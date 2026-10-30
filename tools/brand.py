"""Idempotent, accessible Learning Lab by Asiel logo lockups for published pages."""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parent.parent
SIGNATURE='<span class="ll-brand-name"><span class="ll-brand-title">Learning <span>Lab</span></span><span class="ll-brand-by">by <b>Asiel</b></span><span class="ll-brand-tagline">A PLACE FOR CURIOUS MINDS</span></span>'
CLASSES={'wordmark','brand','blood-brand','footer-brand','brand-lockup'}
def brand_html(text,prefix='',dashboard=False):
 changed=False
 home_label='Learning Lab by Asiel · Inicio' if re.search(r'<html[^>]*lang=[\"\']es',text) else 'Learning Lab by Asiel home'
 def lockup(match):
  nonlocal changed
  anchor=match.group(0);opening=re.match(r'<a\b[^>]*>',anchor).group(0)
  c=re.search(r'class=[\"\']([^\"\']*)[\"\']',opening)
  if not c or not set(c[1].split())&CLASSES:return anchor
  if 'learning-lab-logo.png' not in anchor and not re.search(r'learning\s*(?:<[^>]+>)*\s*lab',anchor,re.I):return anchor
  changed=True
  if 'll-brand-lockup' not in c[1].split():opening=opening[:c.start(1)]+c[1]+' ll-brand-lockup'+opening[c.end(1):]
  opening=re.sub(r'aria-label=[\"\'][^\"\']*[\"\']',f'aria-label="{home_label}"',opening)
  if 'aria-label=' not in opening:opening=opening[:-1]+f' aria-label="{home_label}">'
  image=re.search(r'<img\b[^>]*learning-lab-logo\.png[^>]*>',anchor)
  image=image.group(0) if image else f'<img class="brand-logo" src="{prefix}assets/brand/learning-lab-logo.png" width="44" height="44" alt="">'
  return opening+image+SIGNATURE+'</a>'
 text=re.sub(r'<a\b[^>]*>.*?</a>',lockup,text,flags=re.S)
 if changed:
  if dashboard:
   style=(ROOT/'assets/brand/brand.css').read_text();text=re.sub(r'<style id="asiel-brand">.*?</style>','',text,flags=re.S);text=text.replace('</head>',f'<style id="asiel-brand">{style}</style></head>')
  else:
   if re.search(r'<link\b[^>]*assets/brand/brand\.css[^>]*>',text):text=re.sub(r'assets/brand/brand\.css(?:\?[^\"\']*)?', 'assets/brand/brand.css?v=asiel-2',text)
   else:text=text.replace('</head>',f'<link rel="stylesheet" href="{prefix}assets/brand/brand.css?v=asiel-2"></head>')
  text=re.sub(r'<title>(.*?)</title>',lambda m:'<title>'+m[1].replace('Learning Lab by Asiel','Learning Lab').replace('Learning Lab','Learning Lab by Asiel')+'</title>',text,flags=re.S)
 return text

def apply_branding():
 paths=[*ROOT.glob('*.html'),*(ROOT/'activities').rglob('*.html'),*(ROOT/'teacher').rglob('*.html')];count=0
 for path in paths:
  prefix='../'*len(path.relative_to(ROOT).parts[:-1]);old=path.read_text();new=brand_html(old,prefix)
  if new!=old:path.write_text(new);count+=1
 dashboard=ROOT/'google-apps-script/Dashboard.html';old=dashboard.read_text();new=brand_html(old,dashboard=True)
 if new!=old:dashboard.write_text(new);count+=1
 return count
if __name__=='__main__':print(f'Branded {apply_branding()} pages with Learning Lab by Asiel.')
