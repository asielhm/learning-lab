const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=(process.env.LEARNING_LAB_BASE_URL||'http://127.0.0.1:8008').replace(/\/$/,'');
const configuredEndpoint=JSON.parse(fs.readFileSync('assets/records/config.json','utf8')).deploymentUrl;
const endpoint=configuredEndpoint||'https://script.google.com/macros/s/test-deployment/exec';
const manifest=JSON.parse(fs.readFileSync('assets/records/banks.json','utf8'));
const bank=JSON.parse(fs.readFileSync('assets/revision/questions/gas-laws.json','utf8'));
const waitFor=async check=>{for(let i=0;i<100;i++){if(await check())return;await new Promise(resolve=>setTimeout(resolve,50));}throw new Error('Condition did not become true');};
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try {
  const context=await browser.newContext();
  // Use the real configuration when connected, but intercept ALL Google writes.
  // This verifies the deployed URL without creating test pupils in a live sheet.
  if(!configuredEndpoint)await context.route('**/assets/records/config.json',route=>route.fulfill({json:{deploymentUrl:endpoint}}));
  await context.route(endpoint+'?*',route=>{const url=new URL(route.request().url());return route.fulfill({contentType:'text/html',body:`<script>window.top.postMessage(${JSON.stringify({type:'learning-lab-recording-capabilities',nonce:url.searchParams.get('nonce'),manifest})},${JSON.stringify(new URL(base).origin)})</script>`});});
  const posted=[];let acknowledge=false, rejectNext=false;
  await context.route(endpoint,async route=>{
   const form=new URLSearchParams(route.request().postData());const payload=JSON.parse(form.get('payload'));posted.push(payload);
   const receipt={type:'learning-lab-record-receipt',nonce:form.get('nonce'),eventId:payload.eventId,ok:!rejectNext};
   rejectNext=false;
   await route.fulfill({contentType:'text/html',body:acknowledge?`<script>window.top.postMessage(${JSON.stringify(receipt)},${JSON.stringify(new URL(base).origin)})</script>`:'Waiting for a simulated Google response'});
  });
  const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/activities/y9/science/gas-laws/revision.html');await page.locator('#start-session').waitFor();
  assert(await page.locator('#record-student-fields').isHidden());
  await page.locator('#start-session').click();await page.locator('input[name=answer]').first().check();await page.locator('#check-answer').click();
  assert.equal(posted.length,0,'Practice never sends results to Google');assert.match(await page.locator('[data-record-status]').innerText(),/Practice and retry rounds are not sent/);
  await page.locator('#new-session').click();await page.locator('input[name=mode][value=test]').check();assert(await page.locator('#record-student-fields').isVisible());
  await page.locator('#start-session').click();assert.equal(await page.locator('#revision-question-title').count(),0,'Name is required when recording is configured');
  await page.locator('[name=studentName]').fill('   ');await page.locator('#start-session').click();assert.equal(await page.locator('#revision-question-title').count(),0);
  await page.locator('[name=studentName]').fill('Test Student');
  await page.locator('#start-session').click();assert.equal(await page.locator('#revision-question-title').count(),0,'Class and teacher name are required');
  await page.locator('[name=classroom]').fill('   ');await page.locator('[name=teacherName]').fill('Ms Rivera');
  await page.locator('#start-session').click();assert.equal(await page.locator('#revision-question-title').count(),0,'Whitespace is not a class');
  await page.locator('[name=classroom]').fill('9T');await page.locator('[name=teacherName]').fill('   ');
  await page.locator('#start-session').click();assert.equal(await page.locator('#revision-question-title').count(),0,'Whitespace is not a teacher name');
  await page.locator('[name=teacherName]').fill('Ms Rivera');
  await page.locator('#start-session').click();await page.locator('input[name=answer]').first().check();await page.locator('#check-answer').click();
  await waitFor(()=>posted.length===1);assert.equal(posted[0].studentName,'Test Student');assert.equal(posted[0].classroom,'9T');assert.equal(posted[0].course,'Year 9 Science');assert.equal(posted[0].topic,'gas-laws');
  assert.equal(posted[0].teacherName,'Ms Rivera');assert.equal(posted[0].version,2);
  assert.equal(posted[0].questionNumber,1);assert.equal(posted[0].totalQuestions,10);assert.equal(posted[0].mode,'test');
  assert((await page.locator('[data-record-status]').innerText()).includes('waiting to save'));
  // Neither an untrusted page nor a forged Google receipt with the wrong nonce is an acknowledgement.
  await page.evaluate(id=>{
   window.dispatchEvent(new MessageEvent('message',{origin:'https://attacker.example',data:{type:'learning-lab-record-receipt',nonce:'fake',eventId:id,ok:true}}));
   window.dispatchEvent(new MessageEvent('message',{origin:'https://script.google.com',data:{type:'learning-lab-record-receipt',nonce:'fake',eventId:id,ok:true}}));
  },posted[0].eventId);
  assert.equal(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('learning-lab-pending-answers-v1')).length),1);
  // A reload resends the exact event, allowing the server to deduplicate a lost receipt.
  acknowledge=true;await page.reload();await page.locator('#start-session').waitFor();
  await waitFor(()=>posted.length===2);await waitFor(async()=>!(await page.locator('[data-record-status]').innerText()).includes('waiting to save'));
  assert.equal(posted[1].eventId,posted[0].eventId);assert.equal(await page.locator('[name=studentName]').inputValue(),'Test Student');
  assert.equal(await page.locator('[name=classroom]').inputValue(),'9T');assert.equal(await page.locator('[name=teacherName]').inputValue(),'Ms Rivera');
  // Explicit failed receipt keeps the answer pending and offers manual retry.
  rejectNext=true;await page.locator('input[name=mode][value=test]').check();await page.locator('#start-session').click();
  for(let i=0;i<10;i++){
   const prompt=await page.locator('#revision-question-title').innerText();const q=bank.questions.find(q=>q.prompt===prompt);const texts=await page.locator('.revision-option-text').allTextContents();
   const correct=texts.indexOf(q.options[q.answer]);await page.locator('input[name=answer]').nth(i===0?(correct+1)%4:correct).check();await page.locator('#check-answer').click();
   if(i===0){await page.locator('[data-record-retry]:not([hidden])').waitFor();assert.equal(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('learning-lab-pending-answers-v1')).length),1);await page.locator('[data-record-retry]').click();}
   await waitFor(async()=>JSON.parse(await page.evaluate(()=>sessionStorage.getItem('learning-lab-pending-answers-v1'))).length===0);
   assert.equal(await page.locator('#next-question').count(),0,'Tests advance immediately after saving');
   if(i<9){assert.equal(await page.locator('input[name=answer]:checked').count(),0);assert(await page.locator('#check-answer').isDisabled());}
  }
  assert.match(await page.locator('.revision-score').innerText(),/9 \/ 10 correct/);
  const completed=posted.filter(p=>p.sessionId!==posted[0].sessionId);assert.equal(new Set(completed.map(p=>p.eventId)).size,10);assert.equal(new Set(completed.map(p=>p.sessionId)).size,1);
  assert.deepEqual([...new Set(completed.map(p=>p.questionNumber))].sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9,10],'Auto-advance records each question under its original number');
  const beforeRetry=posted.length;
  await page.locator('#retry-wrong').click();await page.locator('input[name=answer]').first().check();await page.locator('#check-answer').click();
  assert.equal(posted.length,beforeRetry,'Retry rounds are not recorded');assert.equal(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('learning-lab-pending-answers-v1')).length),0);assert.match(await page.locator('[data-record-status]').innerText(),/Practice and retry rounds are not sent/);
  for(const [path,topic,course] of [['y7/maths/algebra','algebra','Year 7 Maths'],['y9/science/circulatory-system','circulatory-system','Year 9 Science'],['y9/science/breathing-system','breathing-system','Year 9 Science']]){
   await page.goto(`${base}/activities/${path}/revision.html`);await page.locator('#start-session').waitFor();
   await page.locator('input[name=mode][value=test]').check();
   for(const field of ['studentName','classroom','teacherName']){assert(await page.locator(`[name=${field}]`).isVisible());assert(await page.locator(`[name=${field}]`).evaluate(input=>input.required));}
   await page.locator('#start-session').click();await page.locator('input[name=answer]').first().check();await page.locator('#check-answer').click();
   await waitFor(()=>posted.some(p=>p.topic===topic));assert.equal(posted.find(p=>p.topic===topic).course,course);
  }
  // New courses enable identity and recording only after matching the deployed bank.
  const legacy=['algebra','circulatory-system','breathing-system','gas-laws'];
  const newBanks=manifest.banks.filter(b=>!legacy.includes(b.topic));
  const routeFor=topic=>topic==='blood-vessels'?'y9/science/blood-vessels':topic.startsWith('y10-physics-')?'y10/physics/'+topic.replace('y10-physics-',''):topic.startsWith('y10-')?'y10/chemistry/'+({'y10-acids-bases':'acids-and-bases','y10-organic':'organic-chemistry'}[topic]||topic.replace('y10-','')):'y7/maths/'+topic;
  for(const metadata of newBanks){
   await page.goto(`${base}/activities/${routeFor(metadata.topic)}/revision.html`);await page.locator('#start-session').waitFor();assert.equal(await page.locator('#revision-app').getAttribute('data-recording'),'auto');
   const before=posted.length;assert(await page.locator('#record-student-fields').isHidden());await page.locator('#start-session').click();await page.locator('input[name=answer]').first().check();await page.locator('#check-answer').click();assert.equal(posted.length,before,'New-course practice remains unrecorded');await page.locator('#new-session').click();await page.locator('input[name=mode][value=test]').check();
   for(const field of ['studentName','classroom','teacherName']){assert(await page.locator(`[name=${field}]`).isVisible());assert(await page.locator(`[name=${field}]`).evaluate(input=>input.required));}
   await page.locator('[name=studentName]').fill('New Course Student');await page.locator('[name=classroom]').fill(metadata.course==='Year 7 Maths'?'7N':metadata.course==='Year 10 Chemistry'?'10C':metadata.course==='Year 9 Science'?'9S':'10P');await page.locator('[name=teacherName]').fill('Ms Rivera');await page.locator('#start-session').click();await page.locator('input[name=answer]').first().check();await page.locator('#check-answer').click();await waitFor(()=>posted.some(p=>p.topic===metadata.topic));await waitFor(async()=>JSON.parse(await page.evaluate(()=>sessionStorage.getItem('learning-lab-pending-answers-v1'))).length===0);
   const sent=posted.find(p=>p.topic===metadata.topic);assert.equal(sent.course,metadata.course);assert.equal(sent.bankSignature,metadata.signature);assert.equal(sent.mode,'test');assert.equal(sent.retry,false);assert.equal(sent.teacherName,'Ms Rivera');assert.equal(await page.locator('#next-question').count(),0);
  }
  // A missing or stale server bank stays local and collects no pupil identity.
  for(const kind of ['missing','stale','stale-client']){
   const fallback=await browser.newContext();const target=manifest.banks.find(b=>b.topic==='y10-physics-kinematics');const old=JSON.parse(JSON.stringify(manifest));if(kind==='missing')old.banks=old.banks.filter(b=>b.topic!==target.topic);else if(kind==='stale')old.banks.find(b=>b.topic===target.topic).signature='0'.repeat(64);
   if(kind==='stale-client')await fallback.route('**/assets/revision/questions/y10-physics-kinematics.json',route=>{const changed=JSON.parse(fs.readFileSync('assets/revision/questions/y10-physics-kinematics.json','utf8'));changed.questions[0].prompt+=' Modified after publishing the manifest.';return route.fulfill({json:changed});});
   await fallback.route(endpoint+'?*',route=>{const url=new URL(route.request().url());return route.fulfill({contentType:'text/html',body:`<script>window.top.postMessage(${JSON.stringify({type:'learning-lab-recording-capabilities',nonce:url.searchParams.get('nonce'),manifest:old})},${JSON.stringify(new URL(base).origin)})</script>`});});let writes=0;await fallback.route(endpoint,route=>{writes++;return route.fulfill({body:'Unexpected write'});});const local=await fallback.newPage();await local.goto(base+'/activities/y10/physics/kinematics/revision.html');await local.locator('#start-session').waitFor();await local.locator('input[value=test]').check();assert.equal(await local.locator('#record-student-fields').count(),0);assert.match(await local.locator('.revision-bottom-note').innerText(),/shown on this page only/);await local.locator('#start-session').click();await local.locator('input[name=answer]').first().check();await local.locator('#check-answer').click();assert.equal(writes,0);await fallback.close();
  }
  await page.goto(base+'/');await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Teacher dashboard',exact:true}).click();
  assert.equal(new URL(page.url()).pathname,'/teacher/');await page.locator('#dashboard-link:not([hidden])').waitFor();assert.equal(await page.locator('#dashboard-link').getAttribute('href'),endpoint);
  await page.goto(base+'/teacher/setup.html');assert.equal(await page.locator('[data-copy]').count(),3);
  assert.deepEqual(errors,[]);
  const phone=await context.newPage();await phone.setViewportSize({width:390,height:844});await phone.goto(base+'/activities/y7/maths/algebra/revision.html');await phone.locator('#start-session').waitFor();
  await phone.locator('input[name=mode][value=test]').check();
  assert.equal(await phone.locator('[name=studentName]').inputValue(),'','A new tab does not inherit another student’s profile through localStorage');
  await phone.locator('#start-session').click();assert.equal(await phone.locator('#revision-question-title').count(),0,'A fresh student must enter a name before starting');
  assert(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await phone.screenshot({path:'/tmp/recording-student-mobile.png',fullPage:true});
  await phone.goto(base+'/teacher/setup.html');assert(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await phone.goto(base+'/');const access=phone.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Teacher dashboard',exact:true});assert(await access.isVisible());assert(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await phone.screenshot({path:'/tmp/teacher-dashboard-home-mobile.png',fullPage:true});await access.click();await phone.locator('#dashboard-link:not([hidden])').waitFor();
  // Unrecognised configuration cannot send pupil data to a different host.
  const unsafe=await browser.newContext();await unsafe.route('**/assets/records/config.json',route=>route.fulfill({json:{deploymentUrl:'https://attacker.example/collect'}}));
  const unconfigured=await unsafe.newPage();await unconfigured.goto(base+'/activities/y9/science/gas-laws/revision.html');await unconfigured.locator('#start-session').waitFor();assert.equal(await unconfigured.locator('[name=studentName]').count(),0);assert.match(await unconfigured.locator('[data-record-status]').innerText(),/not been connected/);
  await unsafe.route(endpoint+'?*',route=>route.fulfill({body:'No valid capability receipt'}));
  const forgedCapabilities=await unconfigured.evaluate(async({endpoint,manifest})=>{
   const {probeRecording}=await import('/assets/records/capabilities.js?v=all-courses-1');const pending=probeRecording(endpoint,{timeout:150});const frame=document.querySelector('iframe[title="Check quiz recording compatibility"]');const nonce=new URL(frame.src).searchParams.get('nonce');
   window.dispatchEvent(new MessageEvent('message',{origin:'https://attacker.example',data:{type:'learning-lab-recording-capabilities',nonce,manifest}}));
   window.dispatchEvent(new MessageEvent('message',{origin:'https://script.google.com',data:{type:'learning-lab-recording-capabilities',nonce:'wrong-nonce',manifest}}));
   return (await pending).manifest;
  },{endpoint,manifest});assert.equal(forgedCapabilities,null,'Untrusted origins and wrong nonces never enable recording');
  // Check the Google-hosted dashboard UI against a simulated google.script.run API.
  const dashboardContext=await browser.newContext({viewport:{width:390,height:844}});
  await dashboardContext.route('https://asielhm.github.io/learning-lab/assets/brand/learning-lab-logo.png*',route=>route.fulfill({contentType:'image/png',body:fs.readFileSync('assets/brand/learning-lab-logo.png')}));
  await dashboardContext.addInitScript(manifest=>{
   window.expireTeacher=false;
   const rows=Array.from({length:61},(_,i)=>['id-'+i,'2026-10-26T00:00:00.000Z',i===0?'<img src=x onerror=alert(1)>':'Test Student','9T','Year 9 Science','gas-laws','test',false,'2026-10-26T00:00:00.000Z',10,8,80,'Ms Rivera']);
   for(let i=0;i<7;i++)rows.push(['extra-'+i,'2026-10-26T00:00:00.000Z','Other Student',i<3?'7M':'9B',i<3?'Year 7 Maths':'Year 9 Science',i<3?'algebra':'breathing-system','test',false,'2026-10-26T00:00:00.000Z',10,7,70,'Ms Chen']);
   window.dashboardRequests=[];window.dashboardRows=rows;
   window.google={script:{get run(){let success=()=>{},failure=()=>{};return {
    withSuccessHandler(fn){success=fn;return this;},withFailureHandler(fn){failure=fn;return this;},
    loginTeacher(password){setTimeout(()=>password==='test-password'?success({token:'test-token'}):failure({message:'Sign-in failed. Check your teacher password.'}),0);},
    logoutTeacher(){success();},
    getTeacherResults(token,filters){setTimeout(()=>{
     if(token!=='test-token'||window.expireTeacher){failure({message:'Your sign-in has expired. Sign in again.'});return;}
     window.dashboardRequests.push(filters);
     const match=(choices,value)=>choices===null||choices===undefined||choices.some(choice=>choice.toLowerCase()===value.toLowerCase());
     const filtered=rows.filter(row=>(!filters.search||row[2].includes(filters.search))&&match(filters.teacher,row[12])&&match(filters.course,row[4])&&match(filters.topic,row[5])&&match(filters.classroom,row[3]));
     success({headers:['Session ID','Completed at','Student name','Class','Course','Topic','Mode','Retry','Started at','Questions','Correct','Score (%)','Teacher'],rows:filtered.slice(filters.offset,filters.offset+50),total:filtered.length,offset:filters.offset,pageSize:50,students:new Set(filtered.map(row=>row[2]+'|'+row[3])).size,accuracy:filtered.length?Math.round(filtered.reduce((sum,row)=>sum+row[10],0)/filtered.reduce((sum,row)=>sum+row[9],0)*100):null,courses:[...new Set(manifest.banks.map(b=>b.course))],classes:[...new Set(rows.map(row=>row[3]))],topics:manifest.banks.map(b=>({value:b.topic,label:b.title,course:b.course})),bankCount:22,questionCount:1450,topicSummary:[...new Set(filtered.map(row=>row[4]+'|'+row[5]))].map(key=>{const group=filtered.filter(row=>row[4]+'|'+row[5]===key),first=group[0],answers=group.reduce((sum,row)=>sum+row[9],0),correct=group.reduce((sum,row)=>sum+row[10],0);return {course:first[4],topic:first[5],tests:group.length,students:new Set(group.map(row=>row[2]+'|'+row[3])).size,answers,correct,accuracy:Math.round(correct/answers*100)};}),teachers:['Ms Chen','Ms Rivera'],spreadsheetUrl:'https://docs.google.com/spreadsheets/d/test/edit'});
    },0);}
   };}}};
  },manifest);
  const dashboard=await dashboardContext.newPage();await dashboard.goto(base+'/google-apps-script/Dashboard.html');
  await dashboard.locator('.brand-lockup img').evaluate(img=>img.decode());assert(await dashboard.locator('.brand-lockup img').evaluate(img=>img.naturalWidth>0));
  assert(await dashboard.locator('#dashboard').isHidden());assert.equal(await dashboard.locator('#rows tr').count(),0);
  await dashboard.locator('#password').fill('wrong');await dashboard.locator('#sign-in').click();await dashboard.locator('#status.error').waitFor();assert(await dashboard.locator('#dashboard').isHidden());
  await dashboard.locator('#password').fill('test-password');await dashboard.locator('#sign-in').click();await dashboard.locator('#rows tr').first().waitFor();
  assert.equal(await dashboard.locator('#rows tr').count(),50);assert.equal(await dashboard.locator('#rows img').count(),0,'Student text is never interpreted as HTML');
  assert((await dashboard.locator('#columns').innerText()).includes('Teacher'));assert((await dashboard.locator('#rows tr').first().innerText()).includes('Ms Rivera'));
  async function choose(key,noun,labels){
   await dashboard.locator(`#${key} summary`).click();
   await dashboard.getByRole('button',{name:`Clear ${noun}`,exact:true}).click();
   for(const label of labels)await dashboard.locator('#'+key).getByRole('checkbox',{name:key==='topic'?new RegExp('^'+label+' · '):label,exact:key!=='topic'}).check();
   await dashboard.getByRole('button',{name:`Done choosing ${noun}`,exact:true}).click();
  }
  assert.deepEqual(await dashboard.locator('#teacher input[type=checkbox]').evaluateAll(inputs=>inputs.map(input=>input.value)),['Ms Chen','Ms Rivera']);
  await choose('teacher','teachers',['Ms Chen']);await dashboard.locator('#apply').click();await waitFor(async()=>await dashboard.locator('#rows tr').count()===7);
  assert.equal(await dashboard.locator('#teacher-summary').innerText(),'Ms Chen');
  await choose('topic','topics',['Gas laws']);await dashboard.locator('#apply').click();await waitFor(async()=>await dashboard.locator('#rows tr').count()===0);
  assert.equal(await dashboard.locator('#teacher input').count(),2,'Empty matches retain every saved teacher choice');
  await choose('teacher','teachers',['Ms Chen','Ms Rivera']);
  await choose('course','courses',['Year 9 Science']);
  await choose('topic','topics',['Gas laws','Breathing system']);await dashboard.locator('#apply').click();await waitFor(async()=>await dashboard.locator('#record-count').innerText()==='65');
  assert.equal(await dashboard.locator('#topic-summary').innerText(),'2 selected');
  assert.deepEqual(await dashboard.evaluate(()=>window.dashboardRequests.at(-1).topic),['breathing-system','gas-laws']);
  await choose('teacher','teachers',[]);await dashboard.locator('#apply').click();await waitFor(async()=>await dashboard.locator('#rows tr').count()===0);
  assert.deepEqual(await dashboard.evaluate(()=>window.dashboardRequests.at(-1).teacher),[],'Clear sends an empty selection, not All');
  await choose('teacher','teachers',['Ms Rivera']);await dashboard.locator('#apply').click();await waitFor(async()=>await dashboard.locator('#rows tr').count()===50);
  assert.equal(await dashboard.locator('#course-summary').innerText(),'Year 9 Science');
  assert.equal(await dashboard.locator('#password').inputValue(),'');assert.match(await dashboard.locator('#page-label').innerText(),/1–50 of 61/);
  await dashboard.locator('#next').click();await waitFor(async()=>await dashboard.locator('#rows tr').count()===11);assert.match(await dashboard.locator('#page-label').innerText(),/51–61/);
  assert(await dashboard.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await dashboard.screenshot({path:'/tmp/teacher-dashboard-mobile.png',fullPage:true});
  await dashboard.evaluate(()=>window.dashboardRows.push(['physics','2026-10-28T10:00:00.000Z','Physics Pupil','10P','Year 10 Physics','y10-physics-kinematics','test',false,'2026-10-28T10:00:00.000Z',10,9,90,'Ms Rivera']));
  await dashboard.locator('#apply').click();await waitFor(async()=>await dashboard.locator('#classroom input[value="10P"]').count()===1);
  await choose('course','courses',['Year 10 Physics']);await choose('topic','topics',['Motion and projectiles']);await choose('classroom','classes',['10P']);await dashboard.locator('#apply').click();await waitFor(async()=>await dashboard.locator('#record-count').innerText()==='1');assert.match(await dashboard.locator('#rows').innerText(),/Physics Pupil/);assert.match(await dashboard.locator('#rows').innerText(),/Motion and projectiles/);assert(!String(await dashboard.locator('#rows').innerText()).includes('y10-physics-kinematics'));assert.match(await dashboard.locator('#topic-overview-rows').innerText(),/90%/);assert.match(await dashboard.locator('#bank-coverage').innerText(),/22 revision question banks/);
  await dashboard.setViewportSize({width:1440,height:900});await dashboard.screenshot({path:'/tmp/teacher-dashboard-all-courses.png',fullPage:true});
  await dashboard.locator('#sign-out').click();assert(await dashboard.locator('#dashboard').isHidden());assert.equal(await dashboard.locator('#rows tr').count(),0);assert.equal(await dashboard.locator('#teacher input').count(),0);assert.equal(await dashboard.locator('#teacher-summary').innerText(),'All teachers');
  await dashboard.locator('#password').fill('test-password');await dashboard.locator('#sign-in').click();await dashboard.locator('#rows tr').first().waitFor();
  await dashboard.evaluate(()=>window.expireTeacher=true);await dashboard.locator('#apply').click();await waitFor(()=>dashboard.locator('#dashboard').isHidden());assert.equal(await dashboard.locator('#rows tr').count(),0);
  console.log('Google records browser: required student identity, all 22 question banks, readiness/signature fallback, class/course/topic filters, topic overview, Google receipts, rejection of forged receipts, queued reload/retry, stable IDs, separate retry sessions, teacher link and mobile/shared-device flows passed.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
