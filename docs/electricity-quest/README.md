# Voltvale: The Power Quest

Y9 → Science → Electricity includes a pixel role-playing adventure at
`activities/y9/science/electricity/games/power-quest.html`. It is linked from the
electricity hub, both lessons, the catalogue and the learning-games directory.

Six districts contain 24 checkpoints with three authored variants each:
Charge Harbour, Spark Citadel, Circuit Crossing, Meter Market, Ohm’s Workshop
and The Power District. Guardians teach the rule before each investigation.
Challenges combine scientific choices and sorting with direct manipulation:
electron transfer, earthing, component placement, meter connections, numerical
calculations with units, voltage/graph control, wire dimensions and branch switches.
Charge transfer and earthing animate; complete circuits carry moving markers;
lamps, meter readings and graph points respond to the apparatus. Models are
explicitly simplified, including fixed-resistance lamps in the network exercise.

The shared `assets/pixel-adventure` runtime/model preserve Runehaven’s behavior
and save key. Voltvale has its own `learning-lab-voltvale-v1` local save, teaching,
pixel city art and physics adapter. Male/female characters, name, outfits, skin
tone and optional local portrait use the same accessible creator. Four solved
quests unlock four physical chests; collecting them opens a portal and grants
a relic. Hints do not remove treasure. Studying a full solution requires a fresh
question. Practice, restored local play and completed-guardian retries do not
send teacher results or duplicate treasure.

Recording requires matching metadata for both segments before student details
are requested: `electricity-quest-static` (8 checkpoints, topic
`y9-electricity-static`) and `electricity-quest-circuits` (16 checkpoints,
`y9-electricity-circuits`). The shared recorder keeps the classroom identity,
switches topic at the third district, binds each session’s game id/signature,
and records six separate four-checkpoint sessions. The server validates the
canonical question, apparatus configuration, numerical result, unit and reason.
The physics grader is generated verbatim into QuestionBank.gs. Action history
and identity remain formative self-reports. Portraits never enter a payload.

The final teacher setup page now lists only Code.gs, QuestionBank.gs and
Dashboard.html, with current downloads/copy buttons. Existing teacher passwords,
results, sheet schema and deployment URL are preserved. The owner installs and
deploys these files in the existing Google project; the static website cannot
perform that private Google deployment.

Build and verify (serve on port 8068 for browser tests):

```sh
python3 tools/build_electricity_quest.py
python3 tools/build_teacher_files.py
python3 tools/build_google_question_bank.py
node tests/electricity-quest.mjs
node tests/electricity-quest-browser.cjs
node tests/electricity-quest-motion.cjs
node tests/like-terms-rpg-browser.cjs
node tests/google-records-server.cjs
python3 tests/assessment-preparation.py
python3 tools/validate_catalog.py
```

Google calls in tests are intercepted; no real student records are written.
