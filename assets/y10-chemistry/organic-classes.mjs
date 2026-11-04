// Scope the existing instrument-driven lab to the class being studied.
const scopes={
 'alcohols-carboxylic-acids':{compounds:['ethanol','ethanoic'],routes:[]},
 'esters-polyesters':{compounds:[],routes:['ester','polyester']},
 'amines-amides-polyamides':{compounds:['amine','amide'],routes:['polyamide']}
};
export function organicClassDefinitions(definitions,slug){
 if(!slug)return definitions;
 const scope=scopes[slug];if(!scope)throw new RangeError('Unknown organic chemistry class');
 return definitions.filter(d=>d.id==='functional-groups'&&scope.compounds.length||d.id==='condensation'&&scope.routes.length).map(d=>({...d,
  controls:d.controls.map(c=>{const allowed=c.id==='compound'?scope.compounds:c.id==='route'?scope.routes:null;if(!allowed)return c.id==='pairs'?{...c,showIf:v=>v.route!=='ester'}:{...c};const options=c.options.filter(([id])=>allowed.includes(id));return {...c,options,value:options[0][0]};}),
  model(...args){
   const result=d.model(...args),q=result.question,correct=q.options[q.answer];
   let options;
   if(d.id==='functional-groups'){
    const families=slug==='alcohols-carboxylic-acids'?['Alcohol','Carboxylic acid']:['Amine','Amide'];
    options=[correct,...families.filter(f=>f!==correct),'Both of these families in this displayed group','Neither family'];
   }else if(args[0].route==='ester')options=[correct,'Ethyl ethanoate with no water formed.','An indefinitely growing chain from these two single-ended molecules.','Water only, with no organic product.'];
   else options=[correct,'Each monomer has only one reactive end.','No new covalent bonds are made.','Water is never released in this chosen route.'];
   return {...result,question:{...q,options,answer:0}};
  },
  ...(d.id==='condensation'&&slug==='amines-amides-polyamides'?{subtitle:'Model amide-link formation under suitable reaction conditions; compare this with ordinary acid–base salt formation.'}:{})
 }));
}
