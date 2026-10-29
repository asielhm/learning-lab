export const key='learning-lab-oaf-v1';
export function load(){try{const v=JSON.parse(localStorage.getItem(key)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{};}catch{return {};}}
export function unitState(id){const value=load()[id];return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}
export function completed(id){const values=unitState(id).complete;return Array.isArray(values)?[...new Set(values.filter(n=>Number.isInteger(n)&&n>=0&&n<4))]:[];}
export function save(id,patch){try{const all=load();all[id]={...unitState(id),...patch};localStorage.setItem(key,JSON.stringify(all));return true;}catch{return false;}}
export function refresh(){document.querySelectorAll('[data-progress]').forEach(el=>{el.textContent=`${completed(el.dataset.progress).length} de 4 lecciones comprobadas`;});}
refresh();window.addEventListener('storage',refresh);
