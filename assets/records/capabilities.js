// This endpoint returns public bank metadata only, never a pupil record or teacher identity.
const manifestURL=new URL('./banks.json',import.meta.url);
export const localRecordingManifest=fetch(manifestURL,{cache:'no-store',signal:AbortSignal.timeout(5000)})
 .then(response=>{if(!response.ok)throw new Error();return response.json();})
 .then(value=>{if(value.protocol!==3||!Array.isArray(value.banks))throw new Error();return value;})
 .catch(()=>null);
const validDeployment=url=>/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url||'');
export function trustedGoogleOrigin(value){try{const origin=new URL(value);return origin.protocol==='https:'&&(origin.hostname==='script.google.com'||/(?:^|[-.])script\.googleusercontent\.com$/.test(origin.hostname));}catch{return false;}}
export function probeRecording(url,{timeout=8000}={}){
 if(!validDeployment(url))return Promise.resolve({manifest:null,reason:'not-configured'});
 return new Promise(resolve=>{
  const nonce=crypto.randomUUID(),frame=document.createElement('iframe');frame.hidden=true;frame.title='Check quiz recording compatibility';
  const source=new URL(url);source.searchParams.set('action','capabilities');source.searchParams.set('nonce',nonce);frame.src=source;
  const finish=result=>{clearTimeout(timer);window.removeEventListener('message',receive);frame.remove();resolve(result);};
  const receive=event=>{
   if(!trustedGoogleOrigin(event.origin)||event.data?.type!=='learning-lab-recording-capabilities'||event.data.nonce!==nonce)return;
   const manifest=event.data.manifest;
   if(manifest?.protocol!==3||!Array.isArray(manifest.banks)||manifest.banks.some(bank=>typeof bank.topic!=='string'||typeof bank.course!=='string'||!/^[a-f0-9]{64}$/.test(bank.signature||'')))return;
   finish({manifest,gameManifest:event.data.gameManifest||null,reason:''});
  };
  const timer=setTimeout(()=>finish({manifest:null,reason:'not-confirmed'}),timeout);
  window.addEventListener('message',receive);document.body.append(frame);
 });
}
export function compatibleBank(local,remote,topic,course){
 const expected=local?.banks.find(bank=>bank.topic===topic&&bank.course===course);
 const deployed=remote?.banks.find(bank=>bank.topic===topic&&bank.course===course);
 return !!expected&&!!deployed&&expected.signature===deployed.signature;
}
export async function questionBankSignature(bank,course){
 const questions=Object.fromEntries(bank.questions.map(question=>[question.id,Object.fromEntries(['prompt','category','difficulty','options','answer'].map(key=>[key,question[key]]))]));
 const sorted=value=>Array.isArray(value)?value.map(sorted):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,sorted(value[key])])):value;
 const bytes=new TextEncoder().encode(JSON.stringify(sorted({course,questions})));
 const hash=await crypto.subtle.digest('SHA-256',bytes);
 return [...new Uint8Array(hash)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
}
