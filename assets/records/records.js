// Public configuration contains only the Apps Script deployment URL, never a password.
const CONFIG_URL = new URL('./config.json', import.meta.url);
const PROFILE_KEY = 'learning-lab-student-v1';
const QUEUE_KEY = 'learning-lab-pending-answers-v1';
const validDeployment = value => /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(value || '');
export const recordingConfig = fetch(CONFIG_URL, {cache:'no-store', signal:AbortSignal.timeout(5000)})
  .then(response => {if (!response.ok) throw new Error('Configuration unavailable'); return response.json();})
  .then(config => ({url:validDeployment(config.deploymentUrl) ? config.deploymentUrl : '', available:true}))
  .catch(() => ({url:'', available:false}));

function read(key, fallback) {
  try {return JSON.parse(sessionStorage.getItem(key)) || fallback;} catch {return fallback;}
}
function store(key, value) {
  try {sessionStorage.setItem(key, JSON.stringify(value)); return true;} catch {return false;}
}
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let profile = read(PROFILE_KEY, {name:'', classroom:'', teacherName:''});
if (typeof profile.name !== 'string' || typeof profile.classroom !== 'string') profile = {name:'', classroom:'', teacherName:''};
if (typeof profile.teacherName !== 'string') profile.teacherName = '';
let queue = read(QUEUE_KEY, []);
if (!Array.isArray(queue)) queue = [];
queue = queue.filter(item => item && typeof item.eventId === 'string' && typeof item.studentName === 'string' && item.mode === 'test' && item.retry === false);
store(QUEUE_KEY, queue);
let config, sending = false, lastError = '', savedCount = 0, retryTimer;
let durable = true;
const notify = () => document.dispatchEvent(new Event('learning-lab-recording-change'));

// Apps Script redirects POSTs to a Google HTML response. An iframe lets us receive
// an explicit server acknowledgement without pretending an opaque fetch was saved.
function deliver(url, payload) {
  return new Promise((resolve, reject) => {
    const nonce = crypto.randomUUID();
    const frame = document.createElement('iframe');
    frame.name = `record-${nonce}`; frame.hidden = true; frame.title = 'Save quiz answer';
    const form = document.createElement('form');
    form.hidden = true; form.method = 'POST'; form.action = url; form.target = frame.name;
    for (const [name, value] of Object.entries({payload:JSON.stringify(payload), nonce})) {
      const input = document.createElement('input'); input.type = 'hidden'; input.name = name; input.value = value; form.append(input);
    }
    const finish = error => {
      clearTimeout(timer); window.removeEventListener('message', receive); frame.remove(); form.remove();
      if (error) reject(error); else resolve();
    };
    const receive = event => {
      let trusted = false;
      try {
        const origin = new URL(event.origin);
        trusted = origin.protocol === 'https:' && (origin.hostname === 'script.google.com' || /(?:^|[-.])script\.googleusercontent\.com$/.test(origin.hostname));
      } catch {return;}
      if (!trusted || event.data?.type !== 'learning-lab-record-receipt' || event.data.nonce !== nonce || event.data.eventId !== payload.eventId) return;
      finish(event.data.ok === true ? null : new Error('Google could not save this answer.'));
    };
    const timer = setTimeout(() => finish(new Error('No confirmation received from Google.')), 45000);
    window.addEventListener('message', receive);
    document.body.append(frame, form);
    form.submit();
  });
}
async function flush() {
  clearTimeout(retryTimer);
  if (sending || !config?.url || !queue.length) return;
  sending = true; lastError = ''; notify();
  try {
    while (queue.length) {
      const item = queue[0];
      await deliver(config.url, item);
      queue.shift(); savedCount++; durable = store(QUEUE_KEY, queue); notify();
    }
  } catch (error) {
    lastError = error.message;
    retryTimer = setTimeout(flush, 20000);
  } finally {sending = false; notify();}
}
recordingConfig.then(value => {config = value; flush(); notify();});
window.addEventListener('online', flush);

