import assert from 'node:assert/strict';
import fs from 'node:fs';import vm from 'node:vm';
import{LEVELS,QUESTS,gameForLevel}from'../assets/electricity-quest/data.mjs';
import{gradeElectricityAnswer,initialLab,checkRpgAnswer}from'../assets/electricity-quest/physics.mjs';
import*as model from'../assets/electricity-quest/model.mjs';
import{SAVE_KEY as algebraKey}from'../assets/like-terms-rpg/model.mjs';
const context=vm.createContext({});for(const f of ['QuestionBank.gs','Code.gs'])vm.runInContext(fs.readFileSync('google-apps-script/'+f,'utf8'),context);
export function correctAnswer(v,index=0){let values={};if(v.kind==='charge')values={transfers:-v.targetNet};if(v.kind==='earth')values={wire:true,grounded:true,settled:true,net:0};if(v.kind==='loop')values={slots:{source:'cell',control:'switch',load:'lamp'},closed:true};if(v.kind==='meter')values={placement:v.meter==='ammeter'?'series':'parallel'};if(v.kind==='calculation')values={value:v.expectedValue,unit:v.unit};if(v.kind==='ohm')values={voltage:v.resistance*v.targetCurrent};if(v.kind==='wire')values=v.targetRatio===.25?{length:1,diameter:2}:{length:v.targetRatio,diameter:1};if(v.kind==='network')values={connection:v.targetConnection,a:v.targetA,b:v.targetB};return{variant:index,...(v.type==='choice'?{choice:v.answer}:v.type==='sort'?{placements:Object.fromEntries(v.cards.map(c=>[c.id,c.key]))}:{values,reason:v.correctReason})};}
assert.equal(LEVELS.length,6);assert.equal(QUESTS.length,24);assert.equal(new Set(QUESTS.map(q=>q.id)).size,24);assert.notEqual(model.SAVE_KEY,algebraKey);
let count=0;for(const q of QUESTS){const game=context.GAME_CATALOG_[gameForLevel(q.levelIndex)],round=game.rounds[q.id];assert(round);for(const[index,v]of q.variants.entries()){
 count++;const a=correctAnswer(v,index);assert(checkRpgAnswer(q,a),q.id);assert(context.gradeElectricityAnswer_(v,a));assert.equal(context.gameGrade_(game,round,{answer:a,attempts:1,assisted:false,revealed:false}),3);assert.equal(context.gameGrade_(game,round,{answer:{...a,usedWorkedSolution:true},attempts:1,assisted:false,revealed:false}),1);assert(context.gameAnswerText_(game,round,a).includes(v.prompt));
 const wrong=structuredClone(a);if(v.type==='choice')wrong.choice=(v.answer+1)%v.options.length;else if(v.type==='sort')wrong.placements[v.cards[0].id]='wrong';else if(v.correctReason!==undefined)wrong.reason=99;else wrong.values.value+=1;
 assert(!gradeElectricityAnswer(v,wrong));assert.throws(()=>context.gameGrade_(game,round,{answer:wrong,attempts:1,assisted:false,revealed:false}),/solution/);
 if(v.type==='lab'){assert(!gradeElectricityAnswer(v,{...a,values:initialLab(v)}),q.id+' must require an action');assert(!gradeElectricityAnswer(v,{...a,values:null}));}
 }
 const map=model.makeWorld(q.levelIndex),objects=model.objectsFor(q.levelIndex);for(const object of objects)assert(model.route(map,objects,model.START,[object.x,object.y],true));
}
assert.equal(count,72);const wire=QUESTS.find(q=>q.id==='ohm-wire').variants;assert(gradeElectricityAnswer(wire[1],{values:{length:1,diameter:2},reason:0}));assert(!gradeElectricityAnswer(wire[1],{values:{length:1,diameter:4},reason:0}));
const ohm=QUESTS.find(q=>q.id==='ohm-supply').variants[0];assert(!gradeElectricityAnswer(ohm,{values:{voltage:Infinity},reason:0}));assert(!gradeElectricityAnswer(ohm,{values:{voltage:'6'},reason:0}));assert(gradeElectricityAnswer(ohm,{values:{voltage:6},reason:0}));
const earth=QUESTS.find(q=>q.id==='spark-earth').variants[0];assert(!gradeElectricityAnswer(earth,{values:{wire:true,grounded:true,settled:false,net:0},reason:0}));assert(!gradeElectricityAnswer(earth,{values:{wire:true,grounded:true,settled:true,net:-3},reason:0}));
const state=model.freshAdventure({name:'Ada',gender:'female',outfit:1,skin:2});for(const q of LEVELS[0].quests)state.progress[q.id]={solved:true,collected:false,stars:3};assert(!model.levelComplete(state));for(const p of Object.values(state.progress))p.collected=true;assert(model.levelComplete(model.restoreAdventure(state)));assert.equal(model.totals(state).coins,40);
console.log('Voltvale: 72 variants, 24 quests, authoritative static/circuit topic mapping, charge conservation, meter connections, complete loops, Ohm/wire/network calculations, units, wrong-answer gates, separate saves and reachable maps passed.');
