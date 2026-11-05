"""Keep the like-terms adventure discoverable when the school pages regenerate."""
import json,os,re
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
GAME='activities/y7/maths/algebra-ii/games/like-terms-quest.html'
COVER='assets/like-terms-rpg/cover.svg'

def integrate_quest():
 if not (ROOT/GAME).exists():return
 for relative in ('activities/y7/maths/algebra-ii/index.html','activities/y7/maths/algebra/index.html','activities/y7/maths/algebra/games/index.html','activities/games/index.html'):
  path=ROOT/relative
  if not path.exists():continue
  page=path.read_text();page=re.sub(r'<!-- like-terms-quest:start -->.*?<!-- like-terms-quest:end -->','',page,flags=re.S)
  page=re.sub(r'<!-- like-terms-quest:inline:start -->.*?<!-- like-terms-quest:inline:end -->','',page,flags=re.S)
  page=re.sub(r'<link data-rpg-links[^>]*>','',page)
  link=lambda target:os.path.relpath(ROOT/target,path.parent)
  page=page.replace('</head>',f'<link data-rpg-links rel="stylesheet" href="{link("assets/like-terms-rpg/links.css")}?v=1"></head>',1)
  banner=f'''<!-- like-terms-quest:start --><section class="rpg-discovery" aria-labelledby="runehaven-title"><img src="{link(COVER)}" width="800" height="450" alt="Pixel explorers, matching algebra runes and a treasure chest"><div><span class="eyebrow">Y7 MATHS · ALGEBRA II · PIXEL ADVENTURE</span><h2 id="runehaven-title">Collect like terms. Discover Runehaven.</h2><p>Create a hero and walk through six pixel worlds. Help guardians by matching, sorting and collecting like terms. Unlock 24 treasure chests, earn relics and keep the rules in your study journal.</p><a href="{link(GAME)}">Play the Like-Terms Quest →</a></div></section><!-- like-terms-quest:end -->'''
  if relative.endswith('algebra/games/index.html'):
   marker=page.index('<div class="game-hub-grid">')
  elif relative=='activities/games/index.html':
   marker=page.index('<div class="game-hub-grid">',page.index('<section id="maths"'))
  else:
   found=re.search(r'<section\b[^>]*class="[^\"]*\b(?:unit-review|lesson-review)\b[^\"]*"',page)
   if not found:raise ValueError('Final revision invitation missing: '+relative)
   marker=found.start()
  page=page[:marker]+banner+page[marker:];path.write_text(page)
  if relative=='activities/y7/maths/algebra/index.html':
   before=page.index('<section id="collectPanel"');after=page.index('<section id="bagsPanel"',before);end=page.rfind('</section>',before,after)
   inline=f'<!-- like-terms-quest:inline:start --><p class="rpg-inline-link"><b>Put your like-term skills to work.</b> <a href="{link(GAME)}">Create a pixel explorer and play the Like-Terms Quest →</a></p><!-- like-terms-quest:inline:end -->'
   page=page[:end]+inline+page[end:];path.write_text(page)
 catalog_path=ROOT/'catalog.json';catalog=json.loads(catalog_path.read_text())
 year=next(y for y in catalog['years'] if y['id']=='y7');subject=next(s for s in year['subjects'] if s['id']=='maths');topic=next(t for t in subject['topics'] if t['id']=='algebra-ii')
 activity=dict(id='like-terms-quest',title='Runehaven: The Like-Terms Quest',description='Create a pixel hero, solve like-term challenges across six worlds and collect 24 treasures. Guided rules, worked examples, a study journal and local adventure saves.',format='Pixel adventure game',duration='Six levels · save and return',href=GAME,image=COVER)
 topic['activities']=[a for a in topic['activities'] if a['id']!=activity['id']]+[activity]
 catalog_path.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
