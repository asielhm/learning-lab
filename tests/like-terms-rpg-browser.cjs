const{chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.LEARNING_LAB_BASE_URL||'http://127.0.0.1:8068',path='/activities/y7/maths/algebra-ii/games/like-terms-quest.html',endpoint=JSON.parse(fs.readFileSync('assets/records/config.json')).deploymentUrl,manifest=JSON.parse(fs.readFileSync('assets/records/banks.json')),gameManifest=JSON.parse(fs.readFileSync('assets/records/games.json')),key='learning-lab-runehaven-v1';
(async()=>{
 const{LEVELS,questById}=await import('../assets/like-terms-rpg/data.mjs'),{parseRpgExpression,expressionText}=await import('../assets/like-terms-rpg/math.mjs');
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const c=await browser.newContext({viewport:{width:1366,height:768},reducedMotion:'reduce'}),posts=[],errors=[];
  await c.route(endpoint+'?*',r=>r.fulfill({contentType:'text/html',body:`<script>window.top.postMessage(${JSON.stringify({type:'learning-lab-recording-capabilities',nonce:new URL(r.request().url()).searchParams.get('nonce'),manifest,gameManifest})},${JSON.stringify(new URL(base).origin)})</script>`}));
  await c.route(endpoint,r=>{const form=new URLSearchParams(r.request().postData()),payload=JSON.parse(form.get('payload'));posts.push(payload);r.fulfill({contentType:'text/html',body:`<script>window.top.postMessage(${JSON.stringify({type:'learning-lab-record-receipt',nonce:form.get('nonce'),eventId:payload.eventId,ok:true})},${JSON.stringify(new URL(base).origin)})</script>`});});
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));const action=name=>p.locator('#rpg-app [data-action="'+name+'"]'),dialog=()=>p.locator('#rpg-dialogue');
  const saved=()=>p.waitForFunction(()=>JSON.parse(sessionStorage.getItem('learning-lab-pending-games-v1')||'[]').length===0);
  const read=()=>p.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
  async function go(id){await p.locator(`#quest-list [data-id="${id}"]`).click();}
  async function mapClick(x,y){const rect=await p.locator('#rpg-world').boundingBox();await p.mouse.click(rect.x+(x+.5)/20*rect.width,rect.y+(y+.5)/12*rect.height);}
  async function answerChallenge({wrong=false,drag=false,uncollected=false,mergeWrong=false}={}){
   const id=await dialog().getAttribute('data-quest'),index=Number(await dialog().getAttribute('data-variant')),v=questById(id).variants[index];
   if(v.type==='choice'){
    if(wrong){await p.locator(`[name=quest-choice][value="${(v.answer+1)%v.options.length}"]`).check();await action('check-quest').click();assert.match(await p.locator('#quest-feedback').innerText(),/Not yet/);}
    await p.locator(`[name=quest-choice][value="${v.answer}"]`).check();
   }else if(v.type==='sort'){
    for(const [i,card]of v.cards.entries()){
     if(drag&&i===0){await p.locator(`[data-drag-rune="${card.id}"]`).dragTo(p.locator(`[data-sort-bin="${card.key}"]`));assert.equal(await p.locator(`[data-sort-bin="${card.key}"] [data-id="${card.id}"]`).count(),1);}
     else{await p.locator(`#rpg-exercise [data-action=select-rune][data-id="${card.id}"]`).press('Enter');await p.locator(`[data-action=place-rune][data-key="${card.key}"]`).click();}
    }
   }else if(v.type==='combine'){
    if(mergeWrong){const runes=await p.locator('.rpg-combine-runes button').all();await runes[0].click();await runes[1].click();await p.locator('#merge-value').fill('99');await action('merge').click();assert.match(await p.locator('#quest-feedback').innerText(),/Try the signed numbers/);}
    for(let merges=0;merges<15;merges++){
     const runes=await p.locator('.rpg-combine-runes button').evaluateAll(els=>els.map(e=>({id:e.dataset.id,text:e.textContent})));
     const terms=runes.map(r=>{const parsed=parseRpgExpression(r.text),[key,n]=Object.entries(parsed.map)[0];return{...r,key,n};});
     const a=terms.find((a,i)=>terms.some((b,j)=>j>i&&a.key===b.key));if(!a)break;const b=terms.find(t=>t.id!==a.id&&t.key===a.key);
     // Clear any previous selection before choosing this pair.
     for(const selected of await p.locator('.rpg-combine-runes [aria-pressed=true]').evaluateAll(els=>els.map(e=>e.dataset.id)))await p.locator(`.rpg-combine-runes [data-id="${selected}"]`).click();
     await p.locator(`.rpg-combine-runes [data-id="${a.id}"]`).click();await p.locator(`.rpg-combine-runes [data-id="${b.id}"]`).click();await p.locator('#merge-value').fill(String(a.n+b.n));await action('merge').click();
    }
   }else{
    if(uncollected){await p.locator('#quest-expression').fill(expressionText(v.terms));await action('check-quest').click();assert.match(await p.locator('#quest-feedback').innerText(),/finish collecting/);}
    await p.locator('#quest-expression').fill(v.solution.replaceAll('²','^2').replaceAll('³','^3'));
   }
   await action('check-quest').click();await p.locator('#rpg-dialogue[data-kind=reward]').waitFor();return id;
  }
  await p.goto(base+path);await p.locator('#character-form').waitFor();await p.locator('#character-form [type=submit]').click();assert.equal(await p.locator('#rpg-console').count(),0);assert.equal(await p.locator('[name=heroName]').evaluate(e=>e.validity.valueMissing),true);
  await p.locator('[name=heroName]').fill('Ada <b>');await p.locator('[name=gender][value=female]').check();await p.locator('[name=outfit]').selectOption('1');await p.locator('[name=skin]').selectOption('1');
  await p.locator('#portrait-file').setInputFiles({name:'bad.txt',mimeType:'text/plain',buffer:Buffer.from('not an image')});assert.match(await p.locator('#portrait-status').innerText(),/PNG, JPG or WebP/);
  const png=await p.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d');x.fillStyle='#f2be68';x.fillRect(0,0,16,16);x.fillStyle='#538977';x.fillRect(4,4,8,10);return c.toDataURL('image/png').split(',')[1];});
  await p.locator('#portrait-file').setInputFiles({name:'portrait.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')});await p.getByText('Your pixel portrait is ready.',{exact:false}).waitFor();await p.locator('.rpg-creator').screenshot({path:'/tmp/runehaven-character.png'});
  await p.locator('#character-form [type=submit]').click();await action('explore').click();let state=await read();assert.equal(state.profile.gender,'female');assert.equal(state.profile.outfit,1);assert(state.profile.portrait.startsWith('data:image/png;'));assert.equal(await p.locator('#hud-name b').count(),0);
  // Actual keyboard movement changes the pixels at the hero's starting square.
  const pixels=()=>p.locator('#rpg-world').evaluate(c=>Array.from(c.getContext('2d').getImageData(64,288,32,32).data).join(','));const before=await pixels();await p.locator('#rpg-world').focus();await p.keyboard.down('ArrowRight');await p.waitForTimeout(80);await p.keyboard.up('ArrowRight');assert.notEqual(await pixels(),before);
  await mapClick(7,3);await p.getByText('This chest is locked.',{exact:false}).waitFor();assert.equal((await read()).progress['village-coefficient']?.solved,undefined);assert.equal(posts.length,0);
  await go('npc-village-coefficient');await p.locator('#rpg-dialogue[data-kind=challenge]').waitFor();await answerChallenge();assert.equal((await read()).progress['village-coefficient'].collected,false);await action('find-from-dialog').click();await p.waitForFunction(()=>document.querySelector('#rpg-console').dataset.treasures==='1');assert.equal(posts.length,0,'Default practice is never recorded');await action('pause').focus();await action('pause').press('Space');await p.locator('#rpg-dialogue[data-kind=pause]').waitFor();await p.keyboard.press('Escape');
  // Work through a solution, leave it, reload and require a genuinely different question.
  await go('npc-village-family');await p.locator('#rpg-dialogue[data-quest=village-family]').waitFor();const workedVariant=Number(await dialog().getAttribute('data-variant'));await action('worked').click();assert.equal((await read()).progress['village-family'].needsFresh,true);await p.reload();await action('resume').click();await action('explore').click();await go('npc-village-family');await p.locator('#rpg-dialogue[data-kind=challenge]').waitFor();assert.notEqual(Number(await dialog().getAttribute('data-variant')),workedVariant);await action('worked').click();assert.equal(await dialog().getAttribute('data-kind'),'worked-review');await action('return-to-challenge').click();assert.notEqual(Number(await dialog().getAttribute('data-variant')),workedVariant);await action('close-dialog').click();
  // Required student details; starting a recorded level resets only that level.
  const form=p.locator('.game-record-panel form');await form.waitFor();await form.locator('[name=name]').fill('Test Explorer');await form.locator('[name=teacherName]').fill('Ms Rivera');await form.locator('[type=submit]').click();assert.equal((await read()).progress['village-coefficient'].collected,true);await form.locator('[name=classroom]').fill('7R');await form.locator('[type=submit]').click();await action('explore').click();assert.equal((await read()).progress['village-coefficient'],undefined);
  let workedOnce=false;
  for(let level=0;level<6;level++){
   assert.equal((await read()).level,level);
   // A closed portal cannot advance the player.
   await mapClick(18,2);await p.getByText('This portal needs four collected treasures.',{exact:false}).waitFor();assert.equal((await read()).level,level);
   for(const [i,q]of LEVELS[level].quests.entries()){
    await go('npc-'+q.id);await p.locator(`#rpg-dialogue[data-quest="${q.id}"][data-kind=challenge]`).waitFor();if(level===1&&i===0)await p.screenshot({path:'/tmp/runehaven-sorting.png'});
    if(level===0&&i===1)await action('hint').click();
    if(level===0&&i===2){const old=Number(await dialog().getAttribute('data-variant'));await action('worked').click();assert.equal((await read()).progress[q.id].solved,false);await action('fresh-after-worked').click();assert.notEqual(Number(await dialog().getAttribute('data-variant')),old);workedOnce=true;}
    await answerChallenge({wrong:level===0&&i===0,drag:level===1&&i===0,mergeWrong:level===1&&i===1,uncollected:level===1&&i===2});
    await saved();assert.equal((await read()).progress[q.id].collected,false);await action('find-from-dialog').click();await p.waitForFunction(n=>Number(document.querySelector('#rpg-console').dataset.treasures)===n,level*4+i+1);
   }
   assert.equal((await p.locator('#relic-count').innerText()),`${level+1} / 6`);
   await mapClick(18,2);await p.locator(`#rpg-dialogue[data-kind=${level===5?'ending':'portal'}]`).waitFor();
   if(level<5){await action('next-level').click();await action('explore').click();}
  }
  assert(workedOnce);await saved();assert.equal(posts.length,24);assert.equal(new Set(posts.map(p=>p.sessionId)).size,6);for(const session of new Set(posts.map(p=>p.sessionId)))assert.equal(posts.filter(p=>p.sessionId===session).length,4);
  assert.equal(posts[0].attempts,2);assert.notDeepEqual(posts[0].firstAnswer,posts[0].answer);assert.equal(posts[1].assisted,true);assert.equal(posts[2].answer.usedWorkedSolution,true);assert.equal(posts[2].revealed,false);
  assert(posts.every(p=>p.gameId==='like-terms-rpg'&&p.classroom==='7R'&&p.studentName==='Test Explorer'&&p.teacherName==='Ms Rivera'));
  assert(!JSON.stringify(posts).includes('data:image'));assert(!JSON.stringify(posts).includes('Ada <b>'));
  state=await read();assert.equal(state.complete,true);assert.equal(Object.values(state.progress).filter(p=>p.collected).length,24);assert.equal(await p.locator('#hud-coins').innerText(),'◈ 240 coins');await p.screenshot({path:'/tmp/runehaven-complete.png'});
  // Completed guardians offer local practice without awarding duplicate treasures.
  await action('explore').click();await go('npc-vault-finale');await action('practice-quest').click();await answerChallenge();assert.equal(posts.length,24);assert.equal(await p.locator('#hud-coins').innerText(),'◈ 240 coins');await action('explore').click();
  await p.reload();await action('resume').click();await action('explore').click();assert.equal((await read()).level,5);assert.equal(await p.locator('#hud-coins').innerText(),'◈ 240 coins');assert.match(await p.locator('[data-game-status]').innerText(),/Practice/);
  for(const size of [{width:1366,height:768},{width:1440,height:900},{width:1920,height:1080}]){
   await p.setViewportSize(size);await action('expand').click();await action('journal').click();const box=await p.locator('.rpg-dialog-panel').boundingBox();assert(box.y>=0&&box.y+box.height<=size.height);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.keyboard.press('Escape');await action('expand').click();
  }
  await action('pause').click();await action('character-screen').click();await p.locator('[name=heroName]').fill('Leo');await p.locator('[name=gender][value=male]').check();await p.locator('#character-form [type=submit]').click();await action('explore').click();assert.equal((await read()).profile.gender,'male');assert.equal((await read()).level,0);assert.equal(await p.locator('#hud-coins').innerText(),'◈ 0 coins');assert.equal(posts.length,24);
  // In a laptop-sized view, map ratio, challenge actions and hero controls fit.
  await p.setViewportSize({width:1366,height:768});await go('npc-village-coefficient');await p.locator('#rpg-dialogue[data-kind=challenge]').waitFor();const check=await action('check-quest').boundingBox();assert(check.y+check.height<=768);await p.screenshot({path:'/tmp/runehaven-challenge.png'});await p.keyboard.press('Escape');const canvas=await p.locator('#rpg-world').boundingBox();assert(Math.abs(canvas.width/canvas.height-5/3)<.03);await p.screenshot({path:'/tmp/runehaven-world.png'});await action('expand').click();await p.locator('#rpg-world').focus();await p.keyboard.press('Escape');assert.equal(await action('expand').getAttribute('aria-expanded'),'false');assert.equal(await action('expand').innerText(),'Enlarge game');
  assert.deepEqual(errors,[]);console.log('Runehaven browser: full 24-quest/6-world journey, real movement, male/female/portrait creation, drag and keyboard sorting, merge/input maths, worked-to-fresh recovery, chest/portal gates, autosave/resume, duplicate-free treasure, 24 acknowledged records across six sessions, local-only practice/portraits and three desktop layouts passed.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
