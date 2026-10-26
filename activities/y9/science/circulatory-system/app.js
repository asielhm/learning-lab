import { stages, anatomyDiagram } from './dissection.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const descriptions={
'right-atrium':['Right atrium','Receives oxygen-poor blood from the body via the vena cava.'],
'left-atrium':['Left atrium','Receives oxygen-rich blood returning from the lungs.'],
'ventricular-wall':['Muscular ventricular wall','Surrounds both ventricles. The left ventricle needs higher pressure to pump blood to the whole body. The source groups both ventricular walls into one mesh.'],
'right-ventricle':['Right ventricular cavity','The space in the right ventricle; blood is pumped from here towards the lungs.'],
'left-ventricle':['Left ventricular cavity','The space in the left ventricle; blood is pumped from here to the body through the aorta.'],
'ascending-aorta':['Ascending aorta','Carries oxygen-rich blood away from the left ventricle towards the body.'],
'aortic-arch':['Aortic arch','Curved part of the aorta carrying blood away from the heart.'],
'pulmonary-trunk':['Pulmonary trunk','Carries oxygen-poor blood away from the right ventricle, towards the lungs.'],
'superior-vena-cava':['Superior vena cava','Returns oxygen-poor blood from the head and upper body to the right atrium.'],
'left-coronary':['Left coronary artery','Supplies the heart muscle with oxygen-rich blood.'],
'right-coronary':['Right coronary artery','Supplies the heart muscle with oxygen-rich blood.']};
const list=Object.keys(descriptions); let page=0,stage=0,selected=null,model=null,camera,scene,renderer,controls,ready=false,mouse=new THREE.Vector2(),raycaster=new THREE.Raycaster();
const progress = stages.map(() => ({tasks:new Set(), cut:0, answer:null, correct:false}));
let tool='observe', completed=false, guideNodes=[], tracing=false, membrane=null;
const specimenBounds=new THREE.Box3();
let viewerWidth=0,viewerHeight=0;
const reveal={right:{value:0},left:{value:0},aorta:{value:0}};
const revealTargets={right:0,left:0,aorta:0};
const toolNames={observe:'Observe',probe:'Probe',scissors:'Scissors',forceps:'Forceps'};
const cutPaths={
 right:[[.1,.7,.92],[-.17,.17,1.25],[-.48,-.48,1.28],[-.32,-1.15,1.04]],
 left:[[.77,.02,.99],[.87,-.35,1.07],[.7,-.75,1.07],[.3,-1.23,.93]],
 aorta:[[-.25,.93,.55],[-.32,.63,.55],[-.34,.27,.58],[-.25,-.05,.65]]
};
function setPage(n){
 page=n;
 $$('.step').forEach(x=>x.classList.toggle('active',Number(x.dataset.page)===n));
 $('#bodyScene').hidden=n!==0;$('#threeScene').hidden=n===0;
 ['Position','Explore','Dissect'].forEach((k,i)=>$('#panel'+k).hidden=i!==n);
 $('#sceneLabel').textContent=['STAGE 01 / POSITION','STAGE 02 / ANATOMY','STAGE 03 / DISSECTION'][n];
 $('#sceneTitle').textContent=['Where is your heart?','Explore the 3D heart','Guided heart dissection'][n];
 $('#viewtag').textContent=n===0?'FRONT VIEW':'ROTATABLE 3D';
 $('#modelCaption').textContent=n===0?'Anatomical heart in an illustrative torso · not to scale':'BodyParts3D model · CC BY 4.0';
 if(n>0)loadModel();
 if(n===2)renderStage();else {setHidden([]);select(null);$('#incisionGuide').setAttribute('hidden','');$('#specimenStatus').hidden=true;$('#completionPanel').hidden=true;}
 updateSpecimen();resize();
}
function practicalDone(){const s=stages[stage],p=progress[stage];return [...(s.targets||[]),...(s.tasks||[]).map(x=>x[0])].every(id=>p.tasks.has(id))&&(!s.cut||p.cut===4)}
function updateGates(){
 const s=stages[stage],p=progress[stage],done=practicalDone();
 $('#actionDissect').disabled=!done||!p.correct;
 $('#actionDissect').textContent=stage===stages.length-1?'Complete dissection ✓':'Continue →';
 $('#advanceHint').textContent=!done?'Complete the practical tasks to unlock the question.':!p.correct?'Answer the question correctly to continue.':'Practical action and knowledge check complete.';
 $$('#dissectAnswers button').forEach(b=>b.disabled=!done||p.correct);
 $$('#dissectTasks button').forEach(b=>{const checked=p.tasks.has(b.dataset.task);b.classList.toggle('done',checked);b.setAttribute('aria-pressed',String(checked));b.querySelector('.task-mark').textContent=checked?'✓':'○';});
 $('#nextCut').disabled=tool!=='scissors'||p.cut===4||!model;
 $('#nextCut').textContent=p.cut===4?'Incision traced ✓':`Make guided cut ${p.cut+1} of 4`;
 const status=completed?'DISSECTION COMPLETE':`${s.phase.toUpperCase()} · ${s.cut?`${p.cut}/4 CUT CHECKPOINTS`:toolNames[tool].toUpperCase()}`;
 $('#specimenStatus').textContent=status;
 $('#completedCount').textContent=`${progress.filter((p,i)=>p.correct&&[...(stages[i].targets||[]),...(stages[i].tasks||[]).map(x=>x[0])].every(id=>p.tasks.has(id))&&(!stages[i].cut||p.cut===4)).length}/12`;
 $$('#procedureList li').forEach((li,i)=>{li.classList.toggle('current',i===stage);li.classList.toggle('finished',progress[i].correct);});
 updateGuideStyle();
}
function useTool(t){tool=t;$$('[data-tool]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tool===t)));$('#instruction').textContent=t===stages[stage].tool?stages[stage].instruction:`Choose ${toolNames[stages[stage].tool]} for this step. ${stages[stage].instruction}`;updateGates();}
function recordTask(id){
 const s=stages[stage],p=progress[stage];
 if(tool!==s.tool){$('#instruction').textContent=`Choose ${toolNames[s.tool]} before this action.`;return;}
 if(id==='mitral'&&!p.tasks.has('open-left')){$('#instruction').textContent='Open the left-side window before examining the mitral valve.';return;}
 if(id==='aortic-valve'&&p.cut!==4){$('#instruction').textContent='Trace the aortic incision before examining its valve.';return;}
 p.tasks.add(id);
 if(s.targets?.includes(id)) select(id);
 updateSpecimen();updateGates();
 $('#instruction').textContent=practicalDone()?'Practical action complete. Answer the question to continue.':s.instruction;
}
function renderStage(){
 completed=false;const s=stages[stage],p=progress[stage];
 $('#completionPanel').hidden=true;
 $('#dissectIndex').textContent=`DISSECTION · STEP ${stage+1} OF ${stages.length}`;
 $('#progressFill').style.width=`${stage/stages.length*100}%`;
 $('.progress').setAttribute('aria-valuenow',String(Math.round(stage/stages.length*100)));
 $('#dissectTitle').textContent=s.title;$('#dissectText').textContent=s.text;$('#dissectLook').textContent=s.look;
 $('#dissectPrompt').textContent=s.question;$('#dissectFeedback').hidden=p.answer===null;
 $('#dissectFeedback').textContent=p.answer===null?'':(p.correct?'Correct! ':'Try again. ')+s.explanation;
 $('#dissectAnswers').replaceChildren();
 s.answers.forEach((a,i)=>{const b=document.createElement('button');b.textContent=String.fromCharCode(65+i)+'. '+a;b.classList.toggle('correct',p.correct&&i===s.correct);b.onclick=()=>{
  if(!practicalDone())return;
  p.answer=i;p.correct=i===s.correct;
  $$('#dissectAnswers button').forEach((c,j)=>{c.classList.toggle('correct',p.correct&&j===i);c.classList.toggle('chosen',!p.correct&&j===i)});
  $('#dissectFeedback').hidden=false;$('#dissectFeedback').textContent=(p.correct?'Correct! ':'Try again. ')+s.explanation;updateGates();
 };$('#dissectAnswers').appendChild(b)});
 $('#dissectTasks').replaceChildren();
 for(const [id,label] of [...(s.targets||[]).map(id=>[id,descriptions[id][0]]),...(s.tasks||[])]){
  const b=document.createElement('button');b.dataset.task=id;b.innerHTML='<span class="task-mark" aria-hidden="true">○</span><span></span>';b.lastElementChild.textContent=label;b.onclick=()=>recordTask(id);$('#dissectTasks').appendChild(b);
 }
 $('#anatomyInset').hidden=!s.diagram;$('#anatomyInset').innerHTML=s.diagram?anatomyDiagram(s.diagram):'';
 $('#nextCut').hidden=!s.cut;$('#prevDissect').disabled=stage===0;
 $('#specimenStatus').hidden=false;$('#viewtag').textContent=s.cut?'GUIDED INCISION':'ROTATABLE 3D';
 if(s.cut&&camera)recenterModel();
 setHidden([]);select(null);makeGuide();useTool(s.tool==='scissors'?'observe':s.tool==='forceps'?'observe':s.tool);updateSpecimen();
}
function perform(){
 if(!practicalDone()||!progress[stage].correct)return;
 if(stage===stages.length-1){completed=true;$('#completionPanel').hidden=false;$('#completionPanel').focus();$('#progressFill').style.width='100%';$('.progress').setAttribute('aria-valuenow','100');$('#actionDissect').disabled=true;updateGates();$('#actionDissect').disabled=true;return;}
 stage++;renderStage();$('#dissectTitle').focus({preventScroll:true});
}
function resetDissection(){stage=0;completed=false;progress.forEach(p=>{p.tasks.clear();p.cut=0;p.answer=null;p.correct=false});renderStage();}
function select(id){selected=id;
 $('#selectedName').textContent=id?(descriptions[id]?.[0]||id):'Tap a part of the heart';
 $('#selectedDesc').textContent=id?(descriptions[id]?.[1]||'Anatomical structure'):'Click the 3D heart or use the structure buttons below.';
 $$('.chips button').forEach(b=>b.classList.toggle('selected',b.dataset.id===id));
 if(model)model.traverse(o=>{if(o.isMesh&&!o.userData.helper&&o.material){const s=o.userData.structureId||o.name;o.material.emissive?.set(s===id?'#56312e':'#000000');o.material.emissiveIntensity=s===id?.45:0}});
}
function setHidden(ids){if(!model)return;model.traverse(o=>{if(o.isMesh&&!o.userData.helper){o.visible=!ids.includes(o.userData.structureId||o.name);if(o.material){o.material.side=THREE.DoubleSide;o.material.roughness=.65}}})}
function updateSpecimen(){
 const s=stages[stage],active=page===2;
 // Independent windows preserve the other side of the shared ventricular wall mesh.
 const right=active&&(stage>5||stage===5&&progress[5].tasks.has('open-right'))?1:0;
 const left=active&&(stage>9||stage===9&&progress[9].tasks.has('open-left'))?1:0;
 const aorta=active&&stage>=10?progress[10].cut/4:0;
 revealTargets.right=right;revealTargets.left=left;revealTargets.aorta=aorta;
 if(!active)for(const key of Object.keys(reveal))reveal[key].value=0;
 if(membrane)membrane.visible=active&&(stage===0||stage===1&&!progress[1].tasks.has('pericardium'));
 if(controls){controls.enabled=!(active&&s.cut);controls.enableRotate=!(active&&s.cut);}
 $('#front').disabled=!model;$('#zoomIn').disabled=active&&!!s.cut;$('#zoomOut').disabled=active&&!!s.cut;
 updateGuidePosition();
}
function installCutaway(mesh){
 if(!['ventricular-wall','left-coronary','right-coronary','ascending-aorta'].includes(mesh.name))return;
 mesh.material=mesh.material.clone();
 const wall=mesh.name!=='ascending-aorta';
 mesh.material.onBeforeCompile=shader=>{
  shader.uniforms.rightWindow=reveal.right;shader.uniforms.leftWindow=reveal.left;shader.uniforms.aortaWindow=reveal.aorta;
  shader.vertexShader='varying vec3 specimenPosition;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nspecimenPosition = position;');
  shader.fragmentShader='varying vec3 specimenPosition;\nuniform float rightWindow;\nuniform float leftWindow;\nuniform float aortaWindow;\n'+shader.fragmentShader;
  const rule=wall?`vec3 p=specimenPosition;
   float rightEllipse=pow((p.x+0.39)/0.59,2.0)+pow((p.y+0.5)/0.91,2.0);
   float leftEllipse=pow((p.x-0.55)/0.43,2.0)+pow((p.y+0.49)/0.85,2.0);
   if(rightWindow>0.0 && p.x<0.08 && p.z>0.4 && rightEllipse<rightWindow)discard;
   if(leftWindow>0.0 && p.x>0.12 && p.z>0.28 && leftEllipse<leftWindow)discard;`:
   `if(aortaWindow>0.0 && specimenPosition.z>0.15 && specimenPosition.y>0.73-aortaWindow*0.95)discard;`;
  shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\n'+rule);
 };
 mesh.material.customProgramCacheKey=()=>wall?'ventricle-windows':'aorta-window';
}
function makeGuide(){
 const svg=$('#incisionGuide');svg.replaceChildren();guideNodes=[];const s=stages[stage];svg.toggleAttribute('hidden',page!==2||!s.cut);
 if(!s.cut)return;
 const ns='http://www.w3.org/2000/svg';
 const path=document.createElementNS(ns,'polyline');path.classList.add('cut-line');svg.appendChild(path);
 const done=document.createElementNS(ns,'polyline');done.classList.add('cut-line-done');svg.appendChild(done);
 cutPaths[s.cut].forEach((p,i)=>{const group=document.createElementNS(ns,'g');const circle=document.createElementNS(ns,'circle');circle.setAttribute('r','16');const text=document.createElementNS(ns,'text');text.textContent=i+1;text.setAttribute('text-anchor','middle');text.setAttribute('dy','.35em');group.append(circle,text);group.dataset.checkpoint=i;group.setAttribute('aria-hidden','true');svg.appendChild(group);guideNodes.push(group);});
 updateGuidePosition();updateGuideStyle();
}
function updateGuidePosition(){
 const s=stages[stage];if(page!==2||!s.cut||!model||!camera||!guideNodes.length)return;
 const svg=$('#incisionGuide'),w=$('#canvas').clientWidth,h=$('#canvas').clientHeight;
 svg.setAttribute('viewBox',`0 0 ${w} ${h}`);model.updateMatrixWorld();camera.updateMatrixWorld();
 const pts=cutPaths[s.cut].map(p=>new THREE.Vector3(...p).applyMatrix4(model.matrixWorld).project(camera)).map(p=>[(p.x+1)*w/2,(-p.y+1)*h/2]);
 svg.querySelector('.cut-line').setAttribute('points',pts.map(p=>p.join(',')).join(' '));
 svg.querySelector('.cut-line-done').setAttribute('points',pts.slice(0,progress[stage].cut).map(p=>p.join(',')).join(' '));
 guideNodes.forEach((g,i)=>g.setAttribute('transform',`translate(${pts[i][0]},${pts[i][1]})`));
}
function updateGuideStyle(){guideNodes.forEach((g,i)=>{g.classList.toggle('cut-complete',i<progress[stage].cut);g.classList.toggle('cut-next',i===progress[stage].cut);});}
function makeCut(){
 if(page!==2||!stages[stage].cut||!model)return;
 if(tool!=='scissors'){$('#instruction').textContent='Choose Scissors before tracing the incision.';return;}
 const p=progress[stage];if(p.cut<4)p.cut++;
 $('#instruction').textContent=p.cut===4?'Incision complete. Finish any observations, then answer the question.':`Checkpoint ${p.cut} complete. Follow the guide to checkpoint ${p.cut+1}.`;
 updateSpecimen();updateGates();
}
function traceAt(event){
 if(!tracing||tool!=='scissors')return;
 const next=guideNodes[progress[stage].cut];if(!next)return;
 const box=next.getBoundingClientRect();if(Math.hypot(event.clientX-(box.left+box.width/2),event.clientY-(box.top+box.height/2))<30)makeCut();
}
function visibleIntersection(hit){
 const o=hit.object;if(!o.visible||o.userData.helper)return false;
 const p=o.worldToLocal(hit.point.clone());
 if(['ventricular-wall','left-coronary','right-coronary'].includes(o.name)){
  const rightEllipse=((p.x+.39)/.59)**2+((p.y+.5)/.91)**2;
  const leftEllipse=((p.x-.55)/.43)**2+((p.y+.49)/.85)**2;
  if(reveal.right.value>0&&p.x<.08&&p.z>.4&&rightEllipse<reveal.right.value)return false;
  if(reveal.left.value>0&&p.x>.12&&p.z>.28&&leftEllipse<reveal.left.value)return false;
 }
 if(o.name==='ascending-aorta'&&reveal.aorta.value>0&&p.z>.15&&p.y>.73-reveal.aorta.value*.95)return false;
 return true;
}
function loadModel(){if(ready)return;ready=true;
 const holder=$('#canvas');scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.set(0,.1,7);
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;holder.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0xe1f3ff,0x40475b,2.3));const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(4,6,5);scene.add(key);const fill=new THREE.DirectionalLight(0x88bce3,1.1);fill.position.set(-4,-2,-3);scene.add(fill);
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=2;controls.maxDistance=14;
 renderer.domElement.addEventListener('click',event=>{if(!model)return;const rect=renderer.domElement.getBoundingClientRect();mouse.x=(event.clientX-rect.left)/rect.width*2-1;mouse.y=-((event.clientY-rect.top)/rect.height*2-1);raycaster.setFromCamera(mouse,camera);
 const hits=raycaster.intersectObject(model,true);const o=hits.find(visibleIntersection)?.object;if(!o)return;const id=o.userData.structureId||o.name;if(!descriptions[id])return;
 if(page===2){if(stages[stage].targets?.includes(id))recordTask(id);else $('#instruction').textContent=`${descriptions[id][0]}. Follow the current step’s task list.`;}else select(id);
 });
 new GLTFLoader().load('./models/heart.glb',g=>{
 model=g.scene;model.traverse(o=>{if(o.isMesh)installCutaway(o)});
 const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());const scale=3.6/Math.max(size.x,size.y,size.z);model.scale.setScalar(scale);model.position.copy(center).multiplyScalar(-scale);scene.add(model);specimenBounds.setFromObject(model);
 membrane=new THREE.Mesh(new THREE.SphereGeometry(1,40,28),new THREE.MeshPhysicalMaterial({color:0xcee3df,transparent:true,opacity:.19,roughness:.35,side:THREE.DoubleSide,depthWrite:false}));membrane.scale.set(1.27,1.5,1.35);membrane.position.set(0,-.16,.1);membrane.userData.helper=true;model.add(membrane);
 recenterModel();$('#loading').hidden=true;updateSpecimen();if(page===2)updateGates();resize();
 },undefined,err=>{$('#loading').textContent='Could not load the heart model. Check models/heart.glb and reload. '+(err.message||'')});
 function frame(){requestAnimationFrame(frame);controls.update();for(const key of Object.keys(reveal)){reveal[key].value=THREE.MathUtils.lerp(reveal[key].value,revealTargets[key],.085);if(Math.abs(reveal[key].value-revealTargets[key])<.001)reveal[key].value=revealTargets[key];}if(page>0)renderer.render(scene,camera);}frame();new ResizeObserver(resize).observe(holder);resize();
}
function recenterModel(){
 if(!model||!camera||!controls||specimenBounds.isEmpty())return;
 const holder=$('#canvas');
 if(holder.clientWidth&&holder.clientHeight){camera.aspect=holder.clientWidth/holder.clientHeight;camera.updateProjectionMatrix();}
 const center=specimenBounds.getCenter(new THREE.Vector3());
 const size=specimenBounds.getSize(new THREE.Vector3());
 const halfFov=THREE.MathUtils.degToRad(camera.fov/2);
 // Fit both dimensions with space around the specimen, including its depth.
 const distance=Math.max(size.y,size.x/camera.aspect)/(2*Math.tan(halfFov)) * 1.15+size.z/2;
 const damping=controls.enableDamping;
 controls.enableDamping=false;controls.update(); // Consume any remaining rotation momentum.
 controls.maxDistance=Math.max(14,distance*2);
 controls.target.copy(center);camera.position.copy(center).add(new THREE.Vector3(0,0,distance));
 controls.update();controls.enableDamping=damping;
 updateGuidePosition();
}
function resize(){
 if(!renderer||!camera)return;
 const e=$('#canvas'),w=e.clientWidth,h=e.clientHeight;
 if(w&&h){
  const changed=w!==viewerWidth||h!==viewerHeight;
  viewerWidth=w;viewerHeight=h;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
  if(changed)recenterModel();
  updateGuidePosition();
 }
}
$$('.step').forEach(b=>b.onclick=()=>setPage(+b.dataset.page));$$('[data-go]').forEach(b=>b.onclick=()=>setPage(+b.dataset.go));
$$('.reveal').forEach(b=>b.onclick=()=>{const e=document.getElementById(b.dataset.answer);e.hidden=!e.hidden;b.textContent=e.hidden?'Reveal explanation ↓':'Hide explanation ↑'});
$('#bodyHeart').addEventListener('click',()=>setPage(1));$('#bodyHeart').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setPage(1)}});
$('#actionDissect').onclick=perform;$('#prevDissect').onclick=()=>{if(stage>0){stage--;renderStage();$('#dissectTitle').focus({preventScroll:true});}};
$('#resetDissect').onclick=resetDissection;$('#resetAll').onclick=()=>{resetDissection();setPage(0)};
$('#front').onclick=recenterModel;
$('#zoomIn').onclick=()=>{if(camera){camera.position.sub(controls.target).multiplyScalar(.8).add(controls.target);controls.update()}};$('#zoomOut').onclick=()=>{if(camera){camera.position.sub(controls.target).multiplyScalar(1.25).add(controls.target);controls.update()}};
for(const [i,s] of stages.entries()){const li=document.createElement('li');li.textContent=s.title;$('#procedureList').appendChild(li);}
for(const b of $$('[data-tool]'))b.onclick=()=>useTool(b.dataset.tool);
$('#nextCut').onclick=makeCut;
const guide=$('#incisionGuide');guide.addEventListener('pointerdown',e=>{if(tool!=='scissors'){$('#instruction').textContent='Choose Scissors before tracing the guide.';return;}e.preventDefault();tracing=true;guide.setPointerCapture(e.pointerId);traceAt(e)});
guide.addEventListener('pointermove',traceAt);guide.addEventListener('pointerup',()=>tracing=false);guide.addEventListener('pointercancel',()=>tracing=false);
const chipContainer=$('#exploreChips');for(const id of list){const b=document.createElement('button');b.dataset.id=id;b.textContent=descriptions[id][0];b.onclick=()=>select(id);chipContainer.appendChild(b)}setPage(0);