export const recorder = {
  ready:recordingConfig,
  get enabled() {return !!config?.url;},
  fields() {
    if (!this.enabled) return '';
    return `<fieldset id="record-student-fields" class="record-student" hidden disabled><legend>Your teacher’s record</legend><p>Complete all three fields for Test yourself. Your details and test answers will be sent to your teacher’s private results sheet.</p><div class="record-identity"><label>Student name<input id="record-student-name" name="studentName" required maxlength="100" autocomplete="off" value="${escape(profile.name)}"></label><label>Class<input name="classroom" required maxlength="60" autocomplete="off" value="${escape(profile.classroom)}"></label><label>Teacher’s name<input name="teacherName" required maxlength="100" autocomplete="off" value="${escape(profile.teacherName)}"></label></div><p>Use the names your teacher asks you to use. On a shared device, check that these details are yours.</p></fieldset>`;
  },
  syncMode(scope, mode) {
    scope.dataset.recordingMode = mode;
    const fields = scope.querySelector('#record-student-fields');
    if (fields) {fields.hidden = mode !== 'test'; fields.disabled = mode !== 'test';}
    this.refresh(scope);
  },
  identify(form) {
    if (!this.enabled) return true;
    const data = new FormData(form);
    const identity = {};
    for (const [field, key, message] of [['studentName','name','Enter your student name.'],['classroom','classroom','Enter your class.'],['teacherName','teacherName','Enter your teacher’s name.']]) {
      const input = form.querySelector(`[name=${field}]`);
      const value = String(data.get(field) || '').trim();
      input.setCustomValidity(value ? '' : message);
      if (!value) {input.reportValidity(); input.addEventListener('input', () => input.setCustomValidity(''), {once:true}); return false;}
      identity[key] = value;
    }
    profile = identity;
    store(PROFILE_KEY, profile);
    return true;
  },
  identity() {return {...profile};},
  markup() {return '<div class="record-status" role="status" aria-live="polite"><p data-record-status></p><button type="button" class="revision-text-button" data-record-retry hidden>Try saving again</button></div>';},
  refresh(scope) {
    const node = scope.querySelector('[data-record-status]');
    if (!node) return;
    if (!config?.url) node.textContent = config?.available ? 'Practice only: teacher recording has not been connected yet.' : 'Teacher recording is unavailable. Answers will not be sent.';
    else if (queue.length) node.textContent = `${queue.length} answer${queue.length === 1 ? '' : 's'} waiting to save. ${lastError ? 'Connection not confirmed. ' : ''}Keep this tab open.${!durable ? ' This browser cannot retain pending answers after a reload.' : ''}`;
    else if (scope.dataset.recordingMode !== 'test') node.textContent = 'Practice and retry rounds are not sent to your teacher. Only Test yourself results are recorded.';
    else node.textContent = savedCount ? 'All submitted test answers in this tab have been saved to your teacher’s record.' : `Test recording for ${profile.name || 'your teacher'}. Answers are sent when you submit them.`;
    const button = scope.querySelector('[data-record-retry]');
    if (button) {button.hidden = !config?.url || !queue.length || sending; button.onclick = flush;}
  },
  record(session, item, topic, course, bankSignature) {
    if (!this.enabled || session.mode !== 'test' || session.retry || !session.student.name || !session.student.classroom || !session.student.teacherName) return;
    queue.push({
      version:2, eventId:`${session.id}-${session.index + 1}`, sessionId:session.id,
      studentName:session.student.name, classroom:session.student.classroom, teacherName:session.student.teacherName,
      course, topic, mode:session.mode, retry:session.retry,
      startedAt:session.startedAt, questionNumber:session.index + 1, totalQuestions:session.items.length,
      questionId:item.question.id, selectedAnswer:item.options[item.selection].text,
      ...(bankSignature?{bankSignature}: {})
    });
    durable = store(QUEUE_KEY, queue);
    notify(); flush();
  }
};
