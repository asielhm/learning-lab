const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const base=(process.env.LEARNING_LAB_BASE_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox'],env:{...process.env,...(process.env.BROWSER_HOME?{HOME:process.env.BROWSER_HOME}:{})}});try{
for(const topic of ['circulatory-system','breathing-system']){
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const heart=topic==='circulatory-system',script=heart?'app.js':'lab.js';
 await page.route(`**/${topic}/${script}*`,async route=>{const r=await route.fetch();await route.fulfill({response:r,body:await r.text()+`\nwindow.__viewer=()=>({camera,controls});`})});
 await page.goto(`${base}/activities/y9/science/${topic}/`);
 if(heart){await page.locator('#exploreChips button').first().waitFor({state:'attached'});await page.locator('[data-page="1"]').click();}
 await page.waitForFunction(id=>document.querySelector(id).hidden,heart?'#loading':'#modelLoading',{timeout:45000});
 const snapshot=()=>page.evaluate(()=>{const{camera,controls}=window.__viewer();return{position:camera.position.toArray(),target:controls.target.toArray(),distance:camera.position.distanceTo(controls.target),direction:camera.position.clone().sub(controls.target).normalize().toArray(),scroll:scrollY}});
 const norm=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
 const recenter=async()=>{await page.locator(heart?'#front':'#recenter').click();await page.waitForTimeout(100);await page.locator('#canvas canvas').scrollIntoViewIfNeeded();};
 await recenter();const initial=await snapshot();const box=await page.locator('#canvas canvas').boundingBox();const center={x:box.x+box.width/2,y:box.y+box.height/2};const cdp=await page.context().newCDPSession(page);
 async function gesture(start,end){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:start.map((p,id)=>({...p,id}))});for(let step=1;step<=8;step++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:start.map((p,id)=>({x:p.x+(end[id].x-p.x)*step/8,y:p.y+(end[id].y-p.y)*step/8,id}))});}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(200);}
 const pair=[{x:center.x-45,y:center.y},{x:center.x+45,y:center.y}];
 await gesture(pair,pair.map(p=>({x:p.x+35,y:p.y-25})));const moved=await snapshot();
 assert(norm(moved.target,initial.target)>.1,`${topic}: two fingers must pan`);assert(norm(moved.direction,initial.direction)<.01,'Pan preserves view direction');assert(Math.abs(moved.scroll-initial.scroll)<2,'Model gesture must not scroll the page');
 await recenter();const afterPan=await snapshot();assert(norm(afterPan.target,initial.target)<.001&&norm(afterPan.position,initial.position)<.001,'Re-center restores after pan');
 await gesture(pair,[{x:center.x-85,y:center.y},{x:center.x+85,y:center.y}]);const zoomed=await snapshot();assert(zoomed.distance<initial.distance*.9,`${topic}: pinch must zoom`);
 await recenter();await gesture([{x:center.x,y:center.y}],[{x:center.x+45,y:center.y+20}]);const rotated=await snapshot();assert(norm(rotated.direction,initial.direction)>.05,`${topic}: one finger must rotate`);
 await recenter();const restored=await snapshot();assert(norm(restored.target,initial.target)<.001&&norm(restored.position,initial.position)<.001,'Re-center restores after rotation and zoom');assert.deepEqual(errors,[]);console.log(`${topic}: real two-finger pan, pinch zoom, one-finger rotation and Re-center passed on a phone viewport.`);await page.close();
}
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
