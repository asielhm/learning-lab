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
  requireManifest_();
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var book = SpreadsheetApp.openById(SPREADSHEET_ID_);
    var answers = ensureSheet_(book, 'Answers', ANSWER_HEADERS_);
    var sessions = ensureSheet_(book, 'Sessions', SESSION_HEADERS_);
    var recovered = repairTestSummaries_(answers, sessions);
    ensureSheet_(book, 'GameAnswers', GAME_ANSWER_HEADERS_);
    repairGameSummaries_(ensureSheet_(book, 'GameAnswers', GAME_ANSWER_HEADERS_), ensureSheet_(book, 'GameSessions', GAME_SESSION_HEADERS_));
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

function doGet(event) {
  // Public metadata only: no student records, teacher names, passwords or tokens.
  if (event && event.parameter && event.parameter.action === 'capabilities') {
    var nonce = String(event.parameter.nonce || '');
    if (!/^[a-f0-9-]{36}$/.test(nonce)) throw new Error('Invalid capability nonce');
    requireManifest_();
    var capabilities = JSON.stringify({type:'learning-lab-recording-capabilities',nonce:nonce,manifest:RECORDING_MANIFEST_,gameManifest:typeof GAME_MANIFEST_ === 'undefined' ? null : GAME_MANIFEST_}).replace(/</g, '\\u003c');
    return HtmlService.createHtmlOutput('<!doctype html><meta charset="utf-8"><script>window.top.postMessage(' + capabilities + ', ' + JSON.stringify(PLATFORM_ORIGIN_) + ');</script>')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
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
    ignored = (payload.kind === 'game' ? saveGameAnswer_(payload) : saveAnswer_(payload)) === false;
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
  if (p.bankSignature !== undefined && p.bankSignature !== bank.signature) throw new Error('Question bank version changed');
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
  requireManifest_();
  filters = filters || {};
  if (filters.view === 'games' || filters.view === 'gameAnswers') return getGameResults_(token, filters);
  var query = text_(filters.search || '', 100, false).toLowerCase();
  var topic = resultFilter_(filters.topic, 80);
  var course = resultFilter_(filters.course, 80);
  var teacher = resultFilter_(filters.teacher, 100);
  var classroom = resultFilter_(filters.classroom, 60);
  var view = filters.view === 'answers' ? 'answers' : 'sessions';
  var offset = Number.isInteger(filters.offset) && filters.offset > 0 ? filters.offset : 0;
  var headers = view === 'answers' ? ANSWER_HEADERS_ : SESSION_HEADERS_;
  var lock = LockService.getScriptLock(), source, teachers, answerRows, sessionRows;
  lock.waitLock(20000);
  try {
    var book = SpreadsheetApp.openById(SPREADSHEET_ID_);
    var answers = ensureSheet_(book, 'Answers', ANSWER_HEADERS_);
    var sessions = ensureSheet_(book, 'Sessions', SESSION_HEADERS_);
    repairTestSummaries_(answers, sessions);
    answerRows = rows_(answers, ANSWER_HEADERS_);
    sessionRows = rows_(sessions, SESSION_HEADERS_);
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
    return row[indices.mode] === 'test' && !row[indices.retry] && (!query || (String(row[indices.name]) + ' ' + String(row[indices.classroom])).toLowerCase().includes(query)) && matchesResultFilter_(topic,row[indices.topic]) && matchesResultFilter_(course,row[indices.course]) && matchesResultFilter_(teacher,row[indices.teacher]) && matchesResultFilter_(classroom,row[indices.classroom]);
  }).sort(function(a, b) {return String(b[1]).localeCompare(String(a[1]));});
  var correct = rows.reduce(function(sum, row) {return sum + (view === 'answers' ? (row[18] === true ? 1 : 0) : Number(row[10]));}, 0);
  var count = rows.reduce(function(sum, row) {return sum + (view === 'answers' ? 1 : Number(row[9]));}, 0);
  var choiceRows = answerRows.filter(function(row) {return row[7] === 'test' && !row[8];});
  var savedSessions = sessionRows.filter(function(row) {return row[6] === 'test' && !row[7];});
  var courses = uniqueChoices_(RECORDING_MANIFEST_.banks.map(function(bank) {return bank.course;}).concat(choiceRows.map(function(row) {return row[5];}), savedSessions.map(function(row) {return row[4];})));
  var classes = uniqueChoices_(choiceRows.map(function(row) {return row[4];}).concat(savedSessions.map(function(row) {return row[3];})));
  var topicMap = new Map();
  RECORDING_MANIFEST_.banks.forEach(function(bank) {topicMap.set(bank.topic, {value:bank.topic,label:bank.title,course:bank.course,questionCount:bank.questionCount});});
  choiceRows.map(function(row) {return {topic:row[6],course:row[5]};}).concat(savedSessions.map(function(row) {return {topic:row[5],course:row[4]};})).forEach(function(item) {
    if (!topicMap.has(item.topic)) topicMap.set(item.topic, {value:item.topic,label:item.topic,course:item.course,questionCount:null});
  });
  var summaries = new Map();
  rows.forEach(function(row) {
    var id = row[indices.course] + '\u0000' + row[indices.topic];
    if (!summaries.has(id)) summaries.set(id, {course:row[indices.course],topic:row[indices.topic],tests:new Set(),students:new Set(),answers:0,correct:0});
    var group = summaries.get(id);group.tests.add(row[view === 'answers' ? 2 : 0]);group.students.add(row[indices.name] + '\u0000' + row[indices.classroom]);
    group.answers += view === 'answers' ? 1 : Number(row[9]);group.correct += view === 'answers' ? (row[18] === true ? 1 : 0) : Number(row[10]);
  });
  var topicSummary = Array.from(summaries.values()).map(function(group) {return {course:group.course,topic:group.topic,tests:group.tests.size,students:group.students.size,answers:group.answers,correct:group.correct,accuracy:group.answers ? Math.round(group.correct/group.answers*100) : null};});
  topicSummary.sort(function(a,b) {return a.course.localeCompare(b.course) || a.topic.localeCompare(b.topic);});
  return {
    courses:courses,classes:classes,topics:Array.from(topicMap.values()),topicSummary:topicSummary,bankCount:RECORDING_MANIFEST_.banks.length,questionCount:RECORDING_MANIFEST_.questionCount,release:RECORDING_MANIFEST_.release,
    headers:headers, rows:rows.slice(offset, offset + 50).map(function(row) {return row.map(function(value) {return value instanceof Date ? value.toISOString() : value;});}),
    total:rows.length, offset:offset, pageSize:50, teachers:teachers,
    students:new Set(rows.map(function(row) {return String(row[indices.name]) + '\u0000' + String(row[indices.classroom]);})).size,
    accuracy:count ? Math.round(correct / count * 100) : null,
    spreadsheetUrl:'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID_ + '/edit'
  };
}

