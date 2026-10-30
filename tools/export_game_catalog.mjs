import {controls} from '../assets/unit-games/models.mjs';
import {units} from '../assets/unit-games/data.mjs';
import {algebraGames} from '../assets/unit-games/algebra-data.mjs';
import {coordinatePackGames} from '../assets/unit-games/coordinate-pack.mjs';
import {pictures,words,laws} from '../activities/y9/science/gas-laws/games/data.mjs';
import {MISSIONS,COMPONENTS,NODES} from '../assets/blood-vessels/model.mjs';
import {createHash} from 'node:crypto';
const games={};
const solutionText=(kind,solution)=>{
 if(Array.isArray(solution))return solution.join(' ');
 if(!solution||typeof solution!=='object')return solution;
 const labels=Object.fromEntries((controls[kind]||[]).map(c=>[c[0],c]));
 const extra={moves:'Signed moves in order',slices:'Selected slice indices (starting at zero)',volume:'Volume delivered / mL',bonds:'Bond orders in chain (1 = single, 2 = double)'};
 return Object.entries(solution).map(([key,value])=>{const c=labels[key],choice=c&&Array.isArray(c[2])?c[2].find(([v])=>v===value)?.[1]:null;return (c?.[1]||extra[key]||key)+': '+(choice|| (Array.isArray(value)?value.join(', '):value));}).join('; ');
};
const add=(id,title,course,topic,rounds,grader='reported',rule='standard')=>{const value={id,title,course,topic,grader,rule,rounds};value.signature=createHash('sha256').update(JSON.stringify(value)).digest('hex');games[id]=value;};
for(const u of units)for(const mode of ['classic','workshop']){const g=u[mode];if(!g)continue;add(u.id+'-'+mode,g.title,`Year ${u.year.slice(1)} ${u.subject==='maths'?'Maths':u.subject==='physics'?'Physics':'Chemistry'}`,u.year==='y10'?(u.subject==='physics'?'y10-physics-'+u.topic:({'acids-and-bases':'y10-acids-bases','organic-chemistry':'y10-organic'}[u.topic]||'y10-'+u.topic)):u.topic,Object.fromEntries(g.rounds.map((r,i)=>[String(i),{prompt:r.prompt,explanation:r.explanation||r.why,solution:r.solution?solutionText(g.kind,r.solution):r.cards.map(c=>`${c.label} → ${r.bins.find(b=>b.id===c.bin)?.label}`).join('; ')}])));}
for(const g of algebraGames)add('algebra-'+g.id,g.title,'Year 7 Maths','algebra-i',Object.fromEntries(g.rounds.map((r,i)=>[String(i),{prompt:r.title,explanation:r.why}])));
for(const g of coordinatePackGames)add('coordinates-'+g.id,g.title,'Year 7 Maths','algebra-i',Object.fromEntries(g.rounds.map((r,i)=>[String(i),{prompt:r.title,explanation:r.why||'Read x across first, then y up; lift the pencil at NEW LINE.'}])));
add('gas-picture','Name That Gas Law','Year 9 Science','gas-laws',Object.fromEntries(pictures.map(r=>[r.id,{prompt:r.title+': '+r.story+' '+r.condition,explanation:r.why,law:r.law,quantities:laws[r.law].quantities,solution:laws[r.law].name+' · '+laws[r.law].quantities.join(', ')}])),'picture');
add('gas-word','Mystery Word','Year 9 Science','gas-laws',Object.fromEntries(words.map(r=>[r.id,{prompt:r.clue,explanation:r.explanation,accepted:[r.answer,...(r.aliases||[])],solution:r.answer}])),'word');
add('blood-dispatch','Transport Dispatch','Year 9 Science','blood-vessels',Object.fromEntries(MISSIONS.map(r=>[r.id,{prompt:r.title+': '+r.need+' '+r.question,explanation:r.why,carrier:r.carrier,target:r.target,answer:r.answer,options:r.options,solution:COMPONENTS[r.carrier].name+' → '+NODES[r.target].name+'; '+r.options[r.answer]}])),'dispatch','dispatch');
process.stdout.write(JSON.stringify(games));
