export const key='learning-lab-oaq-v1';
export function load(){try{const v=JSON.parse(localStorage.getItem(key)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{};}catch{return {};}}
export function unitState(id){const value=load()[id];return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}
export function completed(id){const values=unitState(id).complete;return Array.isArray(values)?[...new Set(values.filter(n=>Number.isInteger(n)&&n>=0&&n<4))]:[];}
export function save(id,patch){try{const all=load();all[id]={...unitState(id),...patch};localStorage.setItem(key,JSON.stringify(all));return true;}catch{return false;}}
export function refresh(){document.querySelectorAll('[data-progress]').forEach(el=>{el.textContent=`${completed(el.dataset.progress).length} de 4 lecciones comprobadas`;});}
refresh();window.addEventListener('storage',refresh);
const orientation=document.querySelector('#orientation-form');
orientation?.addEventListener('submit',event=>{event.preventDefault();const values=[0,1,2].map(i=>orientation.querySelector(`[name=orientation-${i}]:checked`)?.value);if(values.some(v=>v===undefined))return;let path,message;
 if(values[0]!=='0'){path='nivel-inicial/serie-1/';message='Empezá por Materia, sistemas y átomos (Inicial, serie 1). Al duplicar una muestra uniforme, masa y volumen crecen juntos, pero densidad = masa/volumen permanece igual. Construí esa base y seguí las cuatro series del Inicial.';}
 else if(values[1]!=='1'){path='nivel-1/serie-1/';message='Tu punto de partida recomendado es Nivel 1, serie 1: reactivo limitante. En el ejemplo, H₂ permite 3/2 = 1,5 avances y O₂ permite 1/1 = 1; O₂ se agota primero. Si los moles todavía te cuestan, el enlace «repaso previo» te lleva a Inicial.';}
 else if(values[2]!=='0'){path='nivel-2/serie-4/';message='Podés comenzar revisando equilibrio (Nivel 2, serie 4). Q < K indica que faltan productos respecto del equilibrio: la reacción avanza hacia ellos. Revisá los requisitos de la unidad y recorré también las otras tres series del nivel.';}
 else{path='nivel-2/serie-1/';message='Resolviste estas tres ideas correctamente. Probá Nivel 2 desde la serie 1 y usá las preguntas de cada unidad para detectar qué necesitás reforzar. Este control breve orienta tu estudio; no demuestra dominio de todo el nivel.';}
 const result=document.querySelector('#orientation-result');result.className='diagnostic-result';result.replaceChildren();const p=document.createElement('p');p.textContent=message;const a=document.createElement('a');a.href=path;a.className='button';a.textContent='Abrir mi punto de partida →';result.append(p,a);
});
