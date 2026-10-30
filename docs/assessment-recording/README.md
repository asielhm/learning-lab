# Teaching, games and teacher records

Revision coverage remains 24 banks / 1,580 questions. Games add 42 catalogued games
with 183 rounds. The course menu covers Y7 Maths, Y9 Science, Y10 Physics and Y10
Chemistry; Y9 games are Name That Gas Law (9), Mystery Word (30) and Transport
Dispatch (10). Other simulations' practical controls and notebooks remain local.

## Student flow

Games start as unrecorded practice. The recording panel checks matching public
Google game metadata before collecting student details. Play for my teacher
requires name, class and teacher, starts a new game and fixes that identity for the
session. Completing a round sends the first response, final model/response,
attempts, help/reveal flags and a stable event ID. Queued records survive reloads
in the same tab where sessionStorage is available; an explicit trusted Google
receipt is required before “saved”. Pending events can be retried and deduplicate
on Google. Closing the tab can lose unsaved records. Practice, targeted retry
rounds and free picture creation never enqueue records. Restarting a full
recorded game creates a distinct session rather than overwriting an earlier one.

Y9 final solutions are checked against the Google catalogue: both magnitudes and
law for pictures, accepted scientific terms for words, and carrier/destination/
explanation for transport. Other game models report their evaluated construction;
the feedback source column explicitly identifies these as self-reported. The
server calculates stars from attempts and help, using each game's existing rule;
reveals earn zero. Attempts and identities remain formative self-reports.

## Backend and teacher view

Code.gs creates GameAnswers and GameSessions without changing existing quiz tabs
or passwords. Complete missing summaries are repaired on setup/authenticated
reads. A partial game appears in Individual game rounds; Completed games requires
all announced rounds. Game scores are percentages of available stars and never
enter revision accuracy. Existing server-checked teacher authentication and
Teacher/Class/Course/Topic checkbox filters apply to both game views.

`tools/export_game_catalog.mjs` derives known game IDs, questions, explanations,
Y9 solutions and fingerprints from the actual game data. The bank builder appends
them to QuestionBank.gs and exports public games.json, so the owner still replaces
only three Google files. Revision protocol and bank signatures are unchanged.
The capability endpoint adds gameManifest; an old deployment leaves game recording
disabled and explicitly explains why on the student panel and teacher coverage.

## Prior teaching reference

Every revision wrapper links to prepare.html before the quiz. Each unit links to
it before its final revision invitation, and each game panel links to the relevant
game's preparation section. Guides retain authored beginner introductions,
symbol/unit keys, concept notes and expandable worked examples. Game notes teach
the model, conditions and reasoning, including the complete gas vocabulary and
blood transport cases. No external syllabus documents have been reintroduced.

`docs/assessment-coverage.json` maps each revision question and game round to a
specific teaching/example anchor. The coverage check verifies this explicit
availability; it is not an independent scientific revalidation of authored banks.
The worked examples deliberately make revision content available for self-study.

## Rebuild / verify

After changing game data or revision questions, run:

```
python3 tools/build_google_question_bank.py
python3 tests/assessment-preparation.py
node tests/google-records-server.cjs
LEARNING_LAB_BASE_URL=http://127.0.0.1:8067 node tests/game-records-browser.cjs
LEARNING_LAB_BASE_URL=http://127.0.0.1:8067 node tests/game-dashboard-browser.cjs
```

Run relevant existing game and revision browser regressions as well. All Google
writes in these tests are intercepted; they never create real pupil records.
The private Google deployment is owner-managed: replace Code.gs, QuestionBank.gs
and Dashboard.html, run setupLearningLab, then update the existing deployment to
a new version. The website's teacher page separately checks quiz and game
coverage. A static Pages deployment does not activate Google project changes.
