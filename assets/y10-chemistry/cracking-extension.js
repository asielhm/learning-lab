import {validDieneBalance} from './science.mjs?v=diene-1';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function createCrackingExtension(){
 const panel=document.createElement('section');panel.id='cracking-extension';panel.className='cracking-extension';panel.hidden=true;panel.setAttribute('aria-labelledby','cracking-extension-title');
 document.querySelector('.bench-toolbar').before(panel);
 return function render({active,state,result,finished,busy,onMode,onVerified}){
  panel.hidden=active.id!=='cracking';if(panel.hidden)return;
  const challenge=state.values.pathway==='diene',formed=state.values.conditions==='both',p=result.balance;
  // The balance is part of the bench. Put it beside the evidence once collection ends.
  if(challenge&&finished)document.querySelector('#bench-status').before(panel);else document.querySelector('.bench-toolbar').before(panel);
  panel.innerHTML=`<div class="cracking-extension-heading"><div><div class="eyebrow">${challenge?'CHALLENGE IN PROGRESS':'GO FURTHER · CRACKING'}</div><h3 id="cracking-extension-title">${challenge?'Two C=C bonds. Account for the extra gas.':'Can cracking produce a diene and hydrogen?'}</h3><p>${challenge?'Build and use the apparatus, inspect the diene chain and collect the extra gas.':'A diene has two double bonds in the same carbon chain. Investigate a cracking and dehydrogenation pathway, then balance every atom.'}</p></div><button type="button" class="bench-button ${challenge?'':'primary'}" id="cracking-pathway">${challenge?'Return to standard cracking':'Start diene challenge →'}</button></div>`;
  panel.querySelector('#cracking-pathway').disabled=busy;
  panel.querySelector('#cracking-pathway').onclick=()=>onMode(challenge?'standard':'diene');
  if(!challenge||!finished)return;
  if(!formed){panel.insertAdjacentHTML('beforeend','<p class="cracking-retry">No products were collected under these model conditions. Open Choose conditions, select Hot, suitable catalyst and repeat the investigation.</p>');return;}
  if(state.extra.balanceVerified){
   panel.insertAdjacentHTML('beforeend',`<div id="cracking-balance-feedback" class="cracking-balance-feedback" role="status" data-state="correct"><b>Balanced: ${escape(p.feed)} → ${escape(p.alkane)} + ${escape(p.diene)} + H₂</b><p>Carbon: ${p.carbonLeft} = ${p.carbonRight}. Hydrogen: ${p.hydrogenLeft} = ${p.hydrogenInHydrocarbons} + 2. One H₂ molecule accounts for the remaining two hydrogen atoms. You can record this trial.</p></div>`);return;
  }
  panel.insertAdjacentHTML('beforeend',`<form id="cracking-balance"><p class="cracking-balance-prompt"><b>Complete the products:</b> ${escape(p.feed)} → ${escape(p.alkane)} + C${p.dieneC}H? + ? H₂</p><div class="cracking-balance-fields"><label for="diene-hydrogens">Hydrogen atoms in C${p.dieneC}H?<input id="diene-hydrogens" name="hydrogens" type="number" min="0" max="30" step="1" required autocomplete="off"></label><label for="hydrogen-coefficient">Coefficient before H₂<input id="hydrogen-coefficient" name="coefficient" type="number" min="0" max="10" step="1" required autocomplete="off"></label><button type="submit" class="bench-button primary">Check the atom balance</button></div><p id="cracking-balance-feedback" class="cracking-balance-feedback" role="status">Count carbon and hydrogen on both sides. An acyclic diene has two C=C bonds and formula CₘH₂ₘ₋₂.</p></form>`);
  panel.querySelector('#cracking-balance').onsubmit=event=>{
   event.preventDefault();if(busy)return;
   const h=Number(event.currentTarget.elements.hydrogens.value),coefficient=Number(event.currentTarget.elements.coefficient.value);
   const correct=validDieneBalance(state.values.n,state.values.dieneC,h,coefficient),feedback=panel.querySelector('#cracking-balance-feedback');
   if(correct){onVerified();return;}
   feedback.dataset.state='incorrect';
   feedback.textContent=h!==p.dieneH?'Check the diene first: start from CₘH₂ₘ₊₂ and remove two hydrogen atoms for each C=C bond. There are two double bonds in this chain.':'Your diene formula is correct. Subtract the hydrogen atoms in both hydrocarbon products from the feed; remember that each H₂ molecule contains two hydrogen atoms.';
  };
 };
}
