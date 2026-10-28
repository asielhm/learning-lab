const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=(process.env.LEARNING_LAB_BASE_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
const units=['numbers-i','geometry-i','numbers-ii','algebra-i','numbers-iii'];
const expected={
 'numbers-i':{factors:'12',decimals:'0.3',powers:'4',order:'18'},
 'geometry-i':{shapes:'3','single-area':'24',polygons:'72',angles:'120',constructions:'90',compound:'6'},
 'numbers-ii':{sets:'N',integers:'2','signed-powers':'-3',order:'15'},
 'algebra-i':{variables:'22',coordinates:'-3',direct:'18',inverse:'3'},
 'numbers-iii':{ratio:'2/5',maps:'4',conversions:'75','fraction-ops':'13/12',percentages:'20','rational-order':'2'}
};
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/chromium',args:['--no-sandbox']});try{
 const p=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],posts=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(r.method()==='POST'&&/script\.google/.test(r.url()))posts.push(r.url());});
 await p.context().route('https://script.google.com/macros/s/**/exec?*',route=>{const url=new URL(route.request().url());return route.fulfill({contentType:'text/html',body:`<script>window.top.postMessage(${JSON.stringify({type:'learning-lab-recording-capabilities',nonce:url.searchParams.get('nonce'),manifest:{protocol:3,banks:[]}})},${JSON.stringify(new URL(base).origin)})</script>`});});
 // Force a local-recording fallback: these lesson tests must never depend on or write to the live Google deployment.
 await p.goto(base+'/#/years/y7/maths');await p.locator('.topic-apps .activity-card').first().waitFor();assert.equal(await p.locator('.topic-apps .activity-card').count(),5);
 assert.deepEqual(await p.locator('.topic-apps .activity-card h2').allTextContents(),['Numbers I','Geometry I','Numbers II','Algebra I','Numbers III']);
 assert.equal(await p.locator('.topic-study-links a[href="activities/y7/maths/algebra/"]').count(),1);
 await p.screenshot({path:'/tmp/y7-maths-menu.png',fullPage:true});
 for(const unit of units){
  await p.goto(`${base}/activities/y7/maths/${unit}/`);await p.locator('.math-widget').first().waitFor();
  assert.equal(await p.locator('.math-widget').count(),Object.keys(expected[unit]).length);
  assert.equal(await p.locator('.unit-path a').count(),5);assert.equal(await p.locator('.unit-path [aria-current]').getAttribute('href'),`../${unit}/`);
  assert.equal(await p.locator('.unit-review').evaluate(el=>el.nextElementSibling),null);
  for(const[id,answer]of Object.entries(expected[unit])){
   const section=p.locator('#'+id);await section.locator('.answer-row input').fill('9999');await section.locator('.answer-row button').click();assert.equal(await section.locator('.practice-feedback').getAttribute('data-state'),'incorrect');
   await section.locator('.answer-row input').fill(answer);await section.locator('.answer-row button').click();assert.equal(await section.locator('.practice-feedback').getAttribute('data-state'),'correct',unit+'/'+id);
   const range=section.locator('input[type=range]').first();if(await range.count()){const before=await range.inputValue();await range.focus();await p.keyboard.press('ArrowRight');assert.notEqual(await range.inputValue(),before);}
   await section.locator('.reset-widget').click();assert.equal(await section.locator('.practice-feedback').innerText(),'');
  }
  await p.locator('#learning-level').selectOption('support');assert.equal(await p.locator('.support-note:visible').count(),Object.keys(expected[unit]).length);assert.equal(await p.locator('.worked-steps[open]').count(),Object.keys(expected[unit]).length);
  await p.locator('#learning-level').selectOption('challenge');assert.equal(await p.locator('.challenge-note:visible').count(),Object.keys(expected[unit]).length);
  if(unit==='numbers-i'){assert.match(await p.locator('#order .result-line').innerText(),/= 27/);await p.locator('#factors-a').fill('18');await p.locator('#factors-b').fill('24');assert.match(await p.locator('#factors .result-line').innerText(),/HCF = 6 · LCM = 72/);}
  if(unit==='geometry-i'){
   await p.locator('#constructions-stage').fill('4');assert.match(await p.locator('#constructions .result-line').innerText(),/Stage 4/);await p.locator('#constructions-kind').selectOption('angle');assert.match(await p.locator('#constructions .result-line').innerText(),/two equal 30°/);
   await p.locator('#compound .answer-row input').fill('272');await p.locator('#compound .answer-row button').click();assert.equal(await p.locator('#compound .practice-feedback').getAttribute('data-state'),'correct');
  }
  if(unit==='numbers-ii'){
   await p.locator('#integers-op').selectOption('divide');await p.locator('#integers-b').fill('0');assert(await p.locator('#integers .practice').isHidden());assert.match(await p.locator('#integers .result-line').innerText(),/undefined/);
   await p.locator('#signed-powers-kind').selectOption('outside');assert.match(await p.locator('#signed-powers .result-line').innerText(),/= -9/);
  }
  if(unit==='algebra-i'){
   const svg=p.locator('#coordinates svg');await svg.scrollIntoViewIfNeeded();const point=await svg.evaluate(svg=>{const p=new DOMPoint(232,266).matrixTransform(svg.getScreenCTM());return{x:p.x,y:p.y};});await p.mouse.click(point.x,point.y);assert.equal(await p.locator('#coordinates .result-line').innerText(),'P = (-2, -4)');
   await p.locator('#inverse-n').fill('8');assert.match(await p.locator('#inverse .result-line').innerText(),/time = 3 h/);
  }
  if(unit==='numbers-iii'){
   await p.locator('#ratio-groups').selectOption('3');assert(await p.locator('#ratio-c').isVisible());assert.match(await p.locator('#ratio .result-line').innerText(),/9 parts/);
   await p.locator('#fraction-ops-op').selectOption('divide');assert.match(await p.locator('#fraction-ops .result-line').innerText(),/= 9\/4/);
   await p.locator('#percentages .answer-row input').fill('54');await p.locator('#percentages .answer-row button').click();assert.equal(await p.locator('#percentages .practice-feedback').getAttribute('data-state'),'correct');
  }
  await p.locator('h1').scrollIntoViewIfNeeded();await p.screenshot({path:`/tmp/y7-${unit}-hero.png`});
  await p.locator('.math-widget').first().screenshot({path:`/tmp/y7-${unit}-activity.png`});
  for(const width of [320,390,768]){await p.setViewportSize({width,height:844});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),unit+' at '+width);}
  await p.setViewportSize({width:1440,height:1000});
  await p.locator('.unit-review a').click();await p.locator('#start-session').waitFor();
  const bank=JSON.parse(fs.readFileSync(`assets/revision/questions/${unit}.json`,'utf8'));
  assert.equal(await p.locator('#revision-app').getAttribute('data-topic'),unit);assert.match(await p.locator('.revision-heading').innerText(),/YEAR 7 MATHS/);assert.match(await p.locator('.revision-bank-meta').innerText(),/60 questions/);
  assert.equal(await p.locator('input[name=category]:checked').count(),6);assert.equal(await p.locator('input[name=difficulty]:checked').count(),3);
  await p.locator('#revision-category summary').click();await p.getByRole('button',{name:'Clear question areas',exact:true}).click();assert(await p.locator('#start-session').isDisabled());await p.getByRole('button',{name:'Select all question areas',exact:true}).click();await p.getByRole('button',{name:'Done choosing question areas',exact:true}).click();
  assert.match(await p.locator('.revision-bottom-note').innerText(),/shown on this page only/);
  async function finish(test=false){
   const seen=new Set();for(let i=0;i<10;i++){
    const prompt=await p.locator('#revision-question-title').innerText(),q=bank.questions.find(q=>q.prompt===prompt);assert(q);assert(!seen.has(q.id));seen.add(q.id);
    const labels=await p.locator('.revision-option-text').allTextContents(),correct=labels.indexOf(q.options[q.answer]);assert(correct>=0);
    await p.locator('input[name=answer]').nth(!test&&i===0?(correct+1)%4:correct).check();await p.locator('#check-answer').click();
    if(test)assert.equal(await p.locator('#next-question').count(),0);else{assert((await p.locator('#revision-feedback').innerText()).includes(q.explanation));await p.locator('#next-question').click();}
   }
   assert.match(await p.locator('.revision-score').innerText(),test?/10 \/ 10 correct/:/9 \/ 10 correct/);
  }
  await p.locator('#start-session').click();await finish();await p.locator('#retry-wrong').click();assert.equal(await p.locator('input[name=answer]').count(),4);
  await p.goto(`${base}/activities/y7/maths/${unit}/revision.html`);await p.locator('#start-session').waitFor();await p.locator('input[value=test]').check();assert.equal(await p.locator('#record-student-fields').count(),0);await p.locator('#start-session').click();await finish(true);
  assert.equal(await p.locator('#retry-wrong').count(),0);assert.match(await p.locator('.revision-bottom-note').innerText(),/shown on this page only/);
 }
 const phone=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});phone.on('pageerror',e=>errors.push(e.message));
 for(const unit of units){await phone.goto(`${base}/activities/y7/maths/${unit}/`);await phone.locator('.math-widget').first().waitFor();await phone.locator('#learning-level').selectOption('support');assert(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await phone.locator('.math-widget').first().screenshot({path:`/tmp/y7-${unit}-mobile.png`});await Promise.all([phone.waitForNavigation({waitUntil:'load'}),phone.locator('.unit-path a').first().tap()]);assert(phone.url().endsWith('/numbers-i/'));}
 await phone.goto(`${base}/activities/y7/maths/algebra-i/`);await phone.locator('#coordinates svg').scrollIntoViewIfNeeded();const point=await phone.locator('#coordinates svg').evaluate(svg=>{const p=new DOMPoint(208,218).matrixTransform(svg.getScreenCTM());return{x:p.x,y:p.y};});await phone.touchscreen.tap(point.x,point.y);assert.equal(await phone.locator('#coordinates .result-line').innerText(),'P = (-3, -2)');
 assert.deepEqual(errors,[]);assert.deepEqual(posts,[],'Local fallback must never send unrecognised questions to Google.');
 console.log('Y7 units: five catalogue pages, 24 interactive activities, support/challenge routes, exact answers and resets, construction stages, coordinate mouse/touch, 100 revision answers with scoring/retry/auto-advance, no Google submissions and 320–1440px layouts passed.');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
