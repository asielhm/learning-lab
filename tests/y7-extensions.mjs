import assert from 'node:assert/strict';
import {statistics,frequencyData,pieAngles} from '../assets/y7-maths/statistics.mjs';
import {EQUATIONS,initialEquation,equationSolution,nextEquationStep,transformEquation} from '../assets/y7-maths/equations.mjs';
import {fraction} from '../assets/y7-maths/maths.mjs';
assert.deepEqual(statistics([2,4,4,5,7,8,10]),{n:7,sum:40,sorted:[2,4,4,5,7,8,10],mean:40/7,median:5,modes:[4],range:8,q1:4,q3:8});
assert.deepEqual(statistics([1,2,3,4,6,7,8,9]).q1,2.5);assert.deepEqual(statistics([1,2,3,4,6,7,8,9]).q3,7.5);assert.deepEqual(statistics([1,2,3]).modes,[]);assert.deepEqual(statistics([2,2,4,4,5]).modes,[2,4]);assert.equal(statistics([]).mean,null);assert.equal(statistics([5,5,5,5]).range,0);assert.equal(statistics(frequencyData([0,1,2,3],[1,2,4,1])).median,2);assert.deepEqual(pieAngles([4,3,2,3]),[120,90,60,90]);assert.throws(()=>frequencyData([1],[.5]));
for(const p of EQUATIONS){let state=initialEquation(p);assert.deepEqual(equationSolution(state),fraction(p.answer));for(let i=0;i<5;i++){const step=nextEquationStep(state);if(!step)break;state=transformEquation(state,step.kind,step.amount);assert.deepEqual(equationSolution(state),fraction(p.answer));}assert.equal(nextEquationStep(state),null);assert.deepEqual(state.a,fraction(1));assert.deepEqual(state.d,fraction(p.answer));const shifted=transformEquation(initialEquation(p),'constant',fraction(-7,2));assert.deepEqual(equationSolution(shifted),fraction(p.answer));}
assert.throws(()=>transformEquation(initialEquation(EQUATIONS[0]),'divide',fraction(0)));
console.log('Y7 extensions: exact equation invariants and step hints, negative solutions, list/frequency statistics, no/multiple modes, stated quartiles and pie shares passed.');
