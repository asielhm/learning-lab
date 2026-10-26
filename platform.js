const arrowIcon = '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
const rightIcon = '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
const starIcon = '<svg class="star-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 2v28M2 16h28M6 6l20 20M6 26 26 6"/></svg>';
function decorate(html) {
  return html.replaceAll('↗', arrowIcon).replaceAll('→', rightIcon).replaceAll('✳', starIcon)
    .replaceAll('⚛', '<svg class="inline-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3h8m-6 0v9L5 26q-1 3 3 3h16q4 0 3-3l-9-14V3M9 20h14"/><circle cx="15" cy="24" r="1"/></svg>')
    .replaceAll('↔', '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 8h17m-5-5 5 5-5 5M21 16H4m5-5-5 5 5 5"/></svg>')
    .replaceAll('◷', '<svg class="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>');
}
const app = document.querySelector('#app');
document.querySelector('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  document.querySelector('#main').focus();
});
let catalogue;
const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const plural = (count, word) => `${count} ${count === 1 ? word : word === 'activity' ? 'activities' : word + 's'}`;
// Main-app counts exclude the separate revision links shown below each app.
const topicCount = subject => subject.topics.reduce((count, topic) => count + (topic.primaryActivity ? 1 : topic.activities.length), 0);
const yearCount = year => year.subjects.reduce((count, subject) => count + topicCount(subject), 0);
const route = (...ids) => '#/years' + (ids.length ? '/' + ids.map(encodeURIComponent).join('/') : '');
const countLabel = count => count ? plural(count, 'activity') : 'Activities coming later';
const heading = (eyebrow, title, description) => `<div class="page-heading"><div class="eyebrow">${escape(eyebrow)}</div><h1>${escape(title)}</h1><p>${escape(description)}</p></div>`;

