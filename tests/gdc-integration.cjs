const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=(process.env.LEARNING_LAB_BASE_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
const site=base+'/learning-lab/',trainer=site+'activities/y12/maths/gdc-trainer/';
const manifest=JSON.parse(fs.readFileSync('activities/y12/maths/gdc-trainer/trainer-manifest.json','utf8'));
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],failed=[],posts=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url());});page.on('request',r=>{if(r.method()==='POST'&&/google/.test(r.url()))posts.push(r.url());});
  async function load(lesson,extra=''){await page.goto(trainer+`?lesson=${lesson.id}&topic=${lesson.topicIds[0]}&mode=guided&course=${encodeURIComponent(lesson.courses[0])}`+extra);await page.locator(`.gdc-app[data-gdc-lesson="${lesson.id}"][data-gdc-mode=guided]`).waitFor();await page.locator('.gdc-key.is-next').waitFor();}
  await page.goto(site+'#/years/y12/maths');await page.locator('.topic-apps .activity-card').first().waitFor();assert.equal(await page.locator('.topic-apps .activity-card').count(),6);
  for(const topic of manifest.topics){
   await page.goto(site+`activities/y12/maths/${topic.id}/`);await page.locator('.gdc-exercise a').first().waitFor();
   for(const course of manifest.courses){await page.locator('#gdc-course').selectOption(course);const expected=manifest.lessons.filter(l=>l.topicIds.includes(topic.id)&&l.courses.includes(course));assert.equal(await page.locator('.gdc-exercise').count(),expected.length);for(const href of await page.locator('.gdc-exercise>a').evaluateAll(nodes=>nodes.map(a=>a.href))){const u=new URL(href);assert.equal(u.searchParams.get('topic'),topic.id);assert.equal(u.searchParams.get('course'),course);assert.equal(u.pathname,'/learning-lab/activities/y12/maths/gdc-trainer/');}}
  }
  assert.equal(manifest.lessons.length,20);assert.equal(manifest.manual.length,42);
  let pressed=0;
  for(const lesson of manifest.lessons){
   await load(lesson);
   const first=await page.locator('.gdc-key.is-next').getAttribute('data-key-id'),wrong=first==='KEY_0'?'KEY_1':'KEY_0';
   await page.locator(`[data-key-id=${wrong}]`).click();assert.equal(await page.locator('.gdc-workspace').getAttribute('data-progress'),'0');assert.equal(await page.locator('.gdc-key.is-next').getAttribute('data-key-id'),first);assert.match(await page.locator('.gdc-feedback').innerText(),/next/);
   for(let guard=0;guard<200;guard++){
    if(await page.locator('.gdc-workspace').getAttribute('data-complete')==='true')break;
    assert.equal(await page.locator('.gdc-key.is-next').count(),1,lesson.id);
    const before=Number(await page.locator('.gdc-workspace').getAttribute('data-progress'));await page.locator('.gdc-key.is-next').click();await page.waitForFunction(n=>Number(document.querySelector('.gdc-workspace')?.dataset.progress)>n,before);pressed++;
   }
   assert.equal(await page.locator('.gdc-workspace').getAttribute('data-complete'),'true',lesson.id);assert.match(await page.locator('.gdc-feedback').innerText(),/complete/);assert.equal(await page.locator('.gdc-key.is-next').count(),0);
  }
  // Free mode uses the actual engine; icons and physical key shortcuts agree.
  await page.goto(trainer+'?topic=functions&mode=free');await page.locator('.gdc-app[data-gdc-mode=free]').waitFor();await page.locator('.gdc-screen-content .tile').nth(4).click();assert.match(await page.locator('.gdc-screen-content').innerText(),/Y1=/);
  await page.locator('[data-key-id=KEY_MENU]').click();await page.locator('.gdc-screen-content .tile').first().click();await page.locator('[data-key-id=KEY_2]').click();await page.keyboard.type('+3*4');await page.keyboard.press('Enter');assert.match(await page.locator('.gdc-screen-content').innerText(),/14/);assert.equal(await page.locator('.gdc-key.is-next').count(),0);assert(await page.locator('[data-key-id=KEY_FRACTION]').isDisabled());
  // Topic and course parameters survive navigation, reload and links back to Learning Lab.
  await load(manifest.lessons.find(l=>l.id==='find-roots'));await page.getByLabel('IB course',{exact:true}).selectOption('AA HL');await page.getByLabel('Maths topic',{exact:true}).selectOption('geometry-and-trigonometry');assert.match(page.url(),/geometry-and-trigonometry/);await page.reload();await page.locator('.gdc-app').waitFor();assert.equal(await page.getByLabel('IB course',{exact:true}).inputValue(),'AA HL');assert.equal(await page.getByLabel('Maths topic',{exact:true}).inputValue(),'geometry-and-trigonometry');await page.goBack();await page.waitForFunction(()=>document.querySelector('select[aria-label="Maths topic"]').value==='functions');
  const backLink=page.locator('.gdc-topbar nav a').first();assert.match(await backLink.getAttribute('href'),/activities\/y12\/maths\/functions/);await backLink.click();await page.locator('#guided-skills').waitFor();
  // All 42 manual routes refresh directly, with actual procedure status and local assets.
  for(const skill of manifest.manual){await page.goto(trainer+`skills/${skill.slug}/`);await page.locator('.manual-procedure-status').waitFor();assert.equal(await page.locator('.skills-sidebar section>a').count(),42);assert.match(await page.locator('.manual-procedure-status').innerText(),skill.verified?/reviewed/i:/awaiting verification/);assert.equal(await page.locator('.teach-action').count(),manifest.lessons.filter(l=>l.manualSlug===skill.slug).length);}
  // Computer-first layouts keep the whole physical keypad inside the screen.
  for(const size of[{width:1366,height:768},{width:1440,height:900},{width:1920,height:1080}]){await page.setViewportSize(size);await load(manifest.lessons.find(l=>l.id==='graph-function'));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const exe=await page.locator('[data-key-id=KEY_EXE]').boundingBox();assert(exe.y+exe.height<=size.height,`EXE below computer viewport ${JSON.stringify(size)} ${JSON.stringify(exe)}`);await page.screenshot({path:`/tmp/gdc-${size.width}.png`,fullPage:true});}
  assert(fs.existsSync('.nojekyll'));assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(posts,[]);console.log(`Y12 integration: six topic pages and four course filters, 20 guided exercises (${pressed} correct key presses), wrong-key gates, mathematical completion, keyboard/free calculator, URL/back/reload, 42 labelled manual pages, GitHub Pages assets and desktop keypad fitting passed. No Google submissions.`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
