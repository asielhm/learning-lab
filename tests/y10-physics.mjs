import assert from 'node:assert/strict';
import * as S from '../assets/y10-physics/science.mjs';
import {units,experiments,defaults} from '../assets/y10-physics/experiments.mjs';
import {scene,moving} from '../assets/y10-physics/scenes.mjs';
const near=(a,b,tol=1e-8)=>assert(Math.abs(a-b)<tol,`${a} ≈ ${b}`);
near(S.circuit(6,10,20).current,.2);near(S.circuit(6,10,20,'parallel').current,.9);near(S.circuit(6,10,20,'parallel').i1+S.circuit(6,10,20,'parallel').i2,.9);near(S.circuit(6,10,20,'single').current,.6);near(S.circuit(6,10,20,'single',false).current,0);
near(S.coulomb(2,3,.5).force/4,S.coulomb(2,3,1).force);assert.equal(S.coulomb(-2,3,.5).type,'Attraction');near(S.coulomb(0,3,.5).force,0);
assert(S.electricalSafety('earth','rcd').trip);assert(!S.electricalSafety('overload','rcd').trip);assert(S.electricalSafety('overload','breaker').trip);assert(!S.electricalSafety('earth','breaker').trip);near(S.energyUse(2000,3,.3).cost,1.8);
near(S.wave(2,3).speed,6);near(S.sound(600,340,85,20).echo,.5);assert(S.sound(600,340,85,20).approach>600);assert(S.sound(600,340,85,20).recede<600);
near(S.refraction(1,1.5,30).angle,19.47122063449069);assert(S.refraction(1.5,1,50).tir);near(S.refraction(1.5,1,0).angle,0);assert(!S.refraction(1,1.5,80).tir);near(S.lens(10,30).v,15);near(S.lens(-10,30).v,-7.5);assert.equal(S.lens(10,10).v,null);assert(S.lens(10,5).v<0);
near(S.heatCapacity(.5,4200,10).energy,21000);near(S.heating(.2,500,84*.2).temperature,0);const during=S.heating(.2,500,.2*(42000+167000)/500);near(during.temperature,0);near(during.fraction,.5);near(S.equilibrium(.2,80,.3,20).temperature,44);near(S.equilibrium(.2,80,.3,20).transfer,.3*4200*(44-20));
near(S.motion(4,-2,4).x,0);near(S.motion(4,-2,4).distance,8);near(S.fall(20,9.81,20).y,0);near(S.projectile(20,45).range,400/9.81);near(S.projectile(20,30).range,S.projectile(20,60).range);near(S.stopping(20,.7,5).total,54);
near(S.horizontal(2,4,.3).a,0);near(S.horizontal(2,4,.3).friction,-4);assert(S.horizontal(2,10,.3).a>0);near(S.incline(2,5,.8).a,0);near(S.incline(2,30,0).a,4.905);near(S.connected(3,1,0).a,9.81/4);near(S.connected(3,1,0).tension,9.81*3/4);near(S.connected(5,.5,.5).a,0);
for(const [xA,vA,xB,vB,delay,expected] of [[20,3,0,5,2,15],[0,3,0,5,4,10],[30,3,0,6,0,10],[0,6,40,3,0,40/3],[20,6,0,4,2,null],[20,4,0,4,2,null]]){const m=S.catchUp(xA,vA,xB,vB,delay);if(expected===null)assert.equal(m.time,null);else{near(m.time,expected);near(xA+vA*m.time,xB+vB*(m.time-delay));assert(m.time>=delay);}}
assert(S.catchUp(0,4,0,4,0).coincident);assert.equal(S.catchUp(0,3,0,5,2).time,5);
// Every offered control boundary, option and stage must produce finite graph/readings and valid SVG.
assert.equal(units.length,6);assert.equal(experiments.length,25);let count=0;
for(const d of experiments){const base=defaults(d),variants=[base,...d.controls.flatMap(c=>(c.options?c.options.map(o=>o[0]):[c.min,c.max]).map(v=>({...base,[c.id]:v})))];for(const v of variants)for(const t of [0,d.duration/2,d.duration]){const m=d.model(v,t);assert.equal(m.readings.length,3);assert.equal(m.question.options.length,4);assert.equal(new Set(m.question.options).size,4);assert(m.question.why);for(const points of [m.plot.points,m.plot.second||[]])for(const pair of points)assert(pair.every(Number.isFinite),d.id);for(let step=0;step<=3;step++){const markup=scene(d,v,step,m)+moving(d,v,step,m,t);assert(!/\b(?:NaN|undefined|Infinity)\b/.test(markup),d.id);assert(markup.startsWith('<svg'));count++;}}}
console.log(`Y10 Physics: 25 investigations and ${count} control/time/stage combinations; circuits, forces, optical signs, thermal conservation, trajectories and delayed-start meeting invariants passed.`);
