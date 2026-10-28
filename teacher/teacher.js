import {recordingConfig} from '../assets/records/records.js?v=all-courses-1';
import {localRecordingManifest,probeRecording,compatibleBank} from '../assets/records/capabilities.js?v=all-courses-1';
const status=document.querySelector('#connection-status'),table=document.querySelector('#coverage-rows'),button=document.querySelector('#check-recording');
const [config,local]=await Promise.all([recordingConfig,localRecordingManifest]);
if(config.url){const link=document.querySelector('#dashboard-link');link.href=config.url;link.hidden=false;}
const cell=value=>{const td=document.createElement('td');td.textContent=value;return td;};
function coverage(remote){
 table.replaceChildren();
 for(const bank of local?.banks||[]){const tr=document.createElement('tr'),ready=compatibleBank(local,remote,bank.topic,bank.course),state=cell(ready?'Ready for Test yourself':'Update not confirmed');state.className=ready?'coverage-ready':'coverage-pending';tr.append(cell(bank.course),cell(bank.title),cell(bank.questionCount),state);table.append(tr);}
 document.querySelector('#coverage-count').textContent=local?`${local.banks.length} revision question banks · ${local.questionCount} questions · ${new Set(local.banks.map(bank=>bank.course)).size} courses`:'Question-bank coverage could not be loaded.';
}
coverage(null);
async function check(){
 button.disabled=true;status.textContent='Checking the deployed Google question banks…';
 if(!config.url){status.textContent='Google recording is not configured. Use the setup guide to connect your spreadsheet.';return;}
 const result=await probeRecording(config.url);coverage(result.manifest);
 const ready=local?.banks.filter(bank=>compatibleBank(local,result.manifest,bank.topic,bank.course)).length||0;
 status.textContent=local&&ready===local.banks.length?`All ${ready} question banks match the Google deployment. Open the private dashboard with your existing teacher password.`:'The new dashboard update could not be confirmed. Install all three updated Google files using the guide below. Existing connected quizzes keep their current recording; new courses show local results until their banks are confirmed.';
 button.disabled=false;
}
button.onclick=check;
check();
