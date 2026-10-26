export function parseExpression(input) {
  if (typeof input !== 'string' || input.length > 200) return null;
  const text=input.toLowerCase().replace(/[−–]/g,'-').replace(/²/g,'^2').replace(/³/g,'^3').replace(/[\s×*]/g,'');
  if(!text||/[^a-z0-9+^\-]/.test(text)||/[+\-]{2}/.test(text))return null;
  const terms=text.match(/[+\-]?[^+\-]+/g);
  if(!terms||terms.join('')!==text)return null;
  const result={};
  for(const term of terms){
    const match=term.match(/^([+-]?)(\d*)([a-z])(?:\^([123]))?$/);
    let key,coefficient;
    if(match){key=match[3]+'^'+(match[4]||'1');coefficient=(match[2]?Number(match[2]):1)*(match[1]==='-'?-1:1);}
    else if(/^[+-]?\d+$/.test(term)){key='1';coefficient=Number(term);}
    else return null;
    if(!Number.isSafeInteger(coefficient)||Math.abs(coefficient)>1000000)return null;
    result[key]=(result[key]||0)+coefficient;
  }
  return Object.fromEntries(Object.entries(result).filter(([,n])=>n!==0));
}
export function sameExpression(input, expected) {
  const actual=typeof input==='string'?parseExpression(input):input;
  if(actual===null||actual===undefined)return false;
  const a=Object.entries(actual).filter(([,n])=>n!==0),b=Object.entries(expected).filter(([,n])=>n!==0);
  return a.length===b.length&&a.every(([key,value])=>expected[key]===value);
}
export function formatExpression(terms) {
  const entries=Object.entries(terms).filter(([,n])=>n!==0).sort(([a],[b])=>a==='1'?1:b==='1'?-1:a.localeCompare(b));
  if(!entries.length)return '0';
  return entries.map(([key,value],index)=>{
    const sign=value<0?(index?' − ':'−'):(index?' + ':'');const n=Math.abs(value);
    if(key==='1')return sign+n;
    const [letter,power]=key.split('^');return sign+(n===1?'':n)+letter+(power==='2'?'²':power==='3'?'³':'');
  }).join('');
}
export function sumTokens(tokens) {
  const result={};for(const token of tokens)result[token.key]=(result[token.key]||0)+token.sign;return result;
}
export function expandBag(n,a,b,type='1') {return {'x^1':n*a,[type==='y'?'y^1':'1']:n*b};}
