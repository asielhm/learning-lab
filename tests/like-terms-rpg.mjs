import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {LEVELS,QUESTS} from '../assets/like-terms-rpg/data.mjs';
import {parseRpgExpression,checkExpression,checkRpgAnswer,expressionText,mapText} from '../assets/like-terms-rpg/math.mjs';
import {freshAdventure,restoreAdventure,makeWorld,objectsFor,walkable,route,START,levelComplete,totals} from '../assets/like-terms-rpg/model.mjs';

const context=vm.createContext({});
for(const file of ['QuestionBank.gs','Code.gs'])vm.runInContext(fs.readFileSync('google-apps-script/'+file,'utf8'),context);
const game=context.GAME_CATALOG_['like-terms-rpg'];
assert.equal(LEVELS.length,6);assert.equal(QUESTS.length,24);assert.equal(Object.keys(game.rounds).length,24);
assert.equal(new Set(QUESTS.map(q=>q.id)).size,24);
let variants=0;
for(const q of QUESTS){
 assert.equal(q.variants.length,3);
 for(const [i,v]of q.variants.entries()){
  variants++;const answer={variant:i,...(v.type==='choice'?{choice:v.answer}:v.type==='sort'?{placements:Object.fromEntries(v.cards.map(c=>[c.id,c.key]))}:{expression:v.solution})};
  assert(checkRpgAnswer(q,answer),q.id+' '+i);
  assert.equal(context.gameGrade_(game,game.rounds[q.id],{answer,attempts:1,assisted:false,revealed:false}),3);
  assert.equal(context.gameGrade_(game,game.rounds[q.id],{answer,attempts:2,assisted:false,revealed:false}),2);
  assert.equal(context.gameGrade_(game,game.rounds[q.id],{answer,attempts:1,assisted:true,revealed:false}),1);
  assert.equal(context.gameGrade_(game,game.rounds[q.id],{answer:{...answer,usedWorkedSolution:true},attempts:1,assisted:false,revealed:false}),1);
  assert(context.gameAnswerText_(game,game.rounds[q.id],answer).startsWith(v.prompt));
  const wrong=structuredClone(answer);
  if(v.type==='choice')wrong.choice=(v.answer+1)%v.options.length;
  else if(v.type==='sort')wrong.placements[v.cards[0].id]='wrong-family';
  else wrong.expression=v.solution+' + 1';
  assert(!checkRpgAnswer(q,wrong));
  assert.throws(()=>context.gameGrade_(game,game.rounds[q.id],{answer:wrong,attempts:1,assisted:false,revealed:false}),/solution/);
  if(v.terms){
   const expanded=expressionText(v.terms);assert(!checkRpgAnswer(q,{variant:i,expression:expanded}),'Correct but uncollected must not unlock '+q.id);
   assert.throws(()=>context.gameGrade_(game,game.rounds[q.id],{answer:{variant:i,expression:expanded},attempts:1,assisted:false,revealed:false}),/solution/);
   // Family order is mathematically irrelevant; Unicode and caret powers agree.
   const reversed=expressionText(Object.entries(v.expected).reverse().map(([key,n])=>({key,n}))).replaceAll('²','^2').replaceAll('³','^3');
   assert(checkRpgAnswer(q,{variant:i,expression:reversed}));
  }
 }
 for(const variant of [-1,3,NaN,'0','__proto__'])assert(!checkRpgAnswer(q,{variant}));
}
assert.equal(variants,72);
for(const raw of ['','x+x^4','2xy','x/2','x--x','x+-y','x^','x²²','x^02','3.5x','(2x)','x; alert(1)','constructor','9999x','3^2','x = 2','x + +y'])assert.equal(parseRpgExpression(raw),null,raw);
for(const raw of ['0','−x + 2y − 3','3*x^2 + y³','2x + x','0x + 3y','x − x','x^1',' 4 x + 2 y '])assert.equal(JSON.stringify(parseRpgExpression(raw)),JSON.stringify(context.parseRpgTerms_(raw)));
assert(checkExpression('2y + 3x',{'x':3,'y':2}).ok);
assert(!checkExpression('x + 2x + 2y',{'x':3,'y':2}).ok);
assert(!checkExpression('0x',{}).ok);assert(checkExpression('0',{}).ok);
assert.equal(mapText({constant:-3,x:-1}),'−x − 3');

for(let level=0;level<6;level++){
 const map=makeWorld(level),objects=objectsFor(level);assert(walkable(map,objects,...START));
 for(const o of objects){const path=route(map,objects,START,[o.x,o.y],true);assert(Array.isArray(path),o.id+' must be reachable');let prev=START;for(const tile of path){assert(walkable(map,objects,...tile));assert.equal(Math.abs(tile[0]-prev[0])+Math.abs(tile[1]-prev[1]),1);prev=tile;}assert.equal(Math.abs(o.x-prev[0])+Math.abs(o.y-prev[1]),1);}
 assert.equal(route(map,objects,START,[0,0]),null);assert.equal(route(map,objects,START,[-1,5]),null);assert.equal(route(map,objects,START,[8,5]),null);
}
const state=freshAdventure({name:'  Ada  ',gender:'female',outfit:1,skin:2});
assert.equal(state.profile.name,'Ada');assert.equal(state.profile.gender,'female');assert.equal(levelComplete(state),false);
for(const q of LEVELS[0].quests)state.progress[q.id]={solved:true,collected:false,stars:3,attempts:1};
assert.equal(levelComplete(state),false,'Answering is followed by physically collecting each chest');
for(const q of LEVELS[0].quests)state.progress[q.id].collected=true;
assert.equal(levelComplete(state),true);assert.deepEqual(totals(state),{solved:4,treasures:4,stars:12,coins:40,xp:60,relics:1});
const save=restoreAdventure(JSON.parse(JSON.stringify(state)));assert.equal(levelComplete(save),true);assert.equal(save.profile.gender,'female');
assert.equal(restoreAdventure(null),null);assert.equal(restoreAdventure({...state,level:9}),null);assert.equal(restoreAdventure({...state,profile:{name:''}}),null);
state.progress['village-coefficient']={solved:false,collected:true,worked:true,needsFresh:true,workedVariant:2,assisted:true};
const restored=restoreAdventure(state);assert.equal(restored.progress['village-coefficient'].collected,false);assert.equal(restored.progress['village-coefficient'].needsFresh,true);assert.equal(restored.progress['village-coefficient'].workedVariant,2);
state.profile.portrait='https://example.test/remote.png';assert.equal(restoreAdventure(state).profile.portrait,'');
console.log('Runehaven: all 72 authored variants agree with Google grading; simplified-expression parser, wrong/unsafe answers, signs/powers/zero, star caps, six reachable worlds, treasure gates and saved-state recovery passed.');
