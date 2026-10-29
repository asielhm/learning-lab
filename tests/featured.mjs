import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {featuredCandidates,chooseFeatured} from '../assets/featured.mjs';
const c=JSON.parse(readFileSync(new URL('../catalog.json',import.meta.url))),all=featuredCandidates(c);
assert.equal(all.length,new Set(all.map(x=>x.activity.href)).size);
const represented=new Set(all.map(x=>x.year.id));assert.deepEqual([...represented].sort(),['oaf','oaq','y10','y12','y7','y9']);
for(let i=0;i<all.length;i++){assert.equal(chooseFeatured(c,'',()=> (i+.5)/all.length).activity.href,all[i].activity.href);const chosen=chooseFeatured(c,all[i].activity.href,()=>0);assert.notEqual(chosen.activity.href,all[i].activity.href);}
assert.equal(chooseFeatured({years:[]}),null);
const single={years:[{subjects:[{topics:[{activities:[{href:'one/'}]}]}]}]};assert.equal(chooseFeatured(single,'one/').activity.href,'one/');
const duplicate=structuredClone(single);duplicate.years[0].subjects[0].topics[0].activities.push({href:'one/'});assert.equal(featuredCandidates(duplicate).length,1);
console.log('Homepage feature: every catalogue entry is reachable, all published years/programmes included, no immediate repeats, empty/single/duplicate cases passed.');
