# Y9 Electricity: authoring and verification

The public unit is `/activities/y9/science/electricity/`. It has two separate
beginner lessons, Static electricity and charge (`static/`) and Electric circuits
(`circuits/`), with 6 and 8 explanatory chapters respectively. They remain
readable without JavaScript. Every introduced formula has a symbol/unit key and
worked or directly interpreted examples. Original SVG figures explain the atom,
standard symbols, charge rate, energy per charge, wire dimensions and paths.

## Teacher materials

Content sequence was checked against the uploaded **Static Electricity and charge
Presentation.pptm** (26 slides) and **CircuitsPresentation.pptm.pptx** (54 slides).
Only ZIP/XML reading was used; macros and embedded code were never executed.
Documents were treated as subject material, not application instructions.

`images/pizza-circuit.png` is the unchanged `ppt/media/image17.png` from the
circuits deck (slide 11); `images/resistance-obstacles.png` is its unchanged
`image18.png` (slide 6). No presentation files, macros, embedded web content or
unrelated slide artwork are published. The illustrations are the teacher's
provided lesson resources. Moving couriers, instruments, diagrams, text and application code are original
additions. Resistance Run now uses an image-generated clean background plate and
a transparent cutout adapted from a blue character in the supplied illustration;
its dynamic obstacles are vector layers. The original PNG remains in the lesson
reference panel.

Corrections made while adapting the decks:

- One coulomb has the magnitude of about 6.24 × 10^18 electron charges, not 10^19.
- Material names do not fix charge sign independently of the rubbing pair.
- Positive charging by rubbing usually means electron loss, not proton transfer.
- Neutral polarised matter can be attracted; attraction alone does not prove an
  opposite net charge. Static charge can move during charging/discharge.
- Voltage is energy per charge; power is energy per time.
- A wire's **cross-sectional** area matters, rather than its outer surface area.
- Higher transmission voltage can reduce current and I²R losses; it does not
  itself lower cable resistance.
- Ohm's law needs unchanged physical conditions. A lamp or diode is not assumed
  to be a constant resistor over its full range. The ratio at (0,0) is undefined.
- Particle collection does not remove all gaseous pollution. Lightning is not
  predicted by a shortest-path-only rule. A defibrillator is a controlled-current
  application for specific rhythms, not simple static attraction.

## Models and interactions

`assets/y9-electricity/model.mjs` contains separately testable SI calculations.
`lab.js` runs the five practical workspaces; no lesson or experiment writes data.
All actions support clicks/keyboard; plugs and balloon also support pointer drag.
Help advances only one assembly/charge step. A reduced-motion preference pauses
continuous motion and completes new charge transfers immediately. Reset cancels
in-progress transfers. Charges remain drawn when the circuit is off.

- Static lab: selected 8-positive/8-electron patches, up to four electrons moved
  cloth → balloon. Total selected charge and electron count are conserved. The
  force view distinguishes opposite signs, like signs and neutral polarisation;
  arrows are qualitative. Earthing uses a metal sphere with ±3 elementary net
  charge and no nearby external charger; the lead permits either direction of
  electron transfer until neutral. No actual triboelectric chemistry or
  quantitative neutral-object force calculation is claimed.
- Pizza Circuit: steady series current I = V/R, 1–6 V and 1–6 Ω. Highlighted
  courier packets each represent 1 C, energy badges show J/C × 1 C, the shop is
  the source and the party the load. Couriers return after energy delivery. The
  movement follows conventional positive-charge flow and is greatly slowed.
- Resistance Run: 1–6 V and 1–12 Ω, initially 3 V and 3 Ω. The old extra
  circle overlay has been removed. A fixed 38-character cast, using the adapted
  blue-electron cutout, travels through a reconstruction of the pictured course.
  Scene nodes and character identities remain stable when sliders change. At
  higher voltage, characters run faster with more bounce, motion lines and
  enthusiasm rays. This is a cartoon for energy per charge, not a claim about
  atomic excitation or a change in electron charge. Higher resistance morphs the
  treacle pit deeper, makes steps taller, planks rougher and climbing obstacles
  higher. Character circulation still uses I=V/R for the entire series loop;
  characters are not consumed or replenished. The geometry transition is eased
  visually while the ideal electrical readings respond immediately. Pause and
  open gate preserve the characters and freeze travel. Reduced motion starts
  paused and changes geometry immediately when a control is used.
  `resistance-run.mjs` owns this scene; `resistanceLook` and `courseGeometry` expose
  its testable visual parameters. A 24-second, 1280×800 silent H.264 MP4 shows four
  6-second comparisons: 2 V/3 Ω; 6 V/3 Ω; 6 V/12 Ω; 6 V/1 Ω. It has on-screen
  explanations, English WebVTT captions, a poster and an MP4 download link.
