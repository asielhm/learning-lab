# Circuit Construction Studio — Y9 Electricity

Public activity: `activities/y9/science/electricity/simulators/construction.html`.
An independent original app following the teacher-uploaded **Circuits Simulation.docx**.
The document text and four screenshots were read as lesson material; its instruction
to visit PhET was not treated as an instruction to execute embedded content. The
app does not embed PhET, copy its code or need its service to operate. The screenshots
were used to interpret the source/ammeter/resistor layouts and measurement tasks.

## Worksheet coverage

Four selectable guided investigations reproduce the worksheet's intended comparisons:

1. Hold supply at 9 V and vary one resistance; default 10 Ω gives 0.900 A.
   Target settings 5, 10, 15, 20, 30, 40 Ω scaffold the originally blank table.
2. Hold resistance at 10 Ω and vary voltage; targets 0, 2, 4, 6, 8, 10, 12 V.
   The origin is a **closed circuit at zero voltage**, distinguished from a broken path.
3. Series at 12 V, R1=10 Ω, R2=10…60 Ω in 10 Ω steps. One total ammeter,
   movable voltmeter probes, both voltage drops and common current recorded.
   Two 10 Ω resistors give 0.600 A and two 6 V drops.
4. Parallel at 12 V with the same R1/R2 values, three ammeters and a voltmeter.
   Both branches have 12 V; at R2=10 Ω, currents are 1.200 A + 1.200 A = 2.400 A.

There are 25 scaffolded settings and 14 explained local concept checks covering
path count, current/voltage relationships, measurement direction and the worksheet
trend questions. Guided completion requires the table and checks; the investigation
menu permits independent study of a chosen section without an external account.

## Actual construction and measurement

Students drag supply, resistors, model lamps, ammeters, a voltmeter, switches and
junctions from the shelf, move/rotate parts, and drag wires between sockets.
Click/tap two sockets is an equivalent connection action. Multiple wires can share
a socket; crossing wires join only at sockets. Junction pieces provide four tied
terminals. Equipment and probes are keyboard accessible; actual touch drag is tested.

Supply power, switch levers and value controls are on the instruments. Double-click
or the on-part control opens an editor next to the device inside the bench. Voltmeter
body, lead handles and contacts are separate: moving the body flexes attached leads.
Signed readings follow red-minus-black; notebooks compare drop/current magnitudes.

The series table cannot save a setting until both resistor drops have been measured
with the actual probes at that electrical condition. Moving to a new resistance
invalidates previous-condition measurements. For parallel branches, a probe pair
across the shared junctions legitimately measures both voltages, including through
ideal zero-drop ammeters. Meter roles are checked electrically rather than by drawing
position: removing the total meter opens both branches, while removing a branch meter
opens only its associated resistor path. Checks use a trial voltage for topology, so
an origin measurement at 0 V still has a valid measurement arrangement.

Guide me highlights missing equipment/connections and offers **one action per help
click**, including placing a component, connecting one wire, powering the source,
changing a controlled setting, or attaching one probe. Free construction preserves
the existing circuit and accepts genuinely different resistor networks; clearing,
undo and worked examples are explicit controls. Capacity is 22 components with one
independent 0–12 V source. The UI load range is 1–100 Ω; guided R2 is 10–60 Ω.
Free construction is not a switch among preset circuit calculations.

## Solver and limitations

`assets/circuit-studio/model.mjs` uses wire/switch/junction union and modified nodal
analysis for actual voltage and current constraints. Ideal ammeters are zero-volt
constraints; voltmeters do not load the circuit. Solving works for single, series,
parallel, mixed and bridge networks. Independent unit tests include an unbalanced
Wheatstone bridge and node-current and power identities, not just the guide templates.

The controlled-temperature resistor and model lamp have constant resistance. The
lamp's brightness illustrates power; it is not a nonlinear hot-filament model.
Source resistance, lead/contact resistance, capacitance, inductance, uncertainty
and transient propagation are omitted. The regulated virtual supply reports a
protected state for an ideal short, a redundant ideal-meter loop or demand above
5 A. These are explicit states rather than fabricated finite or infinite readings.

Wire currents are reconstructed by current balance for unique bridge edges of ideal
wire buses. A wire-cycle's distribution can be indeterminate, so those animation
paths have no claimed quantitative drift. Electron markers already exist in connected
wires while power is off; conventional arrows and electron drift point in opposite
directions. Particle number, size and speed are illustrative. Motion can be paused
or hidden and starts paused with a reduced-motion preference.

## Records and provenance

Notebook tables, concept checks and their CSV exports are local to this page. They
never ask for identity or send records. The final invitation uses the existing separate
circuits revision simulator: only its readiness-gated **Test yourself** records Google
results. No question-bank signatures, private spreadsheet data or passwords changed.

Artwork is original SVG equipment, connections, glass, metal and workbench styling.
The source DOCX and its embedded screenshots are not published. Text defines new
quantities, units, meter use, junctions, model assumptions and worked examples.

## Build and tests

```
python3 tools/build_y9_electricity.py
node tests/circuit-studio.mjs
LEARNING_LAB_BASE_URL=http://127.0.0.1:8067 node tests/circuit-studio-browser.cjs
LEARNING_LAB_BASE_URL=http://127.0.0.1:8067 node tests/circuit-studio-motion.cjs
```

The electricity builder calls `build_circuit_studio.py` to preserve the new lesson
card and catalogue entry on regeneration. Sources: `model.mjs` (electrical solver),
`lessons.mjs` (worksheet settings, explanations and questions), `art.mjs` (original
apparatus) and `studio.js` (interaction and notebooks). Builders are deterministic.
Browser tests construct circuits with real pointer drags, operate meters, complete
all 25 conditions and 14 checks, independently build a mixed network, operate a branch
switch, rotate/delete/undo, create and repair a short/overload, export CSV and verify
no-JS reading plus 1366×768, 1440×900 and 1920×1080 layouts. Separate tests verify
keyboard construction, charge motion/freeze and real CDP touch drag.

## Shared author branding

`tools/brand.py` applies an idempotent, accessible **Learning Lab by Asiel** lockup
where the platform's logo appears. The existing favicon/logo artwork is retained.
The wordmark uses bold/light title weights and a small orange signature (#AD542F),
with 4.71:1 contrast against the landing background. All styles are scoped to the
lockup in `assets/brand/brand.css`, preserving each activity's content styling.

Page generators call the shared helper after writing their pages so later rebuilds
retain the signature. The homepage script/title and public teacher pages are updated.
The private Apps Script dashboard source and downloadable package also include the
new wordmark; an existing private deployment needs its owner to replace Dashboard.html
and publish a new version for that visual change. Authentication, existing passwords,
records, question bank contents and bank signatures are unchanged. Tests cover the
platform, school units, Olympiad routes and teacher page at three desktop sizes, plus
the protected dashboard's recording/filter flows using only mocks.
