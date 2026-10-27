import {modules} from './modules.js';
import {numericAnswer} from './maths.mjs';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const root=document.querySelector('#unit-activities');
const unit=document.body.dataset.unit;
const definitions=modules[unit];
const instances=[];
function makeWidget(d,index){
 const section=document.createElement('section');section.className='math-widget';section.id=d.id;
 section.innerHTML=`<header class="widget-heading"><span class="section-number" aria-hidden="true">${String(index+1).padStart(2,'0')}</span><div><h2>${escape(d.title)}</h2><p>${escape(d.goal)}</p></div></header><div class="widget-layout"><div class="widget-main"><div class="visual"></div><p class="result-line"></p><p class="explanation"></p><details class="worked-steps"><summary>See the worked example, step by step</summary><ol></ol></details><div class="support-note"><b>A little support.</b> ${escape(d.support)}</div><div class="challenge-note"><b>Go further.</b> ${escape(d.challenge)}</div></div><div class="widget-controls"><div class="controls"></div><button type="button" class="widget-button reset-widget">Reset this activity</button><form class="practice"><div class="eyebrow">CHECK YOUR MODEL</div><label for="${d.id}-answer" class="practice-prompt"></label><div class="answer-row"><input id="${d.id}-answer" name="answer" type="text" required maxlength="60" autocomplete="off" aria-describedby="${d.id}-feedback"><button type="submit">Check my answer</button></div><p class="practice-feedback" id="${d.id}-feedback" role="status"></p></form></div></div>`;
 root.append(section);
 const values=Object.fromEntries(d.controls.map(c=>[c.id,c.value]));let output;
 const controlElements={};
 d.controls.forEach(c=>{
  const wrap=document.createElement('div');wrap.className='control';wrap.dataset.control=c.id;
  const id=`${d.id}-${c.id}`;
  if(c.type==='range')wrap.innerHTML=`<label for="${id}">${escape(c.label)}<output for="${id}">${escape(c.value)}</output></label><input id="${id}" type="range" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.value}"><div class="input-limits"><span>${c.min}</span><span>${c.max}</span></div>`;
  else wrap.innerHTML=`<label for="${id}">${escape(c.label)}</label><select id="${id}">${c.options.map(([v,label])=>`<option value="${escape(v)}" ${v===c.value?'selected':''}>${escape(label)}</option>`).join('')}</select>`;
  const input=wrap.querySelector('input,select');controlElements[c.id]=input;
  input.addEventListener(c.type==='range'?'input':'change',()=>{values[c.id]=c.type==='range'?Number(input.value):input.value;update();});
  section.querySelector('.controls').append(wrap);
 });
 function update(){
  output=d.compute(values,document.body.dataset.level);
  if(document.body.dataset.level==='support')section.querySelector('.worked-steps').open=true;
  section.querySelector('.visual').innerHTML=output.visual;
  section.querySelector('.result-line').textContent=output.result;
  section.querySelector('.explanation').textContent=output.explanation;
  section.querySelector('.worked-steps ol').replaceChildren(...output.steps.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  d.controls.forEach(c=>{const input=controlElements[c.id];if(c.type==='range')input.parentElement.querySelector('output').textContent=values[c.id];input.parentElement.hidden=!!c.showIf&&!c.showIf(values);input.disabled=input.parentElement.hidden;});
  const form=section.querySelector('.practice');form.hidden=!output.practice;
  section.querySelector('.practice-prompt').textContent=output.practice?.prompt||'';
  section.querySelector('.practice-feedback').textContent='';delete section.querySelector('.practice-feedback').dataset.state;
  form.elements.answer.value='';form.elements.answer.setCustomValidity('');
 }
 section.querySelector('.practice').addEventListener('submit',event=>{
  event.preventDefault();if(!output.practice)return;
  const input=event.currentTarget.elements.answer,raw=input.value.trim();
  if(!raw){input.setCustomValidity('Enter your answer first.');input.reportValidity();return;}
  const expected=output.practice.answer,number=numericAnswer(raw),correct=typeof expected==='number'?Number.isFinite(number)&&Math.abs(number-expected)<=(output.practice.tolerance??1e-9):raw.toUpperCase().replace(/\s/g,'')===String(expected).toUpperCase();
  const feedback=section.querySelector('.practice-feedback');feedback.dataset.state=correct?'correct':'incorrect';
  feedback.textContent=correct?`Correct. ${output.practice.why}`:`Have another look. ${output.practice.why}`;
 });
 section.querySelector('.practice input').addEventListener('input',e=>e.target.setCustomValidity(''));
 section.querySelector('.reset-widget').onclick=()=>{d.controls.forEach(c=>{values[c.id]=c.value;controlElements[c.id].value=c.value;});update();};
 if(d.id==='coordinates')section.querySelector('.visual').addEventListener('click',event=>{const svg=event.currentTarget.querySelector('svg');const matrix=svg?.getScreenCTM();if(!matrix)return;const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());values.x=Math.max(-5,Math.min(5,Math.round((point.x-280)/24)));values.y=Math.max(-5,Math.min(5,Math.round((170-point.y)/24)));controlElements.x.value=values.x;controlElements.y.value=values.y;update();});
 instances.push({update});update();
}
if(definitions){definitions.forEach(makeWidget);document.querySelector('#activity-links').innerHTML=definitions.map((d,i)=>`<a href="#${d.id}">${String(i+1).padStart(2,'0')} ${escape(d.title)}</a>`).join('');}
else root.textContent='This unit could not be loaded. Please return to Y7 Maths and try again.';
document.querySelector('#learning-level').addEventListener('change',event=>{document.body.dataset.level=event.target.value;instances.forEach(i=>i.update());});
