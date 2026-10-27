import {svg,text,line,beaker,flask,tube,bottle,lattice,chain,burner,meter} from './drawing.js?v=diene-1';
import {indicator,displaces,gasFromAcid,waterElectrolysis,dieneCracking} from './science.mjs?v=diene-1';
export const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label=(x,y,s,cls='small')=>text(x,y,escape(s),cls);
const ring=(x,y)=>`<circle cx="${x}" cy="${y}" r="29" fill="#fff7e7" stroke="#c3864a" stroke-width="2"/>`;
export function toolArt(type,x,y,{v={},name=''}={}){
 let art='';
 switch(type){
  case 'bottle':case 'water':{
   const words=(type==='water'?'Water':name||'Sample').split(/\s+/),lines=[''];
   for(const word of words){if((lines.at(-1)+' '+word).trim().length>10&&lines.at(-1))lines.push(word);else lines[lines.length-1]=(lines.at(-1)+' '+word).trim();}
   art=bottle(-37,-72,'',type==='water'?'#b8dbe7':'#b6c9b3')+lines.slice(0,3).map((part,i)=>label(3,16+i*12,part,'bottle-label')).join('');break;
  }
  case 'dropper':case 'pipette':art=`<rect x="-17" y="-38" width="34" height="45" rx="16" fill="#577c81"/><path d="M-6 6v60l6 18 6-18V6Z" fill="url(#glass)" stroke="#4a6b78" stroke-width="2"/><path d="M-4 35v29l4 12 4-12V35Z" fill="${v.indicator==='phenolphthalein'?'#c9dde2':'#ba937e'}"/>`;break;
  case 'spatula':art=`<path d="M-49 22L28-13" stroke="#4b6972" stroke-width="9" stroke-linecap="round"/><ellipse cx="36" cy="-18" rx="27" ry="14" transform="rotate(-25 36 -18)" fill="#acbdc3" stroke="#496a74" stroke-width="2"/><path d="M20-22l12-14 18 7 6 9-21 7Z" fill="${v.solid==='CuO'?'#3f4548':'#e1d5b4'}"/>`;break;
  case 'solid':art='<path d="M-21-14L8-24 28-6 15 18-15 23-28 3Z" fill="url(#metal)" stroke="#536e78" stroke-width="2"/>';break;
  case 'electrode':case 'strip':art=`<rect x="-12" y="-73" width="24" height="145" rx="5" fill="${v.cell==='copper-electrodes'||v.metal==='Cu'||v.material==='Cu'?'#bb805f':type==='electrode'?'#50666c':'url(#metal)'}" stroke="#425d69" stroke-width="2"/><rect x="-15" y="-65" width="30" height="20" rx="4" fill="#506e76"/>`;break;
  case 'probe':art='<rect x="-16" y="-66" width="32" height="56" rx="8" fill="#375c68"/><rect x="-5" y="-12" width="10" height="93" rx="4" fill="#789d9d" stroke="#3d6470" stroke-width="2"/>';break;
  case 'rod':art='<path d="M-10-70L15 70" stroke="#517c86" stroke-width="10" stroke-linecap="round"/><path d="M-11-70L13 69" stroke="#c8e2e4" stroke-width="5" stroke-linecap="round"/>';break;
  case 'funnel':art='<path d="M-63-40H63L10 23V67H-10V23Z" fill="url(#glass)" stroke="#54787c" stroke-width="3"/><path d="M-50-33H50L0 20Z" fill="#f4ead3" stroke="#cbbd9d"/>';break;
  case 'beaker':art=beaker(-55,-65,110,130,v.solid==='CuO'||v.pair==='copper'?'#89bfcf':'#c6dfe2',.65);break;
  case 'flask':art=flask(0,-60,'#badbe0');break;
  case 'cold-trap':art=flask(0,-60,'#edf3ef')+'<rect x="-68" y="-15" width="136" height="80" rx="15" fill="#a9d1e52b" stroke="#81adc0" stroke-width="2" stroke-dasharray="4 4"/>';break;
  case 'dish':art='<path d="M-65-15Q-57 35 0 35T65-15Z" fill="#e9e9d7" stroke="#5c7e78" stroke-width="3"/><ellipse cy="-15" rx="65" ry="16" fill="#c2e0dd" stroke="#5c7e78" stroke-width="3"/>';break;
  case 'stopper':art='<path d="M-24-15H24L19 12H-19Z" fill="#917762" stroke="#5e6a68" stroke-width="2"/><path d="M0-15V-46H90V-25" fill="none" stroke="#547981" stroke-width="8"/>';break;
  case 'tubes':art=[-60,60].map(dx=>`<path d="M${dx-23} 65V-60a23 23 0 0 1 46 0V65" fill="url(#glass)" stroke="#597d85" stroke-width="3"/><rect x="${dx-18}" y="-57" width="36" height="117" fill="#bbdae3" opacity=".6"/>`).join('');break;
  case 'gas-syringe':art='<rect x="-70" y="-20" width="120" height="40" rx="6" fill="url(#glass)" stroke="#517780" stroke-width="3"/><path d="M-55-16v32m0-16H65m0-20v40" stroke="#638991" stroke-width="5"/>'+label(0,43,'Gas syringe');break;
  case 'test-tubes':art=tube(-40,-55,'#d4e4e5')+tube(24,-55,'#e9e9da');break;
  case 'splint':art='<path d="M-56 17L28-12" stroke="#b78e62" stroke-width="8"/>'+ (v.test==='limewater'?'<ellipse cx="31" cy="-8" rx="25" ry="28" fill="#ecede1" stroke="#5f817f"/>':'<path class="live-flame" d="M30-45Q5-13 30-8Q54-15 30-45Z" fill="#edb55b"/>');break;
  case 'film':art='<rect x="-49" y="-41" width="98" height="82" rx="5" fill="#e5dcb9" stroke="#344f58" stroke-width="9"/><path d="M-26 14Q-45-27 12-25Q49 3-2 24Z" fill="#536d62"/>';break;
  case 'hood':art='<path d="M-60 28H60L15-24V-56H-15V-24Z" fill="url(#glass)" stroke="#5b8288" stroke-width="3"/>';break;
  case 'lighter':art='<rect x="-22" y="-8" width="44" height="58" rx="7" fill="#a87458"/><rect x="-18" y="-22" width="36" height="19" rx="3" fill="#b9cacb"/><path class="live-flame" d="M0-66Q-26-32 0-22Q26-30 0-66Z" fill="#eab463"/>';break;
  case 'chain':art=chain(-54,0,4,v.family==='alkene'||v.monomer!==undefined,'#6d9c8a');break;
  case 'hydrogen':art=[[-24,-14],[20,-14],[-24,25],[20,25]].map(([xx,yy])=>`<circle cx="${xx}" cy="${yy}" r="18" fill="#f6f6e6" stroke="#849e94" stroke-width="2"/>`+label(xx,yy+5,'H')).join('');break;
  case 'electron':art=ring(0,0)+'<circle r="19" fill="#dab079"/>'+label(0,6,v.reaction==='magnesium'?'4e⁻':'2e⁻');break;
  case 'formula':art='<rect x="-75" y="-35" width="150" height="70" rx="10" fill="#fcf7e9" stroke="#6b9285" stroke-width="2"/>'+label(0,6,'Structural formula');break;
  case 'group':art='<rect x="-60" y="-31" width="120" height="62" rx="12" fill="#b7d3c3" stroke="#4c7e6f" stroke-width="2"/>'+label(0,6,v.route==='polyamide'?'H₂N–R–NH₂':v.route==='ester'?'C₂H₅–OH':'HO–R–OH');break;
  case 'water-packet':art='<circle cx="-19" r="18" fill="#f4f1da" stroke="#849e94"/><circle cx="20" r="22" fill="#dfb7a4" stroke="#997664"/>'+label(-19,5,'H')+label(20,5,'OH');break;
  case 'handle':art='<rect x="-27" y="-35" width="54" height="70" rx="12" fill="#c49368" stroke="#815f45" stroke-width="2"/><path d="M-12 0H13m-7-8 8 8-8 8" fill="none" stroke="#fff3d8" stroke-width="3"/>';break;
  case 'lens':art='<circle r="24" fill="#eaf6f3bb" stroke="#56877e" stroke-width="5"/><path d="M16 18L36 40" stroke="#40685f" stroke-width="9" stroke-linecap="round"/><path d="M-12-8Q-2-20 10-11" stroke="white" stroke-width="4" fill="none"/>';break;
  case 'magnet':art='<path d="M-37 25V-22a37 37 0 0 1 74 0V25H15V-20a15 15 0 0 0-30 0V25Z" fill="#b4765a" stroke="#695d52" stroke-width="2"/><rect x="-37" y="13" width="22" height="17" fill="#d5dfe0"/><rect x="15" y="13" width="22" height="17" fill="#d5dfe0"/>';break;
  case 'clock':art=ring(0,0)+'<circle r="22" fill="#edf2df" stroke="#66877b" stroke-width="2"/><path class="clock-hand" d="M0-15V0L12 8" fill="none" stroke="#4e7468" stroke-width="3"/>';break;
  case 'switch':art='<rect x="-34" y="-25" width="68" height="50" rx="9" fill="#3e6265" stroke="#304f52" stroke-width="2"/><circle r="15" fill="#d5aa78"/><path d="M0-9V3m-6-8a10 10 0 1 0 12 0" stroke="#374f47" stroke-width="2.5" fill="none"/>';break;
  case 'valve':art='<path d="M-32 10H32" stroke="#658c8d" stroke-width="14"/><path d="M0 10V-10" stroke="#497077" stroke-width="7"/><path d="M-23-14H23" stroke="#ba805b" stroke-width="8" stroke-linecap="round"/>';break;
  case 'play':art='<rect x="-35" y="-27" width="70" height="54" rx="9" fill="#375f64"/><path d="M-8-15L17 0-8 15Z" fill="#f3d4a1"/>';break;
  case 'lamp':art='<path d="M-21-16Q-21-44 0-44T21-16L12 2H-12Z" fill="#f0d494" stroke="#6b8276" stroke-width="2"/><rect x="-13" y="3" width="26" height="17" rx="3" fill="#496969"/>'+line(-22,30,22,30);break;
  case 'equals':art=ring(0,0)+label(0,8,'=','large');break;
 }
 return `<g transform="translate(${x} ${y})">${art}</g>`;
}
function gas(x,y,n=9,span=100){return `<g class="reaction-bubbles" aria-hidden="true">${Array.from({length:n},(_,i)=>`<circle cx="${x+i*19%span}" cy="${y}" r="${3+i%4}" fill="#f4fcf9" stroke="#7baab1" style="--bubble-delay:${-i*.31}s;--rise:${75+i%3*16}px;--drift:${i%2?9:-7}px"/>`).join('')}</g>`;}
const vessel=body=>`<g data-vessel>${body}</g>`;
const grains=(x,y,colour='#e4d9ba')=>Array.from({length:10},(_,i)=>`<ellipse cx="${x+i*27%90}" cy="${y+i*13%15}" rx="${4+i%3}" ry="3" fill="${colour}" stroke="#9aa79c"/>`).join('');
const colours={Cu:'#86bfcf',Fe:'#b4cbb1',Zn:'#cee4e5',Mg:'#cee4e5'};
const structureData={ethanol:['CH₃–CH₂','–OH','Alcohol'],ethanoic:['CH₃','–C(=O)–OH','Carboxylic acid'],ester:['CH₃','–C(=O)–O–CH₂–CH₃','Ester'],amine:['CH₃','–NH₂','Amine'],amide:['CH₃','–C(=O)–NH₂','Amide']};
export function sceneFor(d,s,plan,result){
 const id=d.id,v=s.values,done=new Set(plan.slice(0,s.benchStep).map(a=>a.id)),has=key=>done.has(key),phase=s.phase;
 const working=s.benchStep<plan.length,a=plan[s.benchStep];
 let body='',footer='',fluid='#cce2e5';
 const power=(has('power')||has('switch')||has('meter'))&&!has('off');
 const observed=s.benchStep>=plan.length;
 const sampleControl=d.controls.find(c=>['sample','type','solid','element','cell'].includes(c.id)&&c.type==='select');
 let sampleLabel=sampleControl?.options.find(o=>o[0]===v[sampleControl.id])?.[1]||'Measured sample';
 if(id==='water-cell')sampleLabel='Acidified water';
 if(id==='neutralisation')sampleLabel=a?.id==='alkali'?v.base:v.acid;
 if(id==='titration')sampleLabel='0.100 M NaOH';
 if(id==='cracking'&&v.pathway==='diene')sampleLabel=dieneCracking(v.n,v.dieneC).feed;
 if(id==='precipitation')sampleLabel=a?.id==='second'?'Solution B':a?.id==='filter-pour'?'Mixture':'Solution A';
 if(id==='crystals')sampleLabel=a?.id==='filter-pour'?'Mixture':'H₂SO₄';
 if(id==='groups')sampleLabel=a?.id==='second'?v.element==='Br2'?'Iodide':'Bromide':v.element==='Cl2'?'Chlorine water':v.element==='Br2'?'Bromine water':sampleLabel;
 if(id==='indicators'||id==='strength'){
  const pH=Number(result.readings[0][1]);if(phase>=2&&Number.isFinite(pH))fluid=indicator(pH,id==='indicators'?v.indicator:'universal').colour;
 }
 if(['indicators','strength','dilution','neutralisation','crystals','precipitation','everyday','groups','displacement','bromine'].includes(id)){
  let inside='',fill=has('sample')||has('solid')||has('solute')||has('mixture')||id==='displacement'||id==='crystals';
  if(id==='dilution'){fluid=has('solute')?'#b5a7d1':'#cee4e6';fill=has('initial-water');}
  if(id==='everyday')fluid=v.mixture==='soap'&&has('swirl')?'#d9dfcb':'#d4e6e3';
  if(id==='precipitation'){fluid=v.pair==='copper'?(has('second')?'#87c1d1':'#91c5d3'):'#d2e4e8';if(has('swirl'))inside+=grains(300,310,v.pair==='copper'?'#77b4d0':'#e9e5d5');}
  if(id==='crystals'){fluid=v.solid==='CuO'&&has('solid')?'#8abfd1':'#d1e5e5';if(has('solid')&&!has('filter-pour'))inside+=grains(300,310,v.solid==='CuO'?'#37484e':'#f0ebdd');}
  if(id==='displacement'){const yes=has('wait')&&displaces(v.metal,v.ion);fluid=colours[yes?v.metal:v.ion];}
  if(id==='bromine')fluid=has('squeeze')?v.sample==='hexene'&&has('swirl')?'#d6e8e9':'#d1a16c':'#d2e5e7';
  if(id==='groups'&&['Cl2','Br2','I2'].includes(v.element))fluid=has('second')?v.element==='Cl2'?'#cc9563':'#b49373':v.element==='Cl2'?'#c3d8a9':v.element==='Br2'?'#d0a274':'#b49373';
  const fizz=(id==='everyday'&&has('water')&&['citric','vinegar','powder'].includes(v.mixture))||(id==='crystals'&&has('solid')&&!has('filter-pour')&&v.solid==='MgCO3')||(id==='groups'&&has('sample')&&['Li','Na','K'].includes(v.element));
  if(fizz)inside+=gas(290,310,id==='groups'?v.element==='K'?18:v.element==='Na'?12:6:12);
  if(id==='everyday'&&v.mixture==='soap'&&has('mixture'))inside+=has('swirl')?Array.from({length:14},(_,i)=>`<circle class="oil-droplet" cx="${291+i*29%93}" cy="${240+i*19%68}" r="6" fill="#d2ba78" stroke="#78a5a3" stroke-width="2"/>`).join(''):'<path d="M267 217H413V237H267Z" fill="#ddc584"/>';
  if(id==='groups'&&has('sample')&&['Li','Na','K'].includes(v.element))inside+='<ellipse class="skating-metal" cx="325" cy="226" rx="10" ry="7" fill="#c3cbd0"/>';
  const filtration=(id==='crystals'||id==='precipitation')&&has('filter');
  if(id==='crystals'&&(has('dish')||a?.id==='dish')){
   const dishX=has('cool')?130:340;
   body+='<rect x="55" y="291" width="150" height="40" rx="9" fill="#a6c8bd"/>'+label(130,355,'Cooling mat');
   if(a?.id!=='cool')body+=vessel(toolArt('dish',dishX,250,{v}));body+=`<rect x="255" y="294" width="170" height="40" rx="8" fill="${has('heat')&&!has('off')?'#b27956':'#91a6a2'}" stroke="#5a7873" stroke-width="3"/>`;
   if(has('heat')&&!has('off'))body+='<g class="steam"><path d="M315 219q-15-17 0-34t0-34M345 219q-15-17 0-34t0-34M375 219q-15-17 0-34t0-34" fill="none" stroke="#bdd3cd" stroke-width="5"/></g>';
   if(has('cool'))body+=`<g class="crystal-growth">${Array.from({length:12},(_,i)=>`<path d="M${dishX-55+i*9} ${246+i%3*6}l7-15 8 12-7 13Z" fill="${v.solid==='CuO'?'#69a9c3':'#dbeae6'}" stroke="#63959d"/>`).join('')}</g>`;
   footer=has('cool')?'Crystals form as the concentrated solution cools.':'Concentrate gently; switch off before cooling.';
  }else if(filtration){
   body+=vessel(flask(340,240,has('filter-pour')?fluid:'#eef3ef','Filtrate'))+toolArt('funnel',340,165,{v});
   if(has('filter-pour'))body+=grains(308,137,id==='precipitation'&&v.pair==='copper'?'#75b3d1':'#d8d0b5');
   footer=has('filter-pour')?'Solid residue stays on the paper; dissolved ions pass through.':'Pour the mixture into the filter paper.';
  }else if(id==='groups'&&['Fe','Cu'].includes(v.element)){
   body+='<rect x="250" y="220" width="180" height="95" rx="15" fill="#f5f1de" stroke="#c4c5af" stroke-width="2"/>';
   if(has('sample'))body+=`<rect x="296" y="240" width="88" height="45" rx="7" fill="${v.element==='Fe'?'#9cabad':'#bd8765'}" stroke="#5c7a7c" stroke-width="2"/>`+label(340,268,v.element);
   if(has('magnet'))body+=toolArt('magnet',340,185,{v})+(v.element==='Fe'?'<path class="magnetic-field" d="M310 211q-15 25 0 31M370 211q15 25 0 31" fill="none" stroke="#b68e61" stroke-width="2" stroke-dasharray="4 3"/>':'');
   footer=has('magnet')?v.element==='Fe'?'Iron is attracted to the magnet.':'Copper is not attracted to an ordinary magnet.':'Compare the two metal samples.';
  }else if(id==='neutralisation')body+=vessel(flask(340,218,fill?fluid:'#eef4f1',has('alkali')?'Mixture':'Acid'));
  else if(id==='bromine')body+=vessel(tube(316,170,fill?fluid:'#eef4f1','Sample'));
  else body+=vessel(beaker(260,170,160,165,fluid,fill?(id==='dilution'?has('water')?.76:.48:.68):0,inside));
  if(id==='displacement'&&has('strip')){body+=toolArt('strip',340,225,{v});if(has('wait')&&displaces(v.metal,v.ion))body+=`<rect class="metal-deposit" x="327" y="232" width="26" height="65" rx="5" fill="${v.ion==='Cu'?'#b87854':'#95a6ab'}"/>`;}
  if(id==='neutralisation'){
   body+=meter(425,35,'pH at 25°C',has('meter')?String(result.readings[0][1]):'OFF');
   if(has('probe'))body+=toolArt('probe',340,250,{v})+'<path d="M340 184V130H490V120" fill="none" stroke="#617e87" stroke-width="3"/>';
   footer='These solutions are colourless. Measure pH with the probe.';
  }
  if(id==='strength'){
   body+=meter(425,35,'pH at 25°C',power?String(result.readings[0][1]):'OFF');
   if(has('probe'))body+=toolArt('probe',310,225,{v})+`<path d="M310 159V130H490V120" fill="none" stroke="#617e87" stroke-width="3"/>`;
   if(has('conductivity'))body+=toolArt('probe',385,225,{v});
   body+=`<circle cx="145" cy="105" r="25" fill="${power?'#e4ce82':'#dce7de'}" stroke="#5b8078" stroke-width="3"/>`+label(145,153,'Conductivity model');
  }
  if(has('dropper')&&!['squeeze','dropper'].includes(a?.id))body+=toolArt('dropper',340,95,{v});
  if(has('rod')&&id==='dilution')body+=toolArt('rod',340,240,{v});
  if(id==='displacement'&&has('wait'))footer=displaces(v.metal,v.ion)?`${v.ion} deposits; the solution changes as ions are displaced.`:'No displacement: the strip is not more reactive than the dissolved metal.';
  if(id==='dilution')footer=has('water')?`${v.mass} mg in ${v.volume+v.water} L. The solute amount stays the same.`:`Start with ${v.mass} mg of solute in ${v.volume} L.`;
 }
 if(id==='titration'){
  const ml=s.extra.delivered||0;
  // Keep the original, chemically computed flask colour and titration curve.
  const drawing=d.model(v,s.phase,s.extra).drawing;body+=drawing.slice(drawing.indexOf('</defs>')+7,drawing.lastIndexOf('</svg>')).replace(/<g data-apparatus-action="drop"[\s\S]*?<\/g>/,'');
  // The original model includes its own background; all interaction overlays sit above it.
  if(has('pipette')&&!has('release'))body+=toolArt('pipette',230,255,{v});
  if(has('dropper')&&!has('squeeze'))body+=toolArt('dropper',260,255,{v});
  if(!working){body+=`<g data-bench-dose="0.1" tabindex="0" role="button" aria-label="Turn burette tap: add 0.1 mL"><rect x="195" y="207" width="72" height="48" rx="8" fill="#d1b08122" stroke="#be8556" stroke-width="2"/>${label(325,242,'Turn tap → 0.1 mL')}</g>`;
   body+=[5,1].map((dose,i)=>`<g data-bench-dose="${dose}" tabindex="0" role="button" aria-label="Add ${dose} mL at the burette"><rect x="32" y="${200+i*58}" width="112" height="46" rx="9" fill="#fff8e8" stroke="#b59066" stroke-width="2"/>${label(88,228+i*58,`Add ${dose} mL`)}</g>`).join('');}
  footer=working?'Prepare the burette and measured sample before opening the tap.':`Delivered: ${ml.toFixed(1)} mL · use 0.1 mL near faint pink.`;
 }
 if(['water-cell','electrolytes','aluminium'].includes(id)||(id==='extraction'&&v.method==='electrolysis')){
  const al=id==='aluminium'||id==='extraction',water=id==='water-cell',copper=v.cell?.startsWith('copper'),liquid=al?'#dba26e':copper?'#91c1d0':'#c8e2e7';
  if(al)body+='<path d="M300 84H225V318H245M380 84V112H280V152M380 112H400V152" fill="none" stroke="#73939a" stroke-width="4"/>';else body+=`<path d="M280 ${has('left-electrode')?152:130}V112H300V84M400 ${has('right-electrode')?152:130}V112H380V84" fill="none" stroke="#73939a" stroke-width="4"/>`;
  body+=`<rect x="276" y="29" width="128" height="65" rx="12" fill="#345e65" stroke="#25464d" stroke-width="3"/>${label(340,53,al?'INDUSTRIAL DC':'DC SUPPLY','power-label')}<circle cx="340" cy="72" r="13" fill="${power?'#b8df9f':'#d4b189'}"/>${label(340,76,power?'ON':'OFF','tiny')}${label(280,132,al?'+':v.wiring==='reverse'?'+':'−')}${label(400,132,v.wiring==='reverse'?'−':'+')}`;
  const loaded=has('sample')||has('alumina')||has('ore');
  let contents='';
  const leftH=v.wiring!=='reverse';
  const leftGas=water||v.cell==='brine',rightGas=water||v.cell!=='copper-electrodes';
  if(power&&(leftGas||al))contents+=gas(275,309,leftH?12:6,12);
  if(power&&rightGas)contents+=gas(396,309,leftH?6:12,12);
  body+=vessel(beaker(245,169,190,169,liquid,loaded?.78:0,contents));
  for(const[key,x]of [['left-electrode',280],['right-electrode',400]])if(has(key)){
   body+=`<g class="${al&&has('power')?'anode-consumed':''}">${toolArt('electrode',x,225,{v})}</g>`;
   if(has('power')&&x===280&&!water&&v.cell!=='brine'&&!al)body+=`<rect class="metal-deposit" x="267" y="235" width="26" height="62" rx="4" fill="${v.cell==='lead'?'#a6b1b7':'#bc7b54'}"/>`;
  }
  if(water&&has('tubes')){
   const g=waterElectrolysis(v.current,v.time),ratio=Math.min(1,(s.elapsed||0)/v.time),volumes=leftH?[g.hydrogen,g.oxygen]:[g.oxygen,g.hydrogen];
   body+=[280,400].map((x,i)=>`<path d="M${x-21} 278V147a21 21 0 0 1 42 0V278" fill="url(#glass)" stroke="#5a7e85" stroke-width="2.5"/><rect data-gas-volume="${volumes[i]}" x="${x-17}" y="${132+((power||has('collect'))?volumes[i]*ratio*4:0)}" width="34" height="${146-((power||has('collect'))?volumes[i]*ratio*4:0)}" fill="#b6d9e1" opacity=".6"/>${label(x,114,has('collect')?`${volumes[i].toFixed(2)} mL`:power?'Collecting…':'Water filled')}`).join('');
   footer=power?'Gas rises into the tubes. Compare volumes at equal temperature and pressure.':'The collection tubes start filled with water.';
  }
  if(al){body+=`<path d="M425 315H478V345" fill="none" stroke="#5e7779" stroke-width="11"/><path d="M447 354h72l-8 22h-56Z" fill="#c3ccc9" stroke="#5d7e79" stroke-width="2"/>`;if(has('power')&&(id==='aluminium'||v.ore==='Al'))body+='<rect x="253" y="320" width="173" height="11" fill="#bdc7cd"/>';if(has('tap'))body+='<path class="metal-stream" d="M478 344v18" stroke="#c7d2d3" stroke-width="9"/>';footer='Carbon anodes (+) · carbon-lined cathode (−) · virtual molten cryolite cell.';}
  if(v.cell==='lead')body+='<rect x="240" y="341" width="199" height="20" rx="5" fill="#b88664"/>'+label(340,383,'Virtual heated cell · electrolyte kept molten');
  if(id==='extraction')footer=v.ore==='Al'?'Alumina / molten cryolite · carbon-anode model.':'This oxide practical does not configure a working electrolysis route for this oxide.';
  if(!has('power')&&a?.id!=='power')body+=`<g data-bench-locked="Place the electrolyte and both electrodes before switching on the supply." role="button" tabindex="0" aria-label="DC supply: prepare the cell first"><rect x="276" y="29" width="128" height="65" fill="transparent"/></g>`;
 }
 if(id==='materials'){
  const on=has('switch'),conducts=['Cu','C'].includes(v.material);
  body+=`<path d="M180 110H480V275H370M310 275H180V110" fill="none" stroke="#6b9290" stroke-width="5"/><rect x="110" y="69" width="120" height="74" rx="9" fill="#365c65"/>${label(170,96,'BATTERY','power-label')}<path d="M155 122H180L${on?205:200} ${on?122:105}" stroke="#d7b176" stroke-width="7" stroke-linecap="round"/><circle cx="480" cy="180" r="30" fill="${on&&conducts?'#f4d979':'#e0e8dc'}" stroke="#597d79" stroke-width="3"/><path d="M465 165l30 30m-30 0 30-30" stroke="#9c925d" stroke-width="3"/>`;
  if(has('sample'))body+=`<rect x="305" y="250" width="70" height="44" rx="7" fill="${v.material==='Cu'?'#bf8b66':v.material==='S'?'#d6c477':'#9baeb1'}" stroke="#58777c" stroke-width="2"/>${label(340,277,v.material)}`;
  if(has('inspect'))body+=`<g class="result-reveal">${label(340,200,result.readings[0][1])}</g>`;footer=on?conducts?'Mobile electrons carry charge: the lamp lights.':'The switch is closed, but this solid has no mobile charge carriers.':'Fit the sample between the circuit contacts before closing the switch.';
 }
 if(id==='acid-metals'){
  const yes=gasFromAcid(v.solid,v.mass)>0;
  body+=vessel(flask(250,210,'#d0e4e7','HCl',has('solid')?grains(218,315):''));
  if(has('solid')&&yes)body+=gas(220,312,12,60);
  if(has('stopper'))body+=toolArt('stopper',250,210,{v})+`<path d="M340 164H390V135" fill="none" stroke="#5d8389" stroke-width="7"/>`;
  const length=has('stopper')?Math.min(120,gasFromAcid(v.solid,v.mass)/3):0;
  body+=`<rect x="385" y="110" width="160" height="45" rx="6" fill="url(#glass)" stroke="#5c8188" stroke-width="3"/><path class="gas-plunger" d="M${395+length} 114V151m0-19H${430+length}" stroke="#6d9092" stroke-width="6"/>${label(465,93,'Gas syringe')}`;
  footer=has('test')?result.readings.map(r=>r[1]).join(' · '):yes&&has('solid')?'Bubbles form as gas is released. Fit the stopper to collect it.':'Compare a reacting solid with copper, which gives no H₂ here.';
 }
 if((id==='extraction'&&v.method!=='electrolysis')||id==='thermite'){
  body+=`<path d="M250 105H390L410 320H230Z" fill="#abb1a1" stroke="#55726f" stroke-width="3"/><path d="M265 119H375L390 304H250Z" fill="${has('heat')||has('run')?'#d5a073':'#d1d5c9'}"/>`;
  if(has('ore')||has('mixture'))body+=grains(275,252,'#8c7964')+grains(278,281,'#505e5b');
  body+=`<path d="M400 290H460V335" fill="none" stroke="#607d7a" stroke-width="10"/><path d="M420 348h100l-12 25h-76Z" fill="#b9cac0" stroke="#5a7a72" stroke-width="2"/>`;
  const success=id==='thermite'?v.mixture==='Al':result.readings[2][1]==='Metal can be obtained';
  if((has('run')||has('outlet'))&&success)body+='<path class="metal-stream" d="M460 334v22" stroke="#e3ae70" stroke-width="9"/><ellipse cx="470" cy="359" rx="26" ry="6" fill="#ce9f72"/>';
  footer=id==='thermite'?'Virtual reaction model · specialist demonstration chemistry.':`Selected extraction route: ${v.method}.`;
 }
 if(id==='alloys'){
  body+=label(165,100,'Pure metal','large')+label(415,100,'Alloy','large');
  body+=`<g class="pure-lattice" style="--layer-shift:${has('push')?24:0}px">${lattice(110,155,false)}</g><g class="alloy-lattice" style="--layer-shift:${has('push')?4:0}px">${lattice(360,155,true)}</g>`;
  footer=has('push')?'The same model force: regular layers move farther; distorted layers resist slipping.':'Compare regular layers with an arrangement of different-sized atoms.';
 }
 if(id==='electrons'){
  body+=`<circle cx="160" cy="190" r="63" fill="#b9cdd0" stroke="#597f85" stroke-width="3"/><circle cx="445" cy="190" r="63" fill="#b5d3bd" stroke="#597f74" stroke-width="3"/>`+label(160,196,v.reaction==='magnesium'?has('transfer')?'2Mg²⁺':'2Mg':has('transfer')?'Zn²⁺':'Zn','large')+label(445,196,v.reaction==='magnesium'?has('transfer')?'2O²⁻':'O₂':has('transfer')?'Cu':'Cu²⁺','large');
  if(has('combine'))body+=label(300,320,v.reaction==='magnesium'?'2Mg + O₂ → 2MgO':'Zn + Cu²⁺ → Zn²⁺ + Cu');footer='Particle model · oxidation and reduction happen together.';
 }
 if(id==='photography'){
  body+=[['Developer',210,255],['Fixer',420,255],['Rinse',320,320]].map(([name,x,y])=>`<rect x="${x-75}" y="${y-32}" width="150" height="72" rx="13" fill="#c5d9cd" stroke="#63867b" stroke-width="3"/>${label(x,y+61,name)}`).join('');
  const pos=has('rinse')?[320,320]:has('fix')?[420,255]:has('develop')?[210,255]:[300,160];
  if(a?.tool!=='film')body+=toolArt('film',...pos,{v});
  if(has('develop'))body+=`<rect x="${pos[0]-35}" y="${pos[1]-28}" width="70" height="56" fill="#344342" opacity="${.2+v.exposure*.12}"/>`;
  footer=has('rinse')?'Fixed and rinsed: unexposed silver halide removed.':has('develop')?'The developer reduces exposed silver ions to dark silver.':has('expose')?'A latent image has formed; it is not visibly dark yet.':'The leaf-shaped mask blocks light from part of the film.';
 }
 if(id==='combustion'){
  body+=`<rect x="126" y="238" width="48" height="105" rx="8" fill="#e6dfc5" stroke="#a1a48d" stroke-width="2"/><path d="M150 238v-12" stroke="#5a6761" stroke-width="3"/>`;
  if(has('light'))body+='<path class="live-flame" d="M150 179q-34 40 0 54q34-16 0-54Z" fill="#e9b75e"/><path class="live-flame" d="M150 211q-12 17 0 20q12-4 0-20Z" fill="#91bed0"/>'+(v.air==='limited'?'<g class="steam"><path d="M150 175q20-35 0-65" stroke="#7f8c85" stroke-width="12" opacity=".4" fill="none"/></g>':'');
  if(has('hood'))body+=toolArt('hood',150,140,{v})+'<path class="flow-line" d="M150 84V51H350V180H420" stroke="#6a9197" stroke-width="7" fill="none"/>';
  if(has('test'))body+=tube(380,180,'#94c5dc','Water')+flask(500,220,'#e7e8d9','Limewater');
  footer='Water: white CuSO₄ → blue · CO₂: limewater → milky.';
 }
 if(id==='distillation'){
  body+='<rect x="280" y="74" width="100" height="248" rx="10" fill="url(#heat)" stroke="#4e7d7c" stroke-width="3"/>';
  body+=[105,150,195,240,285].map(y=>line(285,y,374,y,'#eddfb2',4)+line(380,y,430,y,'#6d9190',5)).join('');
  body+=burner(330,334,has('heat'))+label(210,92,'Cooler')+label(215,338,'Hotter');
  const bp={hexane:69,octane:126,decane:174,hexadecane:287,eicosane:343}[v.component],vapour=v.heat>=bp,outletY=Math.max(105,Math.min(285,80+(bp-25)/(v.heat-25)*230));
  body+=line(380,outletY,450,outletY,'#c19666',5)+`<circle cx="430" cy="${outletY}" r="8" fill="#f1d39f" stroke="#ac8252" stroke-width="2"/>`;
  if(has('flow')&&vapour)body+=`<path class="vapour-flow" d="M329 310V${outletY}H450" fill="none" stroke="#fff3cf" stroke-width="5" stroke-dasharray="9 9"/>`;
  if(has('collect'))body+=flask(450,outletY+20,vapour?'#d3b27b':'#edf3ef');
  footer=has('flow')&&!vapour?'The base is not hot enough to vaporise this selected component.':'A physical separation: hydrocarbon bonds are retained.';
 }
 if(id==='cracking'&&v.pathway!=='diene'){
  body+='<rect x="192" y="140" width="275" height="90" rx="25" fill="url(#glass)" stroke="#567e86" stroke-width="3"/>'+grains(280,209,v.conditions==='no-catalyst'?'#cfdbd4':'#c7ae87')+burner(340,270,has('heat')&&v.conditions!=='cold');
  if(has('flow'))body+='<path class="vapour-flow" d="M199 180H455" stroke="#d8b98c" stroke-width="6" stroke-dasharray="10 9" fill="none"/>';
  if(has('collect'))body+=tube(470,205,'#d3e4de','Products');footer=`Conditions: ${v.conditions==='both'?'hot catalyst':v.conditions==='cold'?'cold catalyst':'same temperature, no catalyst'}.`;
 }
 if(id==='cracking'&&v.pathway==='diene'){
  const products=dieneCracking(v.n,v.dieneC),reacting=has('flow')&&v.conditions==='both',collected=has('collect')&&reacting;
  body+='<rect x="140" y="130" width="230" height="76" rx="22" fill="url(#glass)" stroke="#547b82" stroke-width="3"/>'+(v.conditions==='no-catalyst'?'':grains(230,190,'#bfa782'))+burner(260,252,has('heat')&&!has('off')&&v.conditions!=='cold');
  body+=label(257,112,v.conditions==='no-catalyst'?'Reactor · no catalyst':v.conditions==='cold'?'Cold reactor · catalyst':'Heated reactor · suitable catalyst')+label(260,350,'Virtual heater');
  if(has('feed'))body+='<path d="M101 180H140" fill="none" stroke="#759796" stroke-width="6"/>'+label(87,157,products.feed);
  if(reacting&&!has('off'))body+='<path class="vapour-flow" d="M144 166H366" stroke="#d9b98b" stroke-width="5" stroke-dasharray="8 9" fill="none"/>';
  if(has('trap')){
   body+='<path d="M370 166H415V206" fill="none" stroke="#6c9197" stroke-width="6"/>'+flask(430,206,collected?'#d1bb8c':'#d9e8ee',collected?'Products':'Cold trap');
   body+='<rect x="363" y="255" width="134" height="77" rx="16" fill="#b5d7e82b" stroke="#83b3c7" stroke-width="2" stroke-dasharray="5 4"/>'+label(430,354,'Virtual cold trap','small');
   if(reacting&&!has('off'))body+='<path class="falling-drop" d="M430 241q-5 9 0 13q5-4 0-13Z" fill="#c3a87a"/>';
  }
  if(has('syringe')){
   body+='<path d="M445 206V145H420V100H425" fill="none" stroke="#6c9197" stroke-width="6"/>'+'<rect x="425" y="80" width="120" height="40" rx="6" fill="url(#glass)" stroke="#517780" stroke-width="3"/>'+label(495,142,'Gas syringe');
   // The collection animation moves the plunger; this is not a calibrated volume.
   body+='<rect x="428" y="83" width="113" height="34" fill="#cde5e6" opacity=".6"/>';
   body+=`<g data-hydrogen-plunger transform="translate(${collected?65:0} 0)"><path d="M437 84v32m0-16h55m0-20v40" stroke="#426c78" stroke-width="5"/></g>`;
   body+=label(495,49,collected?'Residual gas: H₂':'Gas collection','small');
   if(collected)body+='<circle cx="454" cy="100" r="8" fill="#f2f2df" stroke="#89a89e"/><circle cx="474" cy="100" r="8" fill="#f2f2df" stroke="#89a89e"/>'+line(462,100,466,100,'#7c9d90',2);
  }
  if(collected){
   body+='<rect x="15" y="282" width="172" height="94" rx="12" fill="#f6f2df" stroke="#b9cbb8"/>'+label(102,300,'Diene: same carbon chain','tiny')+chain(35,331,v.dieneC,[1,3],'#699a88',24);
   if(has('bonds'))body+=[47,95].map(x=>`<ellipse data-diene-double-bond cx="${x}" cy="331" rx="18" ry="10" transform="rotate(47 ${x} 331)" fill="#e9b96533" stroke="#b77d47" stroke-width="2"/>`).join('');
   body+=label(102,367,s.extra.balanceVerified?products.diene:`C${v.dieneC}H?`,'tiny');
  }
  if(has('test'))body+=label(523,235,collected?'Squeaky pop':'No gas / no pop','small');
  footer=has('bonds')?'Both C=C bonds belong to one molecule. Now balance the products.':has('test')?'Hydrogen gives a pop with a burning splint in this virtual test.':collected?'The cold trap retains hydrocarbons; the remaining gas is hydrogen.':'An idealised cracking + dehydrogenation channel · gas syringe is schematic.';
  if(!reacting&&has('collect'))footer='No products under these model conditions. Change the conditions and repeat.';
 }
 if(['hydrocarbons','addition-polymers','functional-groups','condensation'].includes(id)){
  body+='<rect x="170" y="98" width="375" height="220" rx="20" fill="#f8f7ec" stroke="#b5cbbd" stroke-width="2" stroke-dasharray="5 5"/>';
  if(id==='hydrocarbons'&&has('carbon')){
   const n=v.n,step=Math.min(36,270/(n-1)),x=330-(n-1)*step/2,unsat=v.family==='alkene';body+=chain(x,210,n,unsat,'#6c9a88',step);
   if(has('hydrogen')){const h=unsat?2*n:2*n+2;for(let i=0;i<n;i++){
    const px=x+i*step,py=210+(i%2?13:-13),left=i===0?0:unsat&&i===1?2:1,right=i===n-1?0:unsat&&i===0?2:1,hydrogens=4-left-right;
    const positions=hydrogens===1?[[0,py>210?39:-39]]:hydrogens===2?[[0,-39],[0,39]]:[[0,-39],[0,39],[i===0?-32:32,0]];
    for(const[dx,dy]of positions)body+=line(px,py,px+dx,py+dy,'#9cad9c',1.5)+`<circle class="result-reveal" cx="${px+dx}" cy="${py+dy}" r="9" fill="#f2f1dd" stroke="#94aa96"/>`+label(px+dx,py+dy+3,'H','tiny');
   }body+=label(330,290,`${n} carbon atoms · ${h} hydrogen atoms`);}
   footer=has('inspect')?result.readings[0][1]:'Count bond orders: each carbon needs four bonds.';
  }
  if(id==='addition-polymers'&&has('monomers')){
   const group={ethene:'H',propene:'CH₃',chloroethene:'Cl'}[v.monomer];
   if(has('join')){const spacing=Math.min(29,290/(v.count*2-1));body+=chain(205,180,v.count*2,false,'#709b89',spacing);for(let i=0;i<v.count;i++){const x=205+(i*2+1)*spacing;body+=line(x,193,x,227,'#7e9c8c',2)+label(x,247,group);}body+=label(330,291,result.readings[1][1],'large');}
   else for(let i=0;i<v.count;i++){const x=220+i%3*100,y=160+Math.floor(i/3)*83;body+=chain(x,y,2,!has('open'))+line(x+36,y+13,x+36,y+35,'#7e9c8c',2)+label(x+36,y+49,group);}
   footer=has('join')?'All monomer atoms remain in the chain; no small molecule is released.':'Side groups stay attached when the C=C bonds open.';
  }
  if(id==='functional-groups'&&has('formula')){
   const [prefix,group]=structureData[v.compound];body+=label(235,187,prefix,'structure');body+=`<rect x="278" y="151" width="238" height="56" rx="12" fill="${has('group')?'#f1d3ae':'transparent'}" stroke="${has('group')?'#c08957':'transparent'}"/>`+label(396,187,group,'structure');
   if(has('inspect'))body+=label(340,276,structureData[v.compound][2],'large');footer='Inspect the whole group, including the carbonyl where present.';
  }
  if(id==='condensation'){
   body+='<rect x="190" y="159" width="120" height="62" rx="12" fill="#d6ad8c" stroke="#947052" stroke-width="2"/>'+label(250,196,'R–COOH');
   if(has('group'))body+=toolArt('group',400,190,{v});
   if(has('water'))body+=line(310,190,340,190,'#bb805c',5)+label(330,275,v.route==='polyamide'?'New –CONH– link':'New –COO– link');
   body+='<rect x="437" y="259" width="86" height="75" rx="12" fill="#c9dfe0" stroke="#6e9894" stroke-width="2"/>'+label(480,356,'Water tray');
   if(has('water'))body+=label(480,301,'H₂O');footer=has('link')?`${result.readings[2][1]} water molecule(s) in the complete finite model.`:'Group model: remove H and OH, then form the new link.';
  }
 }
 // Physical source objects persist at their placed position until used.
 if(has('dropper')&&a?.id==='squeeze')body+=toolArt('dropper',...(id==='titration'?[260,255]:[340,95]),{v});
 if(has('pipette')&&a?.id==='release')body+=toolArt('pipette',230,255,{v});
 if(working){
  if(a.kind==='move'){
   body+=`<g class="bench-target" data-bench-target tabindex="0" role="button" aria-label="Place here: ${escape(a.label)}"><rect x="${a.to[0]-43}" y="${a.to[1]-43}" width="86" height="86" rx="18" fill="#efc6851c" stroke="#b87842" stroke-width="2" stroke-dasharray="6 5"/>${label(a.to[0],a.to[1]+59,'PLACE HERE','target-label')}</g>`;
   body+=`<g data-bench-source role="button" tabindex="0" aria-pressed="false" aria-label="${escape(a.label)}" class="bench-object">${toolArt(a.tool,...a.from,{v,name:sampleLabel})}<rect x="${a.from[0]-48}" y="${a.from[1]-85}" width="96" height="170" rx="15" fill="transparent"/>${label(a.from[0],a.from[1]+102,'MOVE ME','target-label')}</g>`;
  }else if(a.kind==='motion'){
   if(a.tool==='handle')body+=toolArt('handle',...a.from,{v});
   body+=`<g data-bench-source role="button" tabindex="0" aria-pressed="false" aria-label="${escape(a.label)}" class="bench-object"><rect x="${a.from[0]-45}" y="${a.from[1]-55}" width="90" height="110" rx="16" fill="#efd3a211" stroke="#b87842" stroke-width="2" stroke-dasharray="6 5"/>${label(a.from[0],a.from[1]+82,'DRAG SIDEWAYS →','target-label')}</g>`;
  }else{
   if(a.tool)body+=toolArt(a.tool,...a.to,{v});
   body+=`<g data-bench-tap role="button" tabindex="0" aria-label="${escape(a.label)}" class="bench-tap"><rect x="${a.to[0]-34}" y="${a.to[1]-30}" width="68" height="60" rx="14" fill="#e3b16a18" stroke="#b87842" stroke-width="2"/>${label(a.to[0],a.to[1]+49,'USE ME','target-label')}</g>`;
  }
 }
 if(footer)body+=`<foreignObject x="25" y="391" width="550" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="bench-scene-note">${escape(footer)}</div></foreignObject>`;
 body+='<g id="reaction-fx" pointer-events="none"></g>';
 return svg(body,`${d.title}: interactive apparatus`).replace('viewBox="0 0 600 400" role="img"','viewBox="0 0 600 440" role="group"').replace('<rect width="600" height="400"','<rect width="600" height="440"').replace('M0 346H600V400H0Z','M0 346H600V440H0Z');
}
export function effectArt(action){
 const [x,y]=action.to;
 if(action.effect==='hydrogen-pop')return `<g class="hydrogen-pop"><path d="M${x} ${y-20}l6 14 15-5-8 14 11 10-16 1-3 15-8-13-15 5 7-14-11-10 15-1Z" fill="#efca82" stroke="#bc855b"/>${label(x,y-35,'pop!','large')}</g>`;
 if(action.effect==='condense')return `<path class="falling-drop" d="M${x} ${y-18}q-7 12 0 16q7-4 0-16Z" fill="#c9a572"/>`;
 if(action.effect==='drops')return Array.from({length:4},(_,i)=>`<path class="falling-drop" style="--drop-delay:${i*.16}s" d="M${x} ${y+55}q-9 15 0 19q9-4 0-19Z" fill="#ac7e99"/>`).join('');
 if(action.effect==='pour')return `<path class="pour-stream" d="M${x} ${y+22}q-15 25 4 67" fill="none" stroke="#9bc3ca" stroke-width="8" stroke-linecap="round"/>`;
 if(action.effect==='solid')return `<g class="falling-solid">${grains(x-35,y+10)}</g>`;
 if(action.effect==='flash')return '<rect x="180" y="100" width="240" height="130" rx="12" fill="#fff0a9" class="light-flash"/>';
 if(action.effect==='time')return '<circle cx="490" cy="100" r="36" fill="none" stroke="#90bca1" stroke-width="5" class="timer-ring"/>';
 if(action.effect==='water')return `<g class="falling-solid">${label(x,y+10,'H₂O','large')}</g>`;
 return '';
}
