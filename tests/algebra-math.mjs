import assert from 'node:assert/strict';
import {parseExpression,sameExpression,formatExpression,sumTokens,expandBag} from '../activities/y7/maths/algebra/math.mjs';
assert.deepEqual(parseExpression('3x² + 2x + y − x² + 4 − 1'),{'x^2':2,'x^1':2,'y^1':1,'1':3});
assert(sameExpression('3 + y + 2*x + 2x^2',{'x^2':2,'x^1':2,'y^1':1,'1':3}));
assert(!sameExpression('x²',{'x^1':2}));assert(!sameExpression('2x',{'x^1':1,'y^1':1}));
assert(sameExpression('x-x+y-y',{}));assert(sameExpression('0',{}));
assert.equal(formatExpression({'x^1':4,'x^2':3,'x^3':2,'y^1':3,'y^2':2,'z^1':1}),'4x + 3x² + 2x³ + 3y + 2y² + z');
for(const invalid of ['', 'x++y','x+y=3','alert(1)','x^4','2(x+3)','xy','x/2','NaN','Infinity','x;y','globalThis.process'])assert.equal(parseExpression(invalid),null,invalid);
for(const n of [1,2,3,4,5])for(const a of [1,2,3])for(const b of [1,2,3,4])for(const type of ['1','y']){
 const result=expandBag(n,a,b,type);for(const x of [1,2,5,20])for(const y of [1,3,12])assert.equal(result['x^1']*x+(result['y^1']||0)*y+(result['1']||0),n*(a*x+b*(type==='y'?y:1)));
 assert(sameExpression(formatExpression(result),result));
}
assert.deepEqual(sumTokens([{key:'x^1',sign:1},{key:'x^1',sign:1},{key:'y^2',sign:1},{key:'y^2',sign:-1}]),{'x^1':2,'y^2':0});
console.log('Algebra maths: parsing, equivalent orders, powers, cancellation, malformed input and 1,440 bag/substitution combinations passed.');
