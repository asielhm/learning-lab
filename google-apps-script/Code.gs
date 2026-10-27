// Paste this file, QuestionBank.gs and Dashboard.html into the sheet's Apps Script project.
// The password and teacher sessions stay in Google; they never go in the website.
var SPREADSHEET_ID_ = '11CFaphegZc5bYNnSunvzwZp84LlR45qDMgpMqBs6Cm4';
var PLATFORM_ORIGIN_ = 'https://asielhm.github.io';
var BRAND_LOGO_URL_ = 'https://asielhm.github.io/learning-lab/assets/brand/learning-lab-logo.png';
var ANSWER_HEADERS_ = ['Event ID','Received at','Session ID','Student name','Class','Course','Topic','Mode','Retry','Started at','Question number','Total questions','Question ID','Category','Difficulty','Question','Selected answer','Correct answer','Correct','Teacher'];
var SESSION_HEADERS_ = ['Session ID','Completed at','Student name','Class','Course','Topic','Mode','Retry','Started at','Questions','Correct','Score (%)','Teacher'];

// Visible editor entries. The owner check also protects them if called by the web app.
function setupLearningLab() {
  requireOwner_();
  setupLearningLab_();
}

function resetTeacherPassword() {
  requireOwner_();
  resetTeacherPassword_();
}

function requireOwner_() {
  var active = Session.getActiveUser().getEmail();
  var owner = Session.getEffectiveUser().getEmail();
  if (!active || !owner || active.toLowerCase() !== owner.toLowerCase()) {
    throw new Error('Open the Apps Script editor using the Google account that owns this deployment, then run the setup or reset function there.');
  }
}

// Run once from the Apps Script editor. Creates NEW tabs, leaving existing tabs intact.
function setupLearningLab_() {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var book = SpreadsheetApp.openById(SPREADSHEET_ID_);
    var answers = ensureSheet_(book, 'Answers', ANSWER_HEADERS_);
    var sessions = ensureSheet_(book, 'Sessions', SESSION_HEADERS_);
    var recovered = repairTestSummaries_(answers, sessions);
    if (recovered) console.log('Recovered ' + recovered + ' completed test summaries from saved answers.');
  } finally {lock.releaseLock();}
  var properties = PropertiesService.getScriptProperties();
  if (!properties.getProperty('TEACHER_PASSWORD_HASH')) resetTeacherPassword_();
  else console.log('Recording tabs are ready. Existing teacher password is unchanged. If you did not save it, run resetTeacherPassword to generate a new one.');
}

// Run in the editor only to issue a new password and invalidate all teacher logins.
function resetTeacherPassword_() {
  var password = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().slice(0, 8);
  var salt = Utilities.getUuid();
  PropertiesService.getScriptProperties().setProperties({
    TEACHER_PASSWORD_SALT:salt,
    TEACHER_PASSWORD_HASH:digest_(salt + ':' + password),
    TEACHER_AUTH_VERSION:Utilities.getUuid()
  });
  console.log('Teacher password (keep private; do not send to Learning Lab): ' + password);
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Dashboard').setTitle('Teacher dashboard | Learning Lab').setFaviconUrl(BRAND_LOGO_URL_);
}