function breadcrumbs(items) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="#/">Home</a></li>${items.map((item, index) => `<li>${index === items.length - 1 ? `<span aria-current="page">${escape(item.name)}</span>` : `<a href="${item.href}">${escape(item.name)}</a>`}</li>`).join('')}</ol></nav>`;
}
function pathway(active) {
  return `<ol class="pathway" aria-label="Find your activity">${['Year', 'Subject', 'Topic', 'Activity'].map((label, index) => `<li class="${index === active ? 'current' : index < active ? 'complete' : ''}" ${index === active ? 'aria-current="step"' : ''}><span>${index < active ? '✓' : String(index + 1).padStart(2, '0')}</span>${label}</li>`).join('')}</ol>`;
}
function shell(crumbs, active, content) {
  return `<section class="catalogue-section">${breadcrumbs(crumbs)}${pathway(active)}${content}</section>`;
}
function selectionCard({href, icon, eyebrow, title, description, count, empty = false}) {
  return `<a class="selection-card${empty ? ' empty-card' : ''}" href="${href}"><div class="card-top"><span class="selection-icon" aria-hidden="true">${escape(icon)}</span><span class="card-arrow" aria-hidden="true">↗</span></div>${eyebrow ? `<div class="eyebrow">${escape(eyebrow)}</div>` : ''}<h2>${escape(title)}</h2><p>${escape(description)}</p><div class="card-count">${escape(count)}</div></a>`;
}
function firstActivity() {
  for (const year of catalogue.years) for (const subject of year.subjects) for (const topic of subject.topics) for (const activity of topic.activities) return {year, subject, topic, activity};
  return null;
}
function activityCard(year, subject, topic, activity) {
  return `<a class="activity-card" href="${escape(activity.href)}"><div class="activity-art"><span class="activity-format">${escape(activity.format)}</span>${activity.image ? `<img src="${escape(activity.image)}" alt="" loading="lazy">` : '<span class="fallback-art" aria-hidden="true">✳</span>'}<span class="art-circle" aria-hidden="true"></span></div><div class="activity-copy"><div class="eyebrow">${escape(year.shortName)} · ${escape(subject.name)}</div><h2>${escape(activity.title)}</h2><p>${escape(activity.description)}</p><div class="activity-meta"><span>◷ ${escape(activity.duration)}</span><span class="start-activity">Open activity <span aria-hidden="true">↗</span></span></div></div></a>`;
}
function home() {
  const featured = firstActivity();
  return `<section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="live-dot" aria-hidden="true"></span> SMALL QUESTIONS. BIG DISCOVERIES.</div><h1>Learning starts<br>with <span>curiosity.</span><svg class="hero-underline" viewBox="0 0 370 20" aria-hidden="true"><path d="M5 13 Q160 -4 365 12"/></svg></h1><p>A space to explore, experiment and understand. Find interactive activities for your year, one subject and one discovery at a time.</p><a class="button primary" href="#/years">Explore activities <span aria-hidden="true">↗</span></a><div class="hero-note"><span aria-hidden="true">✳</span> Go beyond the textbook.</div></div><div class="hero-feature">${featured ? `<div class="floating-note">A closer look changes everything <span aria-hidden="true">↘</span></div><a class="featured-lab" href="${escape(featured.activity.href)}"><div class="feature-top"><span class="feature-label">IN THE LAB</span><span>${escape(featured.year.shortName)} · ${escape(featured.subject.name)}</span></div><div class="feature-specimen"><div class="specimen-orbit orbit-one"></div><div class="specimen-orbit orbit-two"></div>${featured.activity.image ? `<img src="${escape(featured.activity.image)}" alt="${escape(featured.activity.title)} activity illustration">` : '<span class="fallback-art" aria-hidden="true">✳</span>'}<span class="specimen-tag tag-anatomy">${escape(featured.activity.format.toUpperCase())}</span><span class="specimen-tag tag-explore">EXPLORE. TRY. DISCOVER.</span></div><div class="feature-bottom"><div><span>${escape(featured.topic.name)}</span><h2>${escape(featured.activity.title)}</h2></div><span class="feature-open" aria-hidden="true">↗</span></div></a><div class="feature-caption"><span class="live-dot" aria-hidden="true"></span> Interactive learning, made for you.</div>` : '<div class="hero-empty"><span aria-hidden="true">✳</span><p>Your next discovery is on its way.</p></div>'}</div></section>
  <section class="journey" id="journey"><div class="section-intro"><div><div class="eyebrow">YOUR LEARNING, YOUR PATH</div><h2>Find your next discovery.</h2></div><p>Start with where you are.<br>See where your curiosity takes you.</p></div><div class="journey-steps"><div><span class="journey-number">01</span><h3>Choose your year</h3><p>Find the right starting point for your learning.</p></div><div><span class="journey-number">02</span><h3>Pick a subject</h3><p>Step into a subject and find something worth exploring.</p></div><div><span class="journey-number">03</span><h3>Explore a topic</h3><p>Open an activity and learn by getting involved.</p></div></div></section>
  <section class="year-preview"><div class="section-intro"><div><div class="eyebrow">MAKE YOURSELF AT HOME</div><h2>Where would you like to start?</h2></div><a class="text-link" href="#/years">Browse all years ↗</a></div><div class="year-tiles">${catalogue.years.map(year => `<a class="year-tile ${yearCount(year) ? 'available' : ''}" href="${route(year.id)}"><span>${escape(year.shortName)}</span><span>${yearCount(year) ? countLabel(yearCount(year)) : 'Coming later'} <span aria-hidden="true">↗</span></span></a>`).join('')}</div></section>`;
}
function emptyState(title, description, backHref, backLabel) {
  const featured = firstActivity();
  return `<div class="empty-state"><span class="empty-symbol" aria-hidden="true">✳</span><h2>${escape(title)}</h2><p>${escape(description)}</p><a class="button primary" href="${backHref}">${escape(backLabel)} →</a>${featured ? `<a class="text-link" href="${route(featured.year.id, featured.subject.id, featured.topic.id)}">Explore ${escape(featured.year.shortName)} ${escape(featured.subject.name)}: ${escape(featured.topic.name)} ↗</a>` : ''}</div>`;
}
function years() {
  return shell([{name:'Explore activities', href:route()}], 0, `${heading('THE FIRST STEP', 'Choose your year.', 'Start with your year, then choose a subject and a topic to find an activity.')}<div class="selection-grid year-grid">${catalogue.years.map(year => selectionCard({href:route(year.id), icon:year.shortName, title:year.name, description:yearCount(year) ? `Explore ${plural(year.subjects.length, 'subject')} and find your next activity.` : 'A space for future discoveries. Activities will appear here as they are added.', count:countLabel(yearCount(year)), empty:!yearCount(year)})).join('')}</div>`);
}
function subjects(year) {
  return shell([{name:'All years', href:route()},{name:year.name}], 1, `${heading(`${year.shortName} · EXPLORE ACTIVITIES`, 'Choose a subject.', `Browse the subjects available for ${year.name}.`)}${year.subjects.length ? `<div class="selection-grid">${year.subjects.map(subject => selectionCard({href:route(year.id,subject.id),icon:subject.name === 'Science' ? '⚛' : '✳',eyebrow:year.name,title:subject.name,description:subject.description,count:`${plural(subject.topics.length,'topic')} · ${countLabel(topicCount(subject))}`})).join('')}</div>` : emptyState('New discoveries are on their way.',`There are no activities for ${year.name} yet. Choose another year to see what is available.`,route(),'Back to all years')}`);
}
function topics(year, subject) {
  const hasApps=subject.topics.some(topic=>topic.primaryActivity);
  const cards=subject.topics.map(topic=>{
    const primary=topic.activities.find(activity=>activity.id===topic.primaryActivity);
    if(!primary)return selectionCard({href:route(year.id,subject.id,topic.id),icon:'↔',eyebrow:subject.name,title:topic.name,description:topic.description,count:countLabel(topic.activities.length)});
    const revision=topic.activities.filter(activity=>activity.id!==primary.id);
    return `<article class="topic-entry">${activityCard(year,subject,topic,{...primary,title:topic.appTitle||primary.title})}${revision.length?`<nav class="topic-study-links" aria-label="${escape(topic.name)} study pages">${revision.map(activity=>`<a href="${escape(activity.href)}">${escape(activity.format)} →</a>`).join('')}</nav>`:''}</article>`;
  }).join('');
  return shell([{name:'All years',href:route()},{name:year.name,href:route(year.id)},{name:subject.name}], 2, `${heading(`${year.shortName} · ${subject.name.toUpperCase()}`, hasApps?'Choose an activity.':'Choose a topic.', hasApps?'Open a science web app below. Breathing and circulation also have their own separate revision simulators.':'Follow an idea that interests you, then choose an activity to explore it.')}<div class="${hasApps?'activity-grid topic-apps':'selection-grid'}">${cards}</div>${subject.topics.length ? '' : emptyState('More topics to explore soon.','This subject does not have any topics yet.',route(year.id),'Back to subjects')}`);
}
function activities(year, subject, topic) {
  return shell([{name:'All years',href:route()},{name:year.name,href:route(year.id)},{name:subject.name,href:route(year.id,subject.id)},{name:topic.name}], 3, `${heading(`${year.shortName} · ${subject.name.toUpperCase()}`,topic.name,topic.description)}<div class="activities-heading"><h2>Choose an activity</h2><span>${plural(topic.activities.length,'activity')}</span></div><div class="activity-grid">${topic.activities.map(activity=>activityCard(year,subject,topic,activity)).join('')}</div>${topic.activities.length ? '' : emptyState('Activities are on their way.','There are no activities for this topic yet.',route(year.id,subject.id),'Back to topics')}`);
}
function about() {
  return `<section class="catalogue-section">${breadcrumbs([{name:'How it works'}])}${heading('A LITTLE CURIOSITY GOES A LONG WAY', 'Learn by getting involved.', 'Learning Lab brings activities together in one place, organised around your year, subject and topic.')}<div class="about-grid"><article><span>01 / FIND YOUR PATH</span><h2>Year → subject → topic</h2><p>Browse activities that match what you are learning. Years without activities are clearly marked, so you always know what is available.</p></article><article><span>02 / TRY SOMETHING</span><h2>Explore at your own pace</h2><p>Open a lesson and get involved. Explore the heart and breathing system with interactive labs, then build your understanding on separate multiple-choice revision pages.</p></article><article><span>03 / KEEP DISCOVERING</span><h2>A growing collection</h2><p>More activities will be added over time. Each new lesson will appear under its year, subject and topic.</p></article></div><a class="button primary" href="#/years">Find an activity ↗</a></section>`;
}
function render(focus = false) {
  let parts;
  try { parts = location.hash.replace(/^#\/?/,'').split('/').filter(Boolean).map(decodeURIComponent); }
  catch { parts = ['invalid']; }
  let content, title='Learning Lab';
  const [section,yearId,subjectId,topicId]=parts;
  const year=catalogue.years.find(item=>item.id===yearId);
  const subject=year?.subjects.find(item=>item.id===subjectId);
  const topic=subject?.topics.find(item=>item.id===topicId);
  if(!section){content=home();title='Learning Lab | Explore. Understand. Discover.';}
  else if(section==='about'&&parts.length===1){content=about();title='How it works | Learning Lab';}
  else if(section==='years'&&parts.length===1){content=years();title='Choose your year | Learning Lab';}
  else if(section==='years'&&year&&parts.length===2){content=subjects(year);title=`${year.name} | Learning Lab`;}
  else if(section==='years'&&subject&&parts.length===3){content=topics(year,subject);title=`${year.shortName} ${subject.name} | Learning Lab`;}
  else if(section==='years'&&topic&&parts.length===4){content=activities(year,subject,topic);title=`${topic.name} | ${year.shortName} ${subject.name} | Learning Lab`;}
  else {content=`<section class="catalogue-section">${heading('LET’S FIND YOUR WAY', 'This page is not here.', 'The activity or category may have moved. Browse the catalogue to find your next discovery.')}<a class="button primary" href="#/years">Explore activities →</a></section>`;title='Page not found | Learning Lab';}
  app.innerHTML=decorate(content);document.title=title;
  document.querySelector('#browse-link').toggleAttribute('aria-current',section==='years');
  if(section==='years')document.querySelector('#browse-link').setAttribute('aria-current','page');
  if(focus){window.scrollTo(0,0);document.querySelector('#main').focus({preventScroll:true});}
}
async function start() {
  try {
    const response=await fetch(new URL('./catalog.json',import.meta.url));
    if(!response.ok)throw new Error('Catalogue unavailable');
    catalogue=await response.json();
    if(!Array.isArray(catalogue.years))throw new Error('Invalid catalogue');
    render();window.addEventListener('hashchange',()=>render(true));
  } catch {
    app.innerHTML=decorate(`<section class="empty-state"><h1>We couldn’t load the activity catalogue.</h1><p>Check your connection and refresh the page, or open a science lab directly.</p><button class="button primary" id="retry">Try again ↻</button><a class="text-link" href="activities/y9/science/circulatory-system/">Open Y9 Science: Heart Lab →</a><a class="text-link" href="activities/y9/science/breathing-system/">Open Y9 Science: Breathing Lab →</a></section>`);
    document.querySelector('#retry').addEventListener('click',start);
  }
}
start();
