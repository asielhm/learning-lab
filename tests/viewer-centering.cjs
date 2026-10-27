const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const base=(process.env.LEARNING_LAB_BASE_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox'],env:{...process.env,...(process.env.BROWSER_HOME?{HOME:process.env.BROWSER_HOME}:{})}});try{
for(const [topic,script,object,loading,recenter] of [['circulatory-system','app.js','model','#loading','#front'],['breathing-system','lab.js','specimen','#modelLoading','#recenter']]){
 const page=await browser.newPage({viewport:{width:1366,height:768},ignoreHTTPSErrors:process.env.PLAYWRIGHT_IGNORE_HTTPS_ERRORS==='1'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 // Expose the real scene only inside this test; deployed scripts stay unchanged.
 await page.route(`**/${topic}/${script}*`,async route=>{const r=await route.fetch();await route.fulfill({response:r,body:await r.text()+`\nwindow.__viewer=()=>({THREE,camera,controls,object:${object}});`})});
 await page.goto(`${base}/activities/y9/science/${topic}/`);
 if(topic==='circulatory-system'){await page.locator('#exploreChips button').first().waitFor({state:'attached'});await page.locator('[data-page="1"]').click();}
 await page.waitForFunction(selector=>document.querySelector(selector).hidden,loading,{timeout:45000});
 async function check(label){
  await page.waitForTimeout(80);
  const metrics=await page.evaluate(()=>{const{THREE,camera,object}=window.__viewer();object.updateMatrixWorld(true);camera.updateMatrixWorld(true);const point=new THREE.Vector3();let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;object.traverse(o=>{if(!o.isMesh||o.userData.helper||!o.visible)return;const a=o.geometry.attributes.position;for(let i=0;i<a.count;i++){point.fromBufferAttribute(a,i).applyMatrix4(o.matrixWorld).project(camera);minX=Math.min(minX,point.x);maxX=Math.max(maxX,point.x);minY=Math.min(minY,point.y);maxY=Math.max(maxY,point.y);}});const e=document.querySelector('#canvas');return{xError:Math.abs(minX+maxX)*e.clientWidth/4,yError:Math.abs(minY+maxY)*e.clientHeight/4,minX,maxX,minY,maxY};});
  assert(metrics.xError<1&&metrics.yError<1,`${topic} ${label}: visually centered within 1px ${JSON.stringify(metrics)}`);
  assert(metrics.minX>-.95&&metrics.maxX<.95&&metrics.minY>-.95&&metrics.maxY<.95,`${topic} ${label}: fits inside canvas`);
  console.log(`${topic}: ${label}, x/y center error ${metrics.xError.toFixed(3)}/${metrics.yError.toFixed(3)}px`);
 }
 await check('desktop initial');
 await page.locator('#zoomIn').click();await page.evaluate(()=>{const {camera,controls}=window.__viewer();camera.position.x+=1;camera.position.y-=1;controls.update()});await page.locator(recenter).click();await check('Re-center after zoom/rotation');
 for(const viewport of [{width:1440,height:900},{width:1920,height:1080},{width:900,height:900}]){await page.setViewportSize(viewport);await check(`resized ${viewport.width}px`);}
 if(topic==='breathing-system'){
  await page.locator('[data-section="1"]').click();await page.locator('#inhale').click();await page.locator('#breathDepth').fill('100');await page.locator(recenter).click();await check('full inhalation');await page.locator('#exhale').click();await page.locator(recenter).click();await check('exhalation');await page.locator('[data-section="0"]').click();await check('return to anatomy');
 }else{
  await page.locator('[data-page="0"]').click();await page.locator('[data-page="1"]').click();await check('return to anatomy');
  assert.equal(await page.locator('.step.dissection-link').getAttribute('href'),'https://asielhm.github.io/heart-lab-y9/');
  assert.equal(await page.locator('#panelDissect').count(),0,'The previous dissection is replaced');

 }
 await page.setViewportSize({width:390,height:844});await page.locator(recenter).click();await check('mobile final');await page.screenshot({path:`/tmp/${topic}-centered.png`,fullPage:true});assert.deepEqual(errors,[]);await page.close();
}
}finally{await browser.close()}})().catch(error=>{console.error(error);process.exitCode=1});