function uniqueChoices_(values) {
  var choices = new Map();
  values.forEach(function(value) {value = String(value || '').trim();if (value && !choices.has(value.toLowerCase())) choices.set(value.toLowerCase(), value);});
  return Array.from(choices.values()).sort(function(a,b) {return a.localeCompare(b);});
}

function requireManifest_() {
  if (typeof RECORDING_MANIFEST_ === 'undefined' || RECORDING_MANIFEST_.protocol !== 3 || !Array.isArray(RECORDING_MANIFEST_.banks)) {
    throw new Error('Replace QuestionBank.gs with the latest Learning Lab file, save all three Google files and deploy a new version.');
  }
}

// Game outcomes are separate from revision tests. Existing tabs are never rewritten.
var GAME_ANSWER_HEADERS_ = ['Event ID','Received at','Session ID','Student name','Class','Teacher','Course','Topic','Game ID','Game','Question ID','Question','Started at','Question number','Total rounds','First answer','Final answer','Attempts','Hint used','Revealed','Stars','Maximum stars','Feedback source'];
var GAME_SESSION_HEADERS_ = ['Session ID','Completed at','Student name','Class','Teacher','Course','Topic','Game ID','Game','Started at','Rounds','Stars','Maximum stars','Score (%)'];
function gameJson_(value) {
  var text = JSON.stringify(value === undefined ? null : value);
  if (text.length > 3000) throw new Error('Game answer too large');
  return text;
}
function gameNormal_(value) {
  return String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
}
function gameAnswerText_(game, question, answer) {
  if (answer === null || answer === undefined) return 'Not answered';
  if (game.grader === 'word') return text_(String(answer),3000,false);
  if (game.grader === 'picture' && typeof answer === 'object') {
    var names={P:'Pressure (P)',V:'Volume (V)',T:'Temperature (T)'},laws={boyle:'Boyle–Mariotte',charles:'Charles',pressure:'Gay-Lussac / Amontons'};
    return 'Quantities: '+(Array.isArray(answer.quantities)?answer.quantities.map(function(q){return names[q]||String(q);}).join(', '):'Not selected')+'; Law: '+(laws[answer.law]||'Not selected');
  }
  if (game.grader === 'dispatch' && typeof answer === 'object') {
    var carriers={rbc:'Red blood cells',wbc:'White blood cells',plasma:'Plasma',platelets:'Platelets'},targets={lungs:'Lungs',heart:'Left heart',right:'Right heart',muscle:'Muscle',liver:'Liver',kidneys:'Kidneys',skin:'Skin',gland:'Endocrine gland',infection:'Affected tissue',wound:'Small injury'};
    return 'Carrier: '+(carriers[answer.carrier]||'Not selected')+'; Destination: '+(targets[answer.target]||'Not selected')+'; Explanation: '+(Number.isInteger(answer.explanation)&&question.options[answer.explanation]||'Not answered');
  }
  return gameJson_(answer);
}
function gameGrade_(game, question, p) {
  if (p.revealed) return 0;
  var a = p.answer, correct = true;
  if (game.grader === 'picture') correct = !!a && a.law === question.law && Array.isArray(a.quantities) && a.quantities.length === 2 && new Set(a.quantities).size === 2 && question.quantities.every(function(q) {return a.quantities.includes(q);});
  if (game.grader === 'word') correct = typeof a === 'string' && question.accepted.some(function(w) {return gameNormal_(w) === gameNormal_(a);});
  if (game.grader === 'dispatch') correct = !!a && a.carrier === question.carrier && a.target === question.target && a.explanation === question.answer;
  if (!correct) throw new Error('Game solution does not match');
  return p.assisted ? 1 : game.rule === 'dispatch' ? (p.attempts > 1 ? 2 : 3) : Math.max(1, 4-p.attempts);
}
function saveGameAnswer_(p) {
  if (p.mode !== 'game' || p.retry === true) return false;
  if (p.retry !== false || p.version !== 1 || !/^[a-f0-9-]{36}$/.test(p.sessionId||'') || !Number.isInteger(p.questionNumber)) throw new Error('Invalid game session');
  if (p.eventId !== p.sessionId+'-'+p.questionNumber) throw new Error('Invalid game event');
  var game = typeof GAME_CATALOG_ !== 'undefined' && GAME_CATALOG_[text_(p.gameId,80,true)];
  if (!game || !Object.prototype.hasOwnProperty.call(GAME_CATALOG_,p.gameId) || p.signature !== game.signature) throw new Error('Update the game catalogue');
  if (!Array.isArray(p.questionIds) || !p.questionIds.length || p.questionIds.length > Object.keys(game.rounds).length || new Set(p.questionIds).size !== p.questionIds.length || p.questionIds.some(function(id) {return typeof id !== 'string' || !Object.prototype.hasOwnProperty.call(game.rounds,id);}) || p.questionNumber<1 || p.questionNumber>p.questionIds.length || p.questionIds[p.questionNumber-1] !== p.questionId) throw new Error('Invalid game rounds');
  if (!Number.isInteger(p.attempts) || p.attempts < (p.revealed?0:1) || p.attempts > 10000 || typeof p.assisted !== 'boolean' || typeof p.revealed !== 'boolean') throw new Error('Invalid game attempts');
  var name=text_(p.studentName,100,true), classroom=text_(p.classroom,60,true), teacher=text_(p.teacherName,100,true), started=new Date(p.startedAt);
  if (!Number.isFinite(started.getTime())) throw new Error('Invalid game date');
  gameJson_(p.firstAnswer);gameJson_(p.answer);
  var question=game.rounds[p.questionId], stars=gameGrade_(game,question,p), first=gameAnswerText_(game,question,p.firstAnswer), final=gameAnswerText_(game,question,p.answer);
  var row=[p.eventId,new Date().toISOString(),p.sessionId,name,classroom,teacher,game.course,game.topic,game.id,game.title,p.questionId,question.prompt,started.toISOString(),p.questionNumber,p.questionIds.length,first,final,p.attempts,p.assisted,p.revealed,stars,3,game.grader === 'reported'?'Game model feedback; self-reported':'Server-checked solution'];
  var lock=LockService.getScriptLock();lock.waitLock(20000);
  try {
    var book=SpreadsheetApp.openById(SPREADSHEET_ID_), answers=ensureSheet_(book,'GameAnswers',GAME_ANSWER_HEADERS_), sessions=ensureSheet_(book,'GameSessions',GAME_SESSION_HEADERS_);
    var entries=gameRows_(answers,GAME_ANSWER_HEADERS_).filter(function(r){return r[2]===p.sessionId;}), identity=JSON.stringify(row.slice(3,10).concat(row[12],row[14]).map(safeCell_));
    if(entries.some(function(r){return JSON.stringify(r.slice(3,10).concat(r[12],r[14]))!==identity;}))throw new Error('Game identity changed');
    var existing=entries.find(function(r){return r[0]===p.eventId;});
    if(existing){if(JSON.stringify(existing.slice(3))!==JSON.stringify(row.slice(3).map(safeCell_)))throw new Error('Game answer already submitted');}
    else {if(entries.some(function(r){return r[10]===p.questionId;}))throw new Error('Repeated game round');append_(answers,row);}
    repairGameSummaries_(answers,sessions);SpreadsheetApp.flush();return true;
  } finally {lock.releaseLock();}
}
function gameRows_(sheet, headers) {
  return rows_(sheet,headers).map(function(row){return row.map(function(v,i){var h=headers[i];if(['Question number','Total rounds','Attempts','Stars','Maximum stars','Rounds','Score (%)'].includes(h))return Number(v);if(h==='Hint used'||h==='Revealed')return v===true||String(v).toLowerCase()==='true';return v;});});
}
function repairGameSummaries_(answers,sessions) {
  var known=new Set(gameRows_(sessions,GAME_SESSION_HEADERS_).map(function(r){return r[0];})),groups=new Map(),repaired=0;
  gameRows_(answers,GAME_ANSWER_HEADERS_).forEach(function(r){if(!known.has(r[2])){if(!groups.has(r[2]))groups.set(r[2],[]);groups.get(r[2]).push(r);}});
  groups.forEach(function(rows,id){var r=rows[0],total=r[14];if(!Number.isInteger(total)||total<1||rows.length!==total||new Set(rows.map(function(v){return v[13];})).size!==total||new Set(rows.map(function(v){return v[10];})).size!==total)return;
    var identity=JSON.stringify(r.slice(3,10).concat(r[12],total));
    if(rows.some(function(v){return v[13]<1||v[13]>total||JSON.stringify(v.slice(3,10).concat(v[12],v[14]))!==identity;}))return;
    var stars=rows.reduce(function(n,v){return n+v[20];},0),max=total*3,completed=rows.map(function(v){return v[1];}).sort().pop();
    append_(sessions,[id,completed,r[3],r[4],r[5],r[6],r[7],r[8],r[9],r[12],total,stars,max,Math.round(100*stars/max)]);known.add(id);repaired++;
  });return repaired;
}
function getGameResults_(token,filters) {
  requireTeacher_(token);
  var view=filters.view==='gameAnswers',headers=view?GAME_ANSWER_HEADERS_:GAME_SESSION_HEADERS_,lock=LockService.getScriptLock(),answers,sessions;
  lock.waitLock(20000);try{var book=SpreadsheetApp.openById(SPREADSHEET_ID_),a=ensureSheet_(book,'GameAnswers',GAME_ANSWER_HEADERS_),s=ensureSheet_(book,'GameSessions',GAME_SESSION_HEADERS_);repairGameSummaries_(a,s);answers=gameRows_(a,GAME_ANSWER_HEADERS_);sessions=gameRows_(s,GAME_SESSION_HEADERS_);}finally{lock.releaseLock();}
  var idx=view?{name:3,cls:4,teacher:5,course:6,topic:7,game:8,stars:20,max:21}:{name:2,cls:3,teacher:4,course:5,topic:6,game:7,stars:11,max:12};
  var query=text_(filters.search||'',100,false).toLowerCase(),f={teacher:resultFilter_(filters.teacher,100),cls:resultFilter_(filters.classroom,60),course:resultFilter_(filters.course,80),topic:resultFilter_(filters.topic,80)};
  var rows=(view?answers:sessions).filter(function(r){return (!query||(String(r[idx.name])+' '+String(r[idx.cls])).toLowerCase().includes(query))&&Object.keys(f).every(function(k){return matchesResultFilter_(f[k],r[idx[k]]);});}).sort(function(a,b){return String(b[1]).localeCompare(String(a[1]));});
  var stars=rows.reduce(function(n,r){return n+r[idx.stars];},0),max=rows.reduce(function(n,r){return n+r[idx.max];},0),offset=Number.isInteger(filters.offset)&&filters.offset>0?filters.offset:0,catalog=typeof GAME_MANIFEST_==='undefined'?[]:GAME_MANIFEST_.games;
  var topics=new Map();catalog.forEach(function(g){topics.set(g.topic,{value:g.topic,label:typeof QUESTION_BANKS_!=='undefined'&&QUESTION_BANKS_[g.topic]?QUESTION_BANKS_[g.topic].title:g.topic,course:g.course});});
  var groups=new Map();rows.forEach(function(r){var key=r[idx.course]+'\u0000'+r[idx.topic];if(!groups.has(key))groups.set(key,{course:r[idx.course],topic:r[idx.topic],tests:new Set(),students:new Set(),answers:0,correct:0});var g=groups.get(key);g.tests.add(r[view?2:0]);g.students.add(r[idx.name]+'\u0000'+r[idx.cls]);g.answers+=r[idx.max];g.correct+=r[idx.stars];});
  return {headers:headers,rows:rows.slice(offset,offset+50),total:rows.length,offset:offset,pageSize:50,students:new Set(rows.map(function(r){return r[idx.name]+'\u0000'+r[idx.cls];})).size,accuracy:max?Math.round(100*stars/max):null,teachers:uniqueChoices_(answers.map(function(r){return r[5];})),classes:uniqueChoices_(answers.map(function(r){return r[4];})),courses:uniqueChoices_(catalog.map(function(g){return g.course;})),topics:Array.from(topics.values()),gameCount:catalog.length,bankCount:RECORDING_MANIFEST_.banks.length,questionCount:RECORDING_MANIFEST_.questionCount,topicSummary:Array.from(groups.values()).map(function(g){return {course:g.course,topic:g.topic,tests:g.tests.size,students:g.students.size,answers:g.answers,correct:g.correct,accuracy:Math.round(100*g.correct/g.answers)};}),spreadsheetUrl:'https://docs.google.com/spreadsheets/d/'+SPREADSHEET_ID_+'/edit'};
}
