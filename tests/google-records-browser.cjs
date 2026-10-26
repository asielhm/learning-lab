const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=(process.env.LEARNING_LAB_BASE_URL||'http://127.0.0.1:8008').replace(/\/$/,'');
const configuredEndpoint=JSON.parse(fs.readFileSync('assets/records/config.json','utf8')).deploymentUrl;
const endpoint=configuredEndpoint||'https://script.google.com/macros/s/test-deployment/exec';
const bank=JSON.parse(fs.readFileSync('assets/revision/questions/gas-laws.json','utf8'));
const waitFor=async check=>{for(let i=0;i<100;i++){if(await check())return;await new Promise(resolve=>setTimeout(resolve,50));}throw new Error('Condition did not become true');};
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try {
  const context=await browser.newContext();
  // Use the real configuration when connected, but intercept ALL Google writes.
  // This verifies the deployed URL without creating test pupils in a live sheet.
  if(!configuredEndpoint)await context.route('**/assets/records/config.json',route=>route.fulfill({json:{deploymentUrl:endpoint}}));
  const posted=[];let acknowledge=false, rejectNext=false;
  await context.route(endpoint,async route=>{
   const form=new URLSearchParams(route.request().postData());const payload=JSON.parse(form.get('payload'));posted.push(payload);
   const receipt={type:'learning-lab-record-receipt',nonce:form.get('nonce'),eventId:payload.eventId,ok:!rejectNext};
   rejectNext=false;
   await route.fulfill({contentType:'text/html',body:acknowledge?`<script>window.top.postMessage(${JSON.stringify(receipt)},${JSON.stringify(new URL(base).origin)})</script>`:'Waiting for a simulated Google response'});
  });
  const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/activities/y9/science/gas-laws/revision.html');await page.locator('#start-session').waitFor();
  await page.locator('#start-session').click();assert.equal(await page.locator('#revision-question-title').count(),0,'Name is required when recording is configured');
  await page.locator('[name=studentName]').fill('   ');await page.locator('#start-session').click();assert.equal(await page.locator('#revision-question-title').count(),0);
  await page.locator('[name=studentName]').fill('Test Student');await page.locator('[name=classroom]').fill('9T');
  await page.locator('#start-session').click();await page.locator('input[name=answer]').first().check();await page.locator('#check-answer').click();
  await waitFor(()=>posted.length===1);assert.equal(posted[0].studentName,'Test Student');assert.equal(posted[0].classroom,'9T');assert.equal(posted[0].course,'Year 9 Science');assert.equal(posted[0].topic,'gas-laws');
  assert.equal(posted[0].questionNumber,1);assert.equal(posted[0].totalQuestions,10);assert.equal(posted[0].mode,'practice');
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
  // Explicit failed receipt keeps the answer pending and offers manual retry.
  rejectNext=true;await page.locator('input[name=mode][value=test]').check();await page.locator('#start-session').click();
  for(let i=0;i<10;i++){
   const prompt=await page.locator('#revision-question-title').innerText();const q=bank.questions.find(q=>q.prompt===prompt);const texts=await page.locator('.revision-option-text').allTextContents();
   const correct=texts.indexOf(q.options[q.answer]);await page.locator('input[name=answer]').nth(i===0?(correct+1)%4:correct).check();await page.locator('#check-answer').click();
   if(i===0){await page.locator('[data-record-retry]:not([hidden])').waitFor();assert.equal(await page.evaluate(()=>JSON.parse(sessionStorage.getItem('learning-lab-pending-answers-v1')).length),1);await page.locator('[data-record-retry]').click();}
   await waitFor(async()=>JSON.parse(await page.evaluate(()=>sessionStorage.getItem('learning-lab-pending-answers-v1'))).length===0);
   await page.locator('#next-question').click();
  }
  assert.match(await page.locator('.revision-score').innerText(),/9 \/ 10 correct/);
  const completed=posted.filter(p=>p.mode==='test');assert.equal(new Set(completed.map(p=>p.eventId)).size,10);assert.equal(new Set(completed.map(p=>p.sessionId)).size,1);
  await page.locator('#retry-wrong').click();await page.locator('input[name=answer]').first().check();await page.locator('#check-answer').click();
  await waitFor(()=>posted.some(p=>p.retry));const retry=posted.find(p=>p.retry);assert.equal(retry.totalQuestions,1);assert.equal(retry.mode,'practice');assert.notEqual(retry.sessionId,completed[0].sessionId);
  for(const [path,topic,course] of [['y7/maths/algebra','algebra','Year 7 Maths'],['y9/science/circulatory-system','circulatory-system','Year 9 Science'],['y9/science/breathing-system','breathing-system','Year 9 Science']]){
   await page.goto(`${base}/activities/${path}/revision.html`);await page.locator('#start-session').waitFor();await page.locator('#start-session').click();await page.locator('input[name=answer]').first().check();await page.locator('#check-answer').click();
   await waitFor(()=>posted.some(p=>p.topic===topic));assert.equal(posted.find(p=>p.topic===topic).course,course);
  }
  await page.goto(base+'/teacher/');await page.locator('#dashboard-link:not([hidden])').waitFor();assert.equal(await page.locator('#dashboard-link').getAttribute('href'),endpoint);
  await page.goto(base+'/teacher/setup.html');assert.equal(await page.locator('[data-copy]').count(),3);
  assert.deepEqual(errors,[]);
  const phone=await context.newPage();await phone.setViewportSize({width:390,height:844});await phone.goto(base+'/activities/y7/maths/algebra/revision.html');await phone.locator('#start-session').waitFor();
  assert.equal(await phone.locator('[name=studentName]').inputValue(),'','A new tab does not inherit another student’s profile through localStorage');
  assert(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await phone.screenshot({path:'/tmp/recording-student-mobile.png',fullPage:true});
  await phone.goto(base+'/teacher/setup.html');assert(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  // Unrecognised configuration cannot send pupil data to a different host.
  const unsafe=await browser.newContext();await unsafe.route('**/assets/records/config.json',route=>route.fulfill({json:{deploymentUrl:'https://attacker.example/collect'}}));
  const unconfigured=await unsafe.newPage();await unconfigured.goto(base+'/activities/y9/science/gas-laws/revision.html');await unconfigured.locator('#start-session').waitFor();assert.equal(await unconfigured.locator('[name=studentName]').count(),0);assert.match(await unconfigured.locator('[data-record-status]').innerText(),/not been connected/);
  // Check the Google-hosted dashboard UI against a simulated google.script.run API.
  const dashboardContext=await browser.newContext({viewport:{width:390,height:844}});
  await dashboardContext.addInitScript(()=>{
   window.expireTeacher=false;
   const rows=Array.from({length:61},(_,i)=>['id-'+i,'2026-10-26T00:00:00.000Z',i===0?'<img src=x onerror=alert(1)>':'Test Student','9T','Year 9 Science','gas-laws','practice',false,'2026-10-26T00:00:00.000Z',10,8,80]);
   window.google={script:{get run(){let success=()=>{},failure=()=>{};return {
    withSuccessHandler(fn){success=fn;return this;},withFailureHandler(fn){failure=fn;return this;},
    loginTeacher(password){setTimeout(()=>password==='test-password'?success({token:'test-token'}):failure({message:'Sign-in failed. Check your teacher password.'}),0);},
    logoutTeacher(){success();},
    getTeacherResults(token,filters){setTimeout(()=>{
     if(token!=='test-token'||window.expireTeacher){failure({message:'Your sign-in has expired. Sign in again.'});return;}
     const filtered=rows.filter(row=>!filters.search||row[2].includes(filters.search));
     success({headers:['Session ID','Completed at','Student name','Class','Course','Topic','Mode','Retry','Started at','Questions','Correct','Score (%)'],rows:filtered.slice(filters.offset,filters.offset+50),total:filtered.length,offset:filters.offset,pageSize:50,students:2,accuracy:80,spreadsheetUrl:'https://docs.google.com/spreadsheets/d/test/edit'});
    },0);}
   };}}};
  });
  const dashboard=await dashboardContext.newPage();await dashboard.goto(base+'/google-apps-script/Dashboard.html');
  assert(await dashboard.locator('#dashboard').isHidden());assert.equal(await dashboard.locator('#rows tr').count(),0);
  await dashboard.locator('#password').fill('wrong');await dashboard.locator('#sign-in').click();await dashboard.locator('#status.error').waitFor();assert(await dashboard.locator('#dashboard').isHidden());
  await dashboard.locator('#password').fill('test-password');await dashboard.locator('#sign-in').click();await dashboard.locator('#rows tr').first().waitFor();
  assert.equal(await dashboard.locator('#rows tr').count(),50);assert.equal(await dashboard.locator('#rows img').count(),0,'Student text is never interpreted as HTML');
  assert.equal(await dashboard.locator('#password').inputValue(),'');assert.match(await dashboard.locator('#page-label').innerText(),/1–50 of 61/);
  await dashboard.locator('#next').click();await waitFor(async()=>await dashboard.locator('#rows tr').count()===11);assert.match(await dashboard.locator('#page-label').innerText(),/51–61/);
  assert(await dashboard.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await dashboard.screenshot({path:'/tmp/teacher-dashboard-mobile.png',fullPage:true});
  await dashboard.locator('#sign-out').click();assert(await dashboard.locator('#dashboard').isHidden());assert.equal(await dashboard.locator('#rows tr').count(),0);
  await dashboard.locator('#password').fill('test-password');await dashboard.locator('#sign-in').click();await dashboard.locator('#rows tr').first().waitFor();
  await dashboard.evaluate(()=>window.expireTeacher=true);await dashboard.locator('#apply').click();await waitFor(()=>dashboard.locator('#dashboard').isHidden());assert.equal(await dashboard.locator('#rows tr').count(),0);
  console.log('Google records browser: required student identity, all four simulators, Google receipts, rejection of forged receipts, queued reload/retry, stable IDs, separate retry sessions, teacher link and mobile/shared-device flows passed.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
