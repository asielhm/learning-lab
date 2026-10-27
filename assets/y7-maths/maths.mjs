export const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a;};
export const lcm=(a,b)=>Math.abs(a*b)/gcd(a,b);
export const factors=n=>Array.from({length:n},(_,i)=>i+1).filter(i=>n%i===0);
export function primes(n){const result=[];for(let p=2;p*p<=n;p++)while(n%p===0){result.push(p);n/=p;}if(n>1)result.push(n);return result;}
export function fraction(n,d=1){if(!d)throw new RangeError('A denominator cannot be zero.');const sign=d<0?-1:1,g=gcd(n,d);return {n:sign*n/g,d:Math.abs(d)/g};}
export const fracText=f=>f.d===1?String(f.n):`${f.n}/${f.d}`;
export const add=(a,b)=>fraction(a.n*b.d+b.n*a.d,a.d*b.d);
export const subtract=(a,b)=>fraction(a.n*b.d-b.n*a.d,a.d*b.d);
export const multiply=(a,b)=>fraction(a.n*b.n,a.d*b.d);
export const divide=(a,b)=>fraction(a.n*b.d,a.d*b.n);
export function numericAnswer(text){const match=String(text).trim().replaceAll('−','-').match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:\s*\/\s*([+-]?\d+))?$/);if(!match)return NaN;const denominator=match[2]?Number(match[2]):1;return denominator?Number(match[1])/denominator:NaN;}
export const fmt=(n,d=2)=>Number(n.toFixed(d)).toLocaleString('en-GB',{maximumFractionDigits:d});
export const signed=n=>n<0?`(${n})`:String(n);
