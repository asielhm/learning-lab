// Modelos didácticos ideales. Cada laboratorio expone sus hipótesis y unidades.
export const R=8.314462618,F=96485.33212;
export const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export function separation(mass=10,saltPercent=40){const salt=mass*saltPercent/100;return {salt,sand:mass-salt};}
export function balance(h=2,o=1,w=2){const left={H:2*h,O:2*o},right={H:2*w,O:w};return {left,right,ok:left.H===right.H&&left.O===right.O,minimum:h===2&&o===1&&w===2};}
export function gas(volume=20,temperature=298.15){return {pressure:101.325*20/volume*temperature/298.15,volume,temperature};}
export function dilution(aliquot=20,final=100,stock=.1){return {moles:stock*aliquot/1000,concentration:stock*aliquot/final,volume:final};}
export function limiting(mass=1,acidMl=20,acidM=1){const carbonate=mass/100.0869,acid=acidM*acidMl/1000,extent=Math.min(carbonate,acid/2);return {carbonate,acid,extent,gasMl:extent*R*298.15/101.325*1000,excessMass:(carbonate-extent)*100.0869,limiting:carbonate<acid/2?'CaCO₃':carbonate>acid/2?'HCl':'Ambos'};}
export const geometries={CO2:{name:'CO₂',regions:2,bonds:2,lone:0,shape:'Lineal',angle:180},BF3:{name:'BF₃',regions:3,bonds:3,lone:0,shape:'Trigonal plana',angle:120},CH4:{name:'CH₄',regions:4,bonds:4,lone:0,shape:'Tetraédrica',angle:109.5},NH3:{name:'NH₃',regions:4,bonds:3,lone:1,shape:'Piramidal trigonal',angle:107},H2O:{name:'H₂O',regions:4,bonds:2,lone:2,shape:'Angular',angle:104.5}};
export function calorimetry(volume=50,concentration=1){const moles=volume*concentration/1000,heat=moles*57300,mass=2*volume,delta=heat/(mass*4.18);return {moles,heat,delta,temperature:20+delta,mass};}
export function electrolysis(current=1,seconds=60){const charge=current*seconds,electrons=charge/F;return {charge,hydrogen:electrons/2*R*298.15/101.325*1000,oxygen:electrons/4*R*298.15/101.325*1000};}
export function raoult(x=.8,celsius=25){const pure=10**(8.07131-1730.63/(233.426+celsius))*.133322368;return {pure,pressure:x*pure,x,celsius};}
export function kinetics(k=.1,time=10,initial=1,order=1){const concentration=order===0?Math.max(0,initial-k*time):order===1?initial*Math.exp(-k*time):initial/(1+k*initial*time);return {concentration,product:initial-concentration,time};}
// N₂O₄ ⇌ 2 NO₂, concentrations in mol/L; Kc numerical in the declared convention.
export function equilibrium(total=.2,k=.1){const no2=(-k+Math.sqrt(k*k+16*k*total))/4;return {no2,n2o4:total-no2/2,k,total};}
export function weakAcid(c,ka=1.8e-5){return 2*ka*c/(Math.sqrt(ka*ka+4*ka*c)+ka);}
// Charge balance includes water, acid mass balance and added sodium. Ideal at 25°C.
export function titration(ml=0,acidM=.1,acidMl=25,baseM=.1,ka=1.8e-5){const litres=(acidMl+ml)/1000,total=acidM*acidMl/1000/litres,sodium=baseM*ml/1000/litres;let low=-16,high=0;for(let i=0;i<100;i++){const mid=(low+high)/2,h=10**mid,residual=h+sodium-1e-14/h-total*ka/(ka+h);if(residual>0)high=mid;else low=mid;}return {pH:-(low+high)/2,volume:ml,equivalence:acidM*acidMl/baseM};}
export function precipitation(chlorideM=.01,silverM=.01,chlorideMl=10,silverMl=10,ksp=1.8e-10){const v=(chlorideMl+silverMl)/1000,ag=silverM*silverMl/1000/v,cl=chlorideM*chlorideMl/1000/v,q=ag*cl;const extent=q<=ksp?0:2*(q-ksp)/(ag+cl+Math.sqrt((ag-cl)**2+4*ksp));return {q,ksp,ag:ag-extent,cl:cl-extent,massMg:extent*v*143.3212*1000,precipitates:q>ksp};}
export function cell(zinc=.1,copper=.1,celsius=25){const q=zinc/copper,e=1.10-R*(celsius+273.15)/(2*F)*Math.log(q);return {q,voltage:e,deltaG:-2*F*e/1000};}
export function orbitalValid(slots,electrons){if(slots.reduce((a,b)=>a+b.length,0)!==electrons)return false;if(slots.some(s=>s.length>2||(s.length===2&&s[0]===s[1])))return false;const singles=slots.filter(s=>s.length===1).map(s=>s[0]);if(electrons<=3&&slots.some(s=>s.length>1))return false;return singles.every(s=>s===singles[0]);}
