// Paste this file, QuestionBank.gs and Dashboard.html into the sheet's Apps Script project.
// The password and teacher sessions stay in Google; they never go in the website.
var SPREADSHEET_ID_ = '11CFaphegZc5bYNnSunvzwZp84LlR45qDMgpMqBs6Cm4';
var PLATFORM_ORIGIN_ = 'https://asielhm.github.io';
var ANSWER_HEADERS_ = ['Event ID','Received at','Session ID','Student name','Class','Course','Topic','Mode','Retry','Started at','Question number','Total questions','Question ID','Category','Difficulty','Question','Selected answer','Correct answer','Correct'];
var SESSION_HEADERS_ = ['Session ID','Completed at','Student name','Class','Course','Topic','Mode','Retry','Started at','Questions','Correct','Score (%)'];

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
  var book = SpreadsheetApp.openById(SPREADSHEET_ID_);
  ensureSheet_(book, 'Answers', ANSWER_HEADERS_);
  ensureSheet_(book, 'Sessions', SESSION_HEADERS_);
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
  return HtmlService.createHtmlOutputFromFile('Dashboard').setTitle('Teacher results | Learning Lab');
}

function doPost(event) {
  var nonce = '', eventId = '', ok = false;
  try {
    nonce = String(event.parameter.nonce || '');
    if (!/^[a-f0-9-]{36}$/.test(nonce)) throw new Error('Invalid receipt nonce');
    var raw = String(event.parameter.payload || '');
    if (raw.length > 12000) throw new Error('Answer too large');
    var payload = JSON.parse(raw);
    eventId = String(payload.eventId || '').slice(0, 100);
    saveAnswer_(payload);
    ok = true;
  } catch (error) {
    // No student names, answers, password or sheet details in public errors or logs.
    console.warn('A quiz submission was rejected or could not be written.');
  }
  var receipt = JSON.stringify({type:'learning-lab-record-receipt',nonce:nonce,eventId:eventId,ok:ok}).replace(/</g, '\\u003c');
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
  if (JSON.stringify(actual) !== JSON.stringify(headers)) throw new Error('The ' + name + ' tab has different columns. Rename that tab and run setupLearningLab again.');
  return sheet;
}
function rows_(sheet, columns) {
  return sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, columns).getValues() : [];
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
  return sheet.getRange(first, 1, last - first + 1, ANSWER_HEADERS_.length).getValues().filter(function(row) {return row[2] === sessionId;});
}
function hasSummary_(sheet, sessionId) {
  return sheet.getLastRow() > 1 && !!sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).createTextFinder(sessionId).matchEntireCell(true).matchCase(true).findNext();
}
function saveAnswer_(p) {
  if (!p || p.version !== 1 || !/^[a-f0-9-]{36}$/.test(p.sessionId || '')) throw new Error('Invalid session');
  if (!Number.isInteger(p.totalQuestions) || p.totalQuestions < 1 || p.totalQuestions > 260 || !Number.isInteger(p.questionNumber) || p.questionNumber < 1 || p.questionNumber > p.totalQuestions) throw new Error('Invalid question count');
  if (p.eventId !== p.sessionId + '-' + p.questionNumber) throw new Error('Invalid event ID');
  if (!['practice','test'].includes(p.mode) || typeof p.retry !== 'boolean') throw new Error('Invalid mode');
  var topic = text_(p.topic, 80, true), course = text_(p.course, 80, true);
  var bank = QUESTION_BANKS_[topic];
  if (!bank || bank.course !== course || p.totalQuestions > Object.keys(bank.questions).length) throw new Error('Invalid course');
  var question = bank.questions[text_(p.questionId, 80, true)];
  if (!question || !question.options.includes(p.selectedAnswer)) throw new Error('Unknown question or answer');
  var name = text_(p.studentName, 100, true), classroom = text_(p.classroom, 60, false);
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
    if (entries.some(function(row) {return JSON.stringify(row.slice(3, 10)) !== JSON.stringify(identity) || row[11] !== p.totalQuestions;})) throw new Error('Session identity changed');
    var duplicate = entries.find(function(row) {return row[0] === p.eventId;});
    if (duplicate) {
      if (duplicate[12] !== p.questionId || duplicate[16] !== safeCell_(p.selectedAnswer)) throw new Error('Answer already submitted');
    } else {
      if (entries.some(function(row) {return row[12] === p.questionId;})) throw new Error('Repeated question');
      var row = [p.eventId,new Date().toISOString(),p.sessionId,name,classroom,course,topic,p.mode,p.retry,started.toISOString(),p.questionNumber,p.totalQuestions,p.questionId,question.category,question.difficulty,question.prompt,p.selectedAnswer,question.options[question.answer],correct];
      append_(answers, row);
      entries.push(row.map(safeCell_));
    }
    // On a retried POST we also repair a missing summary after a partial write.
    if (entries.length === p.totalQuestions && !hasSummary_(sessions, p.sessionId)) {
      var count = entries.filter(function(row) {return row[18] === true;}).length;
      append_(sessions, [p.sessionId,new Date().toISOString(),name,classroom,course,topic,p.mode,p.retry,started.toISOString(),p.totalQuestions,count,Math.round(count / p.totalQuestions * 100)]);
    }
    SpreadsheetApp.flush();
  } finally {lock.releaseLock();}
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
function getTeacherResults(token, filters) {
  requireTeacher_(token); // Every data read checks server-side authentication.
  filters = filters || {};
  var query = text_(filters.search || '', 100, false).toLowerCase();
  var topic = text_(filters.topic || '', 80, false);
  var course = text_(filters.course || '', 80, false);
  var view = filters.view === 'answers' ? 'answers' : 'sessions';
  var offset = Number.isInteger(filters.offset) && filters.offset > 0 ? filters.offset : 0;
  var book = SpreadsheetApp.openById(SPREADSHEET_ID_);
  var headers = view === 'answers' ? ANSWER_HEADERS_ : SESSION_HEADERS_;
  var sheet = ensureSheet_(book, view === 'answers' ? 'Answers' : 'Sessions', headers);
  var indices = view === 'answers' ? {name:3,classroom:4,course:5,topic:6} : {name:2,classroom:3,course:4,topic:5};
  var rows = rows_(sheet, headers.length).filter(function(row) {
    return (!query || (String(row[indices.name]) + ' ' + String(row[indices.classroom])).toLowerCase().includes(query)) && (!topic || row[indices.topic] === topic) && (!course || row[indices.course] === course);
  }).reverse();
  var correct = rows.reduce(function(sum, row) {return sum + (view === 'answers' ? (row[18] === true ? 1 : 0) : Number(row[10]));}, 0);
  var count = rows.reduce(function(sum, row) {return sum + (view === 'answers' ? 1 : Number(row[9]));}, 0);
  return {
    headers:headers, rows:rows.slice(offset, offset + 50).map(function(row) {return row.map(function(value) {return value instanceof Date ? value.toISOString() : value;});}),
    total:rows.length, offset:offset, pageSize:50,
    students:new Set(rows.map(function(row) {return String(row[indices.name]) + '\u0000' + String(row[indices.classroom]);})).size,
    accuracy:count ? Math.round(correct / count * 100) : null,
    spreadsheetUrl:'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID_ + '/edit'
  };
}
