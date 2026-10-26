# Learning Lab

An educational activity platform with a landing page and a **Year → Subject → Topic → Activity** catalogue. It is a static website, ready for GitHub Pages, with no build tools, accounts or backend required.

## Current activity

**Y9 → Science → Circulatory system → Inside the human heart**

Heart Lab retains its body-location illustration, rotatable 3D heart, re-center control and 12-stage guided dissection. Its standalone page and files are in `activities/y9/science/circulatory-system/`. The lesson has breadcrumb links back to its topic, subject, year and the platform home. The anatomical source model is unchanged; see [model attribution](MODEL-ATTRIBUTION.md) and the [lesson documentation](activities/y9/science/circulatory-system/README.md) for anatomy limitations.

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

Year 7 through Year 13 have been reserved in the catalogue. Years without lessons display an honest empty state and links to available activities. Adding a subject, topic or activity to the catalogue automatically updates the navigation and counts; there are no extra menu files to edit. The landing page features the first available activity in catalogue order.

## Local development

From the repository root:

```sh
python3 tools/validate_catalog.py
python3 -m http.server 8000 --bind 127.0.0.1
```

Use the server for local browsing; opening files with `file://` prevents catalogue and model loading in some browsers. The landing page needs no third-party network requests. Heart Lab loads its pinned Three.js modules from `cdn.jsdelivr.net`.

Check home, all years, the Y9 Science topic/activity path, an empty year, browser Back, direct catalogue links, an invalid route, and the lesson's breadcrumb links. In Heart Lab, verify model loading, re-centering, practical/question gates and incision tracing on desktop and touch viewports.

## GitHub Pages

The repository already publishes from `main` at the repository root. Keep the new platform's `index.html`, `platform.js`, `platform.css`, `catalog.json` and the complete `activities/` tree together. All paths work under the repository subpath; no custom domain or deployment setting change is required.

The live root URL opens the platform. The heart lesson is at `activities/y9/science/circulatory-system/`. Catalogue URLs use hash routes, such as `#/years/y9/science/circulatory-system`, so direct links and refreshes work on GitHub Pages without server-side routing.
