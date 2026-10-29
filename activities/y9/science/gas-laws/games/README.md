# Y9 Gas Laws games

English, computer-first practice games linked from the gas-laws lesson, game hub and catalogue. Neither game imports the results recorder, requests student identity or sends results to Google. Scores last for the current page session.

## Name That Gas Law

Nine picture models derived from the teacher’s photographed nine-example worksheet: capped syringe, flask/balloon, aerosol, diver’s bubbles, warmed tyre, hot-air balloon, weighted piston, pressure cooker and cold-water balloon. Each appears once in a shuffled round.

Students choose exactly two changing quantities (P/V/T) and one law. Cards state the fixed conditions; explanations include an equation, particle reasoning and a real-object limitation. There are three examples of each law. In particular, an actual hot-air balloon is open, pressure-cooker water adds vapour, an aerosol can contain liquefying propellant and rubber tension affects balloon pressure. The stated fixed-sample idealisations, not the picture alone, determine each answer. The aerosol example explicitly says never to heat one.

The colour artwork is generated for this platform using the worksheet as a reference; the photograph and the person in the second reference are not redistributed. `images/gas-law-cards.png` is one sheet, displayed one panel at a time with CSS background positions. The final row positions account for the illustration’s panel boundaries.

Scoring: 3 points for a first-try match, 2 for a second try, 1 for subsequent correct attempts, 0 for reveal. The review includes targeted practice of revealed or non-first-try cards.

## Mystery Word

Thirty unit-related clues in `data.mjs`, with scientific explanations, accepted variants and two common mix-ups per card. “You won’t say” toggles the mix-ups and their explanations, as requested; it is not a Taboo ban list. A submitted known mix-up also receives its specific correction.

Choose 10 or all 30 words. A first-letter hint is available, and the reveal button supports learning without guessing. Capitals, common punctuation and listed alternative law names are accepted. Score: 3 first try, 2 second try, 1 after further tries or a letter hint, 0 revealed. Opening mix-up explanations does not reduce points.

Optional 30/45/60-second timers are off by default and begin only when the student presses Start timer. Pause preserves remaining time; expiry allows continued learning and can be reset. Deadlines use the monotonic clock, so an interval delay does not accumulate timing drift. New rounds and new games clear the old timer.

## Maintenance and verification

`python3 tools/build_gas_games.py` regenerates the three HTML shells and two catalogue entries. The lesson’s game invitation and scoped `links.css` are edited directly. The separate revision invitation remains the last section of the lesson.

- `node tests/gas-games.mjs`: classifications, quantities, model caveats, unique cards and accepted/rejected vocabulary.
- `LEARNING_LAB_BASE_URL=http://127.0.0.1:8065 node tests/gas-games-browser.cjs`: full 9-picture and 30-word rounds, wrong answers, reveals, scoring, retry subsets, keyboard entry, mix-ups, hints, fake-clock timer states, catalogue links, no Google requests, and 1366×768 / 1440×900 / 1920×1080 layouts.
- `python3 tools/validate_catalog.py`
- Existing `tests/gas-laws.cjs` and `tests/gas-examples.cjs` cover the unchanged particle and object simulations.
