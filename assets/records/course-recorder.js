import {recorder,recordingConfig} from './records.js?v=all-courses-1';
import {localRecordingManifest,probeRecording,compatibleBank,questionBankSignature} from './capabilities.js?v=all-courses-1';
const localOnly=()=>({
 ready:Promise.resolve(),fields:()=>'',identity:()=>null,identify:()=>true,syncMode:()=>{},record:()=>{},refresh:()=>{},
 markup:()=>'<p class="revision-bottom-note">Your score and answer review are shown on this page only. Teacher recording for this unit is waiting for the Google dashboard update or could not be confirmed. Reload after your teacher updates it.</p>'
});
export function recorderFor(root){
 if(root?.dataset.recording==='paused')return localOnly();
 // The original four quizzes keep their existing connection while the owner upgrades Google.
 if(root?.dataset.recording!=='auto')return recorder;
 let delegate=localOnly(),signature='';
 const ready=Promise.all([recordingConfig,localRecordingManifest]).then(async([config,local])=>{
  if(!config.url||!local)return;
  const remote=await probeRecording(config.url),topic=root.dataset.topic,course=root.dataset.course;
  if(!compatibleBank(local,remote.manifest,topic,course))return;
  signature=local.banks.find(bank=>bank.topic===topic).signature;
 });
 return {ready,async verifyBank(bank){if(signature&&bank.topicId===root.dataset.topic&&await questionBankSignature(bank,root.dataset.course)===signature)delegate=recorder;else delegate=localOnly();},get enabled(){return delegate===recorder&&recorder.enabled;},fields:()=>delegate.fields(),identity:()=>delegate.identity(),identify:form=>delegate.identify(form),syncMode:(...args)=>delegate.syncMode(...args),markup:()=>delegate.markup(),refresh:(...args)=>delegate.refresh(...args),record:(...args)=>{if(delegate===recorder)recorder.record(...args,signature);}};
}
