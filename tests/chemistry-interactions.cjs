const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=(process.env.LEARNING_LAB_BASE_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
const acid='/activities/y10/chemistry/acids-and-bases/',redox='/activities/y10/chemistry/redox/';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/chromium',args:['--no-sandbox']});
 const errors=[];
 try{
  const p=await browser.newPage({viewport:{width:1440,height:1000}});p.on('pageerror',e=>errors.push(e.message));
  const step=page=>page.locator('#bench-step-label').innerText();
  async function changed(page,before){try{await page.waitForFunction(value=>document.querySelector('#bench-step-label').textContent!==value,before,{timeout:7000});}catch(error){console.error('Stuck action:',before,await page.locator('#bench-status').innerText());await page.screenshot({path:'/tmp/chemistry-interaction-failure.png'});throw error;}}
  async function place(page){const before=await step(page);await page.locator('[data-bench-source]').click();await page.locator('[data-bench-target]').click();await changed(page,before);}
  async function tap(page){const before=await step(page);await page.locator('[data-bench-tap]').click();await changed(page,before);}
  async function coords(page,x,y){return page.locator('#chem-scene svg').evaluate((svg,[x,y])=>{const point=svg.createSVGPoint();point.x=x;point.y=y;const screen=point.matrixTransform(svg.getScreenCTM());return {x:screen.x,y:screen.y};},[x,y]);}
  async function dragMouse(page,from,to){await page.locator('#chem-scene').scrollIntoViewIfNeeded();const a=await coords(page,...from),b=await coords(page,...to);await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:14});await page.mouse.up();}
  await p.goto(base+acid);await p.locator('[data-bench-source]').waitFor();
  assert.equal(await p.locator('.bench-controls,#advance-step').count(),0);
  assert.equal(await p.locator('#record-reading').evaluate(e=>!!e.closest('.scene-panel')),true);
  assert.equal(await p.locator('#setup-controls').evaluate(e=>!!e.closest('.scene-panel')),true);
  assert(await p.locator('#record-reading').isDisabled());
  let before=await step(p);await dragMouse(p,[100,200],[155,210]);assert.equal(await step(p),before);assert.match(await p.locator('#bench-status').innerText(),/Not quite there/);
  await dragMouse(p,[100,200],[340,155]);await p.locator('.pour-stream').waitFor();assert(await p.locator('#record-reading').isDisabled());await changed(p,before);
  before=await step(p);await dragMouse(p,[100,200],[340,95]);await changed(p,before);assert.equal(await p.locator('.falling-drop').count(),0);
  before=await step(p);await p.locator('[data-bench-tap]').click();await p.locator('.falling-drop').first().waitFor();
  const transforms=await p.locator('.falling-drop').evaluateAll(e=>e.map(n=>getComputedStyle(n).animationName));assert(transforms.every(a=>a==='drop-fall'));
  assert.equal(await step(p),before);await changed(p,before);assert.equal(await p.locator('.falling-drop').count(),0);
  before=await step(p);await dragMouse(p,[340,250],[390,250]);await changed(p,before);assert(!await p.locator('#record-reading').isDisabled());
  await p.locator('#workbench').screenshot({path:'/tmp/chemistry-indicator-hands-on.png'});
  await p.locator('#record-reading').click();assert.equal(await p.locator('#notebook-rows tr').count(),1);
  await p.locator('#new-trial').click();assert.match(await step(p),/^STEP 1/);assert.equal(await p.locator('#notebook-rows tr').count(),1);
  // Accessible select-and-place keeps focus on the destination, then on the next instrument.
  await p.emulateMedia({reducedMotion:'reduce'});await p.locator('[data-bench-source]').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('[data-bench-target]').evaluate(e=>e===document.activeElement),true);before=await step(p);await p.keyboard.press('Enter');await changed(p,before);assert.equal(await p.locator('[data-bench-source]').evaluate(e=>e===document.activeElement),true);
  // Help points out the physical equipment; demonstration uses the same animation and one step only.
  before=await step(p);await p.locator('#bench-help').click();assert(await p.locator('#bench-hint').isVisible());assert.match(await p.locator('#chem-scene').getAttribute('class'),/show-hints/);assert.equal(await step(p),before);await p.locator('#demonstrate-step').click();await changed(p,before);assert.match(await step(p),/^STEP 3 OF 4/);
  await p.locator('#expand-bench').click();assert.equal(await p.locator('#expand-bench').getAttribute('aria-expanded'),'true');assert(await p.locator('#record-reading').isVisible());await p.keyboard.press('Escape');assert.equal(await p.locator('#expand-bench').getAttribute('aria-expanded'),'false');
  // A cancelled operation must not advance a different experiment or reset trial.
  await p.emulateMedia({reducedMotion:'no-preference'});await p.locator('[data-bench-tap]').click();await p.locator('#reset-lab').click();await p.waitForTimeout(1200);assert.match(await step(p),/^STEP 1 OF 4/);
  // Electrical power cannot be applied until the sample and both electrodes are placed.
  await p.goto(base+redox);await p.locator('[data-experiment=water-cell]').click();
  await p.locator('[data-bench-locked]').click();assert.match(await p.locator('#bench-status').innerText(),/both electrodes/);assert.equal(await p.locator('.reaction-bubbles').count(),0);
  await place(p);await place(p);assert.equal(await p.locator('.reaction-bubbles').count(),0);await place(p);await place(p);assert.equal(await p.locator('.reaction-bubbles').count(),0);
  await tap(p);assert.equal(await p.locator('.reaction-bubbles').count(),2);
  const bubble=p.locator('.reaction-bubbles circle').first();const transform1=await bubble.evaluate(e=>getComputedStyle(e).transform);await p.waitForTimeout(180);assert.notEqual(await bubble.evaluate(e=>getComputedStyle(e).transform),transform1);
  const bubblePositions=await p.locator('.reaction-bubbles circle').evaluateAll(nodes=>nodes.map(node=>{const bounds=node.getBoundingClientRect(),point=node.ownerSVGElement.createSVGPoint();point.x=bounds.x+bounds.width/2;point.y=bounds.y+bounds.height/2;const p=point.matrixTransform(node.ownerSVGElement.getScreenCTM().inverse());return{x:p.x,y:p.y};}));assert(bubblePositions.every(p=>p.x>260&&p.x<425&&p.y>175&&p.y<335));
  before=await step(p);await p.locator('[data-bench-tap]').click();await p.waitForTimeout(600);assert.match(await p.locator('#bench-status').innerText(),/Time accelerated/);const y1=await p.locator('[data-gas-volume]').first().getAttribute('y');await p.waitForTimeout(650);assert(Number(await p.locator('[data-gas-volume]').first().getAttribute('y'))>Number(y1));await changed(p,before);
  await p.locator('#workbench').screenshot({path:'/tmp/chemistry-electrolysis-hands-on.png'});
  const collected=await p.locator('[data-gas-volume]').first().getAttribute('y');await tap(p);assert.equal(await p.locator('.reaction-bubbles').count(),0);assert.equal(await p.locator('[data-gas-volume]').first().getAttribute('y'),collected);await tap(p);assert(!await p.locator('#record-reading').isDisabled());assert.match(await p.locator('#readouts').innerText(),/2 : 1/);
  // A real touch drag, followed by tap-select placement and a tap on the bulb.
  const phone=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});phone.on('pageerror',e=>errors.push(e.message));await phone.goto(base+acid);await phone.locator('[data-bench-source]').waitFor();await phone.locator('#chem-scene').scrollIntoViewIfNeeded();
  const client=await phone.context().newCDPSession(phone),from=await coords(phone,100,200),to=await coords(phone,340,155);before=await step(phone);
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:from.x,y:from.y}]});
  for(let i=1;i<=12;i++)await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from.x+(to.x-from.x)*i/12,y:from.y+(to.y-from.y)*i/12}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await changed(phone,before);
  before=await step(phone);await phone.locator('[data-bench-source]').tap();await phone.locator('[data-bench-target]').tap();await changed(phone,before);before=await step(phone);await phone.locator('[data-bench-tap]').tap();await changed(phone,before);before=await step(phone);await phone.locator('[data-bench-source]').tap();await changed(phone,before);assert(!await phone.locator('#record-reading').isDisabled());
  await phone.locator('#workbench').screenshot({path:'/tmp/chemistry-bench-phone.png'});
  for(const width of[320,390,768,1440]){await p.setViewportSize({width,height:900});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.locator('#expand-bench').click();assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.keyboard.press('Escape');}
  assert.deepEqual(errors,[]);console.log('Direct apparatus: mouse/touch dragging, rejected wrong destinations, keyboard placement/focus, drop timing, animated bubbles and gas collection, DC ordering and off switch, same-bench controls, help/demonstration, reset cancellation and responsive large-bench layouts passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
