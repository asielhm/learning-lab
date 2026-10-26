import {recorder} from '../records/records.js?v=sheets-1';
const root = document.querySelector('#revision-app');
const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const difficulties = ['Foundation', 'Application', 'Challenge'];
let bank;
let settings = {category:'all', difficulty:'all', length:'10', mode:'practice'};
let session;

function shuffled(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const next = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[next]] = [copy[next], copy[index]];
  }
  return copy;
}
function validate(data) {
  if (!data || typeof data.title !== 'string' || !Array.isArray(data.categories) || !Array.isArray(data.questions) || !data.questions.length) throw new Error('Invalid question bank');
  const ids = new Set();
  for (const question of data.questions) {
    if (typeof question.id !== 'string' || !question.id || ids.has(question.id) || typeof question.prompt !== 'string' || !question.prompt.trim() || !data.categories.includes(question.category) || !difficulties.includes(question.difficulty) || !Array.isArray(question.options) || question.options.length !== 4 || question.options.some(option => typeof option !== 'string' || !option.trim()) || new Set(question.options.map(option => option.trim().toLowerCase())).size !== 4 || !Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3 || typeof question.explanation !== 'string' || !question.explanation.trim()) throw new Error('Invalid question bank');
    ids.add(question.id);
  }
  return data;
}
function pool() {
  return bank.questions.filter(question => (settings.category === 'all' || question.category === settings.category) && (settings.difficulty === 'all' || question.difficulty === settings.difficulty));
}
function isCorrect(item) {
  return item.submitted && item.options[item.selection]?.originalIndex === item.question.answer;
}
function header() {
  return `<header class="revision-heading"><p class="revision-eyebrow">${escape((root.dataset.course || "Year 9 Science").toUpperCase())} · STUDY SIMULATOR</p><h1>${escape(bank.title)}<span>revision</span></h1><p>Build your understanding, one question at a time. Choose a focus or mix the whole topic.</p><div class="revision-bank-meta"><span>${bank.questions.length} questions in the bank</span><span>${bank.categories.length} areas to explore</span><span>No timer. Learn at your pace.</span></div></header>`;
}
function focus(selector) {
  const target = root.querySelector(selector);
  if (target) {
    target.focus({preventScroll:true});
    target.scrollIntoView({block:'start'});
  }
}
function renderSetup(moveFocus = false) {
  session = null;
  root.innerHTML = `${header()}<section class="revision-setup" aria-labelledby="setup-title"><div class="revision-section-heading"><div><p class="revision-eyebrow">MAKE IT YOUR SESSION</p><h2 id="setup-title" tabindex="-1">How would you like to practise?</h2></div><span class="revision-session-icon" aria-hidden="true">?</span></div><form id="revision-settings">${recorder.fields()}<div class="revision-filters"><label>Question area<select id="revision-category" name="category"><option value="all">Mixed: all areas</option>${bank.categories.map(category=>`<option value="${escape(category)}" ${settings.category===category?'selected':''}>${escape(category)}</option>`).join('')}</select></label><label>Question level<select id="revision-difficulty" name="difficulty"><option value="all">Mixed: all levels</option>${difficulties.map(difficulty=>`<option ${settings.difficulty===difficulty?'selected':''}>${escape(difficulty)}</option>`).join('')}</select></label><label>Session length<select id="revision-length" name="length">${[['10','10 questions'],['20','20 questions'],['all','All matching questions']].map(([value,label])=>`<option value="${value}" ${settings.length===value?'selected':''}>${label}</option>`).join('')}</select></label></div><fieldset class="revision-mode"><legend>Choose a mode</legend><label class="revision-mode-card"><input type="radio" name="mode" value="practice" ${settings.mode==='practice'?'checked':''}><span><b>Practice</b><small>Get an explanation after each answer.</small></span></label><label class="revision-mode-card"><input type="radio" name="mode" value="test" ${settings.mode==='test'?'checked':''}><span><b>Test yourself</b><small>Review answers and explanations at the end.</small></span></label></fieldset><div class="revision-setup-bottom"><p id="revision-availability" role="status" aria-live="polite"></p><button class="revision-btn revision-primary" id="start-session" type="submit">Start session <span aria-hidden="true">→</span></button></div></form>${recorder.markup()}</section><aside class="revision-study-note"><b>A fresh mix, every session.</b><p>Questions and answer positions are shuffled. Each question appears once per session. Afterwards, review the explanations or retry only the questions you missed.</p></aside>`;
  root.querySelector('#revision-settings').addEventListener('submit', event => {event.preventDefault(); if (recorder.identify(event.currentTarget)) startSession();});
  root.querySelector('#revision-settings').addEventListener('change', () => {
    const form = new FormData(root.querySelector('#revision-settings'));
    settings = Object.fromEntries(['category','difficulty','length','mode'].map(key=>[key,form.get(key)]));
    updateAvailability();
  });
  updateAvailability();
  recorder.refresh(root);
  if (moveFocus) focus('#setup-title');
}
function updateAvailability() {
  const available = pool().length;
  const count = settings.length === 'all' ? available : Math.min(Number(settings.length), available);
  root.querySelector('#revision-availability').textContent = available ? `${available} matching questions · ${count} in this session. ${Number(settings.length) > available ? 'Using every matching question.' : ''}` : 'No questions match these filters. Choose another area or level.';
  root.querySelector('#start-session').disabled = !available;
}
function startSession(retryQuestions = null) {
  const available = retryQuestions || pool();
  if (!available.length) return;
  const count = retryQuestions || settings.length === 'all' ? available.length : Math.min(Number(settings.length), available.length);
  session = {
    id:crypto.randomUUID(), startedAt:new Date().toISOString(), student:recorder.identity(),
    mode:retryQuestions ? 'practice' : settings.mode,
    retry:!!retryQuestions,
    index:0,
    items:shuffled(available).slice(0,count).map(question => ({question, options:shuffled(question.options.map((text, originalIndex)=>({text, originalIndex}))), selection:null, submitted:false}))
  };
  renderQuestion(true);
}
function renderQuestion(moveFocus = false, feedbackFocus = false) {
  const item = session.items[session.index];
  const {question} = item;
  const answered = session.items.filter(entry=>entry.submitted).length;
  const total = session.items.length;
  const correct = session.items.filter(isCorrect).length;
  const practice = session.mode === 'practice';
  root.innerHTML = `<section class="revision-session" aria-label="Revision session"><div class="revision-session-top"><div><p class="revision-eyebrow">${session.retry?'TARGETED RETRY':practice?'PRACTICE MODE':'TEST YOURSELF'}</p><h1>${escape(bank.title)}</h1></div><button id="new-session" class="revision-text-button" type="button">New session</button></div><div class="revision-progress-meta"><span>Question ${session.index+1} of ${total}</span><span>${practice?`${correct} correct · ${answered} answered`:`${answered} of ${total} answers entered`}</span></div><div class="revision-progress" role="progressbar" aria-label="Questions answered" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${answered}"><span style="width:${answered/total*100}%"></span></div><article class="revision-question-card"><div class="revision-question-tags"><span>${escape(question.category)}</span><span>${escape(question.difficulty)}</span></div><h2 id="revision-question-title" tabindex="-1">${escape(question.prompt)}</h2><form id="revision-answer-form"><fieldset class="revision-options" aria-labelledby="revision-question-title"><legend class="revision-sr-only">Choose one answer</legend>${item.options.map((option,index)=>{
    const showCorrect = item.submitted && practice && option.originalIndex === question.answer;
    const showWrong = item.submitted && practice && index === item.selection && !isCorrect(item);
    return `<label class="revision-option ${showCorrect?'is-correct':showWrong?'is-wrong':''}"><input type="radio" name="answer" aria-label="${escape(option.text)}" value="${index}" ${item.selection===index?'checked':''} ${item.submitted?'disabled':''}><span class="revision-letter" aria-hidden="true">${String.fromCharCode(65+index)}</span><span class="revision-option-text">${escape(option.text)}${showCorrect?'<small>Correct answer</small>':showWrong?'<small>Your answer</small>':''}</span></label>`;
  }).join('')}</fieldset>${item.submitted?`<div id="revision-feedback" class="revision-feedback ${practice?(isCorrect(item)?'correct':'needs-review'):'saved'}" tabindex="-1" role="status"><b>${practice?(isCorrect(item)?'Correct. Well done.':'A useful one to revisit.'):'Answer saved in this quiz.'}</b><p>${practice?escape(question.explanation):'Keep going. You’ll see your score, correct answers and explanations when you finish.'}</p></div><div class="revision-question-actions"><span>${session.index+1===total?'Ready to review your session.':'Take a moment to think, then continue.'}</span><button id="next-question" class="revision-btn revision-primary" type="button">${session.index+1===total?'See results':'Next question'} <span aria-hidden="true">→</span></button></div>`:`<div class="revision-question-actions"><span id="revision-answer-hint">Choose an answer, then ${practice?'check it':'save it'}.</span><button id="check-answer" class="revision-btn revision-primary" type="submit" ${item.selection===null?'disabled':''}>${practice?'Check answer':'Save answer'}</button></div>`}</form></article>${recorder.markup()}<p class="revision-bottom-note">${practice?'Explanations are part of learning. Read them even when your answer is correct.':'This is an untimed self-check. Answer every question to complete your session.'}</p></section>`;
  root.querySelector('#new-session').addEventListener('click',()=>renderSetup(true));
  root.querySelector('#revision-answer-form').addEventListener('change', event => {
    if (item.submitted || !event.target.matches('input[name="answer"]')) return;
    item.selection = Number(event.target.value);
    root.querySelector('#check-answer').disabled = false;
  });
  root.querySelector('#revision-answer-form').addEventListener('submit', event => {
    event.preventDefault();
    if (item.submitted || item.selection === null) return;
    item.submitted = true;
    recorder.record(session, item, bank.topicId, root.dataset.course || 'Year 9 Science');
    renderQuestion(false,true);
  });
  root.querySelector('#next-question')?.addEventListener('click', () => {
    if (!item.submitted) return;
    if (session.index+1===total) renderResults();
    else {session.index++;renderQuestion(true);}
  });
  recorder.refresh(root);
  if (feedbackFocus) focus('#revision-feedback');
  else if (moveFocus) focus('#revision-question-title');
}
function renderResults() {
  const correct = session.items.filter(isCorrect).length;
  const total = session.items.length;
  const missed = session.items.filter(item=>!isCorrect(item));
  const percentage = Math.round(correct/total*100);
  const areas = [...new Set(session.items.map(item=>item.question.category))];
  root.innerHTML = `${header()}<section class="revision-results" aria-labelledby="revision-results-title"><div class="revision-result-summary"><div><p class="revision-eyebrow">SESSION COMPLETE</p><h2 id="revision-results-title" tabindex="-1">${correct===total?'You know your stuff.':percentage>=60?'Good progress. Keep building.':'Every explanation is a step forward.'}</h2><p>${correct} correct out of ${total}. ${missed.length?`Review ${missed.length===1?'the question':'the questions'} you missed, then try a focused practice round.`:'You answered every question correctly. Try another level or a fresh mix next.'}</p></div><div class="revision-score"><b>${percentage}<small>%</small></b><span>${correct} / ${total} correct</span></div></div><div class="revision-result-actions">${missed.length?'<button class="revision-btn revision-primary" id="retry-wrong" type="button">Retry missed questions</button>':''}<button class="revision-btn ${missed.length?'revision-secondary':'revision-primary'}" id="new-session" type="button">Choose a new session</button></div>${recorder.markup()}<div class="revision-area-results"><h3>Your session by area</h3><div>${areas.map(category=>{const entries=session.items.filter(item=>item.question.category===category);const score=entries.filter(isCorrect).length;return `<div class="revision-area-row"><span>${escape(category)}</span><span>${score} / ${entries.length} correct</span></div>`;}).join('')}</div></div></section><section class="revision-review" aria-labelledby="revision-review-title"><div class="revision-review-heading"><h2 id="revision-review-title">Review your answers</h2><p>Open any question to revisit its explanation.</p></div>${session.items.map((item,index)=>`<details class="revision-review-item ${isCorrect(item)?'is-correct':'is-missed'}" ${!isCorrect(item)?'open':''}><summary><span class="revision-review-number">${index+1}</span><span>${escape(item.question.prompt)}<small>${escape(item.question.category)}</small></span><b>${isCorrect(item)?'Correct':'Review'}</b></summary><div class="revision-review-answer"><p><b>Your answer:</b> ${escape(item.options[item.selection].text)}</p>${!isCorrect(item)?`<p><b>Correct answer:</b> ${escape(item.question.options[item.question.answer])}</p>`:''}<p class="revision-review-explanation">${escape(item.question.explanation)}</p></div></details>`).join('')}</section>`;
  root.querySelector('#new-session').addEventListener('click',()=>renderSetup(true));
  root.querySelector('#retry-wrong')?.addEventListener('click',()=>startSession(missed.map(item=>item.question)));
  recorder.refresh(root);
  focus('#revision-results-title');
}
async function load() {
  if (!root) return;
  root.innerHTML = '<div class="revision-loading" role="status">Preparing your question bank…</div>';
  try {
    if (!root.dataset.bank) throw new Error('No question bank');
    const response = await fetch(new URL(root.dataset.bank,document.baseURI));
    if (!response.ok) throw new Error('Question bank unavailable');
    bank = validate(await response.json());
    await recorder.ready;
    renderSetup();
  } catch {
    root.innerHTML = '<section class="revision-load-error"><p class="revision-eyebrow">LET’S TRY THAT AGAIN</p><h1>We couldn’t open the questions.</h1><p>Check your connection and try again. You can still use the activity link above to return to the lesson.</p><button class="revision-btn revision-primary" id="retry-bank" type="button">Try again</button></section>';
    root.querySelector('#retry-bank').addEventListener('click',load);
  }
}
document.addEventListener('learning-lab-recording-change',()=>{if(root)recorder.refresh(root);});
load();
