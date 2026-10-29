import {fraction,add,subtract,multiply,divide,fracText} from './maths.mjs';
const F=n=>typeof n==='number'?fraction(n):n;
export const EQUATIONS=[
 {id:'one',label:'One step · natural numbers',a:1,b:5,c:0,d:12,opening:'x + 5 = 12',answer:7},
 {id:'two',label:'Two steps · natural numbers',a:3,b:-4,c:0,d:17,opening:'3x − 4 = 17',answer:7},
 {id:'three',label:'Three steps · a bracket',a:2,b:-2,c:0,d:18,opening:'2(x − 3) + 4 = 18',answer:10,brackets:true},
 {id:'negative',label:'Two steps · integer answer',a:2,b:7,c:0,d:-3,opening:'2x + 7 = −3',answer:-5},
 {id:'both',label:'x on both sides',a:4,b:5,c:2,d:19,opening:'4x + 5 = 2x + 19',answer:7},
 {id:'brackets-both',label:'Challenge · brackets and x on both sides',a:3,b:-6,c:1,d:8,opening:'3(x − 2) = x + 8',answer:7,brackets:true},
 {id:'three-both',label:'Challenge · expand, collect and solve',a:3,b:2,c:2,d:7,opening:'3(x + 2) − 4 = 2x + 7',answer:5,brackets:true}
];
export const initialEquation=p=>({a:F(p.a),b:F(p.b),c:F(p.c),d:F(p.d),expanded:!p.brackets});
export function equationSolution(s){return divide(subtract(s.d,s.b),subtract(s.a,s.c));}
export function transformEquation(s,kind,amount){const n=F(amount);if(!Number.isFinite(n.n)||!Number.isFinite(n.d))throw Error('Choose a finite number.');const t={...s,expanded:true};if(kind==='constant'){t.b=add(s.b,n);t.d=add(s.d,n);}else if(kind==='variable'){t.a=add(s.a,n);t.c=add(s.c,n);}else if(kind==='divide'){if(!n.n)throw Error('You cannot divide by zero.');for(const k of ['a','b','c','d'])t[k]=divide(s[k],n);}else if(kind==='expand')t.expanded=true;else throw Error('Unknown operation.');if(['a','b','c','d'].some(k=>Math.abs(t[k].n)>1e6||t[k].d>1e6))throw Error('Use smaller values or undo a step to keep the equation readable.');return t;}
export function equationSide(a,b){let x=a.n===0?'':a.n===a.d?'x':a.n===-a.d?'−x':`${a.d===1?fracText(a):"("+fracText(a)+")"}x`;if(b.n)x+=(x?(b.n<0?' − ':' + '):b.n<0?'−':'')+fracText({n:Math.abs(b.n),d:b.d});return x||'0';}
export const equationText=s=>`${equationSide(s.a,s.b)} = ${equationSide(s.c,s.d)}`;
export function nextEquationStep(s){if(!s.expanded)return {kind:'expand',amount:0,label:'Expand the bracket: multiply every term inside by the outside factor.'};if(s.c.n)return {kind:'variable',amount:{n:-s.c.n,d:s.c.d},label:`Add ${fracText({n:-s.c.n,d:s.c.d})}x to BOTH sides to collect the variable terms on the left.`};if(s.b.n)return {kind:'constant',amount:{n:-s.b.n,d:s.b.d},label:`Add ${fracText({n:-s.b.n,d:s.b.d})} to BOTH sides to remove the constant from the left.`};if(s.a.n!==s.a.d)return {kind:'divide',amount:s.a,label:`Divide BOTH sides by ${fracText(s.a)} to leave one x.`};return null;}
