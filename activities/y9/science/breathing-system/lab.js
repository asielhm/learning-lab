import { centerSpecimen } from '../../../../assets/viewer-framing.js';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const structures = {
  trachea: ['Trachea', 'The windpipe carries air toward the bronchi. Cartilage supports it, while mucus and cilia help trap and move particles away from the lungs.'],
  bronchi: ['Bronchi', 'The trachea divides into two main bronchi, one entering each lung. The bronchi branch into smaller airways.'],
  bronchioles: ['Bronchioles', 'These smaller branching airways carry air toward the alveoli. Their smooth muscle can change airway diameter.'],
  'right-lung': ['Right lung', 'The right lung normally has three lobes. It contains branching airways and many alveoli; the lung itself is not a muscle.'],
  'left-lung': ['Left lung', 'The left lung normally has two lobes and a cardiac notch that makes room for the heart.'],
  diaphragm: ['Diaphragm', 'A sheet of skeletal muscle below the lungs. It contracts and flattens during inhalation, increasing thoracic volume. It relaxes into a dome during quiet exhalation.']
};
const explored = new Set();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let section = 0, playing = !reducedMotion, phase = 0, rate = 12, depth = .6;
let THREE, scene, camera, renderer, controls, specimen, lungGroups = [], ribs, diaphragm, raycaster;
let modelReady = false, sizeKey = '', previousTime = 0, lastExplanation = '';
const investigationStates = Array.from({length:4}, () => ({traced:false, correct:false}));
let investigation = 0;
const investigations = [
  {title:'Follow oxygen into the blood', text:'The alveolar air normally has a higher oxygen concentration than the arriving blood. Oxygen dissolves in the moist lining and diffuses through the thin alveolar and capillary walls.', task:'Trace oxygen on the diagram before answering.', gas:'oxygen', question:'Which way does oxygen diffuse at the lungs?', answers:['From alveolar air into the blood','From blood into alveolar air','From the lungs directly into body cells'], correct:0, explanation:'Oxygen moves down its concentration gradient from alveolar air into the blood. It is then carried to body tissues.'},
  {title:'Follow carbon dioxide out', text:'Blood arriving at the lungs normally has a higher carbon dioxide concentration than alveolar air. Carbon dioxide diffuses into the alveolus and is removed during exhalation.', task:'Trace CO₂ from blood to alveolar air before answering.', gas:'carbon', question:'Why does carbon dioxide enter the alveolus?', answers:['The diaphragm pumps it through the wall','It diffuses down its concentration gradient','Alveoli make carbon dioxide'], correct:1, explanation:'Carbon dioxide diffuses from its higher concentration in arriving blood toward its lower concentration in alveolar air.'},
  {title:'Keep the gradients going', text:'Ventilation refreshes the air in the alveoli. Blood flow brings carbon dioxide and carries oxygen away. Together they help maintain the concentration gradients needed for diffusion.', task:'Trace either gas again, and compare the blood entering and leaving the capillary.', gas:'either', question:'Which combination helps maintain gas-exchange gradients?', answers:['Ventilation and a continuous blood supply','Thick alveolar walls and slow blood flow','Closing the airways and holding all blood still'], correct:0, explanation:'Fresh air and continuous blood flow help maintain the differences in gas concentrations across the exchange surfaces.'},
  {title:'Connect breathing to respiration', text:'Breathing (ventilation) moves air. Gas exchange moves gases by diffusion. Aerobic cellular respiration is a chemical process inside cells that transfers energy from glucose using oxygen, producing carbon dioxide and water.', task:'Trace oxygen once more: lungs → blood → body tissues. Remember that the chemical reactions happen inside cells, not in alveolar air.', gas:'oxygen', question:'Which statement describes aerobic cellular respiration?', answers:['Air being pushed through the trachea','Oxygen diffusing across an alveolar wall','A chemical process in cells that transfers energy from glucose'], correct:2, explanation:'Aerobic respiration transfers energy from glucose inside cells. Ventilation and gas exchange supply oxygen and help remove carbon dioxide.'}
];
function selectStructure(id) {
  const entry = structures[id]; if (!entry) return;
  explored.add(id); $('#selectedName').textContent = entry[0]; $('#selectedDescription').textContent = entry[1];
  $('#structureProgress').textContent = `${explored.size} of 6 structures explored`;
  $$('#anatomyChips button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.structure === id)));
  if(specimen) specimen.traverse(object => { if(object.isMesh && object.material?.emissive) object.material.emissive.set(object.userData.structure === id ? '#244c48' : '#000000'); });
}
function addAnswers(container, feedback, answers, correct, explanation, callback = () => {}) {
  container.replaceChildren();
  answers.forEach((answer, index) => {
    const button = document.createElement('button'); button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
    button.addEventListener('click', () => {
      const isCorrect = index === correct;
      [...container.children].forEach((option, optionIndex) => { option.classList.toggle('correct', isCorrect && optionIndex === index); option.classList.toggle('incorrect', !isCorrect && optionIndex === index); option.disabled = isCorrect; });
      feedback.hidden = false; feedback.classList.toggle('incorrect', !isCorrect);
      feedback.textContent = (isCorrect ? 'Correct! ' : 'Try again. ') + explanation; callback(isCorrect);
    }); container.append(button);
  });
}
function setSection(index) {
  section = index;
  $$('.step').forEach(button => { const active = +button.dataset.section === index; button.classList.toggle('active', active); if(active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current'); });
  $('#anatomyPanel').hidden = index !== 0; $('#breathingPanel').hidden = index !== 1; $('#exchangePanel').hidden = index !== 2;
  $('#modelScene').hidden = index === 2; $('#exchangeScene').hidden = index !== 2; $('#phaseBadge').hidden = index !== 1;
  $('#sceneLabel').textContent = ['STAGE 01 / ANATOMY','STAGE 02 / VENTILATION','STAGE 03 / GAS EXCHANGE'][index];
  $('#sceneTitle').textContent = ['A closer look at your lungs.','A breath, made visible.','Across a microscopic boundary.'][index];
  $('#sceneTag').textContent = index === 2 ? 'ENLARGED TEACHING SECTION' : '3D TEACHING MODEL';
  $('#modelCaption').textContent = index === 2 ? 'Alveolus and capillary · schematic section' : 'Schematic teaching model · not to scale';
  if(index === 2) renderInvestigation();
  resize(); updateBreathing(); if(index !== 2) recenter();
}
function updatePlayback() { $('#playBreath').textContent = playing ? 'Pause breathing' : 'Play breathing'; $('#playBreath').setAttribute('aria-pressed',String(playing)); }
function updateBreathing() {
  const amount = section === 0 ? 0 : (1 - Math.cos(phase)) / 2 * depth;
  const derivative = Math.sin(phase);
  const atEnd = Math.abs(derivative) < .025;
  const inhale = derivative > 0;
  const phaseName = atEnd ? (Math.cos(phase) > 0 ? 'End of exhalation' : 'End of inhalation') : (inhale ? 'Inhalation' : 'Exhalation');
  $('#expansionReadout').textContent = `${Math.round(amount * 100)}%`;
  $('#pressureReadout').textContent = atEnd ? 'Equal to outside' : inhale ? 'Below outside' : 'Above outside';
  $('#phaseBadge').textContent = `${playing ? '' : 'PAUSED · '}${phaseName.toUpperCase()}`;
  if(lastExplanation !== phaseName) {
    lastExplanation = phaseName; $('#breathingPhase').textContent = phaseName;
    $('#phaseExplanation').textContent = atEnd ? (Math.cos(phase) > 0 ? 'The diaphragm is domed and the lungs are at their smaller resting volume. Airflow pauses as pressures equalise.' : 'The diaphragm is flatter and thoracic volume is larger. Airflow briefly pauses as pressures equalise.') : inhale ? 'The diaphragm contracts and flattens. External intercostal muscles lift the ribs up and out. Thoracic volume rises, lung pressure falls below outside pressure, and air moves in.' : 'During quiet exhalation the diaphragm and external intercostals relax. Elastic recoil reduces lung volume. Lung pressure rises above outside pressure, and air moves out.';
  }
  for(const lung of lungGroups) lung.scale.set(1 + amount * .12, 1 + amount * .085, 1 + amount * .14);
  if(ribs) { ribs.scale.set(1 + amount * .1, 1 + amount * .025, 1 + amount * .07); ribs.position.y = amount * .1; }
  if(diaphragm) {
    const positions = diaphragm.geometry.attributes.position;
    for(let index=0;index<positions.count;index++) { const radius = diaphragm.userData.radii[index]; positions.setY(index,-1.43 + (.48 - amount * .48) * (1-radius*radius)); }
    positions.needsUpdate = true; diaphragm.geometry.computeVertexNormals();
  }
}
function renderInvestigation() {
  const step=investigations[investigation],state=investigationStates[investigation];
  $('#investigationIndex').textContent=`GAS EXCHANGE · STEP ${investigation+1} OF 4`; $('#investigationProgress').style.width=`${(investigation+1)/4*100}%`;
  $('#investigationTitle').textContent=step.title; $('#investigationText').textContent=step.text;
  $('#investigationQuestion').textContent=step.question; $('#exchangeFeedback').hidden=true; $('#exchangeComplete').hidden=true;
  $('#investigationTask').textContent=state.traced?'Pathway traced. Answer the question to continue.':step.task;
  addAnswers($('#exchangeAnswers'),$('#exchangeFeedback'),step.answers,step.correct,step.explanation,correct=>{state.correct=correct;updateInvestigationGate();});
  if(state.correct) {const button=$('#exchangeAnswers').children[step.correct];button.click();}
  $('#previousInvestigation').disabled=investigation===0; $('#nextInvestigation').textContent=investigation===3?'Complete investigation':'Continue →';
  updateInvestigationGate();
}
function updateInvestigationGate() {
  const state=investigationStates[investigation]; $('#nextInvestigation').disabled=!state.traced||!state.correct;
  $$('#exchangeAnswers button').forEach(button=>button.disabled=!state.traced||state.correct);
}
function traceGas(gas) {
  $('#exchangeScene').classList.toggle('gas-oxygen',gas==='oxygen'); $('#exchangeScene').classList.toggle('gas-carbon',gas==='carbon');
  $('#traceOxygen').setAttribute('aria-pressed',String(gas==='oxygen')); $('#traceCarbon').setAttribute('aria-pressed',String(gas==='carbon'));
  $('#gasStatus').textContent=gas==='oxygen'?'Oxygen diffuses from alveolar air, across thin walls, into the capillary blood.':'Carbon dioxide diffuses from the capillary blood, across thin walls, into alveolar air.';
  const step=investigations[investigation];
  if(step.gas===gas||step.gas==='either') { investigationStates[investigation].traced=true; $('#investigationTask').textContent='Pathway traced. Answer the question to continue.'; }
  updateInvestigationGate();
}
function resetLesson() {
  explored.clear(); if(specimen)specimen.traverse(object=>{if(object.isMesh&&object.material?.emissive)object.material.emissive.set('#000000');}); $('#selectedName').textContent='Where would you start?'; $('#selectedDescription').textContent='Select a structure to learn what it does.'; $('#structureProgress').textContent='0 of 6 structures explored';
  $$('#anatomyChips button').forEach(button=>button.setAttribute('aria-pressed','false'));
  phase=0;rate=12;depth=.6;playing=!reducedMotion;lastExplanation='';$('#breathingRate').value=12;$('#breathDepth').value=60;$('#rateOutput').textContent='12 breaths/min';$('#depthOutput').textContent='60%';updatePlayback();
  investigation=0;investigationStates.forEach(state=>{state.traced=false;state.correct=false});
  $('#exchangeScene').classList.remove('gas-oxygen','gas-carbon');$('#traceOxygen').setAttribute('aria-pressed','false');$('#traceCarbon').setAttribute('aria-pressed','false');$('#gasStatus').textContent='Choose a gas to follow its diffusion pathway.';
  setupKnowledgeChecks();setSection(0);recenter();
}
function setupKnowledgeChecks() {
  $('#anatomyFeedback').hidden=true;$('#breathingFeedback').hidden=true;
  addAnswers($('#anatomyAnswers'),$('#anatomyFeedback'),['In the trachea','Across the walls of the alveoli','Inside the diaphragm'],1,'Alveoli provide a large, moist exchange surface with thin walls and a rich capillary supply.');
  addAnswers($('#breathingAnswers'),$('#breathingFeedback'),['The diaphragm relaxes upward and thoracic volume falls','The diaphragm contracts and flattens; thoracic volume rises','The lungs contract like skeletal muscles'],1,'The diaphragm and external intercostal muscles increase thoracic volume. The lungs follow the expanding chest wall; air enters because of a pressure difference.');
}
function recenter() {
  if(THREE) centerSpecimen(THREE,camera,controls,specimen,$('#canvas'));
}
function resize() {
  if(!camera||!renderer)return;
  const element=$('#canvas'),width=element.clientWidth,height=element.clientHeight;if(!width||!height)return;
  camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false);
  const key=`${width}x${height}`;if(sizeKey!==key){sizeKey=key;recenter();}
}
async function initModel() {
  try {
    const modules=await Promise.all([import('three'),import('three/addons/controls/OrbitControls.js')]);THREE=modules[0];
    scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.set(0,.18,7.6);
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;$('#canvas').append(renderer.domElement);
    controls=new modules[1].OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=3.5;controls.maxDistance=14;
    scene.add(new THREE.HemisphereLight(0xdcf5ff,0x313e4a,2.3));const key=new THREE.DirectionalLight(0xffe1d2,3);key.position.set(4,5,5);scene.add(key);const fill=new THREE.DirectionalLight(0x99d7de,1);fill.position.set(-4,1,2);scene.add(fill);
    specimen=new THREE.Group();scene.add(specimen);
    const material=(color,extras={})=>new THREE.MeshStandardMaterial({color,roughness:.67,...extras});
    const lungMaterial=material(0xd88e97,{transparent:true,opacity:.76,side:THREE.DoubleSide});const airwayMaterial=material(0xe5c0a4);const fineAirwayMaterial=material(0xe7c6a5);const cartilageMaterial=material(0xb7d3d4);
    const mark=(object,id)=>{object.userData.structure=id;return object};
    function tube(start,end,radius,mat,id,parent=specimen){const direction=new THREE.Vector3().subVectors(end,start);const object=mark(new THREE.Mesh(new THREE.CylinderGeometry(radius*.83,radius,direction.length(),14),mat.clone()),id);object.position.copy(start).add(end).multiplyScalar(.5);object.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction.normalize());parent.add(object);return object;}
    for(const [x,id] of [[-.83,'right-lung'],[.83,'left-lung']]){
      const group=new THREE.Group();group.position.set(x,-.08,0);specimen.add(group);lungGroups.push(group);
      const geometry=new THREE.SphereGeometry(1,36,28),position=geometry.attributes.position;
      for(let i=0;i<position.count;i++){let px=position.getX(i),py=position.getY(i),pz=position.getZ(i);px*=.72*(1-.1*py);py*=1.22;pz*=.52;if(id==='left-lung'&&px<-.22&&py>-.35&&py<.35&&pz>.05)px+=.17*(1-Math.abs(py)/.35);position.setXYZ(i,px,py,pz);}
      geometry.computeVertexNormals();group.add(mark(new THREE.Mesh(geometry,lungMaterial.clone()),id));
      const fissureMaterial=new THREE.LineBasicMaterial({color:0x9c5966,transparent:true,opacity:.85});
      function fissure(points){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(35)),fissureMaterial);group.add(line);}
      fissure([[-.57,.12,.34],[-.15,-.12,.51],[.42,-.62,.35]]);if(id==='right-lung')fissure([[-.62,.22,.29],[-.2,.18,.51],[.53,.1,.34]]);
    }
    tube(new THREE.Vector3(0,2.06,0),new THREE.Vector3(0,.57,0),.13,airwayMaterial,'trachea');
    for(let y=.72;y<2.05;y+=.16){const ring=mark(new THREE.Mesh(new THREE.TorusGeometry(.13,.018,6,20),cartilageMaterial.clone()),'trachea');ring.rotation.x=Math.PI/2;ring.position.set(0,y,0);specimen.add(ring);}
    for(const side of [-1,1]){
      const bronchusEnd=new THREE.Vector3(side*.71,.15,.12);tube(new THREE.Vector3(0,.57,0),bronchusEnd,.105,airwayMaterial,'bronchi');
      for(const offset of [-.53,0,.47]) {const end=new THREE.Vector3(side*(1.02+Math.abs(offset)*.32),offset-.25,.22);tube(bronchusEnd,end,.045,fineAirwayMaterial,'bronchioles');for(const twig of [-1,1])tube(end,new THREE.Vector3(end.x+side*.12,end.y+twig*.18,.28),.021,fineAirwayMaterial,'bronchioles');}
    }
    ribs=new THREE.Group();specimen.add(ribs);
    for(let level=0;level<5;level++) {const y=1.08-level*.43;for(const side of [-1,1]){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(side*.18,y+.06,-.7),new THREE.Vector3(side*1.47,y+.1,-.36),new THREE.Vector3(side*1.74,y-.13,.25),new THREE.Vector3(side*1.45,y-.27,.61)]);const rib=new THREE.Mesh(new THREE.TubeGeometry(curve,24,.023,6,false),material(0xa8bbc7,{transparent:true,opacity:.3}));rib.userData.helper=true;ribs.add(rib);}}
    const vertices=[],indices=[],radii=[];const rings=16,segments=48;
    for(let r=0;r<=rings;r++)for(let a=0;a<=segments;a++){const radius=r/rings,angle=a/segments*Math.PI*2;vertices.push(Math.cos(angle)*radius*1.74,-1.43+.48*(1-radius*radius),Math.sin(angle)*radius*.85);radii.push(radius);if(r<rings&&a<segments){const first=r*(segments+1)+a,second=first+segments+1;indices.push(first,second,first+1,second,second+1,first+1);}}
    const diaphragmGeometry=new THREE.BufferGeometry();diaphragmGeometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));diaphragmGeometry.setIndex(indices);diaphragmGeometry.computeVertexNormals();diaphragm=mark(new THREE.Mesh(diaphragmGeometry,material(0x80c7bb,{side:THREE.DoubleSide})),'diaphragm');diaphragm.userData.radii=radii;specimen.add(diaphragm);
    raycaster=new THREE.Raycaster();renderer.domElement.addEventListener('click',event=>{if(section!==0)return;const rectangle=renderer.domElement.getBoundingClientRect();const mouse=new THREE.Vector2((event.clientX-rectangle.left)/rectangle.width*2-1,-(event.clientY-rectangle.top)/rectangle.height*2+1);raycaster.setFromCamera(mouse,camera);const hit=raycaster.intersectObject(specimen,true).find(item=>item.object.userData.structure);if(hit)selectStructure(hit.object.userData.structure);});
    modelReady=true;$('#modelLoading').hidden=true;$('#recenter').disabled=false;$('#zoomIn').disabled=false;$('#zoomOut').disabled=false;resize();recenter();new ResizeObserver(resize).observe($('#canvas'));
  } catch {
    $('#modelLoading').hidden=true;$('#canvas').innerHTML='<img class="fallback-svg" src="cover.svg" alt="Schematic lungs with trachea, branching bronchi and a diaphragm"><p class="fallback-caption">The 3D view is unavailable. Use this teaching illustration and the labelled structure buttons to continue.</p>';
  }
}
function frame(time) {
  requestAnimationFrame(frame);const delta=previousTime?Math.min((time-previousTime)/1000,.1):0;previousTime=time;
  if(section===1&&playing){phase=(phase+delta*rate/60*Math.PI*2)%(Math.PI*2);updateBreathing();}
  else if(section===0&&modelReady){for(const lung of lungGroups)lung.scale.set(1,1,1);if(ribs)ribs.scale.set(1,1,1);}
  if(modelReady){controls.update();if(section!==2)renderer.render(scene,camera);}
}
for(const [id,[name]] of Object.entries(structures)) {const button=document.createElement('button');button.dataset.structure=id;button.textContent=name;button.setAttribute('aria-pressed','false');button.onclick=()=>selectStructure(id);$('#anatomyChips').append(button);}
$$('[data-section]').forEach(button=>button.onclick=()=>setSection(+button.dataset.section));$$('[data-go]').forEach(button=>button.onclick=()=>setSection(+button.dataset.go));
$('#recenter').onclick=recenter;$('#zoomIn').onclick=()=>{if(camera){camera.position.sub(controls.target).multiplyScalar(.84).add(controls.target);controls.update();}};$('#zoomOut').onclick=()=>{if(camera){camera.position.sub(controls.target).multiplyScalar(1.18).add(controls.target);controls.update();}};
$('#playBreath').onclick=()=>{playing=!playing;updatePlayback();};$('#inhale').onclick=()=>{phase=Math.PI;playing=false;updatePlayback();updateBreathing();};$('#exhale').onclick=()=>{phase=0;playing=false;updatePlayback();updateBreathing();};
$('#breathingRate').oninput=event=>{rate=+event.target.value;$('#rateOutput').textContent=`${rate} breaths/min`;};$('#breathDepth').oninput=event=>{depth=+event.target.value/100;$('#depthOutput').textContent=`${Math.round(depth*100)}%`;updateBreathing();};
$('#traceOxygen').onclick=()=>traceGas('oxygen');$('#traceCarbon').onclick=()=>traceGas('carbon');$('#previousInvestigation').onclick=()=>{if(investigation>0){investigation--;renderInvestigation();}};$('#nextInvestigation').onclick=()=>{if(!investigationStates[investigation].traced||!investigationStates[investigation].correct)return;if(investigation<3){investigation++;renderInvestigation();}else{$('#exchangeComplete').hidden=false;$('#nextInvestigation').disabled=true;$('#investigationProgress').style.width='100%';}};
$('#restart').onclick=resetLesson;setupKnowledgeChecks();updatePlayback();setSection(0);initModel();requestAnimationFrame(frame);
