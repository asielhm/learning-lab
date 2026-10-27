const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=(process.env.LEARNING_LAB_BASE_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
const coursePath='/activities/y10/chemistry/';
(async()=>{
 const {acids}=await import('../assets/y10-chemistry/acids.js'),{metals}=await import('../assets/y10-chemistry/metals.js'),{redox}=await import('../assets/y10-chemistry/redox.js'),{organic}=await import('../assets/y10-chemistry/organic.js');
 const units=[['acids-and-bases','y10-acids-bases',acids],['metals','y10-metals',metals],['redox','y10-redox',redox],['organic-chemistry','y10-organic',organic]];
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const p=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],posts=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(r.method()==='POST'&&/script\.google/.test(r.url()))posts.push(r.url());});
  await p.goto(base+'/#/years/y10');await p.locator('#app a[href="#/years/y10/chemistry"]').click();await p.locator('.topic-apps .activity-card').first().waitFor();assert.equal(await p.locator('.topic-apps .activity-card').count(),4);assert.equal(await p.locator('.topic-study-links a').count(),4);
  await p.screenshot({path:'/tmp/y10-chemistry-menu.png',fullPage:true});
  async function prepare(){while(!await p.locator('#advance-step').isDisabled())await p.locator('#advance-step').click();}
  for(const[url,bankName,defs]of units){
   await p.goto(base+coursePath+url+'/');await p.locator('#lab-sample,#lab-material,#lab-reaction,#lab-air').first().waitFor();
   assert.equal(await p.locator('[data-experiment]').count(),defs.length);assert.equal(await p.locator('.theory-grid details').count(),8);assert.equal(await p.locator('.unit-nav a').count(),4);
   for(const d of defs){
    await p.locator(`[data-experiment="${d.id}"]`).click();assert.equal(await p.locator('#lab-title').innerText(),d.title);assert(await p.locator('#record-reading').isDisabled());assert(await p.locator('#lesson-options button').first().isDisabled());
    assert.equal(await p.locator('#dose-controls').isVisible(),!!d.doses);
    await prepare();if(d.doses)for(let i=0;i<4;i++)await p.locator('[data-dose="5"]').click();
    assert(!await p.locator('#record-reading').isDisabled(),d.id);assert.equal(await p.locator('#step-progress [data-done=true]').count(),d.steps.length);
    const values=Object.fromEntries(d.controls.map(c=>[c.id,c.value])),m=d.model(values,d.steps.length,{delivered:20}),correct=m.question.options[m.question.answer];
    for(const[label,value]of m.readings){assert((await p.locator('#readouts').innerText()).includes(String(value)),d.id+' '+label);}
    await p.locator('#record-reading').click();assert(await p.locator('#record-reading').isDisabled());assert.match(await p.locator('#trial-count').innerText(),/^1 of 10/);assert(!await p.locator('#lesson-options button').first().isDisabled());
    const wrong=m.question.options[(m.question.answer+1)%4];await p.locator('#lesson-options').getByRole('button',{name:wrong,exact:true}).click();assert.equal(await p.locator('#question-feedback').getAttribute('data-state'),'incorrect');
    await p.locator('#lesson-options').getByRole('button',{name:correct,exact:true}).click();assert.equal(await p.locator('#question-feedback').getAttribute('data-state'),'correct');
    await p.locator('#new-trial').click();assert.match(await p.locator('#trial-count').innerText(),/^1 of 10/);assert(await p.locator('#lesson-options button').first().isDisabled());assert(!await p.locator('#advance-step').isDisabled());
    await p.locator('#reset-lab').click();assert.match(await p.locator('#trial-count').innerText(),/^0 of 10/);assert.match(await p.locator('#notebook-rows').innerText(),/Carry out a trial/);
   }
   await p.locator('[data-experiment]').first().click();await p.locator('#lab-title').scrollIntoViewIfNeeded();await p.locator('#workbench').screenshot({path:`/tmp/y10-${url}-desktop.png`});
   for(const width of[320,390,768]){await p.setViewportSize({width,height:844});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),url+' '+width);}
   await p.setViewportSize({width:1440,height:1000});
   await p.locator('.chem-review a').click();await p.locator('#start-session').waitFor();assert.equal(await p.locator('#revision-app').getAttribute('data-course'),'Year 10 Chemistry');assert.equal(await p.locator('#revision-app').getAttribute('data-topic'),bankName);assert.match(await p.locator('.revision-bank-meta').innerText(),/80 questions/);assert.match(await p.locator('.revision-bottom-note').innerText(),/shown on this page only/);
   assert.equal(await p.locator('input[name=category]:checked').count(),8);await p.locator('#revision-category summary').click();await p.getByRole('button',{name:'Clear question areas',exact:true}).click();assert(await p.locator('#start-session').isDisabled());await p.getByRole('button',{name:'Select all question areas',exact:true}).click();await p.getByRole('button',{name:'Done choosing question areas',exact:true}).click();
   const bank=JSON.parse(fs.readFileSync(`assets/revision/questions/${bankName}.json`,'utf8'));
   async function finish(test){const seen=new Set();for(let i=0;i<10;i++){const prompt=await p.locator('#revision-question-title').innerText(),q=bank.questions.find(q=>q.prompt===prompt);assert(q);assert(!seen.has(q.id));seen.add(q.id);const options=await p.locator('.revision-option-text').allTextContents(),correct=options.indexOf(q.options[q.answer]);assert(correct>=0);await p.locator('input[name=answer]').nth(!test&&i===0?(correct+1)%4:correct).check();await p.locator('#check-answer').click();if(test)assert.equal(await p.locator('#next-question').count(),0);else{assert((await p.locator('#revision-feedback').innerText()).includes(q.explanation));await p.locator('#next-question').click();}}assert.match(await p.locator('.revision-score').innerText(),test?/10 \/ 10 correct/:/9 \/ 10 correct/);}
   await p.locator('#start-session').click();await finish(false);await p.locator('#retry-wrong').click();assert.equal(await p.locator('input[name=answer]').count(),4);
   await p.goto(base+coursePath+url+'/revision.html');await p.locator('#start-session').waitFor();await p.locator('input[value=test]').check();assert.equal(await p.locator('#record-student-fields').count(),0);await p.locator('#start-session').click();await finish(true);
  }
  // Coarse/fine titration, direct apparatus interaction, endpoint gate and repeated titres.
  await p.goto(base+coursePath+'acids-and-bases/');await p.locator('[data-experiment=titration]').click();await prepare();for(let i=0;i<4;i++)await p.locator('[data-dose="5"]').click();await p.locator('#record-reading').click();
  await p.locator('#chem-scene').getByRole('button',{name:'Add 0.1 mL using the burette tap',exact:true}).click();assert.match(await p.locator('#readouts').innerText(),/20.1 mL/);assert.match(await p.locator('#bench-status').innerText(),/Overshot/);assert(await p.locator('#record-reading').isDisabled());
  await p.locator('#new-trial').click();await prepare();for(let i=0;i<3;i++)await p.locator('[data-dose="5"]').click();for(let i=0;i<4;i++)await p.locator('[data-dose="1"]').click();for(let i=0;i<10;i++)await p.locator('[data-dose="0.1"]').click();assert.match(await p.locator('#readouts').innerText(),/20.0 mL/);await p.locator('#record-reading').click();assert.match(await p.locator('#trial-count').innerText(),/^2 of 10/);assert.equal(await p.locator('#notebook-rows tr').count(),2);
  await p.locator('[data-experiment=indicators]').click();await p.locator('[data-experiment=titration]').click();assert.match(await p.locator('#trial-count').innerText(),/^2 of 10/);
  await p.locator('#lab-sample').selectOption('B');assert(!await p.locator('#advance-step').isDisabled());await prepare();for(let i=0;i<6;i++)await p.locator('[data-dose="5"]').click();assert(!await p.locator('#record-reading').isDisabled());
  await p.locator('#chem-scene').getByRole('button',{name:'Add 0.1 mL using the burette tap',exact:true}).focus();await p.keyboard.press('Enter');assert.match(await p.locator('#readouts').innerText(),/30.1 mL/);
  const phone=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});phone.on('pageerror',e=>errors.push(e.message));
  for(const[url,,defs]of units){await phone.goto(base+coursePath+url+'/');await phone.locator('#advance-step').waitFor();assert(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));while(!await phone.locator('#advance-step').isDisabled())await phone.locator('#advance-step').tap();await phone.locator('#record-reading').tap();assert.match(await phone.locator('#trial-count').innerText(),/^1 of 10/);assert.equal(await phone.locator('#lesson-options button:disabled').count(),0);await phone.locator('#workbench').screenshot({path:`/tmp/y10-${url}-mobile.png`});}
  await phone.goto(base+coursePath+'acids-and-bases/');await phone.locator('[data-experiment=titration]').tap();while(!await phone.locator('#advance-step').isDisabled())await phone.locator('#advance-step').tap();await phone.locator('#chem-scene').getByRole('button',{name:'Add 0.1 mL using the burette tap',exact:true}).tap();assert.match(await phone.locator('#readouts').innerText(),/0.1 mL/);
  assert.deepEqual(errors,[]);assert.deepEqual(posts,[]);
  console.log('Y10 Chemistry: four catalogue entries, 28 gated investigations, observations/notebooks/reset, all lesson questions, coarse/fine/touch/keyboard titration with endpoint and overshoot gates, 80 revision answers/scoring/retries, no Google submissions and 320–1440px layouts passed.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
