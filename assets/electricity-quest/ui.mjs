import{creator as baseCreator,consoleHTML as baseConsole,exerciseHTML as baseExercise,solutionHTML as baseSolution,E}from'../like-terms-rpg/ui.mjs';
import{LEVELS}from'./data.mjs';
import{labHTML,labSolution}from'./lab.mjs';
export const creator=(draft,saved)=>baseCreator(draft,saved).replaceAll('Runehaven','Voltvale').replace('Restore the runes of Voltvale, help its villagers and collect six lost relics. Every treasure is earned by understanding like terms.','Restore the electric city of Voltvale. Investigate charge, build complete circuits and collect six power relics. Every treasure is earned by applying the science.');
export const consoleHTML=()=>baseConsole().replace('Runehaven adventure','Voltvale electricity adventure');
export const exerciseHTML=c=>c.variant.type==='lab'?labHTML(c):baseExercise(c).replace('Drag a rune','Drag a card').replace('select a rune','select a card').replace('All runes are placed','All cards are placed').replace('Keep the sign with the term.','Use the scientific definition to choose a category.');
export const solutionHTML=v=>v.type==='lab'?labSolution(v):baseSolution(v);
export const levelRulesHTML=level=>`<p>${E(LEVELS[level].lesson)}</p><div class="rpg-worked"><h4>Worked example · follow the reasoning</h4><p>${E(LEVELS[level].example)}</p></div><p><a href="../${level<2?'static':'circuits'}/">Read the illustrated ${level<2?'static electricity':'circuits'} lesson →</a></p>`;
