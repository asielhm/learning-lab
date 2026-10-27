import assert from 'node:assert/strict';
import {gcd,lcm,primes,factors,fraction,fracText,add,subtract,multiply,divide,numericAnswer} from '../assets/y7-maths/maths.mjs';
import {modules} from '../assets/y7-maths/modules.js';
assert.equal(gcd(48,60),12);assert.equal(lcm(18,24),72);assert.deepEqual(primes(72),[2,2,2,3,3]);assert.deepEqual(factors(16),[1,2,4,8,16]);
assert.equal(fracText(fraction(6,-8)),'-3/4');assert.equal(fracText(fraction(0,9)),'0');
assert.equal(fracText(add(fraction(1,3),fraction(1,6))),'1/2');
assert.equal(fracText(subtract(fraction(3,4),fraction(1,8))),'5/8');
assert.equal(fracText(multiply(fraction(2,3),fraction(3,5))),'2/5');
assert.equal(fracText(divide(fraction(3,4),fraction(1,2))),'3/2');
assert.throws(()=>fraction(1,0),RangeError);assert.throws(()=>divide(fraction(1,2),fraction(0)),RangeError);
assert.equal(numericAnswer(' -3 / 4 '),-.75);assert.equal(numericAnswer('−2.5'),-2.5);assert(Number.isNaN(numericAnswer('1/0')));assert(Number.isNaN(numericAnswer('1+2')));
function output(unit,id,values={},level='core'){const d=modules[unit].find(d=>d.id===id);return d.compute({...Object.fromEntries(d.controls.map(c=>[c.id,c.value])),...values},level);}
assert.match(output('numbers-i','factors').result,/HCF = 12 · LCM = 72/);
assert.equal(output('numbers-i','order').practice.answer,18);assert.equal(output('numbers-i','order',{},'challenge').practice.answer,27);
assert.equal(output('geometry-i','single-area',{shape:'triangle',b:7,h:3}).practice.answer,10.5);
assert.equal(output('geometry-i','compound',{w:10,h:8,a:4,b:3},'challenge').practice.answer,272);
assert.match(output('geometry-i','compound',{},'challenge').visual,/stroke-dasharray/);
assert.equal(output('geometry-i','polygons',{n:8}).practice.answer,45);
assert.equal(output('geometry-i','constructions',{kind:'angle',stage:4}).practice.answer,37);
assert.equal(output('numbers-ii','sets',{number:'wholefrac'}).practice.answer,'N');
assert.equal(output('numbers-ii','integers',{a:-3,b:-4,op:'subtract'}).practice.answer,1);
assert.equal(output('numbers-ii','integers',{a:4,b:0,op:'divide'}).practice,null);
assert.match(output('numbers-ii','signed-powers',{kind:'outside'}).result,/= -9$/);
assert.equal(output('algebra-i','direct',{k:3,x:4}).practice.answer,18);
assert.equal(output('algebra-i','inverse',{work:24,n:4}).practice.answer,3);
assert.equal(output('algebra-i','coordinates',{x:-4,y:2}).practice.answer,4);
assert.equal(output('numbers-iii','ratio',{groups:'3',a:2,b:3,c:4,unit:6}).practice.answer,2/9);
assert.equal(output('numbers-iii','maps',{scale:'25000',cm:4}).practice.answer,4);
assert.equal(output('numbers-iii','percentages',{},'challenge').practice.answer,54);
assert.equal(output('numbers-iii','fraction-ops',{a:3,b:4,c:1,d:2,op:'divide'}).practice.answer,1.5);
assert.equal(output('numbers-iii','rational-order',{example:'5'}).practice.answer,1);
// Sweep each control's boundaries and choices. Bad extremes must not create broken diagrams or non-finite predictions.
let variants=0;
for(const definitions of Object.values(modules))for(const d of definitions){
 const baseline=Object.fromEntries(d.controls.map(c=>[c.id,c.value]));
 for(const control of d.controls)for(const value of control.type==='range'?[control.min,control.max]:control.options.map(o=>o[0]))for(const level of ['support','core','challenge']){
  const result=d.compute({...baseline,[control.id]:value},level);assert(result.result&&result.explanation&&result.visual&&result.steps.length);assert(!/NaN|Infinity/.test(result.visual+result.result));
  if(typeof result.practice?.answer==='number')assert(Number.isFinite(result.practice.answer));variants++;
 }
}
console.log(`Y7 Maths: exact fractions, signed arithmetic, geometry, proportions, ratio, scale and percentage examples; ${variants} activity/control/level variants passed.`);
