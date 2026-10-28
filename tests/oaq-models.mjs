import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as M from '../assets/oaq/models.mjs';
import {experiments,forUnit} from '../assets/oaq/experiments.mjs';
const course=JSON.parse(fs.readFileSync('assets/oaq/course.json'));
const near=(a,b,t=1e-8)=>assert(Math.abs(a-b)<t,`${a} != ${b}`);
assert.deepEqual(course.levels.map(l=>l.id),['nivel-inicial','nivel-1','nivel-2']);assert.equal(course.units.length,12);
const prompts=new Set();
for(const u of course.units){assert.equal(u.lessons.length,4);assert.equal(u.review.length,4);assert(u.topics.length>=3);assert(fs.existsSync('activities/oaq/'+u.path+'index.html'));for(const l of u.lessons){assert(l.text.length>=2&&l.text.every(t=>t.length>100));assert(l.example.length>=3);assert(l.task.length>40);assert(l.memory.cue&&l.memory.reason.length>80);assert(l.trap.length>40);}for(const q of [...u.lessons.map(l=>l.check),...u.review]){assert(!prompts.has(q.prompt),'Duplicate question: '+q.prompt);prompts.add(q.prompt);assert(q.options.length===3&&new Set(q.options).size===3);assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<3);assert(q.explanation.trim());assert(q.area>=0&&q.area<4);}for(const id of forUnit(u)){assert(experiments[id]);assert(experiments[id].assumptions.length>80);assert(experiments[id].steps.length>=2);}}
assert.equal(prompts.size,96);assert.equal(Object.keys(experiments).length,15);
for(let m=5;m<=20;m++)for(let fraction=10;fraction<=70;fraction+=10){const x=M.separation(m,fraction);near(x.salt+x.sand,m);}
assert(M.balance(2,1,2).ok);assert(M.balance(4,2,4).ok);assert(!M.balance(1,1,1).ok);
for(let v=10;v<=40;v++){near(M.gas(v).pressure*v,2026.5);}
near(M.dilution(20,100).concentration,.02);near(M.dilution(20,100).moles,.002);
for(const mass of[.2,.6,1,2])for(const acid of[5,10,20,40]){const x=M.limiting(mass,acid);assert(x.extent<=x.carbonate+1e-12&&2*x.extent<=x.acid+1e-12);assert(x.excessMass>=-1e-12);near(x.excessMass+100.0869*x.extent,mass);}
const cal=M.calorimetry(50,1);near(cal.heat,2865);near(cal.delta,2865/418);
const electro=M.electrolysis(1,60);near(electro.hydrogen,2*electro.oxygen);near(M.electrolysis(2,60).hydrogen,2*electro.hydrogen);
for(const t of[20,25,50,70])for(const x of[.5,.8,1]){const r=M.raoult(x,t);near(r.pressure/r.pure,x);assert(r.pure>0);}assert(M.raoult(.8,50).pressure>M.raoult(.8,25).pressure);
for(const order of[0,1,2])for(let t=0;t<=30;t++){const k=M.kinetics(.1,t,1,order);near(k.concentration+k.product,1);assert(k.concentration>=0);}
near(M.kinetics(.1,10).concentration,Math.exp(-1));
for(const total of[.1,.2,.4]){const e=M.equilibrium(total);near(e.no2**2/e.n2o4,.1);near(e.n2o4+e.no2/2,total);}const low=M.equilibrium(.1),high=M.equilibrium(.4);assert(high.no2>low.no2);assert(high.no2/(high.no2+high.n2o4)<low.no2/(low.no2+low.n2o4));
near(M.titration(12.5).pH,-Math.log10(1.8e-5),.001);assert(M.titration(25).pH>8&&M.titration(25).pH<9);assert(M.titration(40).pH>12);for(let i=0;i<40;i++)assert(M.titration(i+1).pH>M.titration(i).pH);
assert(!M.precipitation(.000001,.000001).precipitates);const precip=M.precipitation(.01,.01);assert(precip.massMg>0);near(precip.ag*precip.cl,precip.ksp,1e-16);
near(M.cell(.1,.1).voltage,1.1);assert(M.cell(1,.01).voltage<1.1);assert(M.cell(.01,1).voltage>1.1);
assert(M.orbitalValid([[1],[1],[1]],3));assert(M.orbitalValid([[-1],[-1],[-1]],3));assert(M.orbitalValid([[1,-1],[1],[1]],4));assert(!M.orbitalValid([[1,-1],[1],[]],3));assert(!M.orbitalValid([[1],[1],[-1]],3));assert(!M.orbitalValid([[1,1],[1],[1]],4));
const memories=JSON.stringify(course.units.flatMap(u=>u.lessons.map(l=>l.memory)));assert(memories.includes('apantallado'));assert(memories.includes('No es una regla universal para todos los metales'));
console.log('OAQ: 3 levels, 12 units, 48 explanatory memory aids, 96 unique questions, 15 investigations and quantitative conservation/equilibrium/electrochemistry models passed.');
