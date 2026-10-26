import { centerSpecimen, enableSpecimenGestures } from '../../../../assets/viewer-framing.js?v=two-finger-1';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const $=selector=>document.querySelector(selector), $$=selector=>[...document.querySelectorAll(selector)];
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

let page=0, model, camera, renderer, controls, scene, loading=false, viewerWidth=0,viewerHeight=0;
const raycaster=new THREE.Raycaster(),mouse=new THREE.Vector2();
function setPage(index){
 if(index!==0&&index!==1)return;
 page=index;
 $$('.step[data-page]').forEach(button=>button.classList.toggle('active',Number(button.dataset.page)===index));
 $('#bodyScene').hidden=index!==0;$('#threeScene').hidden=index===0;
 $('#panelPosition').hidden=index!==0;$('#panelExplore').hidden=index!==1;
 $('#sceneLabel').textContent=index?'STAGE 02 / ANATOMY':'STAGE 01 / POSITION';
 $('#sceneTitle').textContent=index?'Explore the 3D heart':'Where is your heart?';
 $('#viewtag').textContent=index?'ROTATABLE 3D':'FRONT VIEW';
 $('#modelCaption').textContent=index?'BodyParts3D model · CC BY 4.0':'Anatomical heart in an illustrative torso · not to scale';
 if(index){loadModel();resize();recenterModel();}
}
function select(id){
 $('#selectedName').textContent=id?descriptions[id][0]:'Tap a part of the heart';
 $('#selectedDesc').textContent=id?descriptions[id][1]:'Click the 3D heart or use the structure buttons below.';
 $$('#exploreChips button').forEach(button=>button.classList.toggle('selected',button.dataset.id===id));
 model?.traverse(object=>{if(object.isMesh&&object.material?.emissive){const selected=(object.userData.structureId||object.name)===id;object.material.emissive.set(selected?'#56312e':'#000000');object.material.emissiveIntensity=selected?.45:0;}});
}
function recenterModel(){centerSpecimen(THREE,camera,controls,model,$('#canvas'));}
function resize(){
 if(!renderer||!camera)return;const e=$('#canvas'),w=e.clientWidth,h=e.clientHeight;if(!w||!h)return;
 const changed=w!==viewerWidth||h!==viewerHeight;viewerWidth=w;viewerHeight=h;
 camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);if(changed)recenterModel();
}
function loadModel(){
 if(loading)return;loading=true;
 try{
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(38,1,.1,100);
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;$('#canvas').append(renderer.domElement);
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;enableSpecimenGestures(THREE,controls);controls.minDistance=2;controls.maxDistance=14;
 scene.add(new THREE.HemisphereLight(0xe1f3ff,0x40475b,2.3));const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(4,6,5);scene.add(key);const fill=new THREE.DirectionalLight(0x88bce3,1.1);fill.position.set(-4,-2,-3);scene.add(fill);
 renderer.domElement.addEventListener('click',event=>{if(!model)return;const rect=renderer.domElement.getBoundingClientRect();mouse.set((event.clientX-rect.left)/rect.width*2-1,-((event.clientY-rect.top)/rect.height*2-1));raycaster.setFromCamera(mouse,camera);const object=raycaster.intersectObject(model,true).find(hit=>hit.object.visible&&descriptions[hit.object.userData.structureId||hit.object.name])?.object;if(object)select(object.userData.structureId||object.name);});
 new GLTFLoader().load('./models/heart.glb',g=>{
 model=g.scene;const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),scale=3.6/Math.max(size.x,size.y,size.z);model.scale.setScalar(scale);model.position.copy(center).multiplyScalar(-scale);model.traverse(object=>{if(object.isMesh&&object.material){object.material.side=THREE.DoubleSide;object.material.roughness=.65;}});scene.add(model);$('#loading').hidden=true;$('#front').disabled=false;resize();recenterModel();
 },undefined,()=>{$('#loading').textContent='Could not load the heart model. Reload to try again. The dissection and revision links remain available.';});
 function frame(){requestAnimationFrame(frame);controls.update();if(page===1)renderer.render(scene,camera);}frame();new ResizeObserver(resize).observe($('#canvas'));resize();
 }catch{$('#loading').textContent='The 3D view is unavailable. You can still open the dissection and revision simulator.';}
}
$$('.step[data-page]').forEach(button=>button.onclick=()=>setPage(+button.dataset.page));
$$('[data-go]').forEach(button=>button.onclick=()=>setPage(+button.dataset.go));
$$('.reveal').forEach(button=>button.onclick=()=>{const answer=document.getElementById(button.dataset.answer);answer.hidden=!answer.hidden;button.textContent=answer.hidden?'Reveal explanation ↓':'Hide explanation ↑';});
$('#bodyHeart').onclick=()=>setPage(1);$('#bodyHeart').onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setPage(1);}};
$('#resetAll').onclick=()=>{select(null);setPage(0);};$('#front').onclick=recenterModel;
$('#zoomIn').onclick=()=>{if(camera){camera.position.sub(controls.target).multiplyScalar(.8).add(controls.target);controls.update();}};
$('#zoomOut').onclick=()=>{if(camera){camera.position.sub(controls.target).multiplyScalar(1.25).add(controls.target);controls.update();}};
for(const [id,[name]] of Object.entries(descriptions)){const button=document.createElement('button');button.dataset.id=id;button.textContent=name;button.onclick=()=>select(id);$('#exploreChips').append(button);}setPage(0);
