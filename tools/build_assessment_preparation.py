"""Provide an explicit teaching reference before every recorded question/game.
Existing authored explanations and worked examples remain the source of truth.
No question choices, wrong distractors or student records are copied into guides.
"""
from pathlib import Path
from html import escape as E
from html.parser import HTMLParser
import collections,json,re,subprocess
from school_reading import DATA
from notation import SCHOOL,school_notation
ROOT=Path(__file__).resolve().parent.parent
class Wrapper(HTMLParser):
 def __init__(self):super().__init__();self.attrs=None
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if attrs.get('id')=='revision-app':self.attrs=attrs

def apply_preparation():
 games=json.loads(subprocess.check_output(['node',str(ROOT/'tools/export_game_catalog.mjs')],text=True));audit={'revision':{},'games':{}}
 for wrapper in sorted((ROOT/'activities').rglob('revision.html')):
  parser=Wrapper();parser.feed(wrapper.read_text())
  if not parser.attrs:continue
  attrs=parser.attrs;bank=json.loads((wrapper.parent/attrs['data-bank']).resolve().read_text());topic=bank['topicId'];folder=wrapper.parent;path=folder/'prepare.html';relative=folder.relative_to(ROOT);prefix='../'*len(relative.parts);key=str(folder.relative_to(ROOT/'activities'));course=attrs.get('data-course','Year 9 Science');title=bank['title'];grouped=collections.defaultdict(list)
  for q in bank['questions']:grouped[q['category']].append(q)
  start=DATA.get(key);intro=''.join('<p>'+E(x)+'</p>' for x in start[:3]) if start else '<p>Start with the unit’s illustrated lesson, then use these notes to connect the vocabulary, models and worked examples before you answer questions. An example shows the reasoning; the practical lets you test it.</p>'
  lesson='index.html';cover='cover.svg'
  hero=f'<img class="prep-cover" src="{cover}" alt="{E(title)} illustrated unit" width="800" height="360">' if (folder/cover).exists() else ''
  toc='';sections='';audit['revision'][topic]={'path':str(path.relative_to(ROOT)),'questions':{}}
  for i,(category,questions) in enumerate(grouped.items()):
   ident=f'concept-{i+1}';toc+=f'<a href="#{ident}">{i+1:02} · {E(category)}</a>'
   # All authored explanations are readable as concept notes before opening examples.
   notes=list(dict.fromkeys(q['explanation'] for q in questions));notes_html=''.join(f'<li>{E(n)}</li>' for n in notes)
   examples=''
   for q in questions:
    anchor='example-'+q['id'];audit['revision'][topic]['questions'][q['id']]=str(path.relative_to(ROOT))+'#'+anchor
    examples+=f'<details class="prep-example" id="{E(anchor)}"><summary>Worked example · {E(q["prompt"])}</summary><div><p class="prep-answer"><strong>Result:</strong> {E(q["options"][q["answer"]])}</p><p><strong>Reasoning:</strong> {E(q["explanation"])}</p><p class="prep-think">Explain the reasoning in your own words, then compare it with the practical model. For a calculation, identify the known quantities and units before choosing the rule.</p></div></details>'
   notation=''
   sections+=f'<section id="{ident}" class="prep-section"><div class="prep-heading"><span>{i+1:02}</span><h2>{E(category)}</h2></div><h3>Understand the ideas</h3><ul class="prep-notes">{notes_html}</ul>{notation}<h3>Follow the worked examples</h3><p>Try to explain the example first, then open it to compare your reasoning.</p>{examples}</section>'
  if key in SCHOOL:
   glossary=''.join(school_notation(key,i) for i in range(len(SCHOOL[key])))
   sections='<section class="prep-section" id="symbols-and-units"><h2>Read the symbols and units</h2><p>Use this reference whenever a letter, subscript or unit in an example is new to you. A subscript is a smaller label, such as ₁ for the first state; an exponent is a power, such as ² for a square.</p>'+glossary+'</section>'+sections
  relevant=[g for g in games.values() if g['topic']==topic];game_sections=''
  for game in relevant:
   audit['games'][game['id']]={'path':str(path.relative_to(ROOT)),'rounds':{}}
   entries=''
   for rid,r in game['rounds'].items():
    anchor='game-'+game['id']+'-'+rid;audit['games'][game['id']]['rounds'][rid]=str(path.relative_to(ROOT))+'#'+anchor
    solution=r.get('solution');solution_text=json.dumps(solution,ensure_ascii=False) if isinstance(solution,(dict,list)) else str(solution or '')
    entries+=f'<article id="{E(anchor)}" class="prep-game-note"><h4>{E(r["prompt"])}</h4><p>{E(r.get("explanation") or "Apply the same rule to every input and keep each variable’s meaning consistent.")}</p>{f"<details><summary>Compare one model solution</summary><p>{E(solution_text)}</p></details>" if solution_text else ""}</article>'
   game_sections+=f'<details class="prep-game" id="game-{game["id"]}"><summary>{E(game["title"])} · concepts and examples</summary><div>{entries}</div></details>'
  if game_sections:sections+=f'<section id="game-preparation" class="prep-section"><div class="prep-heading"><span>PLAY</span><h2>Understand before you play</h2></div><p>Read the situation and its conditions, identify the changing quantities and explain why your model fits. These examples teach the ideas used by this unit’s games. Hints and revealed solutions are learning tools; they reduce the game stars.</p>{game_sections}</section>'
  page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{E(title)} · Preparation | Learning Lab</title><link rel="icon" href="{prefix}assets/brand/learning-lab-logo.png"><link rel="stylesheet" href="{prefix}platform.css"><link rel="stylesheet" href="{prefix}assets/assessment-preparation/prepare.css?v=1"></head><body><header class="site-header"><a class="brand" href="{prefix}index.html"><img src="{prefix}assets/brand/learning-lab-logo.png" alt="" width="44" height="44">Learning Lab</a><nav aria-label="Main navigation"><a href="{lesson}">Unit lesson</a><a href="revision.html">Revision simulator</a></nav></header><main class="prep-main"><a href="{lesson}">← Back to {E(title)}</a><p class="eyebrow">{E(course.upper())} · LEARN BEFORE YOU ANSWER</p><h1>{E(title)}<br><span>Preparation and worked examples</span></h1><div class="prep-intro"><div>{intro}</div>{hero}</div><ol class="prep-steps"><li><b>Read and explain.</b> Learn the vocabulary and say why the process works.</li><li><b>Work through an example.</b> Identify the known information, rule and result.</li><li><b>Investigate, then apply.</b> Return to the practical, game or revision simulator.</li></ol><nav class="prep-toc" aria-label="Preparation topics">{toc}{'<a href="#game-preparation">Game preparation</a>' if relevant else ''}</nav>{sections}<section class="prep-ready"><h2>Ready to apply the ideas?</h2><a href="{lesson}">Return to the practical activities →</a><a href="revision.html">Open revision simulator →</a></section></main></body></html>'''
  path.write_text(page)
  # Put an explicit prerequisite link before the question engine starts.
  text=wrapper.read_text();text=re.sub(r'<!-- assessment-preparation:start -->.*?<!-- assessment-preparation:end -->','',text,flags=re.S)
  marker='<section id="revision-app"';assert marker in text
  note='<!-- assessment-preparation:start --><aside class="revision-intro"><h2>Before you answer</h2><p>Read the <a href="prepare.html">preparation notes and worked examples</a> first. They explain the ideas, vocabulary and reasoning used in this revision simulator.</p></aside><!-- assessment-preparation:end -->'
  text=text.replace(marker,note+marker);wrapper.write_text(text)
  # Keep this learning route visible in the preceding unit, not only in the quiz.
  index=folder/'index.html'
  if index.exists():
   text=index.read_text();text=re.sub(r'<!-- assessment-preparation:start -->.*?<!-- assessment-preparation:end -->','',text,flags=re.S)
   note='<!-- assessment-preparation:start --><section class="prep-unit-link" style="margin:24px 0;padding:20px;border:2px solid #cbdccc;border-radius:14px;background:#f0f7ef;color:#243f36"><h2 style="font-size:24px;margin:0 0 12px">Before the questions and games</h2><p><a href="prepare.html">Study the preparation notes and worked examples →</a></p><p>Learn the vocabulary, follow the reasoning and compare a model solution before trying the revision simulator or question games.</p></section><!-- assessment-preparation:end -->'
   # Above the final invitation where present; otherwise before the unit's main closes.
   title_pos=text.find('Ready to test your understanding?')
   matches=list(re.finditer(r'<section\b[^>]*>',text[:title_pos])) if title_pos>=0 else []
   match=matches[-1] if matches else re.search(r'<(?:section|div)[^>]*id="(?:revision-invitation|ready-to-test|revision)"',text)
   text=text[:match.start()]+note+text[match.start():] if match else text.replace('</main>',note+'</main>',1)
   index.write_text(text)
 # Every game has an explicit matching prerequisite route; fail rather than silently omit one.
 assert len(audit['games'])==len(games),set(games)-set(audit['games'])
 (ROOT/'docs/assessment-coverage.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n')
 from brand import apply_branding
 apply_branding()
 return audit
if __name__=='__main__':
 audit=apply_preparation();print(f'Preparation references: {len(audit["revision"])} revision banks and {len(audit["games"])} games.')
