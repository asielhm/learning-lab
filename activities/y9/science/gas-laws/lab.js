const $ = selector => document.querySelector(selector);
const baseline = {P:100, V:2.4, T:300};
const definitions = {
  boyle:{name:'Boyle–Mariotte',title:'Compress the same gas.',condition:'TEMPERATURE HELD AT 300 K',relationship:'Pressure and volume are inversely related.',equation:'P₁V₁ = P₂V₂',explanation:'At constant temperature, pressure is inversely proportional to volume. With the same number of particles in less space, collisions with the walls become more frequent. Average particle speed stays the same.',min:1.2,max:4.8,step:.1,start:2.4,label:'Volume',unit:'L',invariant:'PV (kPa·L)',apparatus:'Move the volume slider, or drag the piston. The thermostat keeps temperature constant.',note:'Temperature = 300 K (26.85°C). Amount of gas is fixed.',graph:'Pressure against volume',challenges:[
    {target:1.2,task:'Halve the volume from 2.4 L to 1.2 L. Check the pressure reading.',question:'What happens to pressure when volume halves at constant temperature?',options:['It halves to 50 kPa','It stays at 100 kPa','It doubles to 200 kPa'],answer:2,why:'At constant temperature, P × V stays constant. 200 × 1.2 = 100 × 2.4 = 240 kPa·L.'},
    {target:4.8,task:'Now double the original volume: set 4.8 L.',question:'At 4.8 L, which pressure keeps PV constant?',options:['50 kPa','100 kPa','200 kPa'],answer:0,why:'Doubling the volume halves the pressure: 240 ÷ 4.8 = 50 kPa.'},
    {target:3,task:'Set the volume to 3.0 L and compare it with the 2.4 L reference.',question:'Which statement explains the new pressure?',options:['It rises because each particle gets hotter','It falls to 80 kPa while temperature stays at 300 K','It falls because particles disappear'],answer:1,why:'The amount of gas and temperature remain fixed. P = 240 ÷ 3.0 = 80 kPa; average particle speed is unchanged.'}]},
  charles:{name:'Charles',title:'Warm a movable piston.',condition:'PRESSURE HELD AT 100 kPa',relationship:'Volume increases with Kelvin temperature.',equation:'V₁/T₁ = V₂/T₂',explanation:'At constant pressure, volume is directly proportional to absolute temperature. Heating increases average particle speed. A freely moving piston shifts outward until the gas pressure again balances the fixed outside load.',min:200,max:600,step:1,start:300,label:'Temperature',unit:'K',invariant:'V/T (L/K)',apparatus:'The piston can move against a constant load. Change the temperature using the heater control.',note:'Pressure = 100 kPa. Amount of gas is fixed. All temperature ratios use Kelvin.',graph:'Volume against temperature',challenges:[
    {target:600,task:'Double the absolute temperature from 300 K to 600 K.',question:'At constant pressure, what happens to volume when Kelvin temperature doubles?',options:['It stays at 2.4 L','It halves to 1.2 L','It doubles to 4.8 L'],answer:2,why:'Charles’s law gives V/T = 2.4/300 = 0.008 L/K, so at 600 K the volume is 4.8 L.'},
    {target:200,task:'Cool the model to 200 K. Compare the new volume with the original 2.4 L.',question:'Which volume is predicted at 200 K?',options:['1.6 L','2.4 L','3.6 L'],answer:0,why:'200 K is two-thirds of 300 K, so the volume becomes two-thirds of 2.4 L: 1.6 L.'},
    {target:450,task:'Set 450 K, which is 1.5 times the starting absolute temperature.',question:'What keeps the pressure at 100 kPa as particles move faster?',options:['Gas particles shrink','The piston moves outward and the gas occupies more space','The amount of gas doubles'],answer:1,why:'The larger volume offsets the increase in particle speed. At equilibrium, V = 2.4 × 450/300 = 3.6 L.'}]},
  pressure:{name:'Gay-Lussac',title:'Heat a rigid container.',condition:'VOLUME HELD AT 2.4 L',relationship:'Pressure increases with Kelvin temperature.',equation:'P₁/T₁ = P₂/T₂',explanation:'At constant volume, pressure is directly proportional to absolute temperature. Faster particles collide with the walls more frequently and with greater momentum change. This pressure–temperature law is also associated with Amontons.',min:200,max:600,step:1,start:300,label:'Temperature',unit:'K',invariant:'P/T (kPa/K)',apparatus:'The piston is locked: the volume stays fixed. Use the heater control to change temperature.',note:'Volume = 2.4 L. Amount of gas is fixed. The container remains sealed.',graph:'Pressure against temperature',challenges:[
    {target:600,task:'With the piston locked, double the absolute temperature from 300 K to 600 K.',question:'What pressure is predicted at 600 K?',options:['50 kPa','100 kPa','200 kPa'],answer:2,why:'P/T stays constant. P = 100 × 600/300 = 200 kPa.'},
    {target:200,task:'Cool the rigid container to 200 K.',question:'What happens to pressure as Kelvin temperature falls to two-thirds of its original value?',options:['It rises to 150 kPa','It falls to about 66.7 kPa','It becomes zero'],answer:1,why:'Pressure falls in the same ratio as absolute temperature: 100 × 200/300 ≈ 66.7 kPa.'},
    {target:450,task:'Set the temperature to 450 K. Check whether the volume has changed.',question:'Which pair of readings fits this rigid-container experiment?',options:['150 kPa and 2.4 L','100 kPa and 3.6 L','50 kPa and 4.8 L'],answer:0,why:'Temperature is 1.5 times its starting value, so pressure is 150 kPa. The rigid container keeps volume at 2.4 L.'}]}
};
const contexts = {
 boyle:{image:'sealed-syringe.svg',alt:'Air compressed in a capped syringe with temperature held constant',caption:'Boyle–Mariotte: a sealed syringe connects the model to a familiar object. Compress slowly to approximate constant temperature.',context:'A fixed gas sample occupies 2.4 L at 100 kPa. Its temperature stays constant. What is its pressure at 1.2 L?',equation:'P₂ = P₁V₁ ÷ V₂ = (100 × 2.4) ÷ 1.2 = 200 kPa',reason:'Halving the volume doubles the pressure. Check that the product PV is still 240 kPa·L.'},
 charles:{image:'balloon-temperature.svg',alt:'A flexible sealed balloon expands as its gas warms',caption:'Charles: a balloon illustrates thermal expansion approximately. The simulator uses a movable piston at fixed pressure.',context:'A gas occupies 2.4 L at 300 K. Pressure stays constant. What volume does it occupy at 330 K?',equation:'V₂ = V₁T₂ ÷ T₁ = (2.4 × 330) ÷ 300 = 2.64 L',reason:'Kelvin temperature increases by 10%, so volume increases by 10%. The Celsius temperatures are 26.85°C and 56.85°C.'},
 pressure:{image:'tyre-pressure.svg',alt:'A tyre and pressure gauge illustrate temperature affecting gas pressure',caption:'Gay-Lussac: a tyre is an approximate everyday example. The simulator uses a rigid sealed vessel with exactly fixed volume.',context:'A sealed rigid container holds gas at 100 kPa and 300 K. What pressure is predicted at 330 K?',equation:'P₂ = P₁T₂ ÷ T₁ = (100 × 330) ÷ 300 = 110 kPa',reason:'At fixed volume, a 10% increase in Kelvin temperature produces a 10% increase in absolute pressure.'}
};
const memory = Object.fromEntries(Object.keys(definitions).map(key=>[key,{index:0,input:definitions[key].start,records:[{...baseline}],tasks:definitions[key].challenges.map(()=>({observed:false,correct:false}))}]));
let law='boyle', paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
const state = () => memory[law];
const reading = () => law==='boyle' ? {P:240/state().input,V:state().input,T:300} : law==='charles' ? {P:100,V:2.4*state().input/300,T:state().input} : {P:100*state().input/300,V:2.4,T:state().input};
const formatted = value => Number(value.toFixed(2)).toLocaleString('en-GB',{maximumFractionDigits:2});
function setLaw(key){
 law=key;const d=definitions[law];
 const context=contexts[law];$('#contextImage').src='images/'+context.image;$('#contextImage').alt=context.alt;$('#contextCaption').textContent=context.caption;$('#workedContext').textContent=context.context;$('#workedEquation').textContent=context.equation;$('#workedReasoning').textContent=context.reason;
 document.querySelectorAll('[data-law]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.law===law)));
 $('#lawTitle').textContent=d.title;$('#lawCondition').textContent=d.condition;$('#relationship').textContent=d.relationship;$('#equation').textContent=d.equation;$('#lawExplanation').textContent=d.explanation;$('#apparatusNote').textContent=d.apparatus;$('#constantNote').textContent=d.note;$('#graphTitle').textContent=d.graph;$('#variableLabel').textContent=`Change ${d.label.toLowerCase()}`;
 const input=$('#variable');input.min=d.min;input.max=d.max;input.step=d.step;input.value=state().input;
 $('#rangeMin').textContent=`${d.min} ${d.unit}`;$('#rangeMax').textContent=`${d.max} ${d.unit}`;$('#invariantHeader').textContent=d.invariant;
 $('#notebookHelp').textContent='Record up to eight readings. Compare the final column: it stays constant for this experiment.';
 $('#graphNote').textContent=law==='boyle'?'The curve shows an inverse relationship. Volume never reaches zero in this experiment.':'The dashed section is an ideal-gas extrapolation, not a measurement. The experiment stays between 200 K and 600 K.';
 $('#recordStatus').textContent='';$('#experimentFeedback').textContent='';renderChallenge();update();renderRecords();
}
function invariant(r){return law==='boyle'?r.P*r.V:law==='charles'?r.V/r.T:r.P/r.T;}
function update(){
 const d=definitions[law],r=reading();$('#pressureValue').textContent=formatted(r.P);$('#volumeValue').textContent=formatted(r.V);$('#temperatureValue').textContent=`${formatted(r.T)} K`;$('#temperatureCelsius').textContent=`${(r.T-273.15).toFixed(2)}°C`;
 $('#variableOutput').textContent=`${formatted(state().input)} ${d.unit}`;
 const change=law==='boyle'?r.V/baseline.V:r.T/baseline.T;
 if(Math.abs(change-1)<.001)$('#liveInsight').textContent='Reference state: 100 kPa, 2.4 L, 300 K. Change the slider, predict the result, then record a reading.';
 else if(law==='boyle')$('#liveInsight').textContent=`Volume is ${change.toFixed(2)}× the reference. Pressure is ${(r.P/100).toFixed(2)}× the reference: the changes are inverse. P × V = ${formatted(r.P*r.V)} kPa·L.`;
 else $('#liveInsight').textContent=`Kelvin temperature is ${change.toFixed(2)}× the reference. ${law==='charles'?'Volume':'Pressure'} is also ${change.toFixed(2)}×: a direct relationship. ${law==='charles'?'Pressure remains 100 kPa.':'Volume remains 2.4 L.'}`;
 drawGraph();
}
function renderRecords(){
 const body=$('#measurementRows');body.replaceChildren();
 state().records.forEach((r,index)=>{const row=document.createElement('tr');[index+1,formatted(r.P),formatted(r.V),formatted(r.T),invariant(r).toFixed(law==='boyle'?2:4)].forEach(value=>{const cell=document.createElement('td');cell.textContent=value;row.append(cell)});body.append(row)});
}
function record(){
 const r=reading();if(state().records.some(item=>Math.abs(item.V-r.V)<.001&&Math.abs(item.T-r.T)<.001)){$('#recordStatus').textContent='You have already recorded this state. Try another slider value.';return;}
 state().records.push({...r});if(state().records.length>8)state().records.shift();renderRecords();drawGraph();$('#recordStatus').textContent='Measurement recorded. Compare the constant in the last column.';
}
function drawGraph(){
 const svg=$('#graph'),r=reading(),temp=law!=='boyle',xMax=temp?650:5.2,yMax=law==='charles'?5.2:240;
 const x=value=>55+value/xMax*350,y=value=>247-value/yMax*210;
 const point=value=>({x:value,y:law==='boyle'?240/value:law==='charles'?.008*value:value/3});
 const start=temp?200:1.2,end=temp?600:4.8;
 const curve=Array.from({length:101},(_,i)=>point(start+(end-start)*i/100)).map((p,i)=>`${i?'L':'M'}${x(p.x).toFixed(2)},${y(p.y).toFixed(2)}`).join(' ');
 const xTicks=temp?[0,100,200,300,400,500,600]:[0,1,2,3,4,5],yTicks=law==='charles'?[0,1,2,3,4,5]:[0,50,100,150,200];
 const currentX=temp?r.T:r.V,currentY=law==='charles'?r.V:r.P;
 svg.setAttribute('aria-label',`${definitions[law].graph}: current x ${formatted(currentX)}, current y ${formatted(currentY)}`);
 svg.innerHTML=`${yTicks.map(t=>`<path d="M55 ${y(t)}H405" stroke="#e0e7d6"/><text x="43" y="${y(t)+4}" text-anchor="end">${t}</text>`).join('')}<path d="M55 30V247H411" stroke="#8d9f80" fill="none"/>${xTicks.map(t=>`<path d="M${x(t)} 247v5" stroke="#8d9f80"/><text x="${x(t)}" y="267" text-anchor="middle">${t}</text>`).join('')}<text x="230" y="292" text-anchor="middle">${temp?'Temperature (K)':'Volume (L)'}</text><text x="56" y="17">${law==='charles'?'Volume (L)':'Pressure (kPa)'}</text>${temp?`<path d="M${x(0)} ${y(0)}L${x(200)} ${y(point(200).y)}" stroke="#9eae90" stroke-dasharray="4 5" fill="none"/>`:''}<path d="${curve}" stroke="#60825a" stroke-width="2.5" fill="none"/>${state().records.map(item=>`<circle cx="${x(temp?item.T:item.V)}" cy="${y(law==='charles'?item.V:item.P)}" r="3" fill="#60825a"/>`).join('')}<path d="M${x(currentX)} ${y(currentY)}V247M55 ${y(currentY)}H${x(currentX)}" stroke="#be8b7d" stroke-dasharray="3 4" fill="none"/><circle cx="${x(currentX)}" cy="${y(currentY)}" r="6" fill="#c47d6e" stroke="#fff" stroke-width="2"/>`;
}
function renderChallenge(){
 const d=definitions[law],m=state(),q=d.challenges[m.index],task=m.tasks[m.index];
 $('#challengeIndex').textContent=`${d.name.toUpperCase()} · INVESTIGATION ${m.index+1} OF 3`;
 $('#challengeTask').textContent=q.task;$('#challengePrompt').textContent=q.question;$('#experimentFeedback').textContent=task.observed?'Observation checked. Explain the result below.':'';
 $('#challengeAnswers').replaceChildren();$('#answerFeedback').hidden=!task.correct;$('#answerFeedback').textContent=q.why;$('#lawComplete').hidden=true;
 q.options.forEach((text,index)=>{const b=document.createElement('button');b.textContent=`${String.fromCharCode(65+index)}. ${text}`;b.disabled=!task.observed||task.correct;b.classList.toggle('correct',task.correct&&index===q.answer);b.onclick=()=>{
 if(!task.observed||task.correct)return;
 const correct=index===q.answer;task.correct=correct;
 [...$('#challengeAnswers').children].forEach((button,i)=>{button.classList.toggle('correct',correct&&i===q.answer);button.classList.toggle('wrong',!correct&&i===index);button.disabled=correct});
 $('#answerFeedback').hidden=false;$('#answerFeedback').textContent=(correct?'Correct. ':'Try again. ')+q.why;updateGate();
 };$('#challengeAnswers').append(b)});updateGate();
}
function updateGate(){const m=state(),task=m.tasks[m.index];$('#nextChallenge').disabled=!task.observed||!task.correct;$('#nextChallenge').textContent=m.index===2?'Complete this law':'Next investigation';$('#challengeHint').textContent=!task.observed?'Set the requested value and check your experiment before answering.':!task.correct?'Choose the correct explanation to continue.':'Observation and explanation complete.';}
$('#variable').addEventListener('input',event=>{state().input=+event.target.value;update();if(!state().tasks[state().index].observed)$('#experimentFeedback').textContent='';});
$('#recordState').onclick=record;
$('#checkExperiment').onclick=()=>{const q=definitions[law].challenges[state().index],task=state().tasks[state().index];if(Math.abs(state().input-q.target)>.01){$('#experimentFeedback').textContent=`Your ${definitions[law].label.toLowerCase()} is ${formatted(state().input)} ${definitions[law].unit}. Set ${q.target} ${definitions[law].unit}, then compare the live readings.`;return;}task.observed=true;renderChallenge();};
$('#nextChallenge').onclick=()=>{const m=state();if(!m.tasks[m.index].correct||!m.tasks[m.index].observed)return;if(m.index<2){m.index++;renderChallenge();}else{$('#lawComplete').hidden=false;$('#nextChallenge').disabled=true;}};
$('#resetExperiment').onclick=()=>{const d=definitions[law];memory[law]={index:0,input:d.start,records:[{...baseline}],tasks:d.challenges.map(()=>({observed:false,correct:false}))};setLaw(law);};
document.querySelectorAll('[data-law]').forEach(button=>button.onclick=()=>setLaw(button.dataset.law));
// The sealed sample always contains the same number of particles.
const canvas=$('#particles'),context=canvas.getContext('2d');
const particles=Array.from({length:56},()=>({x:Math.random(),y:Math.random(),angle:Math.random()*Math.PI*2}));
let lastTime=0,dragging=false;
function drawParticles(time){
 requestAnimationFrame(drawParticles);const delta=lastTime?Math.min((time-lastTime)/1000,.04):0;lastTime=time;
 const width=canvas.clientWidth,height=canvas.clientHeight,ratio=Math.min(devicePixelRatio||1,2);
 if(canvas.width!==Math.round(width*ratio)||canvas.height!==Math.round(height*ratio)){canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);}
 context.setTransform(ratio,0,0,ratio,0,0);context.clearRect(0,0,width,height);
 const r=reading(),left=width*.09,top=35,bottom=height-44,gasWidth=width*.76*r.V/4.8,gasHeight=bottom-top;
 context.lineWidth=2;context.strokeStyle='#8cbaa5';context.fillStyle='#204d45';context.fillRect(left,top,gasWidth,gasHeight);context.strokeRect(left,top,gasWidth,gasHeight);
 const speed=50*Math.sqrt(r.T/300),sx=gasWidth/Math.max(1,width*.38);
 for(const p of particles){
 if(!paused){p.x+=Math.cos(p.angle)*speed*delta/(width*.38)*1/Math.max(.1,sx);p.y+=Math.sin(p.angle)*speed*delta/Math.max(1,gasHeight);if(p.x<0||p.x>1){p.x=Math.max(0,Math.min(1,p.x));p.angle=Math.PI-p.angle;}if(p.y<0||p.y>1){p.y=Math.max(0,Math.min(1,p.y));p.angle=-p.angle;}}
 context.beginPath();context.arc(left+5+p.x*Math.max(1,gasWidth-10),top+5+p.y*Math.max(1,gasHeight-10),2.4,0,Math.PI*2);context.fillStyle='#d6b99b';context.fill();}
 context.fillStyle=law==='pressure'?'#c48c7c':'#b7cfbf';context.fillRect(left+gasWidth-3,top-6,10,gasHeight+12);context.fillStyle='#8aaf9e';context.fillRect(left+gasWidth+7,top+gasHeight/2-3,Math.min(width*.08,width-left-gasWidth-8),6);
 context.fillStyle='#bed4c4';context.font='10px system-ui';context.fillText(law==='pressure'?'LOCKED VOLUME':law==='charles'?'CONSTANT LOAD':'MOVABLE PISTON',left,bottom+25);
 context.fillStyle='#ddaa88';context.font='11px system-ui';context.fillText(`${Math.round(r.T)} K`,Math.max(left,width-63),bottom+25);
}
function updatePause(){const b=$('#pauseParticles');b.textContent=paused?'Play particles':'Pause particles';b.setAttribute('aria-pressed',String(paused));}
$('#pauseParticles').onclick=()=>{paused=!paused;updatePause();};
function drag(event){if(!dragging||law!=='boyle')return;const rect=canvas.getBoundingClientRect();const volume=Math.max(1.2,Math.min(4.8,(event.clientX-rect.left-rect.width*.09)/(rect.width*.76)*4.8));state().input=Math.round(volume*10)/10;$('#variable').value=state().input;update();}
canvas.addEventListener('pointerdown',event=>{if(law!=='boyle')return;dragging=true;canvas.setPointerCapture(event.pointerId);drag(event);});canvas.addEventListener('pointermove',drag);canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointercancel',()=>dragging=false);
setLaw('boyle');updatePause();requestAnimationFrame(drawParticles);
