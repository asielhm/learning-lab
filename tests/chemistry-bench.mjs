import assert from 'node:assert/strict';
import {acids} from '../assets/y10-chemistry/acids.js';
import {metals} from '../assets/y10-chemistry/metals.js';
import {redox} from '../assets/y10-chemistry/redox.js';
import {organic} from '../assets/y10-chemistry/organic.js';
import {planFor} from '../assets/y10-chemistry/bench-plans.js';
import {sceneFor} from '../assets/y10-chemistry/bench-scenes.js';
let scenes=0,actions=0;
for(const d of [...acids,...metals,...redox,...organic]){
 const defaults=Object.fromEntries(d.controls.map(c=>[c.id,c.value]));
 const variants=[defaults,...d.controls.flatMap(c=>(c.options?c.options.map(o=>o[0]):[c.min,c.max]).map(value=>({...defaults,[c.id]:value})))];
 actions+=planFor(d.id,defaults).length;
 for(const values of variants){
  const plan=planFor(d.id,values);assert.equal(new Set(plan.map(a=>a.id)).size,plan.length,d.id);let phase=0;
  for(let step=0;step<=plan.length;step++){
   const state={values,phase,benchStep:step,extra:{delivered:20},elapsed:values.time||0};
   const markup=sceneFor(d,state,plan,d.model(values,phase,state.extra));
   assert(markup.startsWith('<svg'));assert(!/\b(?:NaN|Infinity|undefined)\b/.test(markup),d.id+' '+step);
   assert(markup.includes('id="reaction-fx"'));
   if(step<plan.length){const a=plan[step];assert(a.to.every(Number.isFinite));assert(a.label);if(a.kind==='move'||a.kind==='motion'){assert(a.from.every(Number.isFinite));assert(markup.includes('data-bench-source'));}else assert(markup.includes('data-bench-tap'));phase=Math.max(phase,a.phase||0);}
   scenes++;
  }
 }
}
const water=planFor('water-cell',{}).map(a=>a.id),cell=planFor('electrolytes',{}).map(a=>a.id);
for(const p of[water,cell]){assert(p.indexOf('left-electrode')<p.indexOf('power'));assert(p.indexOf('right-electrode')<p.indexOf('power'));}
for(const id of['indicators','bromine']){const p=planFor(id,{}).map(a=>a.id);assert(p.indexOf('dropper')<p.indexOf('squeeze'));assert(p.indexOf('squeeze')<p.indexOf('swirl'));}
console.log(`Chemistry bench: all 28 experiments, ${actions} ordered actions and ${scenes} input/stage scenes; instrument placement precedes use.`);