- Ohm bench: regulated 0–12 V, R1/R2 20–100 Ω, 10 W power resistors maintained at
  constant temperature. A is in series; V spans the **whole tested network**.
  Click either meter or drag its paired-lead connector to its matching socket,
  turn on DC at the supply and close the switch on the diagram. Single, series
  and parallel networks use exact equivalent resistance and branch readings.
  Ideal wires/A have zero resistance; ideal V draws no current. Full measured
  topology/R settings stay with every row. Distinct networks have distinct I–V
  traces (latest four shown); curves are ideal model lines, not fitted noisy
  measurements. Horizontal V, vertical I: gradient = 1/R. Maximum current 1.2 A.
- Wire lab: R = rho(T)L/A; A = pi(d/2)^2 with mm converted to metres. Length
  0.5–5 m, diameter 0.2–1 mm, external temperature 0–100°C. The measuring current
  remains 0.100 A. Material values at 20°C are illustrative bulk values:
  copper rho=1.68e−8 Ω m, alpha=.00393/°C;
  nichrome 1.10e−6, .0004/°C; iron 9.71e−8, .005/°C.
  rho(T)=rho20[1+alpha(T−20)]. Real alloy/composition dependence, contact/lead
  resistance, self-heating and uncertainty are omitted. Only the selected factor
  can be edited; graph signatures retain all other conditions. Material is a
  categorical axis, never a continuous fitted line. Drift/vibrations are enlarged
  and illustrative; marker counts do not measure carrier density.

The four circuit pages keep apparatus, controls and graphs in the same desktop
workspace. Local evidence tables are directly below it, retain at most 18
settings, reject duplicates, and compare saved predictions with recorded results.
Twenty local conceptual checks allow explained retries. Check-your-understanding
follows each simulator; the separate revision invitation ends every lesson/page.

## Revision and dashboard

`static/revision.html` and `circuits/revision.html` each load 60 original
four-option questions, six selectable areas and three selectable levels. IDs are
stable `y9-electricity-static-*` / `y9-electricity-circuits-*`.

Only separate revision **Test yourself** may record student name/class/teacher.
The existing `data-recording="auto"` guard checks a matching deployed bank before
collecting identity or sending answers. Practice, formative checks and apparatus
rows never record. All 22 previous bank signatures remain unchanged. The complete
update bundle now has 24 banks / 1,580 questions. Publishing Pages does **not**
update the owner's private Apps Script; use the existing teacher setup/update
procedure for the two new banks. Missing/stale deployments leave those quizzes
local, rather than sending unscoreable data.

## Rebuild

```
python3 tools/build_y9_electricity_questions.py
python3 tools/build_y9_electricity.py
python3 tools/build_google_question_bank.py
```

Lesson prose is in `tools/electricity_lessons.py`; HTML/course integration in
`build_y9_electricity.py`; SVGs in `art.mjs`; authoritative question rows in
`build_y9_electricity_questions.py`. The two original PNGs are retained as sources.
Builders are deterministic and safe to repeat. Catalogue integration makes the
new activities eligible for the homepage's existing random feature.

## Checks

```
node tests/y9-electricity.mjs
LEARNING_LAB_BASE_URL=http://127.0.0.1:8067 node tests/y9-electricity-browser.cjs
LEARNING_LAB_BASE_URL=http://127.0.0.1:8067 node tests/y9-electricity-motion.cjs
python3 tools/validate_catalog.py
python3 tools/validate_questions.py
node tests/google-records-server.cjs
LEARNING_LAB_BASE_URL=http://127.0.0.1:8067 node tests/google-records-browser.cjs
node tests/featured.mjs
```

Browser coverage includes actual balloon and meter-plug drags, click/keyboard
alternatives, both earthing directions, all circuit arrangements, graph groups,
wire-factor fair tests, prediction feedback, records/reset, all 20 local checks,
revision automatic advance, no-JS reading and 1366×768 / 1440×900 / 1920×1080.
Normal-motion tests verify particle movement, pause, stopped circuits, reset
cancellation and charges present before switching on. All Google browser/server
tests use mocks; they never create real student results or expose credentials.

## Rebuild the Resistance Run film

The background and transparent character layers were edited from the supplied
obstacle picture using the image-generation tool. WebP conversion retains the
output composition and alpha channel; original PNG reference is unchanged.
Generated layer sources remain in the workspace's generated_images directory;
the publication uses the two small WebP assets.

With the local static server running:

```
LEARNING_LAB_BASE_URL=http://127.0.0.1:8067 node tools/render_resistance_film.cjs
node tests/resistance-run.mjs
LEARNING_LAB_BASE_URL=http://127.0.0.1:8067 node tests/resistance-run-browser.cjs
```

The film renderer uses the same scene controller as the lesson, samples 24 fps
for 24 seconds, then encodes with ffmpeg. Temporary frames are confined to /tmp
and removed when encoding succeeds. It neither captures student work nor calls
Google. The lesson builder preserves the rendered film rather than rerendering
it on every build. No revision-bank signatures or dashboard settings change in
this animation update.
