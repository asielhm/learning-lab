import assert from 'node:assert/strict';
import {solution,excessPH,titrationPH,indicator,waterElectrolysis,aluminium,gasFromAcid,displaces} from '../assets/y10-chemistry/science.mjs';
import {acids} from '../assets/y10-chemistry/acids.js';
import {metals} from '../assets/y10-chemistry/metals.js';
import {redox} from '../assets/y10-chemistry/redox.js';
import {organic} from '../assets/y10-chemistry/organic.js';
const near=(actual,expected,tolerance=1e-8)=>assert(Math.abs(actual-expected)<tolerance,`${actual} ≈ ${expected}`);
near(solution(.01,'strong-acid').pH,2);near(solution(.01,'strong-base').pH,12);
assert(solution(.01,'weak-acid').pH>solution(.01,'strong-acid').pH);assert(solution(.01,'weak-base').pH<solution(.01,'strong-base').pH);
assert(solution(.01,'weak-acid').percent<100);near(excessPH(0,.05),7);near(excessPH(.001,.05),1.6989700043,1e-9);near(excessPH(-.001,.05),12.3010299957,1e-9);
near(titrationPH(.08,25,.1,0),2.924075932,1e-8);
for(const[c,ml]of [[.08,20],[.12,30],[.16,40]]){const equivalence=titrationPH(c,25,.1,ml);assert(equivalence>8.2&&equivalence<10);assert(titrationPH(c,25,.1,ml-.1)<8.2);assert(titrationPH(c,25,.1,ml+.1)>10);}
let last=0;for(let n=0;n<=500;n++){const pH=titrationPH(.08,25,.1,n/10);assert(pH>=last);assert(pH>0&&pH<14);last=pH;}
assert.equal(indicator(2,'phenolphthalein').name,'Colourless');assert.equal(indicator(8.7,'phenolphthalein').name,'Faint pink');assert.equal(indicator(11,'phenolphthalein').name,'Deep pink');
const gas=waterElectrolysis(.5,120);near(gas.hydrogen/gas.oxygen,2);near(gas.hydrogen,7.462299839,1e-8);near(waterElectrolysis(1,120).hydrogen,2*gas.hydrogen);
const al=aluminium(100000);near(al.mass/al.carbon,3);assert.equal(gasFromAcid('Cu',1),0);near(gasFromAcid('Mg',1),300);assert(displaces('Zn','Cu'));assert(!displaces('Cu','Zn'));assert(!displaces('Cu','Cu'));
const all={acids,metals,redox,organic};assert.equal(Object.values(all).flat().length,28);
function model(group,id,values={},phase=99,extra={delivered:20}){const d=all[group].find(d=>d.id===id);return d.model({...Object.fromEntries(d.controls.map(c=>[c.id,c.value])),...values},Math.min(phase,d.steps.length),extra);}
assert.deepEqual(model('acids','dilution').row,[60,3,'20','20']);assert.equal(model('acids','neutralisation').readings[0][1],'7');
assert(model('acids','titration').complete);assert(!model('acids','titration',{},99,{delivered:20.1}).complete);
assert.equal(model('acids','crystals').readings[0][1],'MgSO₄·7H₂O');
assert.equal(model('metals','materials',{material:'NaCl'}).readings[1][1],'Does not conduct as a solid');
assert.equal(model('metals','displacement',{metal:'Cu',ion:'Zn'}).readings[0][1],'Not predicted');
assert.equal(model('redox','electrolytes',{cell:'brine'}).row[1],'H₂');assert.equal(model('redox','electrolytes',{cell:'copper-electrodes'}).row[2],'Cu²⁺');
assert.equal(model('organic','hydrocarbons',{family:'alkene',n:4}).row[3],'C4H8');
assert.equal(model('organic','cracking',{n:10,k:2}).equation,'C10H22 → C8H18 + C2H4');
assert.equal(model('organic','condensation',{route:'polyamide',pairs:5}).row[2],9);
let variants=0;
for(const defs of Object.values(all))for(const d of defs){const base=Object.fromEntries(d.controls.map(c=>[c.id,c.value]));
 const inputs=[base,...d.controls.flatMap(c=>(c.type==='range'?[c.min,c.max]:c.options.map(o=>o[0])).map(v=>({...base,[c.id]:v})))];
 for(const values of inputs)for(let phase=0;phase<=d.steps.length;phase++){
  const result=d.model(values,phase,{delivered:20});assert(result.drawing.startsWith('<svg'));assert(!/\b(?:NaN|Infinity|undefined)\b/.test(result.drawing+result.equation+JSON.stringify(result.readings)),d.id);
  assert.equal(result.readings.length,3);assert.equal(result.row.length,d.columns.length,d.id);assert.equal(result.question.options.length,4);assert.equal(new Set(result.question.options).size,4,d.id);assert(result.question.why);variants++;
 }
}
console.log(`Y10 Chemistry: 28 models; titration endpoints/overshoot, weak/strong pH, dilution, gas and Faraday stoichiometry, displacement, molecular formulas and ${variants} control/stage variants passed.`);
