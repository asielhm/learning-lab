import {acids} from './acids.js';
import {metals} from './metals.js';
import {redox} from './redox.js';
import {organic} from './organic.js';
const $=selector=>document.querySelector(selector);
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const definitions={acids,metals,redox,organic}[document.body.dataset.unit];
const states=new Map();let active=definitions[0],state,status='';
function fresh(d){return {values:Object.fromEntries(d.controls.map(c=>[c.id,c.value])),phase:0,extra:{delivered:0},records:[],trial:1,recorded:false,answer:null,rotation:Math.floor(Math.random()*4)};}
function startTrial(){state.phase=0;state.extra={delivered:0};state.trial++;state.recorded=false;state.answer=null;}
function model(){return active.model(state.values,state.phase,state.extra);}
function isComplete(result){return result.complete??state.phase>=active.steps.length;}
function render(){
 const result=model(),complete=isComplete(result),observed=state.phase>=active.steps.length;
 $('#chem-scene').innerHTML=result.drawing;
 if(active.doses)$('#chem-scene svg').setAttribute('role','group');
 document.querySelector('.scene-caption').textContent=active.doses?'Once prepared, tap or click the burette tap for 0.1 mL; the buttons add larger portions. Readings follow the stated teaching model.':'Original apparatus illustrations. Readings follow the stated teaching model; drawings and animation are not measurements.';
 $('#lab-equation').textContent=result.equation;
 $('#readouts').replaceChildren(...result.readings.map(([label,value])=>{const div=document.createElement('div');div.className='readout';const span=document.createElement('span'),b=document.createElement('b');span.textContent=label;b.textContent=observed?String(value):'—';div.append(span,b);return div;}));
 $('#next-instruction').textContent=state.phase<active.steps.length?active.steps[state.phase]:active.doses&&!complete?'Use the burette buttons. Aim for faint pink; if you overshoot, start another trial.':'Record your observation, then explain what happened.';
 const advance=$('#advance-step');advance.textContent=state.phase<active.steps.length?`${state.phase+1}. ${active.steps[state.phase]}`:active.doses?'Use the burette controls below':'Practical actions completed';advance.disabled=observed;
 $('#dose-controls').hidden=!active.doses;
 for(const button of document.querySelectorAll('[data-dose]'))button.disabled=!observed||state.extra.delivered>=50;
 $('#record-reading').disabled=!complete||state.recorded||state.records.length>=10;
 $('#bench-status').textContent=status;
 $('#step-progress').innerHTML=active.steps.map((step,index)=>`<li data-done="${state.phase>index}" ${state.phase===index?'aria-current="step"':''}><span>${state.phase>index?'✓':index+1}</span>${escape(step)}</li>`).join('');
 $('#notebook-columns').replaceChildren(...active.columns.map(value=>{const th=document.createElement('th');th.scope='col';th.textContent=value;return th;}));
 $('#notebook-rows').replaceChildren(...state.records.map(row=>{const tr=document.createElement('tr');row.forEach(value=>{const td=document.createElement('td');td.textContent=String(value);tr.append(td);});return tr;}));
 if(!state.records.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=active.columns.length;td.textContent='Carry out a trial, then record your observation here.';tr.append(td);$('#notebook-rows').append(tr);}
 $('#trial-count').textContent=`${state.records.length} of 10 readings · ${active.title}`;
 $('#model-explanation').textContent=observed?result.explanation:'Make a prediction first. Complete the practical actions above to reveal the observations, scientific explanation and model assumptions.';
 $('#lesson-question').textContent=result.question.prompt;
 $('#lesson-options').replaceChildren(...Array.from({length:4},(_,index)=>{
  const original=(index+state.rotation)%4,button=document.createElement('button');button.type='button';button.textContent=result.question.options[original];button.disabled=!state.recorded;button.setAttribute('aria-pressed',String(state.answer===original));
  button.onclick=()=>{state.answer=original;$('#lesson-options').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'));button.setAttribute('aria-pressed','true');const correct=original===result.question.answer;$('#question-feedback').dataset.state=correct?'correct':'incorrect';$('#question-feedback').textContent=(correct?'Correct. ':'Try again. ')+result.question.why;};return button;
 }));
 $('#question-feedback').textContent=state.recorded?'Choose an explanation using your recorded observation.':'Complete and record this trial to unlock the question.';delete $('#question-feedback').dataset.state;
 if(state.records.length>=10)$('#bench-status').textContent='Your notebook has 10 readings. Reset this experiment to clear it and start again.';
}
function choose(d,moveFocus=false){
 active=d;if(!states.has(d.id))states.set(d.id,fresh(d));state=states.get(d.id);status='';
 $('#lab-title').textContent=d.title;$('#lab-description').textContent=d.subtitle;$('#experiment-index').textContent=`EXPERIMENT ${String(definitions.indexOf(d)+1).padStart(2,'0')} · ${definitions.length} TO EXPLORE`;
 document.querySelectorAll('[data-experiment]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.experiment===d.id)));
 $('#setup-controls').replaceChildren(...d.controls.map(c=>{
  const wrap=document.createElement('div');wrap.className='control';const id=`lab-${c.id}`;
  if(c.type==='range')wrap.innerHTML=`<label for="${id}">${escape(c.label)}<output for="${id}">${escape(c.format?c.format(state.values[c.id]):state.values[c.id])}</output></label><input id="${id}" type="range" min="${c.min}" max="${c.max}" step="${c.step}" value="${state.values[c.id]}"><div class="control-limits"><span>${escape(c.format?c.format(c.min):c.min)}</span><span>${escape(c.format?c.format(c.max):c.max)}</span></div>`;
  else wrap.innerHTML=`<label for="${id}">${escape(c.label)}</label><select id="${id}">${c.options.map(([value,label])=>`<option value="${escape(value)}" ${value===state.values[c.id]?'selected':''}>${escape(label)}</option>`).join('')}</select>`;
  const input=wrap.querySelector('input,select');input.addEventListener(c.type==='range'?'input':'change',()=>{state.values[c.id]=c.type==='range'?Number(input.value):input.value;if(c.type==='range')wrap.querySelector('output').textContent=c.format?c.format(state.values[c.id]):state.values[c.id];startTrial();status='Setup changed. Carry out a new trial to observe these conditions.';render();});return wrap;
 }));
 render();
 if(moveFocus){$('#lab-title').focus({preventScroll:true});$('#workbench').scrollIntoView({block:'start'});}
}
$('#experiment-menu').replaceChildren(...definitions.map((d,i)=>{const button=document.createElement('button');button.type='button';button.dataset.experiment=d.id;button.innerHTML=`<span>EXPERIMENT ${String(i+1).padStart(2,'0')}</span><b>${escape(d.title)}</b>`;button.onclick=()=>choose(d,true);return button;}));
$('#advance-step').onclick=()=>{if(state.phase<active.steps.length){state.phase++;status=state.phase<active.steps.length?'Action completed. Follow the next instruction.':active.doses?'Apparatus ready. Turn the burette tap using the buttons.':'Observations ready. Record this trial in your notebook.';render();}};
function addDose(amount){if(!active.doses||state.phase<active.steps.length)return;state.extra.delivered=Math.min(50,Math.round((state.extra.delivered+amount)*10)/10);state.recorded=false;state.answer=null;const result=model();status=isComplete(result)?'Faint-pink endpoint reached. Record the titre.':state.extra.delivered>0&&result.readings[1][1]==='Deep pink'?'Overshot: deep pink. Start another trial and use smaller additions near the endpoint.':'NaOH added. Observe the flask and approach the endpoint carefully.';render();}
for(const button of document.querySelectorAll('[data-dose]'))button.onclick=()=>addDose(Number(button.dataset.dose));
$('#chem-scene').addEventListener('click',event=>{if(event.target.closest('[data-apparatus-action="drop"]'))addDose(.1);});
$('#chem-scene').addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.closest('[data-apparatus-action="drop"]')){event.preventDefault();addDose(.1);$('#chem-scene [data-apparatus-action="drop"]').focus({preventScroll:true});}});

$('#record-reading').onclick=()=>{const result=model();if(!isComplete(result)||state.recorded||state.records.length>=10)return;state.records.push(result.row.map(value=>value===null?state.records.length+1:value));state.recorded=true;state.answer=null;status='Observation recorded. Use it to answer the question below.';render();};
$('#new-trial').onclick=()=>{startTrial();status='New trial started. Earlier readings stay in your notebook.';render();};
$('#reset-lab').onclick=()=>{states.set(active.id,fresh(active));choose(active);status='Experiment reset to its starting conditions; its notebook is cleared.';render();};
choose(active);
