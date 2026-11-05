# Runehaven: The Like-Terms Quest

Y7 → Maths → Algebra II includes a standalone pixel role-playing game at
`activities/y7/maths/algebra-ii/games/like-terms-quest.html`. It is also linked
from Boxes & Brackets, Like-Terms Recycling's hub and the games directory.

Students name a hero, choose a male/female sprite, outfit and skin tone, and
optionally supply a picture as a 32-pixel portrait. Original SVG/canvas pixel
art needs no external game engine, fonts, image service or network download.
Portrait conversion happens locally; pictures never enter a teacher payload.

Six worlds contain four guardians and four chests each:

1. Village of Symbols: terms, coefficients, constants and matching families.
2. Meadow of Matches: separate x/y/constants; sort and combine runes.
3. Cavern of Signs: signed coefficients, −1 and cancellation.
4. Tower of Powers: distinguish linear, square and cubic variable parts.
5. Forge of Expressions: mixed families, constants and negative coefficients.
6. Treasure Vault: retrieve and apply all the rules in mixed challenges.

Walking, nearby interaction and click-to-walk use a tile world with obstacle
collision and breadth-first routing. Arrow/WASD keys and E/Space work alongside
destination buttons. Challenges include multiple choice, drag or keyboard
sorting, pairwise coefficient merging and typed expressions. The checker
accepts reordered families, caret/superscript powers and Unicode minus signs;
it rejects uncollected equivalents, malformed input and executable strings.
No expression is evaluated as code.

Each island opens with a rule and example. A study journal keeps learned rules.
Hints, supportive retry feedback and a worked-example-to-fresh-question cycle
support understanding. Viewing a complete solution cannot unlock its own
chest, including after reopening or reloading. Every completed checkpoint
unlocks the same ten coins, regardless of help; stars reflect attempts and
assistance. Collecting four physical chests grants a relic and opens a portal.
There are no lost lives, countdowns, random rewards or daily attendance locks.

`learning-lab-runehaven-v1` stores the adventure in localStorage. Character,
variant, solved quests, worked-example state, coins and relics survive reloads.
Map position restarts at the island entrance. Clearing browser storage removes
the local save. Resume explicitly uses local practice, never a silently resumed
teacher session. Sound is opt-in; reduced movement follows the system setting
and can be changed in Pause / settings. Classroom desktop sizes tested are
1366×768, 1440×900 and 1920×1080.

Teacher recording uses the shared game recorder and existing Google schema.
The game id is `like-terms-rpg`, course `Year 7 Maths`, topic `algebra-ii`.
Each island is one four-checkpoint session; partial answers appear in individual
rounds and completed levels in Completed games with a level label. Starting
Play for my teacher resets only the current island. Earlier island treasure
is retained. Repeat practice, resumed local play and portraits are excluded.
Google checks the canonical variant and fully collected answer independently.
The parser is generated verbatim from the browser's self-contained parser.
Existing 25 question-bank signatures and 43 earlier game signatures are unchanged.
The owner must install/redeploy the new Google package to record the new game.

Build and verify:

```sh
python3 tools/build_like_terms_rpg.py
python3 tools/build_google_question_bank.py
node tests/like-terms-rpg.mjs
node tests/like-terms-rpg-browser.cjs
node tests/google-records-server.cjs
python3 tests/assessment-preparation.py
python3 tools/validate_catalog.py
```

Run `python3 tools/serve.py --port 8068` in a separate process for browser tests.
Browser tests intercept all Google reads/writes; no real pupil records are made.
`tools/like_terms_rpg.py` provides idempotent discovery integration and is called
by the shared unit-game integration after school pages regenerate.