function doPost(event) {
  var nonce = '', eventId = '', ok = false, ignored = false;
  try {
    nonce = String(event.parameter.nonce || '');
    if (!/^[a-f0-9-]{36}$/.test(nonce)) throw new Error('Invalid receipt nonce');
    var raw = String(event.parameter.payload || '');
    if (raw.length > 12000) throw new Error('Answer too large');
    var payload = JSON.parse(raw);
    eventId = String(payload.eventId || '').slice(0, 100);
    ignored = saveAnswer_(payload) === false;
    ok = true;
  } catch (error) {
    // No student names, answers, password or sheet details in public errors or logs.
    console.warn('A quiz submission was rejected or could not be written.');
  }
  var receipt = JSON.stringify({type:'learning-lab-record-receipt',nonce:nonce,eventId:eventId,ok:ok,ignored:ignored}).replace(/</g, '\\u003c');
  return HtmlService.createHtmlOutput('<!doctype html><meta charset="utf-8"><script>window.top.postMessage(' + receipt + ', ' + JSON.stringify(PLATFORM_ORIGIN_) + ');</script>')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function text_(value, max, required) {
  if (typeof value !== 'string' || value.length > max) throw new Error('Invalid field');
  value = value.replace(/[\u0000-\u001f\u007f]/g, '').trim();
  if (required && !value) throw new Error('Required field');
  return value;
}
function safeCell_(value) {
  // Prevent a student name or answer becoming a spreadsheet formula.
  return typeof value === 'string' && /^\s*[=+\-@]/.test(value) ? '\u200b' + value : value;
}
function ensureSheet_(book, name, headers) {
  var sheet = book.getSheetByName(name) || book.insertSheet(name);
  if (!sheet.getLastRow()) {sheet.appendRow(headers); sheet.setFrozenRows(1);}
  var actual = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  // Upgrade the original schema by appending Teacher; preserve every existing row.
  if (headers[headers.length - 1] === 'Teacher' && actual[actual.length - 1] === '' && JSON.stringify(actual.slice(0, -1)) === JSON.stringify(headers.slice(0, -1))) {
    sheet.getRange(1, headers.length, 1, 1).setValues([['Teacher']]);
    actual = headers;
  }
  if (JSON.stringify(actual) !== JSON.stringify(headers)) throw new Error('The ' + name + ' tab has different columns. Rename that tab and run setupLearningLab again.');
  return sheet;
}
function normalizeRow_(row, headers) {
  var answerRow = headers.indexOf('Question ID') !== -1;
  return row.map(function(value, index) {
    var header = headers[index];
    if (header === 'Retry' || (answerRow && header === 'Correct')) return value === true || /^(true|1|yes|verdadero)$/i.test(String(value));
    if (['Question number','Total questions','Questions','Score (%)'].includes(header) || (!answerRow && header === 'Correct')) return Number(value);
    if (value instanceof Date) return value.toISOString();
    return value === null || value === undefined ? '' : String(value);
  });
}
function rows_(sheet, headers) {
  return sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues().map(function(row) {return normalizeRow_(row, headers);}) : [];
}
function append_(sheet, row) {
  // Preserve answer text such as "0" and leading zeroes in class identifiers.
  var range = sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length);
  range.setNumberFormat('@');
  range.setValues([row.map(safeCell_)]);
}
function sessionAnswers_(sheet, sessionId) {
  if (sheet.getLastRow() < 2) return [];
  var matches = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).createTextFinder(sessionId).matchEntireCell(true).matchCase(true).findAll();
  if (!matches.length) return [];
  var positions = matches.map(function(cell) {return cell.getRow();});
  var first = Math.min.apply(null, positions), last = Math.max.apply(null, positions);
  return sheet.getRange(first, 1, last - first + 1, ANSWER_HEADERS_.length).getValues().map(function(row) {return normalizeRow_(row, ANSWER_HEADERS_);}).filter(function(row) {return row[2] === sessionId;});
}
function hasSummary_(sheet, sessionId) {
  return sheet.getLastRow() > 1 && !!sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).createTextFinder(sessionId).matchEntireCell(true).matchCase(true).findNext();
}
function saveAnswer_(p) {
  if (!p || ![1,2].includes(p.version) || !/^[a-f0-9-]{36}$/.test(p.sessionId || '')) throw new Error('Invalid session');
  if (!Number.isInteger(p.totalQuestions) || p.totalQuestions < 1 || p.totalQuestions > 260 || !Number.isInteger(p.questionNumber) || p.questionNumber < 1 || p.questionNumber > p.totalQuestions) throw new Error('Invalid question count');
  if (p.eventId !== p.sessionId + '-' + p.questionNumber) throw new Error('Invalid event ID');
  if (!['practice','test'].includes(p.mode) || typeof p.retry !== 'boolean') throw new Error('Invalid mode');
  // Ignore older clients' practice/retry deliveries without storing personal data.
  if (p.mode !== 'test' || p.retry) return false;
  var topic = text_(p.topic, 80, true), course = text_(p.course, 80, true);
  var bank = QUESTION_BANKS_[topic];
  if (!bank || bank.course !== course || p.totalQuestions > Object.keys(bank.questions).length) throw new Error('Invalid course');
  var question = bank.questions[text_(p.questionId, 80, true)];
  if (!question || !question.options.includes(p.selectedAnswer)) throw new Error('Unknown question or answer');
  var name = text_(p.studentName, 100, true), classroom = text_(p.classroom, 60, p.version === 2);
  var teacher = text_(p.teacherName === undefined && p.version === 1 ? '' : p.teacherName, 100, p.version === 2);
  var started = new Date(p.startedAt);
  if (!Number.isFinite(started.getTime())) throw new Error('Invalid start date');
  var correct = p.selectedAnswer === question.options[question.answer];
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var book = SpreadsheetApp.openById(SPREADSHEET_ID_);
    var answers = ensureSheet_(book, 'Answers', ANSWER_HEADERS_);
    var sessions = ensureSheet_(book, 'Sessions', SESSION_HEADERS_);
    var entries = sessionAnswers_(answers, p.sessionId);
    var identity = [name,classroom,course,topic,p.mode,p.retry,started.toISOString()].map(safeCell_);
    if (entries.some(function(row) {return JSON.stringify(row.slice(3, 10)) !== JSON.stringify(identity) || row[11] !== p.totalQuestions || String(row[19] || '') !== safeCell_(teacher);})) throw new Error('Session identity changed');
    var duplicate = entries.find(function(row) {return row[0] === p.eventId;});
    if (duplicate) {
      if (duplicate[12] !== p.questionId || duplicate[16] !== safeCell_(p.selectedAnswer)) throw new Error('Answer already submitted');
    } else {
      if (entries.some(function(row) {return row[12] === p.questionId;})) throw new Error('Repeated question');
      var row = [p.eventId,new Date().toISOString(),p.sessionId,name,classroom,course,topic,p.mode,p.retry,started.toISOString(),p.questionNumber,p.totalQuestions,p.questionId,question.category,question.difficulty,question.prompt,p.selectedAnswer,question.options[question.answer],correct,teacher];
      append_(answers, row);
      entries.push(row.map(safeCell_));
    }
    // On a retried POST we also repair a missing summary after a partial write.
    if (entries.length === p.totalQuestions && !hasSummary_(sessions, p.sessionId)) {
      var count = entries.filter(function(row) {return row[18] === true;}).length;
      append_(sessions, [p.sessionId,new Date().toISOString(),name,classroom,course,topic,p.mode,p.retry,started.toISOString(),p.totalQuestions,count,Math.round(count / p.totalQuestions * 100),teacher]);
    }
    SpreadsheetApp.flush();
    return true;
  } finally {lock.releaseLock();}
}

