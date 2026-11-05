"""Keep the 3D titration discoverable when chemistry pages regenerate."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
def integrate():
 path=ROOT/'activities/y10/chemistry/acids-and-bases/index.html';s=path.read_text().replace('lab.js?v=organic-classes-1','lab.js?v=titration-3d-1')
 if 'class="titration-3d-link"' not in s:s=s.replace('<section class="investigation-chooser"','<p class="titration-3d-link" style="padding:18px;background:#e0ecef;border:1px solid #b3cbd0"><a href="titration-3d.html"><b>05 · Vinegar titration: enter the interactive 3D laboratory →</b></a></p><section class="investigation-chooser"',1)
 path.write_text(s);p=ROOT/'catalog.json';c=json.loads(p.read_text());y=next(y for y in c['years']if y['id']=='y10');subject=next(s for s in y['subjects']if s['id']=='chemistry');topic=next(t for t in subject['topics']if t['id']=='acids-and-bases');topic['activities']=[a for a in topic['activities']if a['id']!='vinegar-titration-3d']+[dict(id='vinegar-titration-3d',title='Vinegar titration: interactive 3D laboratory',description='Prepare a burette and measured vinegar aliquot, control the tap, swirl, inspect the meniscus and record persistent faint-pink endpoints.',format='3D practical',duration='Work at your pace',href='activities/y10/chemistry/acids-and-bases/titration-3d.html',image='activities/y10/chemistry/acids-and-bases/cover.svg')];p.write_text(json.dumps(c,ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':integrate()
