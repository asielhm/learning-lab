"""Idempotent links: call after regenerating school unit pages/catalogue."""
import html,json,re,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent

def manifest():
 return json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {units} from './assets/unit-games/data.mjs';console.log(JSON.stringify(units))"],cwd=ROOT,text=True))

def integrate():
 catalog=json.loads((ROOT/'catalog.json').read_text())
 for u in manifest():
  folder=ROOT/u['path'];p=folder/'index.html'
  if not p.exists():continue
  page=p.read_text();page=re.sub(r'<!-- unit-games:start -->.*?<!-- unit-games:end -->','',page,flags=re.S)
  page=re.sub(r'<link data-unit-games[^>]*>','',page)
  page=page.replace('</head>','<link data-unit-games rel="stylesheet" href="../../../../assets/unit-games/links.css?v=1"></head>')
  page=re.sub(r'<a data-unit-games-nav[^>]*>.*?</a>','',page)
  header_end=page.index('</header>');before,after=page[:header_end],page[header_end:]
  last_nav=before.rfind('</nav>')
  before=before[:last_nav]+'<a data-unit-games-nav href="games/">Games</a>'+before[last_nav:]
  page=before+after
  extra=u.get('extraGames',[]);game_count=2+len(extra)
  names=html.escape(u['classic']['title'])+' and '+html.escape(u['workshop']['title']) if not extra else ', '.join(html.escape(g['title']) for g in [u['classic'],u['workshop'],*extra])
  invite=f'''<!-- unit-games:start --><section id="games" class="game-lesson-invite" aria-labelledby="games-title"><div><span class="game-mini-tag">LEARN THROUGH PLAY · {game_count} GAMES</span><h2 id="games-title">Try it. Solve it. Play again.</h2><p>{names}: move cards, build a model and use feedback to work out the next step.</p></div><a href="games/">Choose a game →</a></section><!-- unit-games:end -->'''
  marker=re.search(r'<section\b[^>]*class="[^\"]*\b(?:unit-review|chem-review|physics-review|lesson-review)\b[^\"]*"',page)
  if not marker:raise ValueError('Missing final revision invitation: '+str(p))
  page=page[:marker.start()]+invite+page[marker.start():];p.write_text(page)
  year=next(y for y in catalog['years'] if y['id']==u['year']);subject=next(s for s in year['subjects'] if s['id']==u['subject']);topic=next(t for t in subject['topics'] if t['id']==u['topic'])
  ident=u['slug']+'-games';topic['activities']=[a for a in topic['activities'] if a['id']!=ident]
  topic['activities'].append(dict(id=ident,title=u['name']+': learning games',description=(u['classic']['title']+' and '+u['workshop']['title']+'. Three rounds each, illustrated game boards, hints, explanations and targeted retries.') if not extra else 'Four games: rule matching, coordinate checkpoints, mystery function machines and direct/inverse proportion paint orders. 18 rounds with hints and explanations.',format='Learning games',duration='5–15 minutes',href=u['path']+'games/',image=u['path']+'games/cover.svg'))
 (ROOT/'catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