function repairTestSummaries_(answers, sessions) {
  var existing = new Set(rows_(sessions, SESSION_HEADERS_).map(function(row) {return row[0];}));
  var groups = new Map();
  rows_(answers, ANSWER_HEADERS_).forEach(function(row) {
    if (row[7] !== 'test' || row[8] || existing.has(row[2])) return;
    if (!groups.has(row[2])) groups.set(row[2], []);
    groups.get(row[2]).push(row);
  });
  var recovered = 0;
  groups.forEach(function(entries, id) {
    var first = entries[0], total = first[11];
    if (!Number.isInteger(total) || total < 1 || total > 260 || entries.length !== total) return;
    var positions = new Set(), questions = new Set();
    var identity = JSON.stringify(first.slice(3, 10).concat(first[19]));
    for (var i = 0; i < entries.length; i++) {
      var row = entries[i];
      if (!Number.isInteger(row[10]) || row[10] < 1 || row[10] > total || row[11] !== total || JSON.stringify(row.slice(3, 10).concat(row[19])) !== identity) return;
      positions.add(row[10]); questions.add(row[12]);
    }
    if (positions.size !== total || questions.size !== total) return;
    var correct = entries.filter(function(row) {return row[18];}).length;
    var completed = entries.map(function(row) {return row[1];}).sort().pop();
    append_(sessions, [id,completed,first[3],first[4],first[5],first[6],'test',false,first[9],total,correct,Math.round(correct / total * 100),first[19]]);
    existing.add(id); recovered++;
  });
  if (recovered) SpreadsheetApp.flush();
  return recovered;
}

