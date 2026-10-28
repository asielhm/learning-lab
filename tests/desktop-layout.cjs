const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const base=(process.env.LEARNING_LAB_BASE_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
const pages=['/','/activities/y9/science/circulatory-system/','/activities/y9/science/breathing-system/','/activities/y9/science/gas-laws/','/activities/y9/science/gas-laws/examples/syringe.html','/activities/y9/science/gas-laws/examples/syringe-balloon.html','/activities/y9/science/gas-laws/examples/balloon.html','/activities/y9/science/gas-laws/examples/tyre.html','/activities/y7/maths/algebra/',...['numbers-i','geometry-i','numbers-ii','algebra-i','numbers-iii'].map(u=>`/activities/y7/maths/${u}/`),...['acids-and-bases','metals','redox','organic-chemistry'].map(u=>`/activities/y10/chemistry/${u}/`)];
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const p=await b.newPage({reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  for(const viewport of[{width:1366,height:768},{width:1440,height:900},{width:1920,height:1080}]){
   await p.setViewportSize(viewport);
   for(const url of pages){
    await p.goto(base+url);if(url.includes('/maths/')&&!url.includes('/algebra/'))await p.locator('.math-widget').first().waitFor();if(url.includes('/chemistry/'))await p.locator('[data-bench-source],[data-bench-tap]').first().waitFor();
    const metric=await p.evaluate(()=>({main:document.querySelector('main').getBoundingClientRect().width,scroll:document.documentElement.scrollWidth,width:innerWidth}));
    assert(metric.scroll<=metric.width,url+' overflow '+JSON.stringify(metric));assert(metric.main>=Math.min(1760,metric.width)*.98,url+' not using desktop width');
    for(const selector of['.workspace','.gas-layout','.object-layout','.widget-layout','.lesson-grid','.apparatus-stage'])if(await p.locator(selector).count()){
     const columns=await p.locator(selector).first().evaluate(el=>getComputedStyle(el).gridTemplateColumns);assert(columns.split(' ').length>=2,url+' '+selector+' should use columns: '+columns);
    }
    if(url.includes('/chemistry/')){
     const bounds=await p.locator('#workbench').boundingBox(),menu=await p.locator('#experiment-menu').boundingBox();assert(menu.y+menu.height<bounds.y,'Investigation dropdown above the bench');assert.equal(await p.locator('#experiment-select').count(),1);await p.locator('.notebook').scrollIntoViewIfNeeded();const menuAfter=await p.locator('#experiment-menu').boundingBox(),notebook=await p.locator('.notebook').boundingBox();assert(menuAfter.y+menuAfter.height<notebook.y,'Investigation selector stays above observations when scrolling');
     await p.locator('#expand-bench').click();const stage=await p.locator('.apparatus-stage').boundingBox();assert(stage.height>=300&&stage.height<viewport.height,'Bench scaled to computer height');
     for(const button of['#expand-bench','#record-reading','#new-trial','#reset-lab']){const box=await p.locator(button).boundingBox();assert(box.y>=0&&box.y+box.height<=viewport.height,button+' outside expanded computer bench '+JSON.stringify(box));}
     await p.keyboard.press('Escape');
    }
   }
   console.log(`Desktop workspaces: ${pages.length} pages at ${viewport.width}×${viewport.height}.`);
  }
  await p.setViewportSize({width:1440,height:900});await p.goto(base+'/activities/y10/chemistry/acids-and-bases/revision.html');await p.locator('#start-session').click();
  const question=await p.locator('#revision-question-title').boundingBox(),answers=await p.locator('#revision-answer-form').boundingBox();assert(question.x+question.width<answers.x,'Question and choices alongside each other');assert(Math.abs(question.y-answers.y)<5);
  await p.locator('input[name=answer]').first().check();await p.locator('#check-answer').click();assert(await p.locator('#revision-feedback').isVisible());
  for(const[route,selector,name]of[['/activities/y10/chemistry/acids-and-bases/','#workbench','chemistry'],['/activities/y9/science/gas-laws/','#experiment','gas'],['/activities/y7/maths/numbers-i/','.math-widget','math']]){await p.goto(base+route);await p.locator(selector).first().waitFor();await p.locator(selector).first().screenshot({path:`/tmp/desktop-final-${name}.png`});}
  // Every public HTML shell, including the generated wrappers, uses the common template.
  const walk=folder=>fs.readdirSync(folder,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(folder,e.name)):e.name.endsWith('.html')?[path.join(folder,e.name)]:[]);
  for(const file of['index.html',...walk('activities'),...walk('teacher')].filter(file=>!file.includes('gdc-trainer/'))){const html=fs.readFileSync(file,'utf8'),matches=html.match(/<link[^>]+href="([^"]*desktop-layout\.css[^\"]*)"/g)||[];assert.equal(matches.length,1,file);const href=matches[0].match(/href="([^"]+)"/)[1].split('?')[0];assert(fs.existsSync(path.resolve(path.dirname(file),href)),file);}
  assert.deepEqual(errors,[]);console.log('Shared desktop template, wide revision interaction, in-view large-bench controls and all public stylesheet links passed.');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
