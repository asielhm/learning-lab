/* Browser integration checks. Start the static server, then run with Playwright installed. */
const {chromium} = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = (process.env.LEARNING_LAB_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const project = path.resolve(__dirname, '..');
const loadBank = name => JSON.parse(fs.readFileSync(path.join(project, `assets/revision/questions/${name}.json`), 'utf8'));
// Quiz behaviour checks must never submit test results to the teacher's live sheet.
async function practicePage(browser, options = {}) {
  const page = await browser.newPage(options);
  await page.route('**/assets/records/config.json', route => route.fulfill({json:{deploymentUrl:''}}));
  return page;
}

async function answer(page, bank, wrong = false, test = false) {
  const prompt = await page.locator('#revision-question-title').innerText();
  const question = bank.questions.find(q => q.prompt === prompt);
  assert(question, `Question comes from the selected bank: ${prompt}`);
  const texts = await page.locator('.revision-option-text').allTextContents();
  const correct = texts.findIndex(text => text === question.options[question.answer]);
  assert(correct >= 0, 'The correct answer survives option shuffling');
  assert(await page.locator('#check-answer').isDisabled(), 'Answer is required');
  await page.locator('input[name=answer]').nth(wrong ? (correct + 1) % 4 : correct).check();
  await page.locator('#check-answer').click();
  assert.equal(await page.locator('input[name=answer]:disabled').count(), 4);
  if (test) {
    assert.equal(await page.locator('.revision-option.is-correct').count(), 0);
    assert(!(await page.locator('#revision-feedback').innerText()).includes(question.explanation));
  } else {
    assert((await page.locator('#revision-feedback').innerText()).includes(question.explanation));
    assert.equal(await page.locator('.revision-option.is-correct').count(), 1);
  }
  await page.locator('#next-question').click();
  return question.id;
}
async function study(page, name, topic) {
  const bank = loadBank(name);
  assert(bank.questions.length >= 50);
  assert.equal(new Set(bank.questions.map(q=>q.prompt)).size, bank.questions.length);
  await page.goto(`${base}/activities/y9/science/${topic}/revision.html`);
  await page.locator('#start-session').waitFor();
  assert((await page.locator('.revision-bank-meta').innerText()).includes(String(bank.questions.length)));
  assert.equal(await page.locator('#revision-category option').count(),bank.categories.length+1);
  await page.locator('#revision-length').selectOption('all');
  assert((await page.locator('#revision-availability').innerText()).includes(`${bank.questions.length} matching`));
  await page.locator('#revision-length').selectOption('10');
  await page.locator('#start-session').click();
  const seen = [];
  for (let index = 0; index < 10; index++) seen.push(await answer(page,bank,index < 2));
  assert.equal(new Set(seen).size, 10, 'No repeat questions in a session');
  assert.match(await page.locator('.revision-score').innerText(), /8 \/ 10 correct/);
  assert.equal(await page.locator('.revision-review-item').count(), 10);
  assert.equal(await page.locator('.revision-review-item.is-missed').count(), 2);
  const missedPrompts = await page.locator('.revision-review-item.is-missed summary>span:nth-child(2)').evaluateAll(nodes=>nodes.map(node=>node.firstChild.textContent));
  await page.locator('#retry-wrong').click();
  for (let index = 0; index < 2; index++) {
    assert(missedPrompts.includes(await page.locator('#revision-question-title').innerText()));
    await answer(page,bank);
  }
  assert.match(await page.locator('.revision-score').innerText(), /2 \/ 2 correct/);
  assert.equal(await page.locator('#retry-wrong').count(), 0);
  await page.locator('#new-session').click();
  await page.locator('input[name=mode][value=test]').check();
  await page.locator('#start-session').click();
  for (let index = 0; index < 10; index++) await answer(page,bank,index === 0,true);
  assert.match(await page.locator('.revision-score').innerText(), /9 \/ 10 correct/);
  assert.equal(await page.locator('.revision-review-item').count(), 10);
  await page.locator('#new-session').click();
  const sample = bank.questions.find(q=>q.difficulty === 'Challenge');
  await page.locator('#revision-category').selectOption(sample.category);
  await page.locator('#revision-difficulty').selectOption('Challenge');
  await page.locator('#revision-length').selectOption('all');
  const pool = bank.questions.filter(q=>q.category===sample.category && q.difficulty==='Challenge');
  assert((await page.locator('#revision-availability').innerText()).includes(`${pool.length} matching`));
  await page.locator('#start-session').click();
  for (const tag of await page.locator('.revision-question-tags span').allTextContents()) assert([sample.category,'Challenge'].includes(tag));
  console.log(`${bank.title}: practice scoring, shuffled answers, no repeats, targeted retry, test mode and filters passed (${bank.questions.length} bank questions).`);
}
(async()=>{
  const executable = process.env.CHROMIUM_EXECUTABLE || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
  const browser = await chromium.launch({executablePath:executable, headless:true, args:['--no-sandbox'], env:{...process.env,...(process.env.BROWSER_HOME ? {HOME:process.env.BROWSER_HOME} : {})}});
  try {
    const page = await practicePage(browser,{viewport:{width:1365,height:1000}});
    const errors = [];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'/');await page.locator('.year-tiles').waitFor();
    assert.equal(await page.locator('.year-tile').count(),6);
    assert.match(await page.locator('.year-tile[href="#/years/y9"]').innerText(),/3 activities/);
    assert.equal(await page.locator('a[href="#/years/y13"]').count(),0);
    await page.goto(base+'/#/years/y9/science');await page.locator('.topic-apps .activity-card').first().waitFor();
    assert.equal(await page.locator('.topic-apps .activity-card').count(),3);
    for (const [name,topic] of [['circulatory','circulatory-system'],['breathing','breathing-system'],['gas-laws','gas-laws']]) {
      await page.goto(base+'/#/years/y9/science/'+topic);await page.locator('.activity-card').first().waitFor();
      assert.equal(await page.locator('.activity-card').count(),2);
      await study(page,name,topic);
    }
    // Phone-sized revision page: readable setup and answer, no overflow, keyboard answer choice.
    const phone = await practicePage(browser,{viewport:{width:390,height:844},hasTouch:true,isMobile:true});
    phone.on('pageerror',e=>errors.push(e.message));
    await phone.goto(`${base}/activities/y9/science/gas-laws/revision.html`);
    await phone.locator('#start-session').waitFor();
    assert(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await phone.locator('#start-session').tap();
    await phone.locator('input[name=answer]').first().focus();await phone.keyboard.press('Space');
    await phone.locator('#check-answer').tap();
    await phone.locator('#revision-feedback').waitFor();
    assert(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await phone.locator('#next-question').tap();
    assert(await phone.locator('#revision-question-title').evaluate(el=>{const b=el.getBoundingClientRect();return b.top>=0&&b.top<innerHeight;}));
    assert.deepEqual(errors,[]);
    // Read failure is recoverable, and an empty filtered set cannot start a session.
    const failure = await practicePage(browser);
    await failure.route('**/questions/breathing.json',route=>route.fulfill({status:503,body:'Unavailable'}));
    await failure.goto(`${base}/activities/y9/science/breathing-system/revision.html`);
    await failure.locator('#retry-bank').waitFor();await failure.unroute('**/questions/breathing.json');
    await failure.locator('#retry-bank').click();await failure.locator('#start-session').waitFor();
    console.log('Catalogue: Y13 removed, three main Science apps, and separate breathing/circulation/gas-laws revision pages. Mobile keyboard/touch, focus, no overflow, bank-error recovery passed.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
