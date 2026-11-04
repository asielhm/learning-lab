"""Build three separate Y10 organic chemistry classes and their discovery cards."""
from pathlib import Path
from html import escape as E
import json,re,subprocess
from alcohols_book import CHAPTERS,render_book,render_game,formula_html
from organic_class_content import CLASSES
ROOT=Path(__file__).resolve().parent.parent
BASE=ROOT/'activities/y10/chemistry/organic-chemistry'
P='../../../../../'

def cover(index):
 if index==0:return (ROOT/'assets/y10-chemistry/alcohols/cover.svg').read_text()
 colour=CLASSES[index]['colour'];title=CLASSES[index]['short']
 panels=[('Alcohol','CH₃–CH₂–OH','Carboxylic acid','CH₃–C(=O)–OH','Same O–H letters. Different neighbours. Different reactions.'),('Small ester','CH₃–C(=O)–O–CH₂–CH₃','Polyester links','–C(=O)–O–R–O–C(=O)–','One link → repeated links → useful materials.'),('Amine','CH₃–NH₂','Amide','CH₃–C(=O)–NH₂','Find nitrogen. Look next door for C=O.')][index]
 a,b,c,d,note=panels
 return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" role="img" aria-labelledby="title desc"><title id="title">{E(title)}</title><desc id="desc">{E(a+': '+b+'. '+c+': '+d+'. '+note)}</desc><defs><linearGradient id="paper" x2="1" y2="1"><stop stop-color="#eef5ef"/><stop offset="1" stop-color="#fff2de"/></linearGradient></defs><rect width="800" height="500" rx="24" fill="url(#paper)"/><circle cx="720" cy="70" r="100" fill="{colour}" opacity=".08"/><g font-family="system-ui,sans-serif"><text x="42" y="56" fill="{colour}" font-size="17" font-weight="750" letter-spacing="2">CLASS {index+1:02} · ORGANIC CHEMISTRY</text><text x="42" y="106" fill="#264d43" font-size="32" font-weight="750">{E(title)}</text><rect x="40" y="141" width="720" height="112" rx="18" fill="white" stroke="#c1d6c8"/><text x="64" y="176" fill="{colour}" font-size="18" font-weight="650">{a}</text><text x="400" y="222" fill="#294b42" font-size="30" text-anchor="middle">{b}</text><rect x="40" y="277" width="720" height="112" rx="18" fill="white" stroke="#c1d6c8"/><text x="64" y="312" fill="{colour}" font-size="18" font-weight="650">{c}</text><text x="400" y="358" fill="#294b42" font-size="30" text-anchor="middle">{d}</text><text x="400" y="444" fill="#526c60" font-size="19" text-anchor="middle">{E(note)}</text></g></svg>'''

def cards():
 return '<!-- organic-classes:start --><section class="organic-class-cards" id="organic-classes"><p class="eyebrow">THREE SEPARATE CLASSES · LEARN AT YOUR OWN PACE</p><h2>Study each family in its own class.</h2><div class="organic-class-grid">'+''.join(f'<a class="organic-class-card" href="{c["id"]}/"><img src="{c["id"]}/{"cover-book.svg" if i==0 else "cover.svg"}" width="800" height="500" alt=""><div><span class="organic-class-number">CLASS {i+1:02}</span><h3>{E(c["title"])}</h3><p>{E(c["intro"])}</p><strong>Open this class →</strong></div></a>' for i,c in enumerate(CLASSES))+'</div></section><!-- organic-classes:end -->'

