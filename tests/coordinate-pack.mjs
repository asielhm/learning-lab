import assert from 'node:assert/strict';
import {coordinatePackGames,MATCH_POINTS,AXIS_POINTS,PICTURES,validVariablePair,validDefinition,creatorCheck,instruction} from '../assets/unit-games/coordinate-pack.mjs';
assert.deepEqual(coordinatePackGames.map(g=>g.rounds.length),[7,11,2]);assert.equal(new Set(MATCH_POINTS.map(p=>p.join(','))).size,6);
for(const r of coordinatePackGames[0].rounds.filter(r=>r.choices)){const good=r.choices.filter(c=>c.variable).map(c=>c.id),bad=r.choices.find(c=>!c.variable).id;assert(validVariablePair(r,good.slice(0,2)));assert(validVariablePair(r,good.slice(0,2).reverse()));assert(!validVariablePair(r,[good[0],bad]));assert(!validVariablePair(r,[good[0],good[0]]));}
for(const a of ['change','vary','take different values','can change'])assert(validDefinition(a));assert(!validDefinition('always stay the same'));
const letters=Object.keys(AXIS_POINTS),pairs=letters.flatMap((a,i)=>letters.slice(i+1).map(b=>a+b));
for(const axis of ['x','y']){const coordinate=axis==='x'?0:1,expected=pairs.filter(pair=>AXIS_POINTS[pair[0]][coordinate]===AXIS_POINTS[pair[1]][coordinate]);assert.deepEqual(coordinatePackGames[1].rounds.find(r=>r.id==='same-'+axis).answers,expected);}
assert.deepEqual(PICTURES.map(r=>r.segments.map(s=>s.length)),[[6,4,5,5],[11,5]]);
for(const p of PICTURES)for(const segment of p.segments)for(const point of segment)assert(point.every(n=>Number.isInteger(n)&&n>=0&&n<=10));
assert(!creatorCheck([Array(8).fill([1,1])]).valid);assert(creatorCheck([[[1,1],[1,5],[3,7],[5,5],[5,1],[1,1]],[[2,2],[2,3]]]).valid);assert(!creatorCheck([[[11,2],[0,0]]]).valid);assert.equal(instruction([4,2]),'Move 4 across and 2 up.');
console.log('Print-pack games: sensible/reversed variable labels, six exact triples, every shared-coordinate pair including omitted key pairs, both picture stroke lists, creator constraints and bounds passed.');
