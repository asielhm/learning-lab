import {acids} from './acids.js';
import {metals} from './metals.js';
import {redox} from './redox.js';
import {organic} from './organic.js';
import {planFor} from './bench-plans.js';
import {sceneFor,effectArt,escape} from './bench-scenes.js';
const $=selector=>document.querySelector(selector);
const definitions={acids,metals,redox,organic}[document.body.dataset.unit];
const states=new Map();let active=definitions[0],state,status='',busy=false,selected=false,drag=null,touchPress=null,lastTouchAt=-Infinity,operation=0,suppressClick=false;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function fresh(d){return {values:Object.fromEntries(d.controls.map(c=>[c.id,c.value])),phase:0,benchStep:0,extra:{delivered:0},elapsed:0,records:[],trial:1,recorded:false,answer:null,rotation:Math.floor(Math.random()*4),helped:new Set()};}
const plan=()=>planFor(active.id,state.values);
function startTrial(){operation++;busy=false;selected=false;drag=null;state.phase=0;state.benchStep=0;state.elapsed=0;state.extra={delivered:0};state.trial++;state.recorded=false;state.answer=null;state.helped=new Set();}
function model(){return active.model(state.values,state.phase,state.extra);}
const benchFinished=()=>state.benchStep>=plan().length;
function isComplete(result){return benchFinished()&&(result.complete??true);}
function announce(message){status=message;$('#bench-status').textContent=message;}
function render(){
 const result=model(),finished=benchFinished(),complete=isComplete(result),steps=plan(),current=steps[state.benchStep];
 selected=false;$('#chem-scene').innerHTML=sceneFor(active,state,steps,result);$('#chem-scene').classList.remove('object-selected','show-hints');
 $('#chem-scene').setAttribute('aria-busy',String(busy));
 $('.scene-caption').textContent='Drag the highlighted object, or select it and then select its destination. Use Enter or Space with a keyboard. Amber outlines show the equipment to use next.';
 $('#bench-step-label').textContent=finished?'APPARATUS READY':`STEP ${state.benchStep+1} OF ${steps.length}`;
 $('#bench-instruction').textContent=current?.label||(active.doses&&!complete?'Turn the burette tap. Add 0.1 mL near the faint-pink endpoint.':'Your practical is complete. Record the evidence, then explain your observation.');
 const summary=active.controls.map(c=>c.options?c.options.find(o=>o[0]===state.values[c.id])?.[1]:`${c.label}: ${c.format?c.format(state.values[c.id]):state.values[c.id]}`).join(' · ');
 $('#bench-settings summary span').textContent=summary;$('#bench-settings summary span').title=summary;
 $('#lab-equation').textContent=result.equation;
 $('#readouts').replaceChildren(...result.readings.map(([label,value])=>{const div=document.createElement('div');div.className='readout';const span=document.createElement('span'),b=document.createElement('b');span.textContent=label;b.textContent=finished?String(value):'—';div.append(span,b);return div;}));
 $('#bench-help').disabled=finished||busy;$('#bench-help').textContent='Help with this step';$('#bench-hint').hidden=true;$('#demonstrate-step').disabled=busy;
 $('#record-reading').disabled=!complete||state.recorded||state.records.length>=10||busy;
 $('#setup-controls').querySelectorAll('input,select').forEach(el=>el.disabled=busy);
 $('#bench-status').textContent=status;
 $('#step-progress').innerHTML=steps.map((step,index)=>`<li data-done="${state.benchStep>index}" ${state.benchStep===index?'aria-current="step"':''}><span>${state.benchStep>index?'✓':index+1}</span>${escape(step.label)}</li>`).join('');
 $('#notebook-columns').replaceChildren(...active.columns.map(value=>{const th=document.createElement('th');th.scope='col';th.textContent=value;return th;}));
 $('#notebook-rows').replaceChildren(...state.records.map(row=>{const tr=document.createElement('tr');row.forEach(value=>{const td=document.createElement('td');td.textContent=String(value);tr.append(td);});return tr;}));
 if(!state.records.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=active.columns.length;td.textContent='Carry out a trial, then record your observation here.';tr.append(td);$('#notebook-rows').append(tr);}
 $('#trial-count').textContent=`${state.records.length} of 10 readings · ${active.title}`;
 $('#model-explanation').textContent=finished?result.explanation:'Make a prediction first. Use the apparatus in order to reveal the observations, scientific explanation and model assumptions.';
 $('#lesson-question').textContent=result.question.prompt;
 $('#lesson-options').replaceChildren(...Array.from({length:4},(_,index)=>{
  const original=(index+state.rotation)%4,button=document.createElement('button');button.type='button';button.textContent=result.question.options[original];button.disabled=!state.recorded;button.setAttribute('aria-pressed',String(state.answer===original));
  button.onclick=()=>{state.answer=original;$('#lesson-options').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'));button.setAttribute('aria-pressed','true');const correct=original===result.question.answer;$('#question-feedback').dataset.state=correct?'correct':'incorrect';$('#question-feedback').textContent=(correct?'Correct. ':'Try again. ')+result.question.why;};return button;
 }));
 $('#question-feedback').textContent=state.recorded?'Choose an explanation using your recorded observation.':'Complete and record this trial to unlock the question.';delete $('#question-feedback').dataset.state;
 if(state.records.length>=10)announce('Your notebook has 10 readings. Reset this experiment to clear it and start again.');
}
function choose(d,moveFocus=false){
 operation++;busy=false;drag=null;active=d;if(!states.has(d.id))states.set(d.id,fresh(d));state=states.get(d.id);status='';
 $('#lab-title').textContent=d.title;$('#lab-description').textContent=d.subtitle;$('#experiment-index').textContent=`EXPERIMENT ${String(definitions.indexOf(d)+1).padStart(2,'0')} · ${definitions.length} TO EXPLORE`;
 document.querySelectorAll('[data-experiment]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.experiment===d.id)));
 $('#setup-controls').replaceChildren(...d.controls.map(c=>{
  const wrap=document.createElement('div');wrap.className='control';const id=`lab-${c.id}`;
  if(c.type==='range')wrap.innerHTML=`<label for="${id}">${escape(c.label)}<output for="${id}">${escape(c.format?c.format(state.values[c.id]):state.values[c.id])}</output></label><input id="${id}" type="range" min="${c.min}" max="${c.max}" step="${c.step}" value="${state.values[c.id]}"><div class="control-limits"><span>${escape(c.format?c.format(c.min):c.min)}</span><span>${escape(c.format?c.format(c.max):c.max)}</span></div>`;
  else wrap.innerHTML=`<label for="${id}">${escape(c.label)}</label><select id="${id}">${c.options.map(([value,label])=>`<option value="${escape(value)}" ${value===state.values[c.id]?'selected':''}>${escape(label)}</option>`).join('')}</select>`;
  const input=wrap.querySelector('input,select');input.addEventListener(c.type==='range'?'input':'change',()=>{state.values[c.id]=c.type==='range'?Number(input.value):input.value;if(c.type==='range')wrap.querySelector('output').textContent=c.format?c.format(state.values[c.id]):state.values[c.id];startTrial();status='Setup changed. Prepare the apparatus again for these conditions.';render();});return wrap;
 }));
 render();if(moveFocus){$('#lab-title').focus({preventScroll:true});$('#workbench').scrollIntoView({block:'start'});}
}
function nextFocus(){($('#chem-scene [data-bench-source],#chem-scene [data-bench-tap],#chem-scene [data-bench-dose]')||$('#record-reading')).focus({preventScroll:true});}
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function perform({help=false,keyboard=false,from=null}={}){
 if(busy||benchFinished())return;
 const a=plan()[state.benchStep],token=++operation;
 if(help)scene.scrollIntoView({block:'center',behavior:'instant'});
 busy=true;selected=false;$('#chem-scene').setAttribute('aria-busy','true');$('#bench-help').disabled=true;$('#demonstrate-step').disabled=true;$('#record-reading').disabled=true;
 $('#setup-controls').querySelectorAll('input,select').forEach(el=>el.disabled=true);
 $('#bench-hint').hidden=true;
 if(help)state.helped.add(a.id);
 announce(help?'Watch the demonstration on the bench.':'Using the apparatus…');
 const source=$('#chem-scene [data-bench-source]');
 if(a.kind==='move'&&source){
  const offset=from||[0,0],destination=[a.to[0]-a.from[0],a.to[1]-a.from[1]];
  source.removeAttribute('transform');
  const movement=source.animate([{transform:`translate(${offset[0]}px,${offset[1]}px)`},{transform:`translate(${destination[0]}px,${destination[1]}px)`}],{duration:reducedMotion.matches?100:500,easing:'ease-in-out',fill:'forwards'});
  await movement.finished;
 }
 if(token!==operation)return;
 if(a.effect==='pour')source?.firstElementChild?.classList.add('pouring-tool');
 const fx=$('#reaction-fx');fx.innerHTML=effectArt(a);
 if(a.effect==='swirl')$('#chem-scene [data-vessel]')?.classList.add('swirling-vessel');
 if(a.effect==='force')$('#chem-scene svg')?.classList.add('pushing-layers');
 if(a.effect==='electrons')source?.classList.add('electron-transfer');
 if(a.effect==='time'){
  const clock=$('#chem-scene .clock-hand');clock?.classList.add('running-clock');
  if(active.id==='water-cell'){
   const duration=reducedMotion.matches?150:2400,started=performance.now();
   await new Promise(resolve=>{function frame(now){if(token!==operation){resolve();return;}const fraction=Math.min(1,(now-started)/duration);state.elapsed=state.values.time*fraction;$('#bench-status').textContent=`Time accelerated: ${Math.round(state.elapsed)} / ${state.values.time} s. Watch the gases collect.`;for(const level of $('#chem-scene').querySelectorAll('[data-gas-volume]')){const displacement=Number(level.dataset.gasVolume)*fraction*4;level.setAttribute('y',132+displacement);level.setAttribute('height',146-displacement);}if(fraction<1)requestAnimationFrame(frame);else resolve();}requestAnimationFrame(frame);});
  }else await wait(reducedMotion.matches?120:1400);
 }else await wait(reducedMotion.matches?100:['drops','pour','solid','cool','develop','fix','rinse'].includes(a.effect)?1000:650);
 if(token!==operation)return;
 state.phase=Math.max(state.phase,a.phase||0);state.benchStep++;if(benchFinished())state.phase=active.steps.length;
 busy=false;status=benchFinished()?active.doses?'Apparatus ready. Use the controls beside the burette to approach the endpoint.':'Practical completed. Record your evidence in the notebook.':`Step ${state.benchStep} complete${help?' with help':''}. Follow the next instruction on the bench.`;
 render();if(keyboard)nextFocus();
}
function selectSource(keyboard=false){
 if(busy||benchFinished())return;
 selected=!selected;scene.classList.toggle('object-selected',selected);
 scene.querySelector('[data-bench-source]')?.setAttribute('aria-pressed',String(selected));
 if(selected&&keyboard)scene.querySelector('[data-bench-target]')?.focus({preventScroll:true});
 announce(selected?'Object selected. Click or tap the marked destination to place it.':'Selection cleared. Drag the object, or select it and then its destination.');
}
function activate(target,keyboard=false){
 if(busy)return;
 if(target.closest('[data-bench-source]')){if(plan()[state.benchStep]?.kind==='motion')perform({keyboard});else selectSource(keyboard);}
 else if(target.closest('[data-bench-target]')){if(selected)perform({keyboard});else announce('Select the object labelled MOVE ME first, then select this destination.');}
 else if(target.closest('[data-bench-tap]'))perform({keyboard});
 else if(target.closest('[data-bench-dose]'))addDose(Number(target.closest('[data-bench-dose]').dataset.benchDose),keyboard);
 else if(target.closest('[data-bench-locked]'))announce(target.closest('[data-bench-locked]').dataset.benchLocked);
}
const scene=$('#chem-scene');
function point(event){const svg=scene.querySelector('svg'),p=svg.createSVGPoint();p.x=event.clientX;p.y=event.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());}
scene.addEventListener('pointerdown',event=>{
 if(event.pointerType==='touch')touchPress={element:event.target.closest('[role="button"]'),x:event.clientX,y:event.clientY};
 const source=event.target.closest('[data-bench-source]');if(!source||busy||event.button!==0)return;
 const p=point(event);drag={pointer:event.pointerId,start:p,last:p,source,action:plan()[state.benchStep],moved:false};source.setPointerCapture(event.pointerId);source.classList.add('being-dragged');
});
scene.addEventListener('pointermove',event=>{
 if(!drag||event.pointerId!==drag.pointer)return;
 const p=point(event),dx=p.x-drag.start.x,dy=p.y-drag.start.y;drag.last=p;
 if(Math.hypot(dx,dy)>8)drag.moved=true;
 if(drag.moved){event.preventDefault();if(drag.action.effect==='swirl')$('#chem-scene [data-vessel]')?.setAttribute('transform',`translate(${Math.max(-25,Math.min(25,dx))} 0)`);drag.source.setAttribute('transform',`translate(${dx} ${dy})`);scene.classList.add('object-selected');}
});
scene.addEventListener('pointerup',event=>{
 const touch=event.pointerType==='touch',press=touchPress;touchPress=null;
 if(touch)lastTouchAt=performance.now();
 if(!drag||event.pointerId!==drag.pointer){
  if(touch&&press?.element&&press.element===event.target.closest('[role="button"]')&&Math.hypot(event.clientX-press.x,event.clientY-press.y)<10)activate(press.element);
  return;
 }
 const current=drag;drag=null;current.source.classList.remove('being-dragged');
 if(!current.moved){if(touch)activate(current.source);return;}
 suppressClick=true;setTimeout(()=>{suppressClick=false;},0);
 const dx=current.last.x-current.start.x,dy=current.last.y-current.start.y,a=current.action;
 const actual=[a.from[0]+dx,a.from[1]+dy];
 const valid=a.kind==='motion'?Math.abs(dx)>=28&&Math.abs(dy)<95:Math.hypot(actual[0]-a.to[0],actual[1]-a.to[1])<62;
 $('#chem-scene [data-vessel]')?.removeAttribute('transform');
 if(valid)perform({from:[dx,dy]});else{current.source.removeAttribute('transform');scene.classList.remove('object-selected');selected=false;announce('Not quite there. Move the centre of the object into the amber outline. Use Help with this step for a demonstration.');}
});
scene.addEventListener('pointercancel',()=>{$('#chem-scene [data-vessel]')?.removeAttribute('transform');if(drag)drag.source.removeAttribute('transform');drag=null;touchPress=null;selected=false;scene.classList.remove('object-selected');});
// Touch actions run on pointer release. Compatibility clicks can arrive late or
// be swallowed after a drag, so they must not control (or repeat) an experiment.
scene.addEventListener('click',event=>{if(event.pointerType==='touch'||event.sourceCapabilities?.firesTouchEvents||(!event.pointerType&&performance.now()-lastTouchAt<900))return;if(!suppressClick)activate(event.target);});
scene.addEventListener('keydown',event=>{if(event.key==='Escape'){selected=false;scene.classList.remove('object-selected');announce('Selection cleared.');}else if(event.key==='Enter'||event.key===' '){if(event.target.closest('[role="button"]')){event.preventDefault();activate(event.target,true);}}});
$('#bench-help').onclick=()=>{
 if(busy||benchFinished())return;
 const a=plan()[state.benchStep];$('#bench-hint').hidden=!$('#bench-hint').hidden;scene.classList.toggle('show-hints',!$('#bench-hint').hidden);
 $('#hint-text').textContent=a.kind==='move'?'The outlined object is the tool. Drag its centre into the amber destination, or select the object and then the destination.':a.kind==='motion'?'Drag the outlined vessel or handle sideways. You can also select it or press Enter to perform the movement.':'Use the outlined part of the apparatus. Click it, tap it or press Enter.';
};
$('#demonstrate-step').onclick=()=>perform({help:true,keyboard:true});
let previousBodyOverflow='';
$('#expand-bench').onclick=()=>{
 const expanded=$('#workbench').classList.toggle('expanded-bench');$('#expand-bench').textContent=expanded?'Close large bench':'Enlarge bench';$('#expand-bench').setAttribute('aria-expanded',String(expanded));if(expanded){previousBodyOverflow=document.body.style.overflow;document.body.style.overflow='hidden';$('#workbench').setAttribute('role','dialog');$('#workbench').setAttribute('aria-modal','true');$('#bench-instruction').scrollIntoView({block:'start'});}else{document.body.style.overflow=previousBodyOverflow;$('#workbench').removeAttribute('role');$('#workbench').removeAttribute('aria-modal');$('#expand-bench').focus({preventScroll:true});}
};
document.addEventListener('keydown',event=>{
 if(!$('#workbench').classList.contains('expanded-bench'))return;
 if(event.key==='Escape'){$('#expand-bench').click();return;}
 if(event.key==='Tab'){
  const focusable=[...$('#workbench').querySelectorAll('button:not(:disabled),summary,input:not(:disabled),select:not(:disabled),[tabindex="0"]')].filter(el=>el.getClientRects().length);
  const first=focusable[0],last=focusable.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 }
});
async function addDose(amount,keyboard=false){
 if(busy||!active.doses||!benchFinished()||state.extra.delivered>=50)return;
 const token=++operation;busy=true;$('#record-reading').disabled=true;$('#chem-scene').setAttribute('aria-busy','true');
 $('#reaction-fx').innerHTML=effectArt({effect:'drops',to:[230,201]});announce('NaOH is falling from the burette. Watch the flask.');
 await wait(reducedMotion.matches?80:650);if(token!==operation)return;
 state.extra.delivered=Math.min(50,Math.round((state.extra.delivered+amount)*10)/10);state.recorded=false;state.answer=null;const result=model();busy=false;
 status=isComplete(result)?'Faint-pink endpoint reached. Record the titre.':state.extra.delivered>0&&result.readings[1][1]==='Deep pink'?'Overshot: deep pink. Start another trial and use smaller additions near the endpoint.':'NaOH added. Observe the flask and approach the endpoint carefully.';render();if(keyboard)scene.querySelector(`[data-bench-dose="${amount}"]`)?.focus({preventScroll:true});
}
$('#experiment-menu').replaceChildren(...definitions.map((d,i)=>{const button=document.createElement('button');button.type='button';button.dataset.experiment=d.id;button.innerHTML=`<span>EXPERIMENT ${String(i+1).padStart(2,'0')}</span><b>${escape(d.title)}</b>`;button.onclick=()=>choose(d,true);return button;}));
$('#record-reading').onclick=()=>{const result=model();if(busy||!isComplete(result)||state.recorded||state.records.length>=10)return;state.records.push(result.row.map(value=>value===null?state.records.length+1:value));state.recorded=true;state.answer=null;status='Observation recorded. Use it to answer the question below.';render();};
$('#new-trial').onclick=()=>{startTrial();status='New trial started. Earlier readings stay in your notebook.';render();};
$('#reset-lab').onclick=()=>{states.set(active.id,fresh(active));choose(active);status='Experiment reset to its starting conditions; its notebook is cleared.';render();};
choose(active);
