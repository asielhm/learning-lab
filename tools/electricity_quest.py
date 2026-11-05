"""Idempotent discovery integration for the Y9 electricity pixel adventure."""
import json,os,re
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
GAME='activities/y9/science/electricity/games/power-quest.html'
COVER='assets/electricity-quest/cover.svg'
def integrate_electricity_quest():
 if not (ROOT/GAME).exists():return
 for relative in ('activities/y9/science/electricity/index.html','activities/y9/science/electricity/static/index.html','activities/y9/science/electricity/circuits/index.html','activities/games/index.html'):
  path=ROOT/relative;page=path.read_text();page=re.sub(r'<!-- electricity-quest:start -->.*?<!-- electricity-quest:end -->','',page,flags=re.S);page=re.sub(r'<link data-electricity-quest[^>]*>','',page)
  page=re.sub(r'<a data-electricity-quest-nav[^>]*>.*?</a>','',page)
  link=lambda target:os.path.relpath(ROOT/target,path.parent)
  page=page.replace('</head>',f'<link data-electricity-quest rel="stylesheet" href="{link("assets/like-terms-rpg/links.css")}?v=1"></head>')
  banner=f'''<!-- electricity-quest:start --><section class="rpg-discovery" id="electricity-adventure"><img src="{link(COVER)}" width="800" height="450" alt="Pixel explorers restoring a city of electric circuits"><div><span class="eyebrow">Y9 SCIENCE · ELECTRICITY · PIXEL ADVENTURE</span><h2>Power up Voltvale.</h2><p>Create an explorer, investigate charge and restore the city’s circuits. Six districts, 24 challenges and six power relics: move electrons, connect instruments, tune the supply and collect treasure.</p><a href="{link(GAME)}">Play The Power Quest →</a></div></section><!-- electricity-quest:end -->'''
  marker=page.index('<section id="references"') if relative=='activities/games/index.html' else page.index('<section class="revision-invite"')
  page=page[:marker]+banner+page[marker:];path.write_text(page)
  if relative=='activities/games/index.html':
   page=re.sub(r'(<nav class="play-tabs"[^>]*>.*?)(</nav>)',r'\1<a data-electricity-quest-nav href="#electricity-adventure">Y9 Electricity</a>\2',page,count=1,flags=re.S)
  else:
   end=page.index('</header>');before,after=page[:end],page[end:];pos=before.rfind('</nav>');before=before[:pos]+f'<a data-electricity-quest-nav href="{link(GAME)}">Power Quest</a>'+before[pos:];page=before+after
  path.write_text(page)
 p=ROOT/'catalog.json';catalog=json.loads(p.read_text());year=next(y for y in catalog['years'] if y['id']=='y9');subject=next(s for s in year['subjects'] if s['id']=='science');topic=next(t for t in subject['topics'] if t['id']=='electricity')
 activity=dict(id='electricity-power-quest',title='Voltvale: The Power Quest',description='A pixel adventure through static charge, circuit building, meters, Ohm’s law and parallel paths. Create a hero, use the apparatus, solve 24 challenges and earn six power relics.',format='Pixel adventure game',duration='Six districts · save and return',href=GAME,image=COVER)
 topic['activities']=[a for a in topic['activities'] if a['id']!=activity['id']]+[activity];p.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
