import assert from 'node:assert/strict';
import{barometer,geometry,RHO_HG,GRAVITY,REFERENCE_HEIGHT_MM,STANDARD_ATM_PA,QUESTIONS}from'../activities/y9/science/gas-laws/examples/barometer-model.mjs';
const standard=barometer(101.325);assert.equal(standard.pa,101325);assert.equal(standard.atm,1);assert(Math.abs(standard.heightMm-760)<.001);assert(Math.abs(barometer(100).heightMm/standard.heightMm-100/101.325)<1e-12);
const initial=geometry(REFERENCE_HEIGHT_MM);
for(let p=50;p<=110;p+=.25){const s=barometer(p),g=geometry(s.heightMm);assert(Math.abs(RHO_HG*GRAVITY*s.heightMm/1000-p*1000)<1e-8);assert(Math.abs(s.atm*STANDARD_ATM_PA-s.pa)<1e-8);assert(Math.abs((g.reservoirY-g.topY)/g.scale-s.heightMm)<1e-9);assert(g.topY>g.capY&&g.reservoirY<g.tipY);assert(Math.abs(g.topY-initial.topY+20*(g.reservoirY-initial.reservoirY))<1e-8,'Mercury volume conserved with a 20:1 cistern-to-tube area ratio');}
assert(barometer(105).heightMm>standard.heightMm);assert(geometry(barometer(105).heightMm).reservoirY>initial.reservoirY);assert(geometry(barometer(60).heightMm).reservoirY<initial.reservoirY);
for(const bad of[0,49.99,110.01,NaN,Infinity,'101'])assert.throws(()=>barometer(bad));assert.equal(QUESTIONS.length,4);assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,4);for(const q of QUESTIONS)assert(q.options[q.answer]&&q.why.length>80);
console.log('Mercury barometer: standard 760 mm, Pa/kPa/atm, hydrostatic force balance, linearity, surface-relative height, conserved mercury volume, tube bounds and input limits passed.');
