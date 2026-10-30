import assert from 'node:assert/strict';
import{CAST_SIZE,resistanceLook,courseGeometry}from '../assets/y9-electricity/resistance-run.mjs';
assert.equal(CAST_SIZE,38);const low=resistanceLook(1,1),highV=resistanceLook(6,1),hard=resistanceLook(6,12);assert(highV.enthusiasm>low.enthusiasm);assert.equal(highV.difficulty,low.difficulty);for(const key of ['pitDepth','stepHeight','ridgeHeight','benchHeight','tentHeight'])assert(hard[key]>highV[key],key);assert(hard.slideTop<highV.slideTop);
for(let i=0;i<=100;i++){const g=courseGeometry(i/100);assert(!/NaN|Infinity/.test(g.route));assert.equal(g.helix.length,49);assert.equal(g.stair.length,15);assert(g.pitY>500&&g.pitY<600);assert(g.benchY>100&&g.benchY<230);assert(g.helix.every(([x,y])=>x>=0&&x<=1140&&y>=0&&y<660));}
console.log('Resistance cartoon: fixed cast, independent voltage enthusiasm, monotonic pit/step/roughness/climb difficulty, finite full-range course geometry and visible bounds passed.');
