# Heart Lab — Y9 Circulatory System

A GitHub Pages–ready learning website built from the uploaded OrganUI heart model (`heart-3d-main`). No build tools are needed.

## Lesson flow

1. **In the body** — illustrated location of the heart between the lungs.
2. **Zoom into the heart** — a real rotatable anatomical GLB heart model; clicking structures displays their function.
3. **Guided virtual dissection** — the 12-stage sequence supplied by the user from [Biology Junction’s heart dissection](https://biologyjunction.com/heart-dissection/): orientation; pericardium; external landmarks; major vessels; pulmonary/right ventricular incision; right-side opening; tricuspid apparatus and septum; pulmonary valve; left ventricular incision; left-side opening and mitral valve; aortic incision and valve; blood flow and ventricular comparison.

Each stage requires its practical actions and a correct answer. Select Observe, Probe, Scissors or Forceps as directed. For incisions, press at checkpoint 1 and trace through the remaining highlighted checkpoints with a mouse or finger. A keyboard-accessible guided-cut button provides equivalent actions. Previous preserves completed work; resetting the dissection clears all tasks, answers, incisions and openings. The first two lesson sections retain their existing interactions. The body view uses an anatomical heart image rendered from the attributed GLB model (`models/heart-anterior.png`).

**Scientific limitations:** The pericardium is a simulated translucent teaching shell. The source GLB has one combined ventricular-wall mesh and solid cavity surfaces, so independent, animated viewing windows represent opening the free walls. They preserve the rest of the mesh but do not simulate tissue cutting, mechanical flaps or measured incision paths. Valve cusps, chordae tendineae, papillary muscles, pulmonary veins and inferior vena cava are not included in the source model. Labelled teaching sections supply the missing internal anatomy and identify the septum schematically. Wall thickness comparisons are illustrative, not measurements from the GLB. The torso is an illustrative SVG. The original source webpage could not be fetched in this environment; the stage mapping follows the 12-stage procedure text supplied by the user.

## Local development and validation

No installation or build is needed. From this repository run `python3 -m http.server 8000 --bind 127.0.0.1`. The browser needs access to `cdn.jsdelivr.net` for the pinned Three.js modules. A complete browser check should exercise all 12 stages, verify action/question gates, retry an incorrect answer, trace each incision, and verify Previous, reset, exploration and body-view interactions. Check on both desktop and a touch viewport. No automated test framework is required by the application.

## Publish on GitHub Pages

1. Create a new public GitHub repository (e.g. `y9-heart-lab`).
2. Upload **all files**, retaining the `models/heart.glb` folder and `index.html` at repository root.
3. Go to Settings → Pages → Build and deployment → Deploy from a branch → `main` → `/ (root)` → Save.
4. Open `https://YOUR-USERNAME.github.io/y9-heart-lab/` after deployment.

You can also publish from a repository you already have, by placing these files at its root (be aware that replacing its `index.html` will replace its old homepage).

The 3D viewer loads Three.js modules from jsDelivr CDN. Internet is needed at least on initial load. Opening `index.html` directly as a `file://` local file may not work because the browser blocks module/model loading. Use GitHub Pages or a local web server such as `python -m http.server 8000`.

## Attribution

The model `models/heart.glb` comes from the supplied OrganUI project and its BodyParts3D anatomical reconstruction. Model attribution and license information is in `MODEL-ATTRIBUTION.md`. BodyParts3D material is CC BY 4.0. Preserve attribution if you republish. The app page implementation is an original educational adaptation.
