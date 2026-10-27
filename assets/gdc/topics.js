const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const select=document.querySelector('#gdc-course'),id=document.body.dataset.gdcTopic;
const manifestUrl=new URL('../../activities/y12/maths/gdc-trainer/trainer-manifest.json',import.meta.url);
try{
 const response=await fetch(manifestUrl);if(!response.ok)throw Error('Unable to load the calculator metadata');
 const manifest=await response.json(),topic=manifest.topics.find(t=>t.id===id);if(!topic)throw Error('Unknown topic');
 const requested=new URLSearchParams(location.search).get('course');select.value=manifest.courses.includes(requested)?requested:'all';
 function trainerLink(lesson='',mode='guided'){const url=new URL('../gdc-trainer/',location.href);url.searchParams.set('topic',id);url.searchParams.set('course',select.value);url.searchParams.set('mode',mode);if(lesson)url.searchParams.set('lesson',lesson);return url.href;}
 function render(){
  const course=select.value,allowed=item=>course==='all'||item.courses.includes(course);
  const lessons=manifest.lessons.filter(l=>l.topicIds.includes(id)&&allowed(l));
  document.querySelector('#gdc-count').textContent=`${lessons.length} guided exercises · ${course==='all'?'all IB courses':course}`;
  document.querySelector('#gdc-exercises').innerHTML=lessons.map(l=>`<article class="gdc-exercise"><div class="eyebrow">INTERACTIVE SIMULATOR</div><h3>${escape(l.title)}</h3><p>${escape(l.task)}</p><div class="gdc-tags">${l.courses.map(c=>`<span>${escape(c)}</span>`).join('')}</div>${l.limit?`<p class="gdc-lesson-limit">${escape(l.limit)}</p>`:''}<a href="${escape(trainerLink(l.id))}">Start guided practice →</a></article>`).join('');
  const manual=manifest.manual.filter(s=>topic.manualIds.includes(s.id)&&allowed(s));
  document.querySelector('#gdc-manual').innerHTML=`<ul class="gdc-manual-list">${manual.map(s=>`<li><a href="../gdc-trainer/skills/${escape(s.slug)}/">${escape(s.title)} →</a><span class="${s.verified?'reviewed':'pending'}">${s.verified?'Reviewed reference':'Procedure awaiting verification'}</span></li>`).join('')}</ul>`;
  document.querySelectorAll('a[href*="mode=free"]').forEach(a=>a.href=trainerLink('','free'));
  document.querySelectorAll('[data-gdc-topic-link]').forEach(a=>{const url=new URL(a.href);url.searchParams.set('course',course);a.href=url.href;});
 }
 select.onchange=()=>{const url=new URL(location.href);url.searchParams.set('course',select.value);history.replaceState(null,'',url);render();};render();
}catch(error){document.querySelector('#gdc-exercises').innerHTML='<p>We could not load the exercise list. Refresh the page, or <a href="../gdc-trainer/">open the calculator trainer</a>.</p>';console.error(error);}
