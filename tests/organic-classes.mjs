import assert from 'node:assert/strict';
import {organic} from '../assets/y10-chemistry/organic.js';
import {organicClassDefinitions} from '../assets/y10-chemistry/organic-classes.mjs';
assert.equal(organicClassDefinitions(organic),organic);
assert.throws(()=>organicClassDefinitions(organic,'unknown'),/Unknown/);
const a=organicClassDefinitions(organic,'alcohols-carboxylic-acids'),b=organicClassDefinitions(organic,'esters-polyesters'),c=organicClassDefinitions(organic,'amines-amides-polyamides');
assert.deepEqual(a.map(d=>d.id),['functional-groups']);assert.deepEqual(b.map(d=>d.id),['condensation']);assert.deepEqual(c.map(d=>d.id),['functional-groups','condensation']);
assert.deepEqual(a[0].controls[0].options.map(o=>o[0]),['ethanol','ethanoic']);assert.deepEqual(b[0].controls[0].options.map(o=>o[0]),['ester','polyester']);assert.deepEqual(c[0].controls[0].options.map(o=>o[0]),['amine','amide']);assert.deepEqual(c[1].controls[0].options.map(o=>o[0]),['polyamide']);
assert.equal(c[1].controls[0].value,'polyamide');assert.equal(organic.find(d=>d.id==='condensation').controls[0].options.length,3,'The general organic lab is unchanged');
for(const defs of[a,b,c])for(const d of defs){const initial=Object.fromEntries(d.controls.map(c=>[c.id,c.value]));for(const control of d.controls)for(const value of control.options?control.options.map(o=>o[0]):[control.min,control.max])for(let phase=0;phase<=d.steps.length;phase++){const result=d.model({...initial,[control.id]:value},phase);assert(!/undefined|NaN|Infinity/.test(JSON.stringify(result)));assert.equal(result.question.options.length,4);assert.equal(new Set(result.question.options).size,4);}}
const ester=b[0].model({route:'ester',pairs:3},3);assert.equal(ester.row[2],1);assert.match(ester.question.options[ester.question.answer],/Ethyl ethanoate and water/);
assert.equal(b[0].controls.find(c=>c.id==='pairs').showIf({route:'ester'}),false);
for(let n=2;n<=5;n++){assert.equal(b[0].model({route:'polyester',pairs:n},3).row[2],2*n-1);assert.equal(c[1].model({route:'polyamide',pairs:n},3).row[2],2*n-1);}
console.log('Organic classes: scoped compounds/routes, independent defaults, parent lab preservation, all stage/control variants, contextual ester question and finite polymer water counts passed.');
