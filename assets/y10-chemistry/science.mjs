export const KW=1e-14,FARADAY=96485;
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const fmt=(n,d=2)=>Number(n.toFixed(d)).toLocaleString('en-GB',{maximumFractionDigits:d});
export function weakDissociation(c,k=1.8e-5){return 2*k*c/(Math.sqrt(k*k+4*k*c)+k);}
export function excessPH(excess,totalLitres){const delta=excess/totalLitres;const h=delta>=0?(delta+Math.sqrt(delta*delta+4*KW))/2:2*KW/(Math.sqrt(delta*delta+4*KW)-delta);return -Math.log10(h);}
export function solution(c,type){const weak=type.startsWith('weak'),base=type.endsWith('base'),ions=weak?weakDissociation(c):c;return {pH:base?14+Math.log10(ions):-Math.log10(ions),ions,percent:ions/c*100};}
export function titrationPH(acidC,acidMl,baseC,baseMl,ka=1.8e-5){
 const na=acidC*acidMl/1000,nb=baseC*baseMl/1000,total=(acidMl+baseMl)/1000;
 if(baseMl===0)return -Math.log10(weakDissociation(acidC,ka));
 if(Math.abs(nb-na)<1e-12){const oh=weakDissociation(na/total,KW/ka);return 14+Math.log10(oh);}
 if(nb>na)return excessPH(na-nb,total);
 // Exact ideal equilibrium for the monoprotic acid, conjugate base and water at 25°C.
 const ct=na/total,sodium=nb/total;
 let low=-16,high=0;
 for(let i=0;i<90;i++){const mid=(low+high)/2,h=10**mid,residual=h+sodium-KW/h-ct*ka/(ka+h);if(residual>0)high=mid;else low=mid;}
 return -(low+high)/2;
}
export function indicator(pH,kind){
 if(kind==='phenolphthalein')return pH<8.2?{colour:'#dceff1',name:'Colourless'}:pH<=10?{colour:'#f4b8d0',name:'Faint pink'}:{colour:'#db4c96',name:'Deep pink'};
 if(kind==='methyl-orange')return pH<3.1?{colour:'#db5755',name:'Red'}:pH>4.4?{colour:'#f4d66e',name:'Yellow'}:{colour:'#ee9d50',name:'Orange'};
 if(kind==='litmus')return pH<5?{colour:'#cf6487',name:'Red'}:pH>8?{colour:'#779ed2',name:'Blue'}:{colour:'#a38ac1',name:'Purple'};
 if(kind==='cabbage'){const colours=[[3,'#db729b','Pink-red'],[5,'#ae7ab3','Purple'],[8,'#888ec3','Violet-blue'],[10,'#68a8aa','Blue-green'],[12,'#a9bd69','Green'],[15,'#dfca63','Yellow-green']];const c=colours.find(c=>pH<c[0]);return {colour:c[1],name:c[2]};}
 const colours=[[3,'#df6b61','Red'],[5,'#e7a062','Orange'],[6.5,'#e4cb62','Yellow'],[7.5,'#77af7c','Green'],[10,'#68b3be','Blue'],[12,'#7c93cc','Indigo'],[15,'#a07ebf','Purple']];const c=colours.find(c=>pH<c[0]);return {colour:c[1],name:c[2]};
}
export function waterElectrolysis(current,seconds){const q=current*seconds;return {q,hydrogen:q/(2*FARADAY)*24000,oxygen:q/(4*FARADAY)*24000};}
export const reactivity={Mg:4,Zn:3,Fe:2,Cu:1};
export const displaces=(metal,ion)=>reactivity[metal]>reactivity[ion];
export function gasFromAcid(material,mass){const masses={Mg:24.3,Zn:65.4,Fe:55.8,CaCO3:100.1};if(material==='Cu')return 0;return Math.min(mass/masses[material],.5*.05/2)*24000;}
export function aluminium(charge){return {mass:charge/(3*FARADAY)*27,carbon:charge/(4*FARADAY)*12};}
export const alkane=n=>`C${n===1?'':n}H${2*n+2}`;
export const alkene=n=>`C${n}H${2*n}`;
