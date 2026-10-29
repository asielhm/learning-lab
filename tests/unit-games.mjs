import assert from 'node:assert/strict';
import {units} from '../assets/unit-games/data.mjs';
import {initialWorkshop,result,expressionValue} from '../assets/unit-games/models.mjs';
assert.equal(units.length,16);assert.equal(new Set(units.map(u=>u.id)).size,16);
assert.deepEqual(Object.fromEntries(['maths','physics','chemistry'].map(s=>[s,units.filter(u=>u.subject===s).length])),{maths:6,physics:6,chemistry:4});
for(const u of units){assert.equal(u.classic.rounds.length,3);assert.equal(u.workshop.rounds.length,3);for(const r of u.classic.rounds){assert(r.prompt&&r.explanation);assert(r.cards.length>=4);assert.equal(new Set(r.cards.map(c=>c.label)).size,r.cards.length);assert.equal(new Set(r.bins.map(b=>b.label)).size,r.bins.length);for(const c of r.cards)assert(r.bins.some(b=>b.id===c.bin));if(r.kind!=='sort')assert.equal(new Set(r.cards.map(c=>c.bin)).size,r.bins.length);}
 for(const r of u.workshop.rounds){assert(r.hint&&r.why);assert(!result(u.workshop.kind,r.params,initialWorkshop(u.workshop.kind)).ok,`${u.id}: unsolved initial model`);let s=structuredClone(r.solution);if(u.workshop.kind==='expression'){const used=new Set();s={tokens:r.solution.map(value=>{if(!/^\d+$/.test(value))return {type:'op',value};const index=r.params.tiles.findIndex((n,i)=>!used.has(i)&&String(n)===value);assert(index>=0);used.add(index);return {type:'number',value,index};})};}assert(result(u.workshop.kind,r.params,s).ok,`${u.id}: advertised solution does not work`);}
}
assert.equal(expressionValue(['6','÷','(','1','−','3','÷','4',')']).value,24);assert.equal(expressionValue(['3','+','4','×','2']).value,11);assert.equal(expressionValue(['(','3','+','4',')','×','2']).value,14);for(const t of [[],['1','÷','0'],['(','2','+','3'],['2','3'],['globalThis'],['2','+'],['1','e309']])assert(!expressionValue(t).valid);
assert(!result('expression',{tiles:[1,5,5,5]},{tokens:[{type:'number',value:'24',index:0}]}).ok);
assert(result('rectangle',{area:12,perimeter:14},{width:3,height:4}).ok);assert(!result('rectangle',{area:12,perimeter:14},{width:6,height:2}).ok);
assert.equal(result('rover',{start:-2,target:2,moves:[-6,-3,2,5]},{moves:[2,-3,5]}).end,2);
assert(!result('coordinates',{x:4,y:3},{x:3,y:4}).ok);assert.deepEqual(result('bags',{target:[6,3,3]},{bags:3,x:2,y:1,loose:1}).coefficients,[6,3,3]);
assert(!result('circuit',{voltage:6,target:.5},{resistance:12,meter:'parallel'}).ok);assert.equal(result('circuit',{voltage:6,target:.5},{resistance:12,meter:'series'}).power,3);
assert.equal(result('wave',{speed:12,lambda:3,amplitude:4},{frequency:4,amplitude:4}).wavelength,3);
for(const [object,image,mag]of [[30,15,.5],[20,20,1],[15,30,2]]){const r=result('lens',{f:10,magnification:mag},{object,screen:image});assert.equal(r.image,image);assert.equal(r.m,-mag);assert(r.ok);}assert(!result('lens',{f:10,magnification:1},{object:5,screen:10}).ok);assert.equal(result('lens',{f:10,magnification:1},{object:10,screen:10}).image,null);
assert.equal(result('heat',{mass:.5,start:20,target:40},{energy:42,insulation:'insulated'}).temperature,40);assert.equal(result('heat',{mass:.5,start:20,target:40},{energy:42,insulation:'leaky'}).temperature,36);const boiling=result('heat',{mass:.1,start:20,target:70},{energy:60,insulation:'insulated'});assert.equal(boiling.temperature,100);assert(boiling.vaporised>0&&boiling.vaporised<1);
assert.deepEqual(result('catchup',{a:10,va:2,flag:30},{speed:5,delay:4}).meeting,{time:10,x:30});assert(!result('catchup',{a:10,va:2,flag:30},{speed:2,delay:0}).meeting);assert(!result('catchup',{a:0,va:2,flag:40},{speed:4,delay:0}).ok);
assert.equal(result('forces',{mass:5,friction:10,target:-2},{left:10,right:10}).a,-2);
for(const[volume,ph]of[[0,1],[20,7]])assert(Math.abs(result('titration',{acidVolume:20,acidM:.1,baseM:.1},{volume}).ph-ph)<1e-9);assert(result('titration',{acidVolume:20,acidM:.1,baseM:.1},{volume:25}).ph>12);
assert(!result('displacement',{target:'Cu'},{metal:'Mg',solution:'Cu'}).ok);assert(result('displacement',{target:'Cu'},{metal:'Fe',solution:'Cu'}).ok);assert(!result('displacement',{target:'Zn'},{metal:'Cu',solution:'Zn'}).reacts);
assert(!result('electrons',{ion:'Pb',charge:2,anion:'bromine'},{electrons:2,polarity:'positive',gas:'bromine'}).ok);
assert.equal(result('molecule',{carbon:4,hydrogen:6,doubles:2},{carbons:4,bonds:[2,1,2]}).hydrogen,6);assert(!result('molecule',{carbon:4,hydrogen:6,doubles:2},{carbons:4,bonds:[2,3,1]}).valid);
console.log('16 units / 32 games / 96 rounds: all proposed solutions, card destinations, unique matches, arithmetic parsing and independent physical/chemical invariants passed.');
