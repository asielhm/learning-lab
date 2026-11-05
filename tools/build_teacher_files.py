"""One current teacher setup page; only the three final Google files are listed."""
import sys
sys.dont_write_bytecode=True
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
files=[('Code.gs','Recording, validation and private teacher access.'),('QuestionBank.gs','The complete current question and game catalogue.'),('Dashboard.html','The password-protected results interface.')]
cards=''.join(f'<article class="teacher-panel" data-final-file="{name}"><h2>{name}</h2><p>{description}</p><div class="setup-files"><a href="../google-apps-script/{name}" download="{name}">Download {name}</a><button type="button" data-copy="{name}">Copy {name}</button></div></article>'for name,description in files)
page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Final Google files | Learning Lab</title><link rel="icon" href="../assets/brand/learning-lab-logo.png"><link rel="stylesheet" href="../platform.css"><link rel="stylesheet" href="teacher.css?v=final-files-1"><script type="module" src="setup.js?v=final-files-1"></script></head><body><header class="site-header"><a class="brand" href="../index.html"><img src="../assets/brand/learning-lab-logo.png" alt="" width="44" height="44">Learning Lab</a><nav aria-label="Main navigation"><a href="./">Teacher dashboard</a></nav></header><main class="teacher-main" id="update-recording"><p class="eyebrow">CURRENT RELEASE · THREE FILES</p><h1>Final Google files.</h1><p>Replace the matching files in your existing Apps Script project with these final versions. If your main script is named <b>Código.gs</b>, paste Code.gs there. Save, run <code>setupLearningLab</code>, then deploy a new version using the existing deployment URL. Your results and teacher password stay in place.</p>{cards}<p id="copy-status" role="status" aria-live="polite"></p><p><a href="./">Return to the teacher dashboard →</a></p></main><footer class="site-footer"><a href="../index.html">Learning Lab</a></footer></body></html>'''
(ROOT/'teacher/setup.html').write_text(page)
from brand import apply_branding
apply_branding()
print('Teacher setup now lists only the three final Google files.')
