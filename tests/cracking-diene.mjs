import assert from 'node:assert/strict';
import {dieneCracking,validDieneBalance} from '../assets/y10-chemistry/science.mjs';
import {cracking} from '../assets/y10-chemistry/cracking.js';
import {chain} from '../assets/y10-chemistry/drawing.js';
import {planFor} from '../assets/y10-chemistry/bench-plans.js';
import {sceneFor} from '../assets/y10-chemistry/bench-scenes.js';
const atoms=formula=>Object.fromEntries([...formula.matchAll(/([CH])(\d*)/g)].map(([,element,count])=>[element,Number(count||1)]));
let stages=0;
for(const n of[8,10,12])for(const m of[4,5,6]){
 const p=dieneCracking(n,m),feed=atoms(p.feed),a=atoms(p.alkane),b=atoms(p.diene);
 assert.equal(feed.C,a.C+b.C);assert.equal(feed.H,a.H+b.H+2);assert.equal(b.H,2*m-2);
 assert(validDieneBalance(n,m,b.H,1));
 for(const wrongH of[b.H-2,b.H+2,NaN,Infinity,1.5])assert(!validDieneBalance(n,m,wrongH,1));
 for(const wrongCoefficient of[0,2,3,-1,.5,NaN])assert(!validDieneBalance(n,m,b.H,wrongCoefficient));
 const doubleLines=(chain(0,0,m,[1,3]).match(/<line /g)||[]).length;
 assert.equal(doubleLines,(m-1)+2,'Exactly two C=C bonds in one connected carbon skeleton');
 for(const conditions of['both','cold','no-catalyst']){
  const v={pathway:'diene',n,dieneC:m,k:2,conditions},plan=planFor('cracking',v),ids=plan.map(a=>a.id);let phase=0;
  assert(ids.indexOf('trap')<ids.indexOf('flow'));assert(ids.indexOf('syringe')<ids.indexOf('flow'));assert(ids.indexOf('off')<ids.indexOf('test'));assert(ids.indexOf('test')<ids.indexOf('bonds'));
  for(let benchStep=0;benchStep<=plan.length;benchStep++){
   const extra={delivered:0},result=cracking.model(v,phase,extra),drawing=sceneFor(cracking,{values:v,phase,benchStep,extra},plan,result);
   assert(!/\b(?:NaN|Infinity|undefined)\b/.test(drawing));assert.equal(result.row.length,cracking.columns.length);assert.equal(result.question.options.length,4);assert.equal(new Set(result.question.options).size,4);assert(!result.complete);
   if(benchStep===plan.length){assert.equal((drawing.match(/data-diene-double-bond/g)||[]).length,conditions==='both'?2:0);assert.equal(cracking.model(v,3,{balanceVerified:true}).complete,conditions==='both');}
   if(benchStep<plan.length)phase=Math.max(phase,plan[benchStep].phase);stages++;
  }
 }
}
for(const[n,m]of[[4,4],[6,2],[8,7],[10.5,4]])assert.throws(()=>dieneCracking(n,m),RangeError);
const v={pathway:'standard',n:10,k:2,dieneC:4,conditions:'both'};
assert.equal(cracking.model(v,3).equation,'C10H22 → C8H18 + C2H4');assert.equal(planFor('cracking',v).length,3);
assert.equal(cracking.model({...v,pathway:'diene'},3,{balanceVerified:true}).equation,'C10H22 → C6H14 + C4H6 + H2');
console.log(`Diene challenge: 9 balanced feed/product combinations, 2 C=C bonds in one chain, hydrogen coefficients, invalid balances, staged collection/test order and ${stages} condition/stage scenes passed.`);
