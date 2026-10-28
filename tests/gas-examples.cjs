const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=(process.env.LEARNING_LAB_BASE_URL||'http://127.0.0.1:8000').replace(/\/$/,'');
const path='/activities/y9/science/gas-laws/';
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||'/usr/bin/chromium',args:['--no-sandbox']});
  try{
    const p=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[],unexpected=[];
    p.on('pageerror',e=>errors.push(e.message));
    p.on('request',r=>{if(/script\.google|googleusercontent/.test(r.url()))unexpected.push(r.url());});
    async function ready(){await p.locator('#reading0').filter({hasText:/\d/}).waitFor();}
    async function reading(i,expected,tolerance=.06){assert(Math.abs(Number(await p.locator('#reading'+i).innerText())-expected)<tolerance);}
    async function set(value){await p.locator('#variable').fill(String(value));}
    for(const [law,key] of [['boyle','syringe'],['syringe-balloon','syringe-balloon'],['charles','balloon'],['pressure','tyre']]){
      await p.goto(base+path);await p.locator('#pressureValue').waitFor();
      await p.locator(`[data-example=${law}]`).click();await ready();
      assert(p.url().endsWith(`/examples/${key}.html`));
      assert.equal(await p.locator('canvas').count(),0);
      assert.equal(await p.locator('.example-tabs [aria-current]').getAttribute('href'),`${key}.html`);
      assert.equal(await p.locator('#measurementRows tr').count(),1);
      assert(await p.locator('.apparatus').evaluate(el=>el.parentElement.nextElementSibling.classList.contains('evidence')));
      assert.equal(await p.locator('.revision-card').evaluate(el=>el.nextElementSibling.tagName),'NOSCRIPT');
      const correct=key==='balloon'||key==='syringe-balloon'?1:0;
      await p.locator('#answerOptions button').nth(correct).click();
      assert((await p.locator('#feedback').innerText()).includes('First complete'));
      if(key==='syringe'){
        await reading(0,101.3);await reading(1,20);await reading(2,20);
        await set(10);await reading(0,202.6);await reading(1,10);
        assert.equal(await p.locator('#airSpace').getAttribute('width'),'39.5');
        await set(40);await reading(0,50.65);await reading(1,40);
        const handle=p.locator('#plunger');await handle.focus();await p.keyboard.press('Home');assert.equal(await p.locator('#variable').inputValue(),'10');
        await p.keyboard.press('ArrowRight');assert.equal(await p.locator('#variable').inputValue(),'11');
        await p.keyboard.press('End');assert.equal(await p.locator('#variable').inputValue(),'40');
        await p.keyboard.press('PageDown');assert.equal(await p.locator('#variable').inputValue(),'35');
        await set(20);await handle.scrollIntoViewIfNeeded();
        const rect=await p.locator('#apparatus').boundingBox(),scale=rect.width/680;
        const x=rect.x+(235+181)*scale,y=rect.y+226*scale;
        await p.mouse.move(x,y);await p.mouse.down();await p.mouse.move(x-37.5*scale,y,{steps:8});await p.mouse.up();
        assert.equal(await p.locator('#variable').inputValue(),'10');
        await reading(0,202.6);
      }else if(key==='syringe-balloon'){
        const {syringeBalloon}=await import('../activities/y9/science/gas-laws/examples/gas-models.mjs');
        await reading(0,101.3);await reading(1,5);await reading(2,20);
        for(let volume=10;volume<=40;volume++){
          const model=syringeBalloon(volume);assert(Math.abs(model.P*model.balloon-506.5)<1e-8);assert(Math.abs(model.P*model.outside-1519.5)<1e-8);assert.equal(model.balloon+model.outside,volume);
          await set(volume);await reading(0,2026/volume);await reading(1,volume/4);await reading(2,volume);
          const balloon=await p.locator('#innerBalloon').boundingBox(),chamber=await p.locator('#airSpace').boundingBox();assert(balloon.x>chamber.x&&balloon.x+balloon.width<chamber.x+chamber.width);assert(balloon.y>chamber.y&&balloon.y+balloon.height<chamber.y+chamber.height);
          const scale=Number((await p.locator('#innerBalloon').getAttribute('transform')).match(/scale\((.*?)\)/)[1]);assert(Math.abs(scale**3-volume/20)<1e-10);
        }
        for(const value of[0,-1,NaN,Infinity])assert.throws(()=>syringeBalloon(value),RangeError);
        await set(20);await p.locator('#plunger').scrollIntoViewIfNeeded();const points=await p.locator('#apparatus').evaluate(svg=>[441,516].map(x=>{const point=svg.createSVGPoint();point.x=x;point.y=230;const p=point.matrixTransform(svg.getScreenCTM());return {x:p.x,y:p.y};}));
        await p.mouse.move(points[0].x,points[0].y);await p.mouse.down();await p.mouse.move(points[1].x,points[1].y,{steps:10});await p.mouse.up();assert.equal(await p.locator('#variable').inputValue(),'30');await reading(1,7.5);
        await p.locator('#plunger').focus();await p.keyboard.press('Home');assert.equal(await p.locator('#variable').inputValue(),'10');await reading(1,2.5);await p.keyboard.press('End');assert.equal(await p.locator('#variable').inputValue(),'40');await reading(0,50.65);await reading(1,10);
      }else if(key==='balloon'){
        await reading(0,3);await reading(1,293.15);await reading(2,101.3);
        await set(0);await reading(0,3*273.15/293.15);await reading(1,273.15);
        const cool=await p.locator('#balloonShape').getAttribute('transform');
        await p.getByRole('button',{name:'Warm room',exact:true}).click();await reading(0,3*333.15/293.15);await reading(1,333.15);await reading(2,101.3);
        assert.notEqual(await p.locator('#balloonShape').getAttribute('transform'),cool);
        const scale=Number((await p.locator('#balloonShape').getAttribute('transform')).match(/scale\((.*?)\)/)[1]);
        assert(Math.abs(scale**3-333.15/293.15)<1e-10);
      }else{
        await reading(0,220);await reading(1,321.3);await reading(2,293.15);
        assert.equal(await p.locator('#variable').getAttribute('min'),'-30');assert.equal(await p.locator('#variable').getAttribute('max'),'70');
        const wheel=await p.locator('#tyreRim > circle').first().getAttribute('r'),needle=await p.locator('#needle').getAttribute('transform'),outline=await p.locator('#tyreOutline').getAttribute('d'),position=await p.locator('#tyreWheel').getAttribute('transform');
        await set(-30);await reading(1,321.3*243.15/293.15);await reading(0,321.3*243.15/293.15-101.3);await reading(2,243.15);
        assert.notEqual(await p.locator('#tyreOutline').getAttribute('d'),outline);assert.notEqual(await p.locator('#tyreWheel').getAttribute('transform'),position);assert.equal(await p.locator('#tyreRim > circle').first().getAttribute('r'),wheel);assert.equal(await p.locator('#apparatus').getAttribute('data-tyre-state'),'cold');
        await set(20);assert.equal(await p.locator('#tyreOutline').getAttribute('d'),outline);await reading(0,220);
        await set(69);assert.equal(await p.locator('#apparatus').getAttribute('data-tyre-state'),'intact');await reading(1,321.3*342.15/293.15);
        await p.getByRole('button',{name:'Hot tyre',exact:true}).click();await reading(0,263.841);await reading(1,365.141);await reading(2,333.15);
        assert.notEqual(await p.locator('#needle').getAttribute('transform'),needle);assert.equal(await p.locator('#tyreRim > circle').first().getAttribute('r'),wheel);
      }
      await p.locator('#recordMeasurement').click();assert.equal(await p.locator('#measurementRows tr').count(),2);
      await p.locator('#recordMeasurement').click();assert.equal(await p.locator('#measurementRows tr').count(),2);
      await p.locator('#answerOptions button').nth((correct+1)%3).click();assert.equal(await p.locator('#feedback').getAttribute('data-state'),'incorrect');
      await p.locator('#answerOptions button').nth(correct).click();assert.equal(await p.locator('#feedback').getAttribute('data-state'),'correct');
      await p.screenshot({path:`/tmp/gas-${key}-tested-desktop.png`,fullPage:true});
      if(key==='tyre'){
        await set(70);assert.equal(await p.locator('#apparatus').getAttribute('data-tyre-state'),'burst');await reading(0,0);await reading(1,101.3);await reading(2,343.15);
        assert.equal(await p.locator('#tyreCasing').evaluate(el=>getComputedStyle(el).display),'none');assert.notEqual(await p.locator('#burstCasing').evaluate(el=>getComputedStyle(el).display),'none');assert.equal(await p.locator('.tyre-air-jet').evaluate(el=>getComputedStyle(el).animationName),'tyre-vent');assert.equal(await p.locator('.sealed-tag').innerText(),'VENTED AIR');assert.match(await p.locator('#calculation').innerText(),/no longer constant/);
        await p.locator('#recordMeasurement').click();assert.equal(await p.locator('#measurementRows tr').count(),3);assert.match(await p.locator('#measurementRows tr').last().innerText(),/Burst \/ vented/);await p.locator('#recordMeasurement').click();assert.equal(await p.locator('#measurementRows tr').count(),3);
        await p.locator('.apparatus').screenshot({path:'/tmp/tyre-burst.png'});
        await set(20);await reading(0,0);assert.equal(await p.locator('#apparatus').getAttribute('data-tyre-state'),'burst');await p.locator('#recordMeasurement').click();assert.equal(await p.locator('#measurementRows tr').count(),4);
        await set(-30);await reading(0,0);assert.match(await p.locator('#resetExample').innerText(),/Replace tyre/);
      }
      await p.locator('#resetExample').click();if(key==='tyre'){assert.equal(await p.locator('#apparatus').getAttribute('data-tyre-state'),'intact');await reading(0,220);assert.equal(await p.locator('.sealed-tag').innerText(),'SEALED AIR');}assert.equal(await p.locator('#measurementRows tr').count(),1);assert.equal(await p.locator('#variable').inputValue(),'20');assert.equal(await p.locator('#feedback').innerText(),'');
      await p.locator('#answerOptions button').nth(correct).click();assert((await p.locator('#feedback').innerText()).includes('First complete'));
      for(const width of [320,390,768]){
        await p.setViewportSize({width,height:844});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        await p.locator('#variable').focus();await p.keyboard.press('ArrowRight');assert.equal(await p.locator('#variable').inputValue(),width===320?'21':width===390?'22':'23');
        if(width===390)await p.screenshot({path:`/tmp/gas-${key}-tested-mobile.png`,fullPage:true});
      }
      await p.setViewportSize({width:1440,height:1050});
      await p.locator('header a[href="../index.html#applications"]').click();assert(p.url().endsWith('/index.html#applications'));
    }
    const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
    const phone=await touch.newPage();phone.on('pageerror',e=>errors.push(e.message));
    await phone.goto(base+path+'examples/syringe.html');await phone.locator('#plunger').waitFor();await phone.locator('#plunger').scrollIntoViewIfNeeded();
    const rect=await phone.locator('#apparatus').boundingBox(),scale=rect.width/680;
    const x=rect.x+(235+181)*scale,y=rect.y+226*scale;
    const session=await touch.newCDPSession(phone);
    await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});
    for(let i=1;i<=8;i++){
      await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-45*scale*i/8,y,id:1}]});
      await phone.evaluate(()=>new Promise(requestAnimationFrame));
    }
    await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await phone.locator('#variable').inputValue(),'10');
    await phone.getByRole('button',{name:'Expand',exact:true}).tap();assert.equal(await phone.locator('#variable').inputValue(),'40');
    await phone.locator('.example-tabs a[href="syringe-balloon.html"]').tap();await phone.locator('#innerBalloon').waitFor();await phone.locator('#plunger').scrollIntoViewIfNeeded();
    const touchPoints=await phone.locator('#apparatus').evaluate(svg=>[441,366].map(x=>{const point=svg.createSVGPoint();point.x=x;point.y=230;const p=point.matrixTransform(svg.getScreenCTM());return {x:p.x,y:p.y};})),bx=touchPoints[0].x,by=touchPoints[0].y;
    await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:bx,y:by,id:1}]});
    for(let i=1;i<=8;i++){await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:bx+(touchPoints[1].x-bx)*i/8,y:by,id:1}]});await phone.evaluate(()=>new Promise(requestAnimationFrame));}
    await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal(await phone.locator('#variable').inputValue(),'10');assert.equal(await phone.locator('#reading1').innerText(),'2.50');await phone.getByRole('button',{name:'Expand',exact:true}).tap();assert.equal(await phone.locator('#reading1').innerText(),'10.00');
    await phone.locator('.example-tabs a[href="balloon.html"]').tap();await phone.getByRole('button',{name:'Warm room',exact:true}).tap();assert.equal(await phone.locator('#variable').inputValue(),'60');
    await phone.locator('.example-tabs a[href="tyre.html"]').tap();await phone.getByRole('button',{name:'Cold day',exact:true}).tap();assert.equal(await phone.locator('#variable').inputValue(),'-30');
    assert.deepEqual(errors,[]);assert.deepEqual(unexpected,[]);
    console.log('Gas object simulations: four linked examples, separate sealed balloon/syringe gas invariants, chamber containment, correct gas-law readings, object responses, mouse/touch/keyboard plunger, investigation gates, records/reset, 320–1440px layouts and no Google submissions passed.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
