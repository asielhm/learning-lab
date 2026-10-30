"""Check that every assessed question and round has preceding teaching material."""
from pathlib import Path
from html.parser import HTMLParser
from html import unescape
import json,re
ROOT=Path(__file__).resolve().parent.parent
audit=json.loads((ROOT/'docs/assessment-coverage.json').read_text())
class Page(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.links=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.append(a['id'])
  if tag=='a' and a.get('href'):self.links.append(a['href'])
count=0
for topic,item in audit['revision'].items():
 page=ROOT/item['path'];parser=Page();s=page.read_text();parser.feed(s);assert len(parser.ids)==len(set(parser.ids))
 wrapper=page.with_name('revision.html').read_text();assert wrapper.index('href="prepare.html"')<wrapper.index('id="revision-app"')
 index=page.with_name('index.html').read_text();assert 'href="prepare.html"' in index
 if 'Ready to test your understanding?'in index:assert index.index('Before the questions and games')<index.index('Ready to test your understanding?')
 for question,reference in item['questions'].items():
  assert reference.split('#')[1] in parser.ids;count+=1
 assert 'Understand the ideas' in s and 'Reasoning:' in s
for game,item in audit['games'].items():
 s=(ROOT/item['path']).read_text();parser=Page();parser.feed(s)
 for round,reference in item['rounds'].items():assert reference.split('#')[1] in parser.ids
assert len(audit['revision'])==24 and count==1580 and len(audit['games'])==42
assert sum(len(g['rounds']) for g in audit['games'].values())==183
for game in json.loads((ROOT/'assets/records/games.json').read_text())['games']:
 assert game['preparation']==audit['games'][game['id']]['path']
print('Teaching coverage: all 1,580 revision questions and 183 rounds in 42 games have explicit prior explanation/worked-example anchors; links precede quizzes and final revision invitations.')
