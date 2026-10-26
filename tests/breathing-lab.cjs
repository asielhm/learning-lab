const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox'],env:{...process.env,...(process.env.BROWSER_HOME?{HOME:process.env.BROWSER_HOME}:{})}});try{
const base=(process.env.LEARNING_LAB_BASE_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
const page=await browser.newPage({viewport});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(base+'/activities/y9/science/breathing-system/');await page.waitForFunction(()=>document.querySelector('#modelLoading').hidden,null,{timeout:45000});assert.equal(await page.locator('#canvas canvas').count(),1,'3D schematic actually renders');
for(const button of await page.locator('#anatomyChips button').all())await button.click();assert.match(await page.locator('#structureProgress').innerText(),/6 of 6/);
await page.locator('#anatomyAnswers button').nth(0).click();assert.match(await page.locator('#anatomyFeedback').innerText(),/Try again/);await page.locator('#anatomyAnswers button').nth(1).click();assert.match(await page.locator('#anatomyFeedback').innerText(),/Correct/);
await page.locator('[data-section="1"]').click();await page.locator('#inhale').click();assert.equal(await page.locator('#expansionReadout').innerText(),'60%');assert.equal(await page.locator('#pressureReadout').innerText(),'Equal to outside');
await page.locator('#breathDepth').fill('100');assert.equal(await page.locator('#expansionReadout').innerText(),'100%');await page.locator('#exhale').click();assert.equal(await page.locator('#expansionReadout').innerText(),'0%');
await page.locator('#breathingRate').fill('24');assert.equal(await page.locator('#rateOutput').innerText(),'24 breaths/min');await page.locator('#playBreath').click();await page.waitForFunction(()=>parseInt(document.querySelector('#expansionReadout').textContent)>10);await page.locator('#playBreath').click();const paused=await page.locator('#expansionReadout').innerText();await page.waitForTimeout(150);assert.equal(await page.locator('#expansionReadout').innerText(),paused);
await page.locator('#recenter').click();await page.locator('[data-section="2"]').click();
for(let i=0;i<4;i++){
assert.match(await page.locator('#investigationIndex').innerText(),new RegExp(`STEP ${i+1} OF 4`));assert(await page.locator('#nextInvestigation').isDisabled());assert(await page.locator('#exchangeAnswers button').first().isDisabled());
await page.locator(i===1?'#traceCarbon':'#traceOxygen').click();await page.locator('#exchangeAnswers button').nth([0,1,0,2][i]).click();assert(!await page.locator('#nextInvestigation').isDisabled());await page.locator('#nextInvestigation').click();}
assert(await page.locator('#exchangeComplete').isVisible());assert.equal(await page.locator('.study-link').getAttribute('href'),'revision.html');await page.locator('#restart').click();assert.equal(await page.locator('#structureProgress').innerText(),'0 of 6 structures explored');assert(await page.locator('#anatomyPanel').isVisible());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);console.log(`Breathing Lab ${viewport.width}px: WebGL, anatomy, ventilation controls, pressure endpoints, pause, gas-exchange gates, completion and reset passed.`);await page.close();}
}finally{await browser.close()}})().catch(error=>{console.error(error);process.exitCode=1});
