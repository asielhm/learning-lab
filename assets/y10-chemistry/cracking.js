import {alkane,alkene,dieneCracking} from './science.mjs?v=diene-1';
import {svg,text,line,chain,burner} from './drawing.js?v=diene-1';
import {choice,range,question} from './acids.js';
const ordinary=range('k','Carbon atoms in the alkene product',2,4,2);
ordinary.showIf=v=>v.pathway!=='diene';
const dieneSize=range('dieneC','Carbon atoms in the diene product',4,6,4);
dieneSize.showIf=v=>v.pathway==='diene';
export const cracking={
 id:'cracking',title:'Crack a long-chain alkane',
 subtitle:'Compare ordinary cracking with a challenge that forms a diene and hydrogen. Conserve every carbon and hydrogen atom.',
 controls:[choice('pathway','Investigation',[['standard','Standard · alkane + alkene'],['diene','Challenge · alkane + diene + hydrogen']]),range('n','Carbon atoms in the starting alkane',8,12,10,2),ordinary,dieneSize,choice('conditions','Model reaction conditions',[['both','Hot, suitable catalyst'],['cold','Cold catalyst'],['no-catalyst','Same temperature, no catalyst']])],
 steps:['Vaporise the starting hydrocarbon','Pass the vapour through the selected catalytic reactor','Collect and identify the model products'],
 columns:['Starting formula','Conditions','Alkane product','Other products'],
 model(v,p,e={}){
  const challenge=v.pathway==='diene',ok=v.conditions==='both',first=alkane(v.n);
  const products=challenge?dieneCracking(v.n,v.dieneC):null;
  const a=challenge?products.alkane:alkane(v.n-v.k),b=challenge?products.diene:alkene(v.k);
  const scene=svg(`<rect x="93" y="102" width="414" height="90" rx="28" fill="url(#glass)" stroke="#557d85" stroke-width="3"/>`+Array.from({length:12},(_,i)=>`<ellipse cx="${250+i*13}" cy="${166-i%3*11}" rx="9" ry="6" fill="${v.conditions==='no-catalyst'?'#c5d3ce':'#c7ae88'}"/>`).join('')+burner(309,225,p>=2&&v.conditions!=='cold')+text(300,64,challenge?'Cracking + dehydrogenation challenge':'Catalytic-cracking teaching model','small')+(p>=3&&ok?chain(45,323,challenge?v.n-v.dieneC:v.n-v.k,false,'#638980',24)+chain(385,323,challenge?v.dieneC:v.k,challenge?[1,3]:true,'#bd8e67',26):chain(112,145,v.n,false))+text(300,385,p>=3&&ok?`${a} + ${b}${challenge?' + H₂':''}`:first,'large'), 'A virtual cracking reactor and molecular products');
  if(!challenge)return {
   drawing:scene,equation:ok?`${first} → ${a} + ${b}`:'No catalytic cracking shown under these selected conditions.',
   readings:[['Starting molecule',first],['Alkane product',ok?a:'Not formed'],['Alkene product',ok?b:'Not formed']],
   row:[first,v.conditions,ok?a:'None',ok?b:'None'],
   explanation:'This model chooses one balanced alkane + alkene split; real cracking produces a mixture. The same total numbers of C and H atoms appear on both sides. Catalytic cracking needs a suitable catalyst and temperature. Thermal cracking can occur without a catalyst under different, more severe conditions; the “no catalyst” comparison here holds the model temperature fixed.',
   question:question('Why are alkenes among the products of cracking alkanes?','The available hydrogen can be conserved by forming some unsaturated products.',['Cracking creates extra hydrogen atoms from nothing.','Every product must have the starting chain length.','Cracking is only evaporation.'],'An alkane can split into a shorter alkane plus an alkene while conserving every carbon and hydrogen atom.')
  };
  const verified=ok&&p>=3&&e.balanceVerified===true;
  return {
   drawing:scene,complete:verified,balance:products,
   nextInstruction:ok?'Explain the extra gas: complete the atom-balance challenge on this bench.':'No diene or hydrogen formed in this model. Choose hot, suitable catalyst in Choose conditions and repeat the practical.',
   equation:!ok?'No cracking/dehydrogenation shown under these selected conditions.':verified?`${first} → ${a} + ${b} + H2`:`${first} → ${a} + C${v.dieneC}H? + ? H2 · complete the balance on the bench`,
   readings:[['Alkane product',ok?a:'Not formed'],['Diene · two C=C bonds',ok?verified?b:`C${v.dieneC}H?`:'Not formed'],['Extra gas',ok?'H₂ · burning-splint pop':'No gas in this model']],
   row:[first,'Diene challenge · '+v.conditions,ok?a:'None',ok?`${b} + H2`:'None'],
   explanation:!verified?'An acyclic diene has two C=C bonds in the same chain. Use carbon valence to find its hydrogen count, then account for any remaining hydrogen as H₂. This selected pathway combines cracking with dehydrogenation. The cold trap is assumed to retain both hydrocarbons; it is assumed cold enough to retain both hydrocarbon products.':`An acyclic diene has two C=C bonds and the formula CₘH₂ₘ₋₂. This example uses a 1,3-diene, with both double bonds in the same chain. The idealised channel combines C–C cracking with dehydrogenation: ${first} → ${a} + ${b} + H₂. Carbon: ${v.n} = ${v.n-v.dieneC} + ${v.dieneC}. Hydrogen: ${products.hydrogenLeft} = ${products.hydrogenInHydrocarbons} + 2. Real cracking gives a mixture; these chosen conditions stand for a suitable pathway and do not guarantee a single product or a measured yield. The virtual cold trap is assumed cold enough to retain both hydrocarbon products, which may include very low-boiling compounds, so the remaining gas is H₂.`,
   question:question('Why is one H₂ molecule needed in this particular balanced pathway?','The alkane and diene products contain two fewer hydrogen atoms than the feed.',['A diene has two separate carbon chains.','Each double bond creates a new carbon atom.','Every cracking reaction always produces hydrogen.'],'Count the atoms: the missing two hydrogens form one H₂. Hydrogen is a product of this selected cracking/dehydrogenation pathway, not a compulsory product of all cracking reactions.')
  };
 }
};
