import {parseExpression,sameExpression,formatExpression,sumTokens,expandBag} from './math.mjs';
const $=selector=>document.querySelector(selector),$$=selector=>[...document.querySelectorAll(selector)];
const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const feedback=(selector,text,correct)=>{const e=$(selector);e.hidden=false;e.textContent=text;e.classList.toggle('needs-work',!correct);};
function pen(){return '<svg class="pen-icon" viewBox="0 0 24 60" aria-hidden="true"><path d="m8 12 8 0-2 39-4 6-4-6z" fill="#c68b52"/><path d="M9 4h6l1 10H8z" fill="#476d78"/><path d="m10 52 2 5 2-5" fill="#233b40"/></svg>';}
function box(letter){return `<div class="unknown-box var-${letter}"><span class="box-label">${letter==='x'?'PEN BOX':'CLIP BOX'}</span><b>${letter}</b><small>unopened</small></div>`;}
function showSection(section){
 for(const id of ['translate','collect','bags'])$('#'+id+'Panel').hidden=id!==section;
 $$('[data-section]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.section===section)));
 $('#'+section+'Title').focus({preventScroll:true});$('#'+section+'Panel').scrollIntoView({block:'start'});
}
$$('[data-section]').forEach(button=>button.onclick=()=>showSection(button.dataset.section));
// 1. Translate concrete quantities into a sum of unknown and known counts.
const stories=[{text:'Build the number of pens in one unopened pen box.',x:1,y:0,c:0},{text:'Build one unopened pen box and three loose pens.',x:1,y:0,c:3},{text:'Build the total number of items in one pen box and one clip box.',x:1,y:1,c:0},{text:'Build the total number of items in two pen boxes and one clip box.',x:2,y:1,c:0},{text:'Build three pen boxes, two clip boxes and two loose pens.',x:3,y:2,c:2}];
let storyIndex=0,storyDone=false;
function number(id,min,max){const input=$(id);const value=Math.max(min,Math.min(max,Math.trunc(Number(input.value)||0)));input.value=value;return value;}
function translationValues(){return{x:number('#penBoxes',0,4),y:number('#clipBoxes',0,3),c:number('#loosePens',0,6)};}
function renderTranslation(){
 const v=translationValues();$('#objectModel').innerHTML=Array.from({length:v.x},()=>box('x')).join('')+Array.from({length:v.y},()=>box('y')).join('')+(v.c?`<div class="loose-pens"><span>${v.c} LOOSE PEN${v.c===1?'':'S'}</span><div>${Array.from({length:v.c},pen).join('')}</div></div>`:'')||'<p>No items yet. Add a box or a loose pen.</p>';
 const expression=formatExpression({'x^1':v.x,'y^1':v.y,'1':v.c});$('#translationExpression').textContent=expression;
 const revealed=$('#showValues').checked;$('#valueControls').hidden=!revealed;
 if(revealed){const x=number('#xValue',1,30),y=number('#yValue',1,30);$('#substitutionResult').textContent=`If x = ${x} and y = ${y}: ${v.x} × ${x} + ${v.y} × ${y} + ${v.c} = ${v.x*x+v.y*y+v.c} items.`;}
 if(storyDone&&(v.x!==stories[storyIndex].x||v.y!==stories[storyIndex].y||v.c!==stories[storyIndex].c)){storyDone=false;$('#nextTranslation').disabled=true;$('#translationFeedback').hidden=true;}
}
function renderStory(){storyDone=false;$('#translationIndex').textContent=`BUILD THE STORY · ${storyIndex+1} OF ${stories.length}`;$('#translationTask').textContent=stories[storyIndex].text;$('#translationFeedback').hidden=true;$('#nextTranslation').disabled=true;$('#nextTranslation').textContent=storyIndex===stories.length-1?'Start the stories again':'Next story';}
['#penBoxes','#clipBoxes','#loosePens','#xValue','#yValue'].forEach(id=>$(id).addEventListener('input',renderTranslation));$('#showValues').onchange=renderTranslation;
$('#checkTranslation').onclick=()=>{const v=translationValues(),goal=stories[storyIndex];storyDone=v.x===goal.x&&v.y===goal.y&&v.c===goal.c;feedback('#translationFeedback',storyDone?`Correct. ${formatExpression({'x^1':v.x,'y^1':v.y,'1':v.c})} matches the story. Each letter represents the unknown count in one box.`:'Count each kind separately: pen boxes contribute x, clip boxes contribute y, and loose pens contribute a known number. Adjust the picture to match the story.',storyDone);$('#nextTranslation').disabled=!storyDone;};
$('#nextTranslation').onclick=()=>{if(!storyDone)return;storyIndex=(storyIndex+1)%stories.length;$('#penBoxes').value=0;$('#clipBoxes').value=0;$('#loosePens').value=0;renderTranslation();renderStory();};
// 2. Tap (or drag) individual algebra terms into groups with identical variable parts.
const token=(key,sign=1)=>({key,sign});
const collectionSets={
 slides:[...Array.from({length:4},()=>token('x^1')),...Array.from({length:3},()=>token('x^2')),...Array.from({length:2},()=>token('x^3')),...Array.from({length:3},()=>token('y^1')),...Array.from({length:2},()=>token('y^2')),token('z^1')],
 mixed:['x^1','x^1','y^1','z^1','x^2','y^2','y^2','z^2','x^3','z^3'].map(key=>token(key)),
 subtract:[token('x^1'),token('x^1'),token('x^1'),token('x^1',-1),token('y^1'),token('y^1',-1),token('z^2'),token('z^2'),token('z^2',-1),token('x^3')]
};
let currentTokens=[],sorted=new Map(),selected=null;
function termLabel(t){return(t.sign<0?'−':'')+formatExpression({[t.key]:1});}
function shape(key){return `<span class="term-shape power-${key.split('^')[1]} var-${key[0]}" aria-hidden="true"></span>`;}
function resetCollection(){currentTokens=collectionSets[$('#collectionSet').value].map(t=>({...t}));sorted=new Map();selected=null;$('#collectionAnswer').value='';$('#collectionFeedback').hidden=true;$('#sortFeedback').textContent='Choose a term, then choose its group.';$('#negativeTileNote').hidden=$('#collectionSet').value!=='subtract';$('#unsortedExpression').textContent=currentTokens.map((t,i)=>i===0?termLabel(t):t.sign<0?' − '+formatExpression({[t.key]:1}):' + '+termLabel(t)).join('');renderSorting();}
function renderSorting(){
 const tray=$('#termTray');tray.replaceChildren();
 currentTokens.forEach((t,index)=>{if(sorted.has(index))return;const b=document.createElement('button');b.type='button';b.draggable=true;b.dataset.token=index;b.setAttribute('aria-pressed',String(selected===index));b.setAttribute('aria-label',`${termLabel(t)} term ${index+1}`);b.innerHTML=shape(t.key)+`<span>${escape(termLabel(t))}</span>`;b.onclick=()=>{selected=index;renderSorting();$('#termGroups button').focus();$('#sortFeedback').textContent=`Selected ${termLabel(t)}. Choose the group with the same letter and power.`;};b.ondragstart=event=>{selected=index;event.dataTransfer.setData('text/plain',String(index));};tray.append(b);});
 const groups=$('#termGroups');groups.replaceChildren();
 for(const letter of ['x','y','z'])for(const power of [1,2,3]){
  const key=`${letter}^${power}`,items=[...sorted.entries()].filter(([,group])=>group===key).map(([index])=>currentTokens[index]);
  const bucket=document.createElement('button');bucket.type='button';bucket.dataset.group=key;bucket.className=`term-group var-${letter}`;bucket.innerHTML=shape(key)+`<b>${formatExpression({[key]:1})}</b><small>${items.length} tile${items.length===1?'':'s'}${items.length?` · sum ${formatExpression(sumTokens(items))}`:''}</small>`;bucket.onclick=()=>placeToken(key);bucket.ondragover=event=>event.preventDefault();bucket.ondrop=event=>{event.preventDefault();const data=event.dataTransfer.getData('text/plain');if(!/^\d+$/.test(data))return;const i=Number(data);if(Number.isInteger(i)&&i>=0&&i<currentTokens.length&&!sorted.has(i))selected=i;placeToken(key);};groups.append(bucket);
 }
 $('#sortProgress').textContent=`${sorted.size} of ${currentTokens.length} terms sorted.`;$('#checkCollection').disabled=sorted.size!==currentTokens.length;
 if(sorted.size===currentTokens.length)$('#sortFeedback').textContent='All terms sorted. Count each group and write the collected expression below.';
}
function placeToken(key){
 if(selected===null){$('#sortFeedback').textContent='Choose an unsorted term first.';return;}
 const t=currentTokens[selected];if(t.key!==key){$('#sortFeedback').textContent=`Not this group. ${termLabel(t)} needs the same letter AND power: ${formatExpression({[t.key]:1})}.`;return;}
 sorted.set(selected,key);selected=null;renderSorting();const next=$('#termTray button');if(next)next.focus();else $('#collectionAnswer').focus();
}
$('#collectionSet').onchange=resetCollection;$('#resetCollection').onclick=resetCollection;
$('#collectionForm').onsubmit=event=>{event.preventDefault();if(sorted.size!==currentTokens.length)return;const input=$('#collectionAnswer').value,expected=sumTokens(currentTokens),correct=sameExpression(input,expected);feedback('#collectionFeedback',correct?`Correct. ${formatExpression(expected)}. You combined coefficients, keeping each variable and power unchanged.`:parseExpression(input)===null?'Use a sum of terms such as 2x + 3y^2. Write powers as ^2/^3 or use ²/³; do not use brackets in a collected expression.':'Check each group. Add its coefficients, not its powers. x + x is 2x, not x². Different letters or powers stay as separate terms.',correct);};
// 3. Distributive law: count every item in each identical bag.
let bagStep=0;
function bagValues(){return{n:+$('#bagCount').value,a:+$('#bagX').value,b:+$('#bagOther').value,type:$('#bagType').value};}
function bagInside(v){return formatExpression({'x^1':v.a,[v.type==='y'?'y^1':'1']:v.b});}
function renderBags(reset=false){
 if(reset){bagStep=0;$('#bagAnswer').value='';$('#bagFeedback').hidden=true;}
 const v=bagValues(),inside=bagInside(v);$('#bagExpression').textContent=`${v.n}(${inside})`;
 $('#bagModel').innerHTML=Array.from({length:v.n},(_,i)=>`<div class="teaching-bag ${bagStep?'opened':''}"><span class="bag-handle" aria-hidden="true"></span><div class="bag-contents">${bagStep?Array.from({length:v.a},()=>'<span class="bag-item x-item">x</span>').join('')+Array.from({length:v.b},()=>`<span class="bag-item ${v.type==='y'?'y-item':'unit-item'}">${v.type==='y'?'y':'1'}</span>`).join(''):`<b>${inside}</b>`}</div><small>Bag ${i+1}</small></div>`).join('');
 $('#openBags').disabled=bagStep>0;$('#collectBags').disabled=bagStep!==1;
 $('#bagExpansion').textContent=bagStep===0?'Open the bags to see every copy of the contents.':bagStep===1?Array.from({length:v.n},()=>`(${inside})`).join(' + '):`${v.n}(${inside}) = ${formatExpression(expandBag(v.n,v.a,v.b,v.type))}`;
}
['#bagCount','#bagX','#bagOther','#bagType'].forEach(id=>$(id).onchange=()=>{$('#bagPreset').value='custom';renderBags(true);});
$('#openBags').onclick=()=>{bagStep=1;renderBags();};$('#collectBags').onclick=()=>{if(bagStep===1){bagStep=2;renderBags();}};
$('#bagPreset').onchange=()=>{if($('#bagPreset').value==='custom')return;const preset={pens:[2,1,3,'1'],mixed:[2,2,1,'y'],three:[3,1,2,'y'],five:[5,1,3,'1']}[$('#bagPreset').value];['#bagCount','#bagX','#bagOther','#bagType'].forEach((id,i)=>$(id).value=preset[i]);renderBags(true);};
$('#bagForm').onsubmit=event=>{event.preventDefault();if(!bagStep){feedback('#bagFeedback','Open the bags first so that you can count every copy of every item.',false);return;}
 const v=bagValues(),correct=sameExpression($('#bagAnswer').value,expandBag(v.n,v.a,v.b,v.type));feedback('#bagFeedback',correct?`Correct. ${v.n}(${bagInside(v)}) = ${formatExpression(expandBag(v.n,v.a,v.b,v.type))}. The multiplier applies to both parts.`:`Multiply every part of one bag by ${v.n}. There are ${v.n} copies of ${v.a===1?'x':v.a+'x'} and ${v.n} copies of ${v.b}${v.type==='y'?'y':''}; leaving the second term unchanged misses some contents.`,correct);
};
renderTranslation();renderStory();resetCollection();renderBags();
