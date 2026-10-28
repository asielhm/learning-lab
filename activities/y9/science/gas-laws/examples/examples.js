import {syringeBalloon} from './gas-models.mjs';
const $ = selector => document.querySelector(selector);
const definitions = {
  syringe: {
    title:'A sealed syringe', law:'BOYLE–MARIOTTE · CONSTANT TEMPERATURE', scene:'Push, pull, observe.',
    intro:'Compress the trapped air with the plunger. How does changing the space inside the syringe affect its pressure?',
    instruction:'Drag the plunger left to compress the air, or use the volume slider. Compare the pressure before and after.',
    label:'Volume of trapped air', min:10, max:40, step:1, initial:20, unit:'mL',
    presets:[[10,'Compress'],[20,'Starting point'],[40,'Expand']],
    constants:'Temperature: 20°C (293.15 K). The cap stays on, so the amount of air is fixed. Move slowly and allow the gas to return to room temperature.',
    equation:'P₁V₁ = P₂V₂', caption:'A capped, needle-free syringe. The black seal and plunger move together; the shaded space is the trapped air.',
    limit:'The syringe is sealed and the plunger is held at the chosen position. The calculation assumes slow compression and thermal equilibrium at 20°C; a quick push would briefly warm the air. Pressure shown is absolute; the small extra volume in the gauge and tubing is neglected. Apparatus dimensions are illustrative. Expanding beyond 20 mL makes the inside pressure lower than the outside atmosphere (101.3 kPa).',
    task:'Start at 20 mL. Predict the pressure at 10 mL, then compress the syringe to investigate.',
    question:'When the volume halves, what happens to the absolute pressure?',
    options:['It doubles to 202.6 kPa.','It halves to 50.7 kPa.','It stays at 101.3 kPa.'], answer:0, target:10,
    explanation:'The same air occupies half the volume at the same temperature. P = 101.3 × 20 ÷ 10 = 202.6 kPa. The product PV stays constant.',
    readings:['Absolute pressure','Air volume','Temperature'], units:['kPa · includes atmospheric pressure','mL · trapped air','°C · held constant'], headers:['V (mL)','P absolute (kPa)','T (K)','PV (kPa·mL)'],
    values:v=>({V:v,P:2026/v,T:293.15}), row:s=>[s.V.toFixed(0),s.P.toFixed(1),s.T.toFixed(2),(s.P*s.V).toFixed(0)]
  },
  'syringe-balloon': {
    title:'A small balloon inside a sealed syringe', law:'BOYLE–MARIOTTE · TWO SEALED AIR SAMPLES', scene:'One plunger. Two air samples.',
    intro:'A small tied balloon is trapped inside a capped syringe. Push or pull the plunger and watch how the surrounding pressure changes its size.',
    instruction:'Drag the plunger or use the chamber-volume slider. Push in: the balloon shrinks. Pull out: the balloon expands. No air crosses the tied balloon.',
    label:'Total chamber volume, including the balloon', min:10, max:40, step:1, initial:20, unit:'mL',
    presets:[[10,'Compress'],[20,'Starting point'],[40,'Expand']],
    constants:'Temperature: 20°C (293.15 K). The syringe cap and balloon knot stay closed. Each air sample keeps its own fixed amount of gas. Initially: 5.00 mL inside the balloon and 15.00 mL around it.',
    equation:'P₁V₁ = P₂V₂ · for each sealed air sample',
    caption:'Coral: air sealed inside the tied balloon. Blue: separate air around it. The slider is the whole chamber volume: balloon + surrounding air. The gauge measures the surrounding absolute pressure.',
    limit:'Ideal gas at 20°C, with slow plunger motion and thermal equilibrium. The membrane is very flexible with negligible tension, so inside and outside balloon pressures are taken as equal. Real latex needs a pressure difference to balance its tension, so measured volumes will differ. Balloon width and height scale with the cube root of its volume. The illustration is schematic, tubing volume is neglected, and there is no leakage or gas exchange between the two samples.',
    task:'Record the starting point at 20 mL. Predict what the balloon will do at 10 mL, then compress. Next pull out to 40 mL and compare its size and pressure with the starting point.',
    question:'Pulling the plunger from 20 mL to 40 mL makes the small sealed balloon…',
    options:['Shrink because the syringe has more space.','Expand from 5.00 mL to 10.00 mL because the surrounding pressure halves.','Fill with extra air that crosses its tied knot.'], answer:1,target:40,
    explanation:'At 40 mL, P = 101.3 × 20 ÷ 40 = 50.65 kPa absolute. The balloon keeps its own gas: V = 101.3 × 5.00 ÷ 50.65 = 10.00 mL. It expands because the surrounding pressure falls, not because air enters it.',
    readings:['Surrounding absolute pressure','Balloon volume','Total chamber volume'], units:['kPa · also inside the ideal balloon','mL · sealed inside the balloon','mL · balloon + surrounding air'],
    headers:['Chamber (mL)','Balloon (mL)','Surrounding air (mL)','P absolute (kPa)','P × V balloon (kPa·mL)','T (K)'],
    values:syringeBalloon, row:s=>[s.V.toFixed(0),s.balloon.toFixed(2),s.outside.toFixed(2),s.P.toFixed(2),(s.P*s.balloon).toFixed(1),s.T.toFixed(2)]
  },
  balloon: {
    title:'A balloon in a changing room', law:'CHARLES · APPROXIMATELY CONSTANT PRESSURE', scene:'A little warmer. A little bigger.',
    intro:'Move a sealed balloon between cooler and warmer conditions. Watch its shape and volume change as the gas reaches the new temperature.',
    instruction:'Cool or warm the room using the temperature slider. Watch the balloon shrink or expand without adding any air.',
    label:'Air temperature at equilibrium', min:0, max:60, step:1, initial:20, unit:'°C',
    presets:[[0,'Cool room'],[20,'Starting point'],[60,'Warm room']],
    constants:'External pressure: 101.3 kPa. The balloon is tied, so the amount of gas is fixed. Treat the membrane as flexible with negligible extra pressure.',
    equation:'V₁/T₁ = V₂/T₂', caption:'The same tied balloon at thermal equilibrium. Its 3D size is scaled with the cube root of volume, so the change in width is subtle.',
    limit:'This cartoon uses Charles’s ideal-gas prediction at constant pressure. A real latex balloon has membrane tension, so the pressure is only approximately constant. The model assumes thermal equilibrium and no leaks; the balloon does not instantly reach room temperature in real life. Volume ratios use Kelvin, never Celsius.',
    task:'Begin at 20°C. Predict what will happen at 60°C, then warm the room to check your prediction.',
    question:'What happens to the 3.00 L balloon when it warms from 20°C to 60°C?',
    options:['It triples to 9.00 L because 60 ÷ 20 = 3.','It expands to about 3.41 L.','It stays at exactly 3.00 L.'], answer:1,target:60,
    explanation:'Use Kelvin: 20°C = 293.15 K and 60°C = 333.15 K. V = 3.00 × 333.15 ÷ 293.15 ≈ 3.41 L. The Celsius temperature triples, but the absolute temperature does not.',
    readings:['Balloon volume','Gas temperature','Absolute pressure'], units:['L · same amount of gas','K · used in the equation','kPa · idealised constant pressure'], headers:['T (°C)','T (K)','V (L)','V/T (L/K)'],
    values:c=>({V:3*(c+273.15)/293.15,P:101.3,T:c+273.15}), row:s=>[(s.T-273.15).toFixed(0),s.T.toFixed(2),s.V.toFixed(2),(s.V/s.T).toFixed(5)]
  },
  tyre: {
    title:'A tyre on a warmer day', law:'GAY-LUSSAC / AMONTONS · APPROXIMATELY CONSTANT VOLUME', scene:'Same tyre. Different pressure.',
    intro:'Change the temperature of the air in a sealed tyre. Follow the needle to see why a pressure gauge reads differently on a warmer day.',
    instruction:'Cool the tyre towards −30°C to watch it flatten. Warm it to 70°C for a cartoon burst, then replace the tyre with Reset to try again.',
    label:'Air temperature at equilibrium', min:-30, max:70, step:1, initial:20, unit:'°C',
    presets:[[-30,'Cold day'],[20,'Starting point'],[60,'Hot tyre'],[70,'Burst demo']],
    constants:'Volume: 25.0 L, treated as fixed. The valve is closed, so the amount of gas is fixed. Outside atmospheric pressure: 101.3 kPa.',
    equation:'P₁/T₁ = P₂/T₂', caption:'Cold flattening and the burst at 70°C are exaggerated teaching effects, not real tyre failure predictions. Before the burst, the readings use the sealed, fixed-volume gas law.',
    limit:'Tyre volume is approximately constant. The starting gauge reading is an illustrative 220 kPa at 20°C, not a recommended inflation pressure. Always use the vehicle manufacturer’s cold-tyre specification. The model holds atmosphere at 101.3 kPa and uses P absolute = P gauge + 101.3. It shows equilibrium gas temperature, not an instant response to weather. Cold squash is exaggerated and is not used to calculate volume. The cartoon burst at 70°C is a chosen animation trigger, not a real failure temperature. After bursting, the tyre vents to atmospheric pressure and the fixed-amount gas law no longer applies; Reset replaces and reinflates it.',
    task:'Begin at 20°C. Predict what will happen at 60°C, then warm the tyre and compare both pressure readings.',
    question:'Why must we add atmospheric pressure before using the gas law with a tyre-gauge reading?',
    options:['Because gas laws use absolute pressure, measured from a vacuum.','Because gauge pressure is already measured from a vacuum.','Because the tyre gains more air when warmed.'], answer:0,target:60,
    explanation:'The gauge reads pressure above the atmosphere. Start with 220 + 101.3 = 321.3 kPa absolute. At 60°C: 321.3 × 333.15 ÷ 293.15 ≈ 365.1 kPa absolute, or 263.8 kPa gauge. No extra air enters.',
    readings:['Gauge pressure','Absolute pressure','Gas temperature'], units:['kPa · above the atmosphere','kPa · measured from a vacuum','K · gas temperature'], headers:['T (°C)','T (K)','P absolute (kPa)','P gauge (kPa)','Tyre condition'],
    values:c=>({V:25,P:321.3*(c+273.15)/293.15,T:c+273.15}), row:s=>[(s.T-273.15).toFixed(0),s.T.toFixed(2),s.P.toFixed(1),(s.P-101.3).toFixed(1),s.burst?'Burst / vented':'Intact / sealed']
  }
};
const key = document.body.dataset.example;
const d = definitions[key];
const syringeMode=key==='syringe'||key==='syringe-balloon';
const syringeGeometry=key==='syringe-balloon'?{origin:110,scale:7.5}:{origin:160,scale:3.75};
let value = d.initial, records = [], observedTarget = false, tyreBurst = false;
function currentValues(){const state=d.values(value);return key==='tyre'?{...state,V:tyreBurst?null:state.V,P:tyreBurst?101.3:state.P,burst:tyreBurst}:state;}
const fixed = (n, digits=1) => n.toFixed(digits);
const commonDefs = `<defs>
  <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#faffff" stop-opacity=".95"/><stop offset=".5" stop-color="#b9e0e7" stop-opacity=".65"/><stop offset="1" stop-color="#eaf9fb"/></linearGradient>
  <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f5fafb"/><stop offset=".5" stop-color="#c0cfd3"/><stop offset="1" stop-color="#839ea7"/></linearGradient>
  <radialGradient id="rubber" cx=".3" cy=".2" r=".9"><stop stop-color="#53636e"/><stop offset=".5" stop-color="#2b3b46"/><stop offset="1" stop-color="#142833"/></radialGradient>
  <radialGradient id="balloonPaint" cx=".3" cy=".23" r=".85"><stop stop-color="#ffa69c"/><stop offset=".45" stop-color="#ed756d"/><stop offset="1" stop-color="#ba4457"/></radialGradient>
  <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="7" stdDeviation="6" flood-color="#244a57" flood-opacity=".14"/></filter>
</defs>`;
function gauge(cx,cy,r,max,label) {
  const ticks = Array.from({length:21},(_,i)=>{
    const a=(-130+i*13)*Math.PI/180, major=i%5===0;
    const x1=Math.sin(a)*(r-12),y1=-Math.cos(a)*(r-12),x2=Math.sin(a)*(r-(major?24:18)),y2=-Math.cos(a)*(r-(major?24:18));
    return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#456471" stroke-width="${major?2.5:1}"/>${major?`<text x="${Math.sin(a)*(r-36)}" y="${-Math.cos(a)*(r-36)+4}" text-anchor="middle" font-size="11">${i*max/20}</text>`:''}`;
  }).join('');
  return `<g transform="translate(${cx} ${cy})"><circle r="${r}" fill="url(#metal)" class="outline" filter="url(#shadow)"/><circle r="${r-7}" fill="#fffdf5" stroke="#637f86" stroke-width="1.5"/>${ticks}<text y="${r*.56}" text-anchor="middle" font-size="10" font-weight="700">${label}</text><text id="dialValue" y="${r*.78}" text-anchor="middle" font-size="15" font-weight="750"></text><g id="needle"><path d="M-4 14L0 -${r-24}L4 14Z" fill="#c44f4a"/><circle r="7" fill="#294e5b"/><circle r="3" fill="#e9f2ef"/></g></g>`;
}
function thermometer() {
  return `<g transform="translate(552 125)"><rect x="-15" y="0" width="30" height="180" rx="15" fill="#fffdf8" class="outline"/><rect id="thermometerFill" x="-6" y="80" width="12" height="90" rx="6" fill="#dc7565"/><circle cy="181" r="23" fill="#fffdf8" class="outline"/><circle cy="181" r="15" fill="#dc7565"/>${[0,1,2,3,4].map(i=>`<path d="M17 ${17+i*34}h10" stroke="#5d7d82" stroke-width="2"/>`).join('')}<text id="thermometerLabel" x="0" y="232" text-anchor="middle" class="svg-readout"></text><text x="0" y="252" text-anchor="middle" class="svg-small">gas temperature</text></g>`;
}
function syringeScene() {
  const ticks=Array.from({length:21},(_,i)=>`<path d="M${160+i*7.5} 195v${i%5===0?22:12}" stroke="#3e6673" stroke-width="1.5"/>${i%5===0?`<text x="${160+i*7.5}" y="234" text-anchor="middle" class="svg-small">${i*2}</text>`:''}`).join('');
  return `${commonDefs}<rect width="680" height="460" fill="#eef5f4"/><circle cx="230" cy="200" r="170" fill="#e2efed"/><path d="M0 382H680V460H0Z" fill="#e0e8e2"/><path d="M0 382H680" stroke="#b8cdca" stroke-width="2"/><ellipse cx="300" cy="366" rx="220" ry="14" fill="#b6cecb" opacity=".45"/>
  <path d="M175 253V308Q175 340 207 340H523Q555 340 555 308V183" fill="none" stroke="#375c68" stroke-width="9"/><path d="M175 253V308Q175 340 207 340H523Q555 340 555 308V183" fill="none" stroke="#78949c" stroke-width="3"/>
  <rect x="141" y="179" width="184" height="96" rx="9" fill="url(#glass)" class="outline"/><rect id="airSpace" x="158" y="185" height="84" width="75" fill="#83c6d7" opacity=".5"/>
  <rect x="110" y="207" width="32" height="40" rx="6" fill="url(#glass)" class="outline"/><rect x="80" y="203" width="35" height="48" rx="9" fill="#ed9b7c" class="outline"/><path d="M88 211v32M96 211v32M104 211v32" stroke="#b66c50" stroke-width="2"/>
  ${ticks}<path d="M150 187H313" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".9"/>
  <rect x="318" y="164" width="15" height="126" rx="6" fill="url(#glass)" class="outline"/>
  <g id="plunger" class="drag-handle" tabindex="0" role="slider" aria-label="Drag syringe plunger to change trapped air volume" aria-valuemin="10" aria-valuemax="40">
    <rect x="4" y="216" width="175" height="22" rx="4" fill="url(#metal)" class="outline"/><rect x="-4" y="185" width="15" height="84" rx="5" fill="#2e505d"/><path d="M0 192v68M6 192v68" stroke="#728e98" stroke-width="2"/>
    <rect x="172" y="183" width="19" height="88" rx="8" fill="#d3e4e6" class="outline"/><path d="M180 199v56" stroke="white" stroke-width="3"/><rect x="155" y="170" width="52" height="115" fill="transparent"/>
  </g><text x="100" y="298" text-anchor="middle" class="svg-label">Sealed cap</text><path d="M100 282v-25" fill="none" stroke="#759394" stroke-width="1.5"/>
  <text id="airLabel" x="205" y="152" text-anchor="middle" class="svg-label"></text><text x="268" y="55" text-anchor="middle" class="svg-label">Same air · slow compression · 20°C</text>
  ${gauge(555,105,78,220,'kPa absolute')}<text x="340" y="426" text-anchor="middle" class="svg-label">← push to compress · pull to expand →</text>`;
}
function syringeBalloonScene() {
  const ticks=Array.from({length:21},(_,i)=>`<path d="M${110+i*15} 182v${i%5===0?17:10}" stroke="#3e6673" stroke-width="1.5"/>${i%5===0?`<text x="${110+i*15}" y="213" text-anchor="middle" class="svg-small">${i*2}</text>`:''}`).join('');
  return `${commonDefs}<rect width="680" height="460" fill="#eef5f4"/><circle cx="230" cy="210" r="165" fill="#e2efed"/><path d="M0 382H680V460H0Z" fill="#e0e8e2"/><path d="M0 382H680" stroke="#b8cdca" stroke-width="2"/><ellipse cx="310" cy="367" rx="240" ry="14" fill="#b6cecb" opacity=".45"/>
    <path d="M125 274V315Q125 340 150 340H525Q555 340 555 315V183" fill="none" stroke="#375c68" stroke-width="9"/><path d="M125 274V315Q125 340 150 340H525Q555 340 555 315V183" fill="none" stroke="#78949c" stroke-width="3"/>
    <rect x="95" y="174" width="331" height="112" rx="9" fill="url(#glass)" class="outline"/><rect id="airSpace" x="108" y="181" height="98" width="152" fill="#83c6d7" opacity=".35"/>
    <rect x="70" y="209" width="26" height="42" rx="5" fill="url(#glass)" class="outline"/><rect x="36" y="203" width="35" height="54" rx="8" fill="#ed9b7c" class="outline"/><path d="M44 212v35M53 212v35M62 212v35" stroke="#b66c50" stroke-width="2"/>
    ${ticks}<path d="M104 178H416" stroke="white" stroke-width="4" stroke-linecap="round" opacity=".85"/>
    <g id="innerBalloon"><path id="innerBalloonBody" d="M0 15C-7 11 -23 -1 -23 -11C-23 -26 -11 -31 0 -31C15 -31 24 -21 23 -10C22 1 7 12 0 15Z" fill="url(#balloonPaint)" stroke="#923e4e" stroke-width="1.5"/><ellipse cx="-9" cy="-20" rx="4" ry="7" fill="#ffe3d3" opacity=".65" transform="rotate(24 -9 -20)"/><path d="M0 14l-4 7q4 -2 8 0Z" fill="#c95160" stroke="#923e4e" stroke-width="1"/></g>
    <rect x="420" y="158" width="15" height="143" rx="6" fill="url(#glass)" class="outline"/>
    <g id="plunger" class="drag-handle" tabindex="0" role="slider" aria-label="Move syringe plunger to change total chamber volume" aria-valuemin="10" aria-valuemax="40"><rect x="4" y="219" width="175" height="22" rx="4" fill="url(#metal)" class="outline"/><rect x="-4" y="181" width="15" height="98" rx="5" fill="#2e505d"/><path d="M0 188v83M6 188v83" stroke="#728e98" stroke-width="2"/><rect x="172" y="180" width="19" height="100" rx="8" fill="#d3e4e6" class="outline"/><path d="M180 194v72" stroke="white" stroke-width="3"/><rect x="155" y="167" width="52" height="126" fill="transparent"/></g>
    <text x="55" y="294" text-anchor="middle" class="svg-small">SEALED CAP</text><text x="110" y="161" class="svg-small">Chamber scale / mL</text>
    <path id="innerBalloonPointer" fill="none" stroke="#a26461" stroke-width="1.5" stroke-dasharray="4 4"/><rect x="150" y="92" width="270" height="42" rx="12" fill="#fff8f1" stroke="#d8b1a3"/><text id="innerBalloonCaption" x="285" y="118" text-anchor="middle" class="svg-label"></text>
    <rect x="170" y="302" width="310" height="28" rx="12" fill="#e3f4f7"/><text id="outsideAirLabel" x="325" y="321" text-anchor="middle" class="svg-label"></text>
    ${gauge(555,105,78,220,'kPa absolute')}<text x="283" y="51" text-anchor="middle" class="svg-label">Tied balloon · closed cap · 20°C</text><text x="340" y="419" text-anchor="middle" class="svg-label">← push to shrink the balloon · pull to expand →</text><text x="340" y="444" text-anchor="middle" class="svg-small">Two separate air samples · no air crosses the balloon</text>`;
}
function balloonScene() {
  return `${commonDefs}<rect id="roomColour" width="680" height="460" fill="#f6e6d7" class="soft-change"/><path d="M0 365H680V460H0Z" fill="#e5d8c3"/><path d="M0 365H680" stroke="#d0bda2" stroke-width="2"/>
    <rect x="40" y="55" width="126" height="170" rx="10" fill="#fdfbf1" stroke="#bcafa0" stroke-width="4"/><rect x="49" y="64" width="108" height="152" rx="3" fill="#d8eceb"/><circle cx="131" cy="93" r="18" fill="#f5d487"/><path d="M49 161Q103 110 157 160V216H49Z" fill="#a9c6b1"/><path d="M103 64V216M49 140H157" stroke="#fdfbf1" stroke-width="7"/>
    <rect x="442" y="278" width="66" height="87" rx="6" fill="#e5d2be" stroke="#bbab94" stroke-width="2"/><path d="M452 290v60M464 290v60M476 290v60M488 290v60" stroke="#c1a98f" stroke-width="5" stroke-linecap="round"/>
    <ellipse id="balloonShadow" cx="315" cy="394" rx="68" ry="13" fill="#b3a68c" opacity=".35"/>
    <g id="balloonShape" filter="url(#shadow)"><path d="M0 0C-20 -15 -115 -66 -111 -150C-108 -234 -47 -253 0 -253C67 -253 113 -212 112 -146C112 -74 29 -18 0 0Z" fill="url(#balloonPaint)" stroke="#923e4e" stroke-width="3"/><ellipse cx="-44" cy="-190" rx="20" ry="35" fill="#ffdfd0" opacity=".55" transform="rotate(29 -44 -190)"/><path d="M0 -2l-9 15q9 -4 18 0Z" fill="#c95160" stroke="#923e4e" stroke-width="2"/></g>
    <path id="balloonString" d="M315 330C284 355 343 370 315 404" fill="none" stroke="#786c65" stroke-width="2"/>
    <rect x="230" y="413" width="170" height="28" rx="14" fill="#fffaf3" opacity=".9"/><text id="balloonVolume" x="315" y="432" text-anchor="middle" class="svg-label"></text>
    ${thermometer()}<text x="340" y="34" text-anchor="middle" class="svg-label">Tied balloon · no air added or removed</text>`;
}
function tyreScene() {
  const tread=Array.from({length:40},(_,i)=>`<path d="M-9 -147l6 -10M5 -148l7 -9" transform="rotate(${i*9})" stroke="#6c7980" stroke-width="2" opacity=".55"/>`).join('');
  const spokes=Array.from({length:5},(_,i)=>`<path d="M-13 -25L-29 -101Q-8 -115 13 -106L18 -29Z" transform="rotate(${i*72})" fill="url(#metal)" stroke="#788d98" stroke-width="2"/>`).join('');
  return `${commonDefs}<rect id="roomColour" width="680" height="460" fill="#e6eff0" class="soft-change"/><path d="M0 359H680V460H0Z" fill="#d5dcda"/><path d="M0 359H680" stroke="#b3c5c1" stroke-width="2"/><path d="M20 408h640" stroke="#f8f8ed" stroke-width="5" stroke-dasharray="40 35"/><ellipse cx="230" cy="369" rx="145" ry="17" fill="#94aba9" opacity=".5"/>
    <g id="tyreWheel" transform="translate(240 198)" filter="url(#shadow)"><g id="tyreCasing"><path id="tyreOutline" fill="url(#rubber)" stroke="#18313e" stroke-width="3"/><g id="tyreTread">${tread}<circle r="136" fill="none" stroke="#7b8990" stroke-width="1"/><circle r="128" fill="none" stroke="#142c37" stroke-width="4"/><text x="0" y="-135" text-anchor="middle" fill="#a4afb1" style="fill:#a4afb1" font-size="10" letter-spacing="4">LEARNING LAB · RADIAL</text></g></g><path id="burstCasing" d="M-169 28Q-189 84 -171 115H-94L-80 99L-60 114H62L80 99L98 115H173Q185 79 162 28L148 49L133 31Q150 77 135 106H-135Q-151 75 -139 36L-154 49Z" fill="#263c47" stroke="#182e39" stroke-width="3"/><g id="tyreRim"><circle r="115" fill="#16303d" stroke="#b2bfc2" stroke-width="6"/>${spokes}<circle r="34" fill="url(#metal)" class="outline"/><circle r="15" fill="#49616c"/><circle r="7" fill="#c8d8dc"/>
    ${Array.from({length:5},(_,i)=>`<circle cx="${24*Math.sin(i*2*Math.PI/5)}" cy="${-24*Math.cos(i*2*Math.PI/5)}" r="3.5" fill="#385562"/>`).join('')}
    <path d="M92 77l15 11" stroke="#b7c5c7" stroke-width="7" stroke-linecap="round"/></g>
    </g><g id="tyreBurstEffects" aria-hidden="true"><path class="tyre-air-jet" d="M340 160q55 -55 106 -10M346 175q70 -12 105 28M328 141q20 -74 75 -76"/><path class="tyre-fragment fragment-one" d="M327 131l35 -19 -3 17 -23 18Z"/><path class="tyre-fragment fragment-two" d="M278 88l14 -28 13 7 -12 30Z"/><path class="tyre-fragment fragment-three" d="M359 220l27 4 9 20 -32 -5Z"/><g transform="translate(368 92)" class="tyre-pop"><path d="M-38 -6l15 -8 -2 -23 19 15 19 -22 3 27 26 4 -20 15 15 20 -27 -5 -14 24 -8 -25 -27 9 14 -23Z" fill="#f4c875" stroke="#b77347" stroke-width="2"/><text y="7" text-anchor="middle" class="svg-label">POP!</text></g></g><path id="tyreHose" d="M346 292C423 370 526 324 514 245" fill="none" stroke="#284b57" stroke-width="12" stroke-linecap="round"/><path id="tyreHoseHighlight" d="M346 292C423 370 526 324 514 245" fill="none" stroke="#789198" stroke-width="3"/>
    ${gauge(520,165,108,400,'kPa gauge')}<text x="516" y="33" text-anchor="middle" class="svg-label">Pressure above the atmosphere</text><text id="tyreSealLabel" x="241" y="438" text-anchor="middle" class="svg-label">Closed valve · approximately fixed volume</text><rect x="37" y="383" width="370" height="30" rx="15" fill="#fffaf1" opacity=".95"/><text id="tyreCondition" x="222" y="403" text-anchor="middle" class="svg-label"></text>
    <rect x="442" y="355" width="160" height="69" rx="11" fill="#fffaf3" stroke="#acbfbc"/><text x="522" y="376" text-anchor="middle" class="svg-small">AIR IN THE TYRE</text><text id="tyreTemperature" x="522" y="404" text-anchor="middle" class="svg-readout"></text>`;
}
$('#apparatus').innerHTML = ({syringe:syringeScene,'syringe-balloon':syringeBalloonScene,balloon:balloonScene,tyre:tyreScene})[key]();
$('#apparatus').setAttribute('aria-label',d.title+' interactive illustration');
$('#lawLabel').textContent=d.law;
$('#sceneTitle').textContent=d.scene;
if(key==='syringe-balloon')$('.sealed-tag').textContent='TWO SEALED AIR SAMPLES';
$('#instruction').textContent=d.instruction;
$('#sceneCaption').textContent=d.caption;
$('#variableLabel').textContent=d.label;
const slider=$('#variable');
Object.assign(slider,{min:d.min,max:d.max,step:d.step,value});
$('#minLabel').textContent=`${d.min} ${d.unit}`;$('#maxLabel').textContent=`${d.max} ${d.unit}`;
$('#constants').textContent=d.constants;$('#equation').textContent=d.equation;
$('#modelLimit').textContent=d.limit;$('#investigationTask').textContent=d.task;$('#questionTitle').textContent=d.question;
d.readings.forEach((label,i)=>{$(`#readingLabel${i}`).textContent=label;$(`#readingUnit${i}`).textContent=d.units[i];});
$('#tableHead').replaceChildren(...['Reading',...d.headers].map(text=>{const th=document.createElement('th');th.scope='col';th.textContent=text;return th;}));
function setValue(next) {value=Math.max(d.min,Math.min(d.max,Math.round(next/d.step)*d.step));slider.value=value;render();}
slider.addEventListener('input',()=>setValue(Number(slider.value)));
d.presets.forEach(([next,label])=>{const button=document.createElement('button');button.textContent=label;button.onclick=()=>setValue(next);$('#presets').append(button);});
function render() {
  if(key==='tyre'&&value>=70)tyreBurst=true;
  const s=currentValues(), c=s.T-273.15;
  if(value===d.target&&!tyreBurst)observedTarget=true;
  $('#variableOutput').textContent=`${value} ${d.unit}`;
  let readings, calculation, insight;
  if(syringeMode) {
    readings=key==='syringe-balloon'?[fixed(s.P,2),fixed(s.balloon,2),fixed(s.V,0)]:[fixed(s.P),fixed(s.V,0),fixed(c,0)];
    const x=syringeGeometry.origin+s.V*syringeGeometry.scale,plunger=$('#plunger');
    plunger.setAttribute('transform',`translate(${x} 0)`);plunger.setAttribute('aria-valuenow',s.V);plunger.setAttribute('aria-valuetext',`${s.V} millilitres, ${fixed(s.P)} kilopascals absolute`);
    $('#airSpace').setAttribute('width',x-(key==='syringe-balloon'?108:158));$('#airSpace').setAttribute('opacity',.3+.4*(40-s.V)/30);
    if(key==='syringe-balloon'){
      const scale=Math.cbrt(s.balloon/5),centre=(110+x)/2;
      $('#innerBalloon').setAttribute('transform',`translate(${centre} 250) scale(${scale})`);
      $('#innerBalloonCaption').textContent=`Sealed balloon: ${fixed(s.balloon,2)} mL`;
      $('#outsideAirLabel').textContent=`Surrounding air: ${fixed(s.outside,2)} mL`;
      $('#innerBalloonPointer').setAttribute('d',`M285 134L${centre} ${250-31*scale}`);
      plunger.setAttribute('aria-valuetext',`${s.V} millilitres total chamber, balloon ${fixed(s.balloon,2)} millilitres, pressure ${fixed(s.P,2)} kilopascals absolute`);
    }else{$('#airLabel').textContent=`Trapped air · ${s.V} mL`;$('#airLabel').setAttribute('x',(158+x)/2);}
    $('#needle').setAttribute('transform',`rotate(${-130+260*s.P/220})`);$('#dialValue').textContent=fixed(s.P);
    calculation=`P = 101.3 × 20 ÷ ${value} = ${fixed(s.P)} kPa`;
    insight=value<20?'Less space for the same air: collisions with the walls become more frequent. Absolute pressure rises while average particle speed stays the same.':value>20?'More space for the same air: collisions with the walls become less frequent. Inside pressure is now below atmospheric pressure.':'The reference position: 20 mL at 101.3 kPa. Push left or pull right to change the volume.';
    if(key==='syringe-balloon'){
      calculation=`P = 101.3 × 20 ÷ ${s.V} = ${fixed(s.P,2)} kPa. Balloon V = 101.3 × 5.00 ÷ ${fixed(s.P,2)} = ${fixed(s.balloon,2)} mL. Surrounding air = ${s.V} − ${fixed(s.balloon,2)} = ${fixed(s.outside,2)} mL.`;
      insight=value<20?'Pushing the plunger raises the pressure of the surrounding air. The balloon is squeezed smaller until its internal pressure balances that higher external pressure. Its own air does not escape.':value>20?'Pulling the plunger lowers the surrounding pressure. The balloon’s own gas expands until the pressures balance. No extra air enters the tied balloon.':'The 20 mL chamber contains a 5.00 mL balloon and 15.00 mL of separate surrounding air. Push or pull the plunger and compare both samples.';
    }
  } else if(key==='balloon') {
    readings=[fixed(s.V,2),fixed(s.T,2),fixed(s.P)];
    const scale=Math.cbrt(s.V/3);$('#balloonShape').setAttribute('transform',`translate(315 317) scale(${scale})`);
    $('#balloonString').setAttribute('d',`M315 ${317+13*scale}C284 355 343 370 315 404`);
    $('#balloonVolume').textContent=`Volume: ${fixed(s.V,2)} L`;
    const height=25+(value-d.min)/(d.max-d.min)*135;
    $('#thermometerFill').setAttribute('y',174-height);$('#thermometerFill').setAttribute('height',height);
    $('#thermometerLabel').textContent=`${value}°C`;
    $('#roomColour').setAttribute('fill',`hsl(${195-(value-d.min)/(d.max-d.min)*165} 40% 91%)`);
    calculation=`V = 3.00 × ${fixed(s.T,2)} ÷ 293.15 = ${fixed(s.V,2)} L`;
    insight=value>20?'Warming makes the gas particles move faster. The flexible balloon expands until its pressure balances the surroundings in this idealised model.':value<20?'Cooling slows the gas particles. The flexible balloon shrinks as it reaches the cooler temperature; the amount of air inside stays the same.':'The reference balloon holds 3.00 L at 20°C. Change the temperature without adding or removing air.';
  } else {
    const gauge=s.P-101.3;
    readings=[fixed(gauge),fixed(s.P),fixed(s.T,2)];
    $('#needle').setAttribute('transform',`rotate(${-130+260*gauge/400})`);$('#dialValue').textContent=fixed(gauge);
    $('#tyreTemperature').textContent=`${value}°C · ${fixed(s.T,2)} K`;
    $('#roomColour').setAttribute('fill',`hsl(${200-(value-d.min)/(d.max-d.min)*170} 35% 92%)`);
    const cold=Math.max(0,Math.min(1,(20-value)/50)),hot=Math.max(0,(value-20)/50);
    const flatten=tyreBurst?1:cold,top=161-25*flatten,radius=161+4*hot*(1-flatten),bottom=161-41*flatten;
    const outline=Array.from({length:96},(_,i)=>{const angle=i*2*Math.PI/96,lower=Math.max(0,-Math.cos(angle));return `${i?'L':'M'}${Math.sin(angle)*(radius+18*flatten*lower)} ${Math.min(bottom,-Math.cos(angle)*top)}`;}).join('')+'Z';
    $('#tyreOutline').setAttribute('d',outline);$('#tyreTread').setAttribute('opacity',1-flatten);
    const centreY=359-bottom;$('#tyreWheel').setAttribute('transform',`translate(240 ${centreY})`);
    const hose=`M346 ${centreY+88}C423 390 526 324 514 245`;$('#tyreHose').setAttribute('d',hose);$('#tyreHoseHighlight').setAttribute('d',hose);
    $('#apparatus').classList.toggle('tyre-burst',tyreBurst);$('#apparatus').dataset.tyreState=tyreBurst?'burst':cold>0?'cold':'intact';
    const tag=$('.sealed-tag');tag.textContent=tyreBurst?'VENTED AIR':'SEALED AIR';tag.classList.toggle('is-open',tyreBurst);
    $('#tyreCondition').textContent=tyreBurst?'BURST · replace the tyre to start again':cold>0?'Cold tyre · exaggerated flattening':value>=65?'Very hot · cartoon burst at 70°C':'Intact tyre · warm it or cool it';
    $('#tyreSealLabel').textContent=tyreBurst?'Air escaped · fixed-amount model no longer applies':'Closed valve · pressure calculation uses fixed volume';
    $('#resetExample').textContent=tyreBurst?'Replace tyre & reset':'Reset';
    $('#constants').textContent=tyreBurst?'The casing is open. Air has escaped until the inside reaches the outside atmosphere: 101.3 kPa absolute, 0 kPa gauge. Cooling cannot repair a torn tyre.':d.constants;
    $('#lawLabel').textContent=tyreBurst?'AFTER THE BURST · OPEN TYRE':d.law;
    $('#equation').textContent=tyreBurst?'P inside = P atmosphere':d.equation;
    $('.evidence-heading > p').textContent=tyreBurst?'Compare intact and burst readings. After bursting, the amount of gas is no longer fixed.':'Keep the amount of gas fixed before the cartoon burst. Change one variable and look for a pattern.';
    calculation=tyreBurst?'The tyre has vented: P absolute = 101.3 kPa; P gauge = 101.3 − 101.3 = 0.0 kPa. P/T is no longer constant because air has escaped.':`P absolute = 321.3 × ${fixed(s.T,2)} ÷ 293.15 = ${fixed(s.P)} kPa. Gauge = ${fixed(s.P)} − 101.3 = ${fixed(gauge)} kPa.`;
    insight=tyreBurst?'Pop! The cartoon casing has torn and the tyre has flattened as air escapes. It stays damaged when cooled: use Replace tyre & reset. The 70°C trigger is an illustration, not a real failure limit.':value>20?'Warmer gas transfers more momentum to the tyre walls, so the sealed-tyre pressure rises. At 70°C the cartoon will burst; actual tyre failure depends on many factors, not one temperature.':value<20?'Cooler gas transfers less momentum to the tyre walls, so pressure falls without air escaping. The squashed shape is deliberately exaggerated; −30°C alone would not normally flatten a correctly inflated tyre.':'The reference tyre reads 220.0 kPa gauge and 321.3 kPa absolute. Try −30°C, 60°C, then the cartoon burst at 70°C.';
  }
  readings.forEach((reading,i)=>$(`#reading${i}`).textContent=reading);
  $('#calculation').textContent=calculation;$('#observation').textContent=insight;
  $('#apparatus').setAttribute('aria-description',`${d.label}: ${value} ${d.unit}. ${d.readings.map((r,i)=>`${r}: ${readings[i]}`).join('. ')}${key==='tyre'?(tyreBurst?'. Burst tyre, air vented. Reset to replace it.':'. Intact sealed tyre.') : ''}`);
}
function renderRecords() {
  $('#measurementRows').replaceChildren(...records.map((s,i)=>{
    const tr=document.createElement('tr');[String(i+1),...d.row(s)].forEach(text=>{const td=document.createElement('td');td.textContent=text;tr.append(td);});return tr;
  }));
}
function record() {
  const s=currentValues();
  if(records.some(row=>row.V===s.V&&row.T===s.T&&row.burst===s.burst)){$('#recordStatus').textContent='This measurement is already in your table.';return;}
  if(records.length>=12){$('#recordStatus').textContent='Your table has 12 measurements. Reset to start a new investigation.';return;}
  records.push(s);renderRecords();$('#recordStatus').textContent=`Reading ${records.length} added. Compare it with the starting point below.`;
}
$('#recordMeasurement').onclick=record;
$('#resetExample').onclick=()=>{records=[];observedTarget=false;tyreBurst=false;$('#feedback').textContent='';delete $('#feedback').dataset.state;$('#answerOptions').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'));setValue(d.initial);record();$('#recordStatus').textContent='Reset to the starting conditions. Your first reading is in the table.';};
d.options.forEach((text,index)=>{
  const button=document.createElement('button');button.textContent=text;button.setAttribute('aria-pressed','false');
  button.onclick=()=>{
    $('#answerOptions').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'));button.setAttribute('aria-pressed','true');
    if(!observedTarget&&key==='tyre'&&tyreBurst){$('#feedback').textContent='Replace the burst tyre with Reset, then set the intact tyre to 60°C before answering.';$('#feedback').dataset.state='incorrect';return;}
    if(!observedTarget){$('#feedback').textContent=`First complete the investigation: set the control to ${d.target} ${d.unit}, then choose your answer again.`;$('#feedback').dataset.state='incorrect';return;}
    const correct=index===d.answer;$('#feedback').dataset.state=correct?'correct':'incorrect';$('#feedback').textContent=correct?`Correct. ${d.explanation}`:`Try again. ${key==='syringe'?'Compare the pressure at 20 mL and 10 mL.':key==='balloon'?'Convert both temperatures to Kelvin before comparing them.':key==='syringe-balloon'?'Compare the pressure around the balloon at 20 mL and 40 mL. Its own gas stays sealed inside.':'The gauge reads the pressure above the atmosphere; absolute pressure starts at a vacuum.'}`;
  };$('#answerOptions').append(button);
});
if(syringeMode) {
  const handle=$('#plunger'), svg=$('#apparatus');let dragging=false,grabOffset=0;
  function drag(event){const matrix=svg.getScreenCTM();if(!matrix)return;const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());setValue((point.x-grabOffset-syringeGeometry.origin)/syringeGeometry.scale);}
  // Keep the initial grab offset so the plunger does not jump when its thumb pad is pressed.
  handle.addEventListener('pointerdown',event=>{if(event.button!==0)return;event.preventDefault();const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(svg.getScreenCTM().inverse());grabOffset=point.x-(syringeGeometry.origin+value*syringeGeometry.scale);dragging=true;handle.setPointerCapture(event.pointerId);});
  handle.addEventListener('pointermove',event=>{if(dragging)drag(event);});
  handle.addEventListener('pointerup',()=>dragging=false);handle.addEventListener('pointercancel',()=>dragging=false);handle.addEventListener('lostpointercapture',()=>dragging=false);
  handle.addEventListener('keydown',event=>{const changes={ArrowLeft:-1,ArrowDown:-1,ArrowRight:1,ArrowUp:1,PageDown:-5,PageUp:5};if(event.key in changes){event.preventDefault();setValue(value+changes[event.key]);}else if(event.key==='Home'||event.key==='End'){event.preventDefault();setValue(event.key==='Home'?d.min:d.max);}});
}
render();record();$('#recordStatus').textContent='Starting conditions recorded. Change one variable, then add another reading.';