function digest_(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8)
    .map(function(byte) {return ('0' + (byte & 255).toString(16)).slice(-2);}).join('');
}
function equal_(left, right) {
  var mismatch = left.length ^ right.length;
  for (var i = 0; i < Math.max(left.length, right.length); i++) mismatch |= (left.charCodeAt(i) || 0) ^ (right.charCodeAt(i) || 0);
  return mismatch === 0;
}
function loginTeacher(password) {
  // A global rate limit is intentional: Apps Script does not provide client IPs.
  var cache = CacheService.getScriptCache(), lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var tries = Number(cache.get('teacher-login-attempts') || 0);
    if (tries >= 20) throw new Error('Too many attempts. Wait five minutes and try again.');
    cache.put('teacher-login-attempts', String(tries + 1), 300);
    var p = PropertiesService.getScriptProperties();
    var hash = p.getProperty('TEACHER_PASSWORD_HASH');
    if (typeof password !== 'string' || password.length > 200 || !hash || !equal_(digest_(p.getProperty('TEACHER_PASSWORD_SALT') + ':' + password), hash)) throw new Error('Sign-in failed. Check your teacher password.');
    var token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    cache.put('teacher-session:' + digest_(token), p.getProperty('TEACHER_AUTH_VERSION'), 3600);
    cache.remove('teacher-login-attempts');
    return {token:token};
  } finally {lock.releaseLock();}
}
function requireTeacher_(token) {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) throw new Error('Sign in to view results.');
  var version = PropertiesService.getScriptProperties().getProperty('TEACHER_AUTH_VERSION');
  if (!version || CacheService.getScriptCache().get('teacher-session:' + digest_(token)) !== version) throw new Error('Your sign-in has expired. Sign in again.');
}
function logoutTeacher(token) {
  requireTeacher_(token);
  CacheService.getScriptCache().remove('teacher-session:' + digest_(token));
}
function resultFilter_(value, maxLength) {
  // Null/omitted is All; an explicitly empty checkbox selection matches nothing.
  // Keep scalar values working for previously deployed dashboard versions.
  if (value === undefined || value === null || value === '') return null;
  var values = Array.isArray(value) ? value : [value];
  if (values.length > 500) throw new Error('Too many filter choices.');
  return Array.from(new Set(values.map(function(item) {return text_(item, maxLength, true).toLowerCase();})));
}
function matchesResultFilter_(choices, value) {
  return choices === null || choices.includes(String(value || '').trim().toLowerCase());
}
function getTeacherResults(token, filters) {
  requireTeacher_(token); // Every data read checks server-side authentication.
  filters = filters || {};
  var query = text_(filters.search || '', 100, false).toLowerCase();
  var topic = resultFilter_(filters.topic, 80);
  var course = resultFilter_(filters.course, 80);
  var teacher = resultFilter_(filters.teacher, 100);
  var view = filters.view === 'answers' ? 'answers' : 'sessions';
  var offset = Number.isInteger(filters.offset) && filters.offset > 0 ? filters.offset : 0;
  var headers = view === 'answers' ? ANSWER_HEADERS_ : SESSION_HEADERS_;
  var lock = LockService.getScriptLock(), source, teachers;
  lock.waitLock(20000);
  try {
    var book = SpreadsheetApp.openById(SPREADSHEET_ID_);
    var answers = ensureSheet_(book, 'Answers', ANSWER_HEADERS_);
    var sessions = ensureSheet_(book, 'Sessions', SESSION_HEADERS_);
    repairTestSummaries_(answers, sessions);
    var answerRows = rows_(answers, ANSWER_HEADERS_);
    var sessionRows = rows_(sessions, SESSION_HEADERS_);
    source = view === 'answers' ? answerRows : sessionRows;
    // Keep the full teacher list across filters, views and pages, including saved
    // tests still in progress. Teacher names are returned only after authentication.
    var names = new Map();
    answerRows.filter(function(row) {return row[7] === 'test' && !row[8];}).map(function(row) {return row[19];})
      .concat(sessionRows.filter(function(row) {return row[6] === 'test' && !row[7];}).map(function(row) {return row[12];}))
      .forEach(function(name) {name = String(name || '').trim(); if (name && !names.has(name.toLowerCase())) names.set(name.toLowerCase(), name);});
    teachers = Array.from(names.values()).sort(function(a, b) {return a.localeCompare(b);});
  } finally {lock.releaseLock();}
  var indices = view === 'answers' ? {name:3,classroom:4,course:5,topic:6,teacher:19,mode:7,retry:8} : {name:2,classroom:3,course:4,topic:5,teacher:12,mode:6,retry:7};
  var rows = source.filter(function(row) {
    return row[indices.mode] === 'test' && !row[indices.retry] && (!query || (String(row[indices.name]) + ' ' + String(row[indices.classroom])).toLowerCase().includes(query)) && matchesResultFilter_(topic,row[indices.topic]) && matchesResultFilter_(course,row[indices.course]) && matchesResultFilter_(teacher,row[indices.teacher]);
  }).sort(function(a, b) {return String(b[1]).localeCompare(String(a[1]));});
  var correct = rows.reduce(function(sum, row) {return sum + (view === 'answers' ? (row[18] === true ? 1 : 0) : Number(row[10]));}, 0);
  var count = rows.reduce(function(sum, row) {return sum + (view === 'answers' ? 1 : Number(row[9]));}, 0);
  return {
    headers:headers, rows:rows.slice(offset, offset + 50).map(function(row) {return row.map(function(value) {return value instanceof Date ? value.toISOString() : value;});}),
    total:rows.length, offset:offset, pageSize:50, teachers:teachers,
    students:new Set(rows.map(function(row) {return String(row[indices.name]) + '\u0000' + String(row[indices.classroom]);})).size,
    accuracy:count ? Math.round(correct / count * 100) : null,
    spreadsheetUrl:'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID_ + '/edit'
  };
}
