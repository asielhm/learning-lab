import assert from 'node:assert/strict';
import {laws,pictures,words,accepts,normalise,shuffled} from '../activities/y9/science/gas-laws/games/data.mjs';
assert.deepEqual(pictures.map(c=>c.law),['boyle','charles','pressure','boyle','pressure','charles','boyle','pressure','charles']);assert.deepEqual(laws.boyle.quantities,['P','V']);assert.deepEqual(laws.charles.quantities,['V','T']);assert.deepEqual(laws.pressure.quantities,['P','T']);assert.equal(pictures.length,9);assert.equal(new Set(pictures.map(c=>c.cell)).size,9);assert.deepEqual(pictures.map(c=>c.cell),[0,1,2,3,4,5,6,7,8]);
for(const [key,law]of Object.entries(laws)){assert.equal(pictures.filter(c=>c.law===key).length,3);assert.equal(new Set(law.quantities).size,2);assert(law.constant);}
for(const c of pictures){assert(c.story.length>50&&c.condition.length>40&&c.limit.length>80);assert(laws[c.law]);assert(!c.story.includes(laws[c.law].name));}
assert.match(pictures.find(c=>c.id==='hot-air-balloon').limit,/open/);assert.match(pictures.find(c=>c.id==='pressure-cooker').condition,/vapour/);assert.match(pictures.find(c=>c.id==='aerosol').limit,/Never heat/);
assert.equal(words.length,30);assert.equal(new Set(words.map(w=>w.id)).size,30);assert.equal(new Set(words.map(w=>w.clue)).size,30);
for(const c of words){assert(accepts(c,c.answer));assert(accepts(c,'  '+c.answer.toUpperCase()+'  '));assert(c.clue.trim()&&c.explanation.trim());for(const alias of c.aliases)assert(accepts(c,alias));for(const [wrong,why]of c.mixups){assert(!accepts(c,wrong),c.id+' accepts a mix-up: '+wrong);assert(why.trim());}assert(!accepts(c,''));}
assert(accepts(words.find(c=>c.id==='boyle'),"Boyle's law"));assert(accepts(words.find(c=>c.id==='pressure-law'),'Amontons'));assert.equal(normalise('Gay–Lussac’s law'),normalise("Gay-Lussac's law"));
const before=JSON.stringify(pictures),deck=shuffled(pictures);assert.equal(new Set(deck.map(c=>c.id)).size,9);assert.equal(JSON.stringify(pictures),before);
console.log('Gas games data: all nine original scenarios, balanced laws and quantities, real-world caveats, 30 unique clues, accepted spellings and rejected mix-ups passed.');
