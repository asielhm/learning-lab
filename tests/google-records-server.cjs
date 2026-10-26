/* Exercise the Apps Script source without Google credentials or real student data. */
const fs=require('node:fs'), vm=require('node:vm'), crypto=require('node:crypto'), assert=require('node:assert/strict');
const path=require('node:path'), root=path.resolve(__dirname,'..');
const sheets=new Map(), properties=new Map(), cache=new Map(), logs=[];
let clock=0, failSummary=false, locked=false;
let activeEmail='owner@example.test', effectiveEmail='owner@example.test';
class Sheet {
 constructor(name){this.name=name;this.rows=[];}
 getLastRow(){return this.rows.length;}
 appendRow(row){this.rows.push([...row]);}
 setFrozenRows(){}
 getRange(row,column,height,width){return {
  setNumberFormat(){return this;},
  createTextFinder:value=>({matchEntireCell(){return this;},matchCase(){return this;},findAll:()=>Array.from({length:height},(_,i)=>({getRow:()=>row+i,value:this.rows[row-1+i]?.[column-1]})).filter(item=>item.value===value),findNext(){return this.findAll()[0]||null;}}),
  getValues:()=>Array.from({length:height},(_,i)=>Array.from({length:width},(_,j)=>this.rows[row-1+i]?.[column-1+j]??'')),
  setValues:values=>{if(this.name==='Sessions'&&failSummary){failSummary=false;throw new Error('Simulated write failure');}values.forEach((value,i)=>{this.rows[row-1+i]||=[];value.forEach((cell,j)=>this.rows[row-1+i][column-1+j]=cell);});}
 };}
}
const book={getSheetByName:name=>sheets.get(name),insertSheet:name=>{const sheet=new Sheet(name);sheets.set(name,sheet);return sheet;}};
const context=vm.createContext({console:{log:s=>logs.push(s),warn:()=>{}},
 Session:{getActiveUser:()=>({getEmail:()=>activeEmail}),getEffectiveUser:()=>({getEmail:()=>effectiveEmail})},
 SpreadsheetApp:{openById:id=>{assert.equal(id,'11CFaphegZc5bYNnSunvzwZp84LlR45qDMgpMqBs6Cm4');return book;},flush:()=>{}},
 Utilities:{getUuid:crypto.randomUUID,DigestAlgorithm:{SHA_256:'SHA_256'},Charset:{UTF_8:'UTF_8'},computeDigest:(_,value)=>[...crypto.createHash('sha256').update(value).digest()]},
 PropertiesService:{getScriptProperties:()=>({getProperty:key=>properties.get(key)||null,setProperties:values=>Object.entries(values).forEach(([key,value])=>properties.set(key,value))})},
 CacheService:{getScriptCache:()=>({get:key=>{const entry=cache.get(key);return entry&&entry.expiry>clock?entry.value:null;},put:(key,value,seconds)=>cache.set(key,{value,expiry:clock+seconds}),remove:key=>cache.delete(key)})},
 LockService:{getScriptLock:()=>({waitLock:()=>{assert(!locked);locked=true;},releaseLock:()=>{locked=false;}})},
 HtmlService:{XFrameOptionsMode:{ALLOWALL:'ALLOWALL'},createHtmlOutput:html=>({html,setXFrameOptionsMode(){return this;}}),createHtmlOutputFromFile:name=>({name,setTitle(){return this;},setFaviconUrl(value){this.favicon=value;return this;}})}
});
for(const file of ['QuestionBank.gs','Code.gs'])vm.runInContext(fs.readFileSync(path.join(root,'google-apps-script',file),'utf8'),context,{filename:file});
for(const name of ['algebra','circulatory','breathing','gas-laws']){
 const bank=JSON.parse(fs.readFileSync(path.join(root,'assets/revision/questions',name+'.json'),'utf8'));
 assert.equal(Object.keys(context.QUESTION_BANKS_[bank.topicId].questions).length,bank.questions.length);
 for(const q of bank.questions)assert.equal(JSON.stringify(context.QUESTION_BANKS_[bank.topicId].questions[q.id]),JSON.stringify(Object.fromEntries(['prompt','category','difficulty','options','answer'].map(key=>[key,q[key]]))),'Regenerate QuestionBank.gs when a source question changes');
}
book.insertSheet('Existing class notes').appendRow(['Keep this']);
activeEmail='';assert.throws(()=>context.setupLearningLab(),/owns this deployment/);
assert.equal(sheets.has('Answers'),false,'Anonymous setup cannot change the sheet');
assert.throws(()=>context.resetTeacherPassword(),/owns this deployment/);assert.equal(properties.size,0);
activeEmail='student@example.test';assert.throws(()=>context.setupLearningLab(),/owns this deployment/);
assert.throws(()=>context.resetTeacherPassword(),/owns this deployment/);
activeEmail='owner@example.test';context.setupLearningLab();
for(const [name,headers] of [['Historical answers',context.ANSWER_HEADERS_],['Historical sessions',context.SESSION_HEADERS_]]){
 const old=book.insertSheet(name);old.appendRow(headers.slice(0,-1));old.appendRow(['historical-result',...Array(headers.length-2).fill('preserve')]);
 const saved=JSON.stringify(old.rows[1]);context.ensureSheet_(book,name,headers);
 assert.equal(JSON.stringify(old.rows[0]),JSON.stringify(headers));assert.equal(JSON.stringify(old.rows[1]),saved,'Appending Teacher must preserve every original cell');
 context.ensureSheet_(book,name,headers);assert.equal(old.rows.length,2,'Migration is idempotent');
}
assert.deepEqual(sheets.get('Existing class notes').rows,[['Keep this']]);
assert.equal(sheets.get('Answers').rows.length,1);assert.equal(sheets.get('Sessions').rows.length,1);
const password=logs[0].split(': ').at(-1);assert.equal(password.length,40);
const firstHash=properties.get('TEACHER_PASSWORD_HASH');context.setupLearningLab();assert.equal(properties.get('TEACHER_PASSWORD_HASH'),firstHash);
activeEmail='';assert.throws(()=>context.resetTeacherPassword(),/owns this deployment/);assert.equal(properties.get('TEACHER_PASSWORD_HASH'),firstHash);
activeEmail='owner@example.test';
assert.throws(()=>context.getTeacherResults('anything',{}),/Sign in/);
assert.throws(()=>context.loginTeacher('not-the-password'),/failed/);
const {token}=context.loginTeacher(password);assert.equal(token.length,64);
let result=context.getTeacherResults(token,{});assert.equal(result.total,0);assert.equal(result.accuracy,null);
const bank=context.QUESTION_BANKS_['gas-laws'];
const questions=Object.entries(bank.questions);
function payload(id=crypto.randomUUID(),number=1,correct=true,name='Test Student',topic='gas-laws'){
 const [questionId,q]=Object.entries(context.QUESTION_BANKS_[topic].questions)[number-1];
 return {version:2,eventId:id+'-'+number,sessionId:id,studentName:name,classroom:'9T',teacherName:'Ms Rivera',course:context.QUESTION_BANKS_[topic].course,topic,mode:'test',retry:false,startedAt:'2026-10-26T00:00:00.000Z',questionNumber:number,totalQuestions:2,questionId,selectedAnswer:q.options[correct?q.answer:(q.answer+1)%4],correct:!correct,score:100};
}
const first=payload();context.saveAnswer_(first);context.saveAnswer_(first);
assert.equal(sheets.get('Answers').rows.length,2,'Duplicate answer is acknowledged without a duplicate row');
assert.equal(context.getTeacherResults(token,{view:'answers'}).total,1);
assert.equal(context.getTeacherResults(token,{}).total,0,'Incomplete quizzes have no completed summary');
const second=payload(first.sessionId,2,false);context.saveAnswer_(second);
result=context.getTeacherResults(token,{});assert.equal(result.total,1);assert.equal(result.accuracy,50);assert.equal(result.rows[0][10],1,'Correctness comes from the server bank, not posted flags');
context.saveAnswer_(second);assert.equal(sheets.get('Sessions').rows.length,2);
// Google can return numbers/booleans as strings from text-formatted cells.
for(const row of sheets.get('Answers').rows.slice(1))for(let i=0;i<row.length;i++)row[i]=typeof row[i]==='boolean'?String(row[i]).toUpperCase():String(row[i]);
context.saveAnswer_(second);assert.equal(sheets.get('Answers').rows.length,3,'A repeated delivery survives text-formatted Google values');
assert.equal(context.getTeacherResults(token,{}).accuracy,50);
assert.throws(()=>context.saveAnswer_({...first,selectedAnswer:'invented option'}),/Unknown/);
assert.throws(()=>context.saveAnswer_({...first,studentName:'Changed identity'}),/identity changed/);
assert.throws(()=>context.saveAnswer_({...first,classroom:'   '}),/Required field/);
assert.throws(()=>context.saveAnswer_({...first,teacherName:'   '}),/Required field/);
assert.throws(()=>context.saveAnswer_({...first,teacherName:'Different teacher'}),/identity changed/);
assert.throws(()=>context.saveAnswer_({...first,version:3}),/Invalid session/);
assert.throws(()=>context.saveAnswer_({...first,eventId:'bad'}),/Invalid event/);
assert.throws(()=>context.saveAnswer_({...first,totalQuestions:99}),/Invalid course/);
assert.throws(()=>context.saveAnswer_({...first,course:'Year 7 Maths'}),/Invalid course/);
assert.throws(()=>context.saveAnswer_({...second,questionId:first.questionId,selectedAnswer:first.selectedAnswer}),/already submitted/);
const repair=payload();context.saveAnswer_(repair);failSummary=true;
assert.throws(()=>context.saveAnswer_(payload(repair.sessionId,2)),/Simulated write/);
const before=sheets.get('Answers').rows.length;context.saveAnswer_(payload(repair.sessionId,2));
assert.equal(sheets.get('Answers').rows.length,before);assert.equal(context.getTeacherResults(token,{}).total,2,'Retry repairs missing summary');
const formula=payload(undefined,1,true,'=IMPORTXML("bad")');context.saveAnswer_(formula);context.saveAnswer_(payload(formula.sessionId,2,true,formula.studentName));
assert(sheets.get('Answers').rows.some(row=>row[3]==='\u200b'+formula.studentName));
for(const topic of ['algebra','circulatory-system','breathing-system']){
 const one=payload(undefined,1,true,'Topic Test',topic);context.saveAnswer_(one);context.saveAnswer_(payload(one.sessionId,2,true,'Topic Test',topic));
 assert.equal(context.getTeacherResults(token,{topic}).total,1);
}
for(let i=0;i<51;i++){const one=payload(undefined,1,true,'Pagination Test');context.saveAnswer_(one);context.saveAnswer_(payload(one.sessionId,2,true,'Pagination Test'));}
// Test pagination using all records; test name filter separately.
result=context.getTeacherResults(token,{offset:50});assert.equal(result.total,57);assert.equal(result.rows.length,7);
assert.equal(context.getTeacherResults(token,{course:'Year 7 Maths'}).total,1);
assert.equal(context.getTeacherResults(token,{search:'Topic Test'}).total,3);
assert.equal(context.getTeacherResults(token,{teacher:'ms rivera'}).total,57);
assert.equal(context.getTeacherResults(token,{teacher:'Other teacher'}).total,0);
assert.equal(context.getTeacherResults(token,{view:'answers',teacher:'MS RIVERA'}).total,114);
assert.equal(sheets.get('Answers').rows[1][19],'Ms Rivera');assert.equal(sheets.get('Sessions').rows[1][12],'Ms Rivera');
// A queued pre-upgrade answer must still be accepted without inventing a teacher.
const legacy={...payload(),version:1,classroom:''};delete legacy.teacherName;
context.saveAnswer_(legacy);context.saveAnswer_({...legacy,...payload(legacy.sessionId,2),version:1,classroom:'',teacherName:undefined});
assert.equal(context.getTeacherResults(token,{}).total,58);
// Recover a completed historical test that has answer rows but no Sessions row.
const summary=sheets.get('Sessions');summary.rows=summary.rows.filter((row,index)=>index===0||row[0]!==first.sessionId);
assert.equal(summary.rows.length,58);assert.equal(context.getTeacherResults(token,{}).total,58);
assert.equal(summary.rows.filter(row=>row[0]===first.sessionId).length,1,'Opening the dashboard repairs the missing summary once');
assert.equal(context.getTeacherResults(token,{view:'sessions'}).accuracy>0,true);
// New practice/retry posts are ignored and never append rows, even from older clients.
const answerCount=sheets.get('Answers').rows.length,sessionCount=summary.rows.length;
assert.equal(context.saveAnswer_({...payload(),mode:'practice'}),false);
assert.equal(context.saveAnswer_({...payload(),retry:true}),false);
assert.equal(sheets.get('Answers').rows.length,answerCount);assert.equal(summary.rows.length,sessionCount);
// Preserve existing practice history but exclude it from every dashboard view.
const historicalPractice=[...sheets.get('Answers').rows[1]];historicalPractice[0]='old-practice';historicalPractice[2]='old-practice-session';historicalPractice[7]='practice';sheets.get('Answers').appendRow(historicalPractice);
const oldPracticeSummary=[...summary.rows[1]];oldPracticeSummary[0]='old-practice-session';oldPracticeSummary[6]='practice';summary.appendRow(oldPracticeSummary);
assert.equal(context.getTeacherResults(token,{}).total,58);assert.equal(context.getTeacherResults(token,{view:'answers'}).total,116);
historicalPractice[19]='Practice-only teacher';oldPracticeSummary[12]='Practice-only teacher';
sheets.get('Answers').rows.at(-1)[19]='Practice-only teacher';summary.rows.at(-1)[12]='Practice-only teacher';
context.saveAnswer_({...payload(),teacherName:'Ms Rivera-Smith'});
context.saveAnswer_({...payload(),teacherName:'ms rivera'});
assert.deepEqual(Array.from(context.getTeacherResults(token,{}).teachers),['Ms Rivera','Ms Rivera-Smith'],'Teacher options include partial tests and deduplicate case variants');
assert.deepEqual(Array.from(context.getTeacherResults(token,{search:'No matching pupil',offset:50}).teachers),['Ms Rivera','Ms Rivera-Smith'],'Teacher options are independent of pagination and other filters');
assert.equal(context.getTeacherResults(token,{view:'answers',teacher:'Ms Rivera-Smith'}).total,1);
assert.equal(context.getTeacherResults(token,{view:'answers',teacher:'Ms Rivera'}).total,115,'Selecting Rivera does not match Rivera-Smith');
const nonce=crypto.randomUUID();
const receipt=context.doPost({parameter:{nonce,payload:JSON.stringify(first)}}).html;
assert(receipt.includes('"ok":true'));assert(!receipt.includes(first.studentName));assert(receipt.includes('https://asielhm.github.io'));
assert(context.doPost({parameter:{nonce,payload:'invalid'}}).html.includes('"ok":false'));
assert(context.doPost({parameter:{nonce,payload:JSON.stringify({...payload(),mode:'practice'})}}).html.includes('"ignored":true'));
context.logoutTeacher(token);assert.throws(()=>context.getTeacherResults(token,{}),/expired/);
const nextToken=context.loginTeacher(password).token;context.resetTeacherPassword();assert.throws(()=>context.getTeacherResults(nextToken,{}),/expired/);
for(let i=0;i<20;i++)assert.throws(()=>context.loginTeacher('wrong'),/failed/);
assert.throws(()=>context.loginTeacher('wrong'),/Too many/);clock+=301;
assert.throws(()=>context.loginTeacher('wrong'),/failed/);
const source=fs.readFileSync(path.join(root,'google-apps-script/Code.gs'),'utf8');
const publicFunctions=[...source.matchAll(/^function (\w+)\(/gm)].map(match=>match[1]).filter(name=>!name.endsWith('_')).sort();
assert.deepEqual(publicFunctions,['doGet','doPost','getTeacherResults','loginTeacher','logoutTeacher','resetTeacherPassword','setupLearningLab']);
assert.equal(context.doGet().name,'Dashboard');
assert.equal(context.doGet().favicon,'https://asielhm.github.io/learning-lab/assets/brand/learning-lab-logo.png');
console.log('Google records server: all four banks, protected reads, password rotation/logout/rate limit, authoritative scoring, partial quizzes, idempotent writes, summary repair, formula escaping and filtered pagination passed.');
