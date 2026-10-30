"""Render all published school units' explanations BEFORE their practical tools."""
import sys
sys.dont_write_bytecode=True
import html,json,re,subprocess
from pathlib import Path
from school_reading import DATA,EXTRA
from learning_figures import draw
from notation import school_notation
ROOT=Path(__file__).resolve().parent.parent
E=lambda x:html.escape(str(x),quote=True)

def sources():
 script="""import {modules} from './assets/y7-maths/modules.js';import {units} from './assets/y10-physics/experiments.mjs';const maths={};for(const[id,defs]of Object.entries(modules))maths[id]=defs.map(d=>{const v=Object.fromEntries(d.controls.map(c=>[c.id,c.value]));if(id==='statistics'&&d.id==='bar-chart')Object.assign(v,{bus:6,walk:8,car:4,cycle:2});if(id==='statistics'&&d.id==='pie-charts')Object.assign(v,{bus:120,walk:90,car:60,cycle:90});if(id==='algebra-ii'&&d.id==='equation-steps')v.stage=4;if(id==='algebra-ii'&&d.id==='multiply-terms')v.stage=3;const o=d.compute(v,'core');return {id:d.id,title:d.title,text:[d.goal,...(d.introduction||[]),d.support,o.explanation],steps:o.steps,model:o.visual,result:o.result};});console.log(JSON.stringify({maths,physics:units}));"""
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',script],cwd=ROOT,text=True))

def topics_for(key,source):
 if key in EXTRA:return [dict(title=t,text=[body],steps=steps) for t,body,steps in EXTRA[key]]
 if key.startswith('y7/maths/'):
  slug=key.split('/')[-1];result=source['maths'][slug]
  for i,t in enumerate(result):
   t['text']=[p.replace('Click or tap the grid to move the point, or use the sliders.','The diagram marks the resulting position.') for p in t['text']]
   # Namespace the drawing markers so the static example cannot alter a live model.
   marker='reading-arrow-'+slug+'-'+str(i)
   t['model']=t['model'].replace('<details class="term-why">','<details class="term-why" open>')
   t['model']=re.sub(r'\s(?:tabindex|data-stats-bar)="[^"]*"','',t['model']).replace('role="button"','').replace('Arrow keys change it; drag to set a height.','Static worked-example illustration.')
   t['model']=t['model'].replace('id="arrow"',f'id="{marker}"').replace('url(#arrow)',f'url(#{marker})')
  return result
 if key.startswith('y10/physics/'):
  u=next(u for u in source['physics'] if u['id']==key.split('/')[-1]);return [dict(title=t,text=[body],steps=[example]) for t,body,example in u['lessons']]
 if key.startswith('y10/chemistry/'):
  u=next(u for u in json.loads((ROOT/'assets/y10-chemistry/units.json').read_text()) if u['id']==key.split('/')[-1]);return [dict(title=t,text=[body],steps=[example]) for t,body,example in u['theory']]
 raise ValueError('No authored topic explanations for '+key)

def render(key,target,source):
 start,why,life,figure=DATA[key];topics=topics_for(key,source);toc='';cards=''
 for i,t in enumerate(topics):
  ident=f'read-topic-{i+1}';toc+=f'<a href="#{ident}">{i+1:02} · {E(t["title"])}</a>'
  model=f'<div class="reading-model">{t["model"]}</div>' if t.get('model') else ''
  result=f'<p><strong>{E(t["result"])}</strong></p>' if t.get('result') else ''
  cards+=f'<details id="{ident}" class="reading-topic" open><summary>{i+1:02} · {E(t["title"])}</summary><div class="reading-topic-body"><div>{"".join("<p>"+E(p)+"</p>" for p in t["text"])}{result}{school_notation(key,i)}{model}</div><aside class="reading-example"><h3>Worked example · follow the reasoning</h3><ol>{"".join("<li>"+E(p)+"</li>" for p in t["steps"])}</ol></aside></div></details>'
 diagram=''
 if figure:
  svg,caption=draw(figure,'en');name=key.replace('/','-')+'.svg';p=ROOT/'assets/learn-first/figures'/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(svg)
  diagram=f'<figure class="reading-figure"><img src="../../../../assets/learn-first/figures/{name}" width="620" height="290" alt="{E(caption)}"><figcaption>{E(caption)}</figcaption></figure>'
 return f'''<!-- learn-first:start --><section class="learn-first" id="learn-first" aria-labelledby="learn-first-title"><div class="reading-heading"><div><span class="reading-label">START HERE · UNDERSTAND BEFORE YOU INVESTIGATE</span><h2 id="learn-first-title">Build the idea, one step at a time.</h2></div><a class="reading-jump" href="#{target}">Go to the practical activities ↓</a></div><div class="reading-introduction"><div><p>{E(start)}</p><p>{E(why)}</p>{diagram}</div><aside class="reading-connection"><strong>Connect it to everyday life and industry</strong><p>{E(life)}</p><p>Read the explanation, follow a worked example, then use the practical to test a prediction. If a result surprises you, return to the relevant idea and compare the assumptions.</p></aside></div><nav class="reading-toc" aria-label="Explanations in this unit">{toc}</nav>{cards}<div class="reading-bottom"><p>You can read these explanations without operating the simulator. The practical activities, games and revision below let you apply the ideas and check your reasoning.</p><a class="reading-jump" href="#{target}">Now investigate →</a></div></section><!-- learn-first:end -->'''

def apply_school_reading():
 source=sources();count=0
 for key in DATA:
  path=ROOT/'activities'/key/'index.html'
  if not path.exists():raise ValueError('Missing published unit: '+key)
  page=path.read_text();page=re.sub(r'<!-- learn-first:start -->.*?<!-- learn-first:end -->','',page,flags=re.S)
  page=re.sub(r'<link data-learn-first[^>]*>','',page);page=page.replace('</head>','<link data-learn-first rel="stylesheet" href="../../../../assets/learn-first/reading.css?v=2"></head>')
  if key.startswith('y7/'):
   if key.endswith('/algebra'):marker=re.search(r'<nav class="algebra-steps"',page);target='translatePanel'
   else:marker=re.search(r'<section class="learning-tools"',page);target='unit-activities'
  elif key.startswith('y9/'):
   if key.endswith('gas-laws'):marker=re.search(r'<nav class="law-menu"',page);target='experiment'
   else:marker=re.search(r'<nav class="steps"',page);target='practical-workspace';page=page.replace('<div class="workspace">','<div class="workspace" id="practical-workspace">')
  elif key.startswith('y10/'):
   marker=re.search(r'<section class="investigation-chooser"',page) if '/chemistry/' in key else re.search(r'<div class="physics-heading"',page);target='workbench' if '/chemistry/' in key else 'physics-bench'
  else:marker=re.search(r'<section id="guided-skills"',page);target='guided-skills'
  if not marker:raise ValueError('Missing practical boundary: '+key)
  page=page[:marker.start()]+render(key,target,source)+page[marker.start():]
  if key.startswith('y12/'):
   page=page.replace('Choose a worked calculator exercise. The trainer highlights the next physical key and advances when you use it correctly. Then repeat in free practice.','Start with the mathematical explanations and worked examples below, then choose a guided calculator exercise. The trainer highlights the next physical key; afterwards, repeat in free practice and interpret your result.')
  path.write_text(page);count+=1
 print(f'Reading first: {count} published school units with explanations, worked examples and everyday/industry contexts before practicals.')

if __name__=='__main__':apply_school_reading()

# Preserve the shared author wordmark when regenerating this section.
from brand import apply_branding
apply_branding()
