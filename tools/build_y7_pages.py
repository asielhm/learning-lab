"""Seven Y7 syllabus units; no external class documents or applets required."""
import sys
sys.dont_write_bytecode=True
import json,html
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
E=lambda x:html.escape(str(x),quote=True)
units=json.loads((ROOT/'assets/y7-maths/units.json').read_text());P='../../../../'
nav=lambda active:''.join(f'<a href="../{u["id"]}/"'+(' aria-current="page"' if u['id']==active else '')+f'>{i+1:02} {E(u["name"])}</a>' for i,u in enumerate(units))
for i,u in enumerate(units):
 folder=ROOT/'activities/y7/maths'/u['id'];folder.mkdir(parents=True,exist_ok=True)
 if u['id'] in ['algebra-ii','statistics']:
  art='<path d="M65 210V150h45v60M145 210V85h45v125M225 210V45h45v165" fill="#9acbb9" stroke="#c3e4d4" stroke-width="5"/><path d="M45 220H300" stroke="#c9d8c4" stroke-width="3"/>' if u['id']=='statistics' else '<rect x="50" y="70" width="110" height="90" rx="14" fill="#a9c9be"/><rect x="200" y="70" width="110" height="90" rx="14" fill="#c6b2d5"/><text x="105" y="125" text-anchor="middle" font-size="28" fill="#244c45">2x + 3</text><text x="180" y="125" text-anchor="middle" font-size="28" fill="#eee4cf">=</text><text x="255" y="125" text-anchor="middle" font-size="28" fill="#244c45">17</text><text x="180" y="215" text-anchor="middle" font-size="23" fill="#e7d3a8">SAME OPERATION · BOTH SIDES</text>'
  (folder/'cover.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 260" role="img" aria-label="{E(u["name"])} illustration"><rect width="360" height="260" rx="20" fill="#285348"/><g font-family="system-ui">{art}</g></svg>')
 bank=json.loads((ROOT/'assets/revision/questions'/f'{u["id"]}.json').read_text());qcount=len(bank['questions']);extra='<section id="equation-workbench" class="math-widget"></section><script type="module" src="../../../../assets/y7-maths/equation-lab.js?v=term-products-1"></script>' if u['id']=='algebra-ii' else ''
 games='<section class="game-lesson-invite"><div><span class="game-mini-tag">LEARN THROUGH PLAY</span><h2>Practise with boxes and brackets.</h2><p>Play Like-Terms Recycling and Bag Factory, or revisit the detailed object models.</p></div><a href="../algebra/games/">Choose a game →</a></section>' if u['id']=='algebra-ii' else ''
 related='<p><a href="../algebra/">Open the boxes, like-terms and bags activities →</a></p>' if u['id']=='algebra-ii' else ''
 page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f6f7f2"><title>{E(u['name'])} | Y7 Maths | Learning Lab</title><meta name="description" content="{E(u['description'])}"><link rel="icon" href="{P}assets/brand/learning-lab-logo.png"><link rel="stylesheet" href="{P}platform.css"><link rel="stylesheet" href="{P}assets/brand/brand.css?v=1"><link rel="stylesheet" href="{P}assets/y7-maths/units.css?v=term-products-1"><link rel="stylesheet" href="{P}assets/unit-games/links.css?v=1"><link rel="stylesheet" href="{P}assets/desktop-layout.css?v=desktop-1"><script type="module" src="{P}assets/y7-maths/unit.js?v=term-products-1"></script></head><body data-unit="{u['id']}" data-level="core"><a class="skip-link" href="#unit-activities">Skip to activities</a><header class="site-header"><a class="wordmark" href="{P}index.html"><img class="brand-logo" src="{P}assets/brand/learning-lab-logo.png" width="46" height="46" alt=""><span>learning<span class="wordmark-light">lab</span><small>A PLACE FOR CURIOUS MINDS</small></span></a><nav><a href="{P}index.html#/years/y7/maths">Y7 Maths</a><a href="revision.html">Revision simulator</a></nav></header><main id="main"><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="{P}index.html">Home</a></li><li><a href="{P}index.html#/years/y7/maths">Y7 Maths</a></li><li><span aria-current="page">{E(u['name'])}</span></li></ol></nav><section class="unit-hero"><div><div class="eyebrow">YEAR 7 MATHS · UNIT {i+1:02}</div><h1>{E(u['name'])}</h1><p>{E(u['subtitle'])}. {E(u['description'])}</p><div class="unit-meta"><span>{E(u['dates'])}</span><span>{E(u['calculator'])}</span><span>Explore at your own pace</span></div></div><img class="unit-cover" src="cover.svg" width="360" height="260" alt="{E(u['name'])} mathematical illustration"></section><nav class="unit-path" aria-label="Year 7 Maths units">{nav(u['id'])}</nav><section class="goals"><h2>What will you learn?</h2><ul>{''.join('<li>'+E(g)+'</li>' for g in u['goals'])}</ul>{related}</section><section class="learning-tools"><div><h2>Predict. Change. Explain.</h2><p>Read the explanations, work on paper, then use the model to check a prediction. Practice here is separate from a recorded Test yourself quiz.</p></div><label for="learning-level">Choose your learning route<select id="learning-level"><option value="support">A little support</option><option value="core" selected>Core exploration</option><option value="challenge">Go further</option></select></label></section><nav id="activity-links" class="section-links" aria-label="Activities in this unit"></nav><div id="unit-activities" tabindex="-1"></div>{extra}<section class="unit-resources"><h2>Compare, explain and try again</h2><p>All instructions, models and worked examples are on this platform. Use “A little support” for a guided method, or “Go further” for extensions. Your working notes and lesson checks are not sent to the teacher.</p></section>{games}<noscript><p>Enable JavaScript for the interactive activities. The explanations and worked examples remain readable above.</p></noscript><section class="unit-review" aria-labelledby="review-title"><div><div class="eyebrow">INDEPENDENT REVISION</div><h2 id="review-title">Ready to test your understanding?</h2><p>Explore {qcount} questions for {E(u['name'])}. Select question areas and levels, practise with explanations or take Test yourself, then retry mistakes.</p></div><a href="revision.html">Open revision simulator →</a></section></main><footer class="site-footer"><a href="{P}index.html">Learning Lab</a><p>Y7 Maths · {E(u['name'])}</p><a href="{P}index.html#/years/y7/maths">All maths units →</a></footer></body></html>'''
 (folder/'index.html').write_text(page)
 # Preserve the five established revision wrappers; create new auto-capability wrappers only.
 if u['id'] in ['algebra-ii','statistics']:
  template=(ROOT/'activities/y7/maths/numbers-i/revision.html').read_text().replace('numbers-i',u['id']).replace('Numbers I',u['name'])
  (folder/'revision.html').write_text(template)
