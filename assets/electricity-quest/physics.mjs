// Self-contained: exported verbatim to Google so final scientific answers are checked there too.
export function gradeElectricityAnswer(v,a){
 if(!v||!a||typeof a!=='object')return false;
 if(v.type==='choice')return Number.isInteger(a.choice)&&a.choice===v.answer;
 if(v.type==='sort')return !!a.placements&&typeof a.placements==='object'&&!Array.isArray(a.placements)&&Object.keys(a.placements).length===v.cards.length&&v.cards.every(c=>a.placements[c.id]===c.key);
 const s=a.values;if(!s||typeof s!=='object'||Array.isArray(s))return false;
 if(v.correctReason!==undefined&&a.reason!==v.correctReason)return false;
 const number=(n,min,max)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
 const integer=(n,min,max)=>number(n,min,max)&&Number.isInteger(n);
 const near=(a,b)=>Math.abs(a-b)<=1e-6;
 if(v.kind==='charge')return integer(s.transfers,0,6)&&-s.transfers===v.targetNet;
 if(v.kind==='earth')return s.wire===true&&s.grounded===true&&s.settled===true&&s.net===0;
 if(v.kind==='loop')return s.slots?.source==='cell'&&s.slots?.control==='switch'&&s.slots?.load==='lamp'&&s.closed===true;
 if(v.kind==='meter')return s.placement===(v.meter==='ammeter'?'series':'parallel');
 if(v.kind==='calculation')return number(s.value,-1e6,1e6)&&near(s.value,v.expectedValue)&&s.unit===v.unit;
 if(v.kind==='ohm')return integer(s.voltage,0,12)&&near(s.voltage/v.resistance,v.targetCurrent);
 if(v.kind==='wire')return integer(s.length,1,4)&&integer(s.diameter,1,3)&&near(s.length/s.diameter**2,v.targetRatio);
 if(v.kind==='network')return s.connection===v.targetConnection&&s.a===v.targetA&&s.b===v.targetB;
 return false;
}
export const checkRpgAnswer=(q,a)=>Number.isInteger(a?.variant)&&a.variant>=0&&gradeElectricityAnswer(q.variants[a.variant],a);
export const initialLab=v=>v.kind==='charge'?{transfers:0}:v.kind==='earth'?{wire:false,grounded:false,settled:false,net:v.initialNet}:v.kind==='loop'?{slots:{},closed:false}:v.kind==='meter'?{placement:''}:v.kind==='calculation'?{value:'',unit:''}:v.kind==='ohm'?{voltage:0}:v.kind==='wire'?{length:1,diameter:1}:v.kind==='network'?{connection:'series',a:false,b:false}:{};
