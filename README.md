# Learning Lab

An educational activity platform with a landing page and a **Year → Subject → Topic → Activity** catalogue. It is a static website, ready for GitHub Pages, with no build tools, accounts or backend required.

## Current activities

**Y7 → Maths → Algebra → Algebra: from boxes to brackets**

The algebra activity follows the teacher's three starter presentations: translating pen/clip-box stories; collecting linear, square and cube terms in x, y and z; then expanding brackets using identical bags. Students build pictures, sort terms by letter and power, enter equivalent expressions, and open/count every bag. Optional stretch examples explain negative factors, variable factors and double brackets. Original presentation files are not hosted. See the [lesson notes](activities/y7/maths/algebra/README.md).

The separate algebra revision simulator contains **60 questions** across six categories. It uses the same practice/test/retry engine as the science simulators, with a Year 7 Maths heading. The platform therefore has **180 revision questions** in total.

**Y9 → Science → Circulatory system → Inside the human heart**

Heart Lab retains its body-location illustration, rotatable 3D heart, re-center control and separate revision page. Its dissection step now opens the user-selected [Heart Lab](https://asielhm.github.io/heart-lab-y9/) in a new tab; the previous local dissection has been retired. Its standalone page and files are in `activities/y9/science/circulatory-system/`. The lesson has breadcrumb links back to its topic, subject, year and the platform home. The anatomical source model is unchanged; see [model attribution](MODEL-ATTRIBUTION.md) and the [lesson documentation](activities/y9/science/circulatory-system/README.md) for anatomy limitations.

**Y9 → Science → Breathing system → Inside the breathing system**

Breathing Lab explores respiratory anatomy, ventilation and alveolar gas exchange. Its files are in `activities/y9/science/breathing-system/`. Lung models and physiological values are teaching schematics, not a clinical simulation.

Both topic pages have a separate **revision simulator**, with **60 questions per topic** (120 total), at `revision.html`. Students can choose practice (immediate explanations) or a test (review at the end), filter their question pool and retry mistakes. The common engine is in `assets/revision/`; each topic has its own JSON question bank in `assets/revision/questions/`. Revision pages are also listed as activities in the catalogue.

**Y9 → Science → Gas laws → Gas laws: the particle lab**

A sealed-gas simulator explores Boyle–Mariotte (constant temperature), Charles (constant pressure), and Gay-Lussac/Amontons (constant volume). Live P/V/T values, a particle diagram, graphs and measurement tables help students investigate each relationship. Nine gated observations and questions supply contextual feedback. The classroom layout includes learning goals, three original labelled pictures, worked examples, and real-life connections to a capped syringe, a balloon and tyre pressure. Each example explains the limits of the idealised model. All calculations use Kelvin. The ideal-gas model is illustrative, with a fixed particle count and no experiments at absolute zero. Files are in `activities/y9/science/gas-laws/`.

Y9 Science shows exactly three main web-app cards: Circulatory system, Breathing system and Gas laws. Each topic's `primaryActivity` ID selects its main card and `appTitle` supplies its label. Revision simulators stay on separate pages, linked from the main apps and as secondary study links; they are not extra main app cards. Direct topic routes remain available for bookmarks and breadcrumbs.

The platform uses **Learning Lab** as a working name. Its branding is in `index.html` and `platform.css`.

## Add another activity

1. Put the activity's `index.html` and supporting files in an activity folder, for example `activities/y8/maths/fractions/`. Keep its asset and script URLs relative to its own page.
2. Open `catalog.json`. Find or add the year, then its subject, then its topic. Each year has `subjects`, each subject has `topics`, and each topic has `activities`. IDs are stable URL slugs; names are the text students see.
3. Add the activity under the topic's `activities` array. Supply a unique `id`, `title`, `description`, `format`, `duration`, `href` and optional `image`. Paths are relative to the platform root, including on GitHub Pages.
4. Add breadcrumb links from the lesson back to the platform. Use the existing Heart Lab as an example and adjust the relative path for the new folder depth.
5. Run `python3 tools/validate_catalog.py`, then browse the activity locally. Publish the files and the catalogue together.

Example activity entry:

```json
{
  "id": "fractions-lab",
  "title": "Explore fractions",
  "description": "A short explanation of what students will do.",
  "format": "Interactive activity",
  "duration": "10–15 min",
  "href": "activities/y8/maths/fractions/",
  "image": "activities/y8/maths/fractions/cover.png"
}
```

Year 7 through Year 12 have been reserved in the catalogue. Years without lessons display an honest empty state and links to available activities. Adding a subject, topic or activity to the catalogue automatically updates the navigation and counts; there are no extra menu files to edit. The landing page features the first available activity in catalogue order.

## Local development

From the repository root:

```sh
python3 tools/validate_catalog.py
python3 tools/validate_questions.py
python3 -m http.server 8000 --bind 127.0.0.1
```

Use the server for local browsing; opening files with `file://` prevents catalogue and model loading in some browsers. The landing page needs no third-party network requests. Heart Lab loads its pinned Three.js modules from `cdn.jsdelivr.net`.

Check home, all years, the Y9 Science topic/activity path, an empty year, browser Back, direct catalogue links, an invalid route, and the lesson's breadcrumb links. In Heart Lab, verify model loading, re-centering, anatomy selection, touch navigation and both links to the replacement dissection page.

## GitHub Pages

The repository already publishes from `main` at the repository root. Keep the new platform's `index.html`, `platform.js`, `platform.css`, `catalog.json` and the complete `activities/` tree together. All paths work under the repository subpath; no custom domain or deployment setting change is required.

The live root URL opens the platform. The heart lesson is at `activities/y9/science/circulatory-system/`. Catalogue URLs use hash routes, such as `#/years/y9/science/circulatory-system`, so direct links and refreshes work on GitHub Pages without server-side routing.

## Revision question banks and browser checks

Questions live in `assets/revision/questions/algebra.json`, `circulatory.json` and `breathing.json`. Every question has a stable `id`, a category, a Foundation/Application/Challenge difficulty, four options, a zero-based `answer`, and an explanation. Practice gives immediate feedback; test mode waits until completion. Questions and choices shuffle independently, with no repeated question within a session. Students can review all answers and retry only their mistakes. Scores are per session and are not stored as accounts or shared with teachers.

Run `python3 tools/validate_questions.py` after editing a bank. This checks unique IDs and prompts, four distinct choices, answer indices, categories and explanations. With Playwright installed and the static server running, `node tests/study-simulators.cjs` checks the catalogue, practice/test scoring, shuffled answers, targeted retries, filters, mobile keyboard/touch navigation and request-failure recovery. `BROWSER_HOME` can point to an environment-trusted Chromium home when the proxy certificate needs to be installed there; TLS verification stays enabled.

Additional browser checks: `node tests/breathing-lab.cjs` exercises the rendered lungs, anatomy, ventilation endpoints, pause and gas-exchange gates on desktop/mobile. `node tests/gas-laws.cjs` verifies the three app cards, numerical gas-law predictions, nine observation/question gates, recording/reset, Kelvin conversion and mobile controls.

The rotatable heart and lung viewers start centered. One finger rotates; two fingers pan and pinch to zoom. Desktop mouse rotation, wheel zoom and right-button panning are supported. Re-center restores the centered front view and zoom. `node tests/viewer-touch.cjs` checks actual touch gestures on both models; `node tests/viewer-centering.cjs` checks visual centering and fitting across screen sizes and lesson states.

The live platform is now https://asielhm.github.io/learning-lab/ and the Git origin is `asielhm/learning-lab`. Internal page and asset paths remain relative. `primaryActivity` determines each topic's main app card; additional revision pages remain secondary links. Shared revision wrappers can set `data-course` to their year/subject; existing Science pages keep their Year 9 default.

For the algebra lesson, run `node tests/algebra-math.mjs` for symbolic checks, then `node tests/algebra-lab.cjs` with the static server and Playwright available for classroom interactions and revision scoring on desktop/mobile.