# The older object models remain as an additional activity within Algebra II.
legacy=ROOT/'activities/y7/maths/algebra/index.html';s=legacy.read_text();s=s.replace('<section class="algebra-intro">','<section class="algebra-intro">')
import re
s=re.sub(r'<nav class="unit-path".*?</nav>','',s,flags=re.S)
pos=s.index('<nav class="algebra-steps"');s=s[:pos]+'<nav class="unit-path" aria-label="Year 7 Maths units">'+nav('algebra-ii')+'</nav>'+s[pos:]
s=s.replace('Y7 Maths · Build. Sort. Explain.','Y7 Algebra II · Build. Sort. Explain.');legacy.write_text(s)
# Reorganise the seven topic cards while retaining the established activity URLs.
p=ROOT/'catalog.json';catalog=json.loads(p.read_text());subject=next(s for y in catalog['years'] if y['id']=='y7' for s in y['subjects'] if s['id']=='maths');old={t['id']:t for t in subject['topics']}
old_algebra=old.get('algebra-i') or old['algebra'];old_algebra['id']='algebra-i';old_algebra['activities']=[a for a in old_algebra['activities'] if '/maths/algebra/' not in a['href']]
legacy_entries=[a for t in old.values() for a in t['activities'] if a['id'] in ['algebra-lab','algebra-revision','algebra-games']]
# On the first run those entries were in the prior Algebra I topic; preserve from the raw snapshot.
if not legacy_entries:
 raw=json.loads(p.read_text());legacy_entries=[a for y in raw['years'] if y['id']=='y7' for sub in y['subjects'] for t in sub['topics'] for a in t['activities'] if a['id'] in ['algebra-lab','algebra-revision','algebra-games']]
new=[]
for u in units:
 if u['id']=='algebra-i':t=old_algebra
 elif u['id'] in ['algebra-ii','statistics']:
  path=f'activities/y7/maths/{u["id"]}/';acts=[dict(id=u['id']+'-lab',title=u['name']+': interactive unit',description=u['description'],format='Interactive maths unit',duration='Work at your pace',href=path,image=path+'cover.svg'),dict(id=u['id']+'-revision',title=u['name']+': revision simulator',description='100 questions covering translation, like terms, multiplying terms, brackets and equations.' if u['id']=='algebra-ii' else '60 questions on charts, averages, quartiles and frequency tables.',format='Revision simulator',duration='Choose your session',href=path+'revision.html',image=path+'cover.svg')]
  if u['id']=='algebra-ii':acts+=legacy_entries
  t=dict(id=u['id'],name=u['name'],description=u['description'],primaryActivity=u['id']+'-lab',appTitle=u['name'],activities=acts)
 else:t=old[u['id']]
 new.append(t)
subject['topics']=new;p.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
from unit_games_integration import integrate
integrate()
from build_learn_first import apply_school_reading
apply_school_reading()
print('Y7 Maths: seven units in syllabus order; Algebra II and Statistics separate, older object activities retained.')

# Preserve the shared author wordmark when regenerating this section.
from brand import apply_branding
apply_branding()
