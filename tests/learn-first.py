"""Content/order checks for the reading-first additions; no browser needed."""
import sys
sys.dont_write_bytecode=True
from pathlib import Path
from html.parser import HTMLParser
import json,re
from urllib.parse import urlsplit,unquote
sys.path.insert(0,str(Path(__file__).resolve().parent.parent/'tools'))
from school_reading import DATA
from notation import SCHOOL, OLYMPIAD
from build_learn_first import sources,topics_for
ROOT=Path(__file__).resolve().parent.parent
class Inspect(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  for k in ['src','href']:
   if a.get(k) and not a[k].startswith(('#','http','data:')):self.links.append(unquote(urlsplit(a[k]).path))
source=sources();topics=0
for key in DATA:
 page=ROOT/'activities'/key/'index.html';s=page.read_text();assert s.count('id="learn-first"')==1,key
 assert '<details id="read-topic-1" class="reading-topic" open>' in s,key
 count=len(topics_for(key,source));assert s.count('class="reading-topic" open')==count
 assert len(SCHOOL[key])==count
 assert s.count('class="notation-key"')==count
 topics+=count
 p=Inspect();p.feed(s)
 for link in p.links:
  path=(page.parent/link).resolve()
  assert path.exists(),(key,link)
 assert len([i for i in p.ids if i.startswith('read-topic-')])==len(set(i for i in p.ids if i.startswith('read-topic-')))
 target=re.search(r'class="reading-jump" href="#([^"]+)"',s)[1];assert target in p.ids,(key,target)
 assert s.index('id="learn-first"')<s.index('id="'+target+'"'),key
olymp=0
for name in ['oaq','oaf']:
 course=json.loads((ROOT/'assets'/name/'course.json').read_text())
 for u in course['units']:
  path=ROOT/'activities'/name/u['path']/'index.html';s=path.read_text();p=Inspect();p.feed(s)
  assert s.count('class="reading-start"')==4
  assert s.count('class="reading-connection"')==4
  assert s.count('class="worked" open')==4
  assert s.count('class="notation-key"')==4
  assert len(OLYMPIAD[u['id']])==4
  assert s.index('class="reading-start"')<s.index('id="laboratorio"')
  for l in u['lessons']:
   assert len(l['beginner']['start'])>180
   assert len(l['beginner']['connection'])>120
   assert len(l['text'])>=1 and l['example'] and l['memory'] and l['check']
   olymp+=1
  for link in p.links:assert (path.parent/link).resolve().exists(),(u['id'],link)
assert olymp==100
print(f'52 published unit pages: {topics} school topic explanations plus {olymp} enriched Olympiad lessons; examples open, practical links valid, explanations first, all local assets present.')