def build_classes():
 subprocess.run(['node',str(ROOT/'tools/export_alcohols_art.mjs')],check=True)
 source=(BASE/'index.html').read_text()
 start=source.index('<section class="investigation-chooser"');end=source.index('<section class="theory-section"',start)
 bench=source[start:end].replace('>01</span>','>07</span>').replace('>02</span>','>08</span>')
 for i,c in enumerate(CLASSES):
  folder=BASE/c['id'];folder.mkdir(exist_ok=True);(folder/'cover.svg').write_text(cover(i))
  if i==0:(folder/'cover-book.svg').write_text(cover(i))
  nav=''.join(f'<a href="../{other["id"]}/"'+(' aria-current="page"' if c==other else '')+f'>{j+1:02} {E(other["short"])}</a>' for j,other in enumerate(CLASSES))
  lessons=''
  for n,s in enumerate(c['sections'],1):
   lessons+=f'<article class="class-topic" id="idea-{n}"><div class="class-topic-heading"><span>{n:02}</span><h2>{E(s["title"])}</h2></div><div class="class-reading-grid"><div>'+''.join('<p>'+E(p)+'</p>' for p in s['paragraphs'])+'</div><aside class="class-worked"><h3>Worked example · follow the reasoning</h3><ol>'+''.join('<li>'+E(p)+'</li>' for p in s['example'])+'</ol></aside></div><div class="class-memory"><b>Remember and explain why</b>'+E(s['memory'])+'</div></article>'
  if i==0:lessons=render_book()
  questions=''
  for qn,q in enumerate(c['checks']):
   questions+=f'<form class="class-question" id="class-q-{qn}" data-answer="{q["answer"]}" data-explanation="{E(q["why"],quote=True)}"><fieldset><legend>{qn+1}. {(formula_html(q["prompt"]) if i==0 else E(q["prompt"]))}</legend>'+''.join(f'<label><input type="radio" required name="q-{qn}" value="{j}"><span>{formula_html(a) if i==0 else E(a)}</span></label>' for j,a in enumerate(q['options']))+'</fieldset><button type="submit">Check my reasoning</button><p data-feedback role="status" aria-live="polite"></p></form>'
  sequence='<section class="class-sequence"><h2>Keep the classes connected.</h2>'+''.join(f'<a href="../{other["id"]}/">Class {j+1:02} · {E(other["title"])} →</a>' for j,other in enumerate(CLASSES) if c!=other)+'<a href="../">All organic chemistry activities →</a></section>'
  model_note='This is a structural group model. The source groups and H + OH packet can be dragged directly on the bench; you can also select the object and then its destination, or use the keyboard. Help with this step demonstrates one action.'
  if i==0:model_note='This is a structural model. Drag the selected formula onto the work mat, click its characteristic functional group and use the magnifier. Record ethanol and ethanoic acid and compare their behaviour. You can also select an object and its destination, or use the keyboard; Help with this step demonstrates one action.'
  if i==2:model_note+=' Amide formation represents suitable activated or dehydrating conditions; ordinary acid–amine mixing can instead form a salt.'
  current_bench=bench.replace('>07</span>','>11</span>').replace('>08</span>','>12</span>') if i==0 else bench
  practice_number='13' if i==0 else '09'
  reading=lessons if i==0 else '<section class="class-reading" id="class-reading" aria-label="Explanations and worked examples">'+lessons+'</section>'
  toc='' if i==0 else '<nav class="class-toc" aria-label="In this class">'+''.join(f'<a href="#idea-{n}">{n:02} {E(part["title"])}</a>' for n,part in enumerate(c['sections'],1))+'<a href="#workbench">07 Practical model</a><a href="#class-practice">09 Practise and explain</a></nav>'
  extras=render_game() if i==0 else ''
  scripts=(f'<link rel="stylesheet" href="{P}assets/y10-chemistry/alcohols/book.css?v=1"><script type="module" src="{P}assets/y10-chemistry/alcohols/book.js?v=1"></script><script type="module" src="{P}assets/y10-chemistry/alcohols/game.js?v=1"></script>') if i==0 else ''
  goals=[*c['objectives']]
  if i==0:goals.insert(1,'Name simple alcohols and carboxylic acids, using carbon counts and OH position numbers.')
  tags='<span>10 illustrated chapters</span><span>Naming, step by step</span><span>60 exclusive revision questions</span>' if i==0 else '<span>Read → model → explain</span><span>6 self-study checks</span><span>Use the apparatus directly</span>'
  hero_image='cover-book.svg' if i==0 else 'cover.svg'
  review_title='SECTION-EXCLUSIVE REVISION' if i==0 else 'INDEPENDENT UNIT REVISION'
  review_text='Choose from 60 questions only on alcohols and carboxylic acids: structures, naming, uses, strength, concentration and reactions. Read the section preparation notes when you need a reminder. Practise with explanations or select Test yourself for a recorded quiz when the updated Google bank is confirmed.' if i==0 else 'Use the six practice questions above for this class. Once you have studied the Organic Chemistry unit, use its full revision simulator. Its 80 questions also cover hydrocarbons, combustion, cracking and addition polymers. Read the unit preparation before attempting unfamiliar areas.'
  review_link='revision.html' if i==0 else '../revision.html'
  page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{E(c['title'])} | Y10 Chemistry | Learning Lab</title><meta name="description" content="{E(c['intro'])}"><link rel="icon" href="{P}assets/brand/learning-lab-logo.png"><link rel="stylesheet" href="{P}platform.css"><link rel="stylesheet" href="{P}assets/y10-chemistry/chemistry.css?v=hands-on-4"><link rel="stylesheet" href="{P}assets/desktop-layout.css?v=investigation-dropdown-1"><link rel="stylesheet" href="{P}assets/investigation-picker.css?v=1"><link rel="stylesheet" href="{P}assets/y10-chemistry/classes.css?v=2"><script type="module" src="{P}assets/y10-chemistry/lab.js?v=alcohol-book-1"></script><script type="module" src="{P}assets/y10-chemistry/class-study.js?v=alcohol-book-1"></script>{scripts}</head><body class="organic-class-page" data-unit="organic" data-organic-class="{c['id']}"><a class="skip-link" href="#class-reading">Skip to the lesson</a><header class="site-header"><a class="wordmark" href="{P}index.html"><img src="{P}assets/brand/learning-lab-logo.png" alt="" width="44" height="44">Learning Lab</a><nav aria-label="Main navigation"><a href="{P}index.html#/years/y10/chemistry">Y10 Chemistry</a><a href="../">Organic Chemistry</a><a href="../revision.html">Unit revision</a></nav></header><main><nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="{P}index.html#/years/y10/chemistry">Y10 Chemistry</a></li><li><a href="../">Organic Chemistry</a></li><li><span aria-current="page">Class {i+1:02}</span></li></ol></nav><section class="chem-hero"><div><p class="eyebrow">Y10 CHEMISTRY · ORGANIC CLASS {i+1:02}</p><h1>{E(c['title'])}</h1><p>{E(c['intro'])}</p><div class="chem-tags">{tags}</div></div><img class="chem-cover" src="{hero_image}" width="800" height="500" alt="{E(c['title'])}: labelled structural formulas"></section><nav class="unit-nav" aria-label="Organic chemistry classes">{nav}</nav><section class="class-objectives"><h2>By the end of this class, you should be able to…</h2><ul>{''.join('<li>'+E(g)+'</li>' for g in goals)}</ul></section>{toc}{reading}<p class="class-model-note">{E(model_note)}</p>{current_bench}<section class="class-practice" id="class-practice"><p class="eyebrow">{practice_number} · CHECK THE IDEAS YOU JUST LEARNED</p><h2>Practise this class.</h2><p>Every question uses an idea explained above. Try it, read the feedback and return to a worked example if needed. These short practice checks and the practical notebook stay on this page; they are separate from recorded Test yourself sessions.</p><p id="class-practice-score" role="status">0 of {len(c['checks'])} questions correctly explained.</p><div class="class-question-grid">{questions}</div></section>{extras}{sequence}<section class="chem-review" aria-labelledby="review-title"><div><p class="eyebrow">{review_title}</p><h2 id="review-title">Ready to test your understanding?</h2><p>{E(review_text)}</p><p><a href="{'prepare.html' if i==0 else '../prepare.html'}">Read the preparation notes and examples →</a></p></div><a href="{review_link}">{'Open this section’s revision simulator' if i==0 else 'Open organic revision'} →</a></section><noscript><p>The full lesson and worked examples above are readable without JavaScript. Enable JavaScript to use the practical model and check practice answers.</p></noscript></main><footer class="site-footer"><a href="../">Back to Organic Chemistry</a><p>Y10 Chemistry · Class {i+1:02} · {E(c['short'])}</p></footer></body></html>'''
  (folder/'index.html').write_text(page)
  if i==0:
   revision=(BASE/'revision.html').read_text()
   revision=revision.replace('../../../../','../../../../../').replace('Organic Chemistry','Alcohols and carboxylic acids').replace('data-topic="y10-organic"','data-topic="y10-alcohols-acids"').replace('/questions/y10-organic.json','/questions/y10-alcohols-acids.json')
   revision=revision.replace('id="revision-app"','id="revision-app" data-formula-colour="alcohols-acids"')
   revision=re.sub(r'revision\.js\?[^"\']*','revision.js?v=alcohol-book-1',revision)
   revision=revision.replace('</head>',f'<link rel="stylesheet" href="{P}assets/y10-chemistry/alcohols/groups.css?v=1"></head>')
   revision=revision.replace('href="../organic-chemistry/"','href="./"')
   (folder/'revision.html').write_text(revision)
 # A full-width card group puts the separate classes before the general organic lab.
 text=(BASE/'index.html').read_text().replace('lab.js?v=investigation-dropdown-1','lab.js?v=alcohol-book-1');text=re.sub(r'<!-- organic-classes:start -->.*?<!-- organic-classes:end -->','',text,flags=re.S)
 text=re.sub(r'<link data-organic-classes[^>]*>','',text)
 text=text.replace('</head>','<link data-organic-classes rel="stylesheet" href="../../../../assets/y10-chemistry/classes.css?v=2"></head>')
 marker='<!-- learn-first:start -->' if '<!-- learn-first:start -->'in text else '<section class="investigation-chooser"'
 text=text.replace(marker,cards()+marker,1);(BASE/'index.html').write_text(text)
 path=ROOT/'catalog.json';catalog=json.loads(path.read_text());year=next(y for y in catalog['years'] if y['id']=='y10');subject=next(s for s in year['subjects'] if s['id']=='chemistry');topic=next(t for t in subject['topics'] if t['id']=='organic-chemistry')
 ids={c['id']+'-class' for c in CLASSES};topic['activities']=[a for a in topic['activities'] if a['id'] not in ids]
 for i,c in enumerate(CLASSES):
  rel='activities/y10/chemistry/organic-chemistry/'+c['id']+'/'
  topic['activities'].append(dict(id=c['id']+'-class',title=c['title']+': Class '+str(i+1),description=c['intro'],format=f'Class {i+1:02} · '+c['title'],duration='Study and investigate at your pace',href=rel,image=rel+('cover-book.svg' if i==0 else 'cover.svg')))
 revision_id='alcohols-acids-revision'
 topic['activities']=[a for a in topic['activities'] if a['id']!=revision_id]
 topic['activities'].append(dict(id=revision_id,title='Alcohols and carboxylic acids: revision simulator',description='60 section-exclusive questions covering structures, naming, properties, production and reactions, with Practice and Test yourself modes.',format='Revision · Alcohols and carboxylic acids',duration='Choose your session',href='activities/y10/chemistry/organic-chemistry/alcohols-carboxylic-acids/revision.html',image='activities/y10/chemistry/organic-chemistry/alcohols-carboxylic-acids/cover.svg'))
 path.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
 from brand import apply_branding
 apply_branding()
 return len(CLASSES)
if __name__=='__main__':print(f'Built {build_classes()} separate organic chemistry classes.')
