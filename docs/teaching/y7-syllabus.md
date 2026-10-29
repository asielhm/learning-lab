# Year 7 syllabus implementation

`assets/y7-maths/units.json` defines the seven-unit order and support/challenge outcomes. Run `tools/build_y7_pages.py` after changing unit metadata, `tools/build_unit_games.py` for game hubs and `tools/build_learn_first.py` for explanations. The final revision invitation remains last on each lesson page.

- Algebra I: variables, coordinate axes, direct/inverse proportion; seven games including the uploaded print-pack activities.
- Algebra II: expressions, like terms with linear/quadratic/cubic variable parts, brackets, equations in natural numbers then integers, x on both sides. Seven exact-rational workbench presets support valid manual transformations, undo, substitution checks and one-step help. November is labelled a bridge to Y8 (2027), without inventing a new year course.
- Statistics: keys/partial pictograms; draggable and keyboard-operable bars; pie sectors linked to frequencies; mean, median, modes, range and quartiles from lists and discrete frequencies. Support uses small lists and convenient angles; challenges use frequency tables, percentages and interpretation. Quartiles use medians of halves, excluding the overall median for odd counts; no mode is reported when all values occur once.

All class material is self-contained. Do not restore Google Docs, Drive or GeoGebra lesson links from the syllabus. Google records configuration is unrelated and remains intact.

Generate the new banks with `python3 tools/build_y7_extension_banks.py` and then the recording bundle with `python3 tools/build_google_question_bank.py`. The 19 older scoring signatures remain unchanged. The new Algebra II bank copies the 60 stable legacy algebra questions and adds 30 equation questions; Statistics has 60 new questions. The 21-bank package requires a separate owner-side Google version update before new-bank recording becomes available. Games and lesson checks never record.

Validation: `node tests/y7-extensions.mjs`, `node tests/coordinate-pack.mjs`, `python3 tools/validate_questions.py`, `python3 tests/learn-first.py`, and browser suites `y7-extension-browser.cjs`, `coordinate-pack-browser.cjs`, `y7-units.cjs` with `LEARNING_LAB_BASE_URL` set to the local static server.
