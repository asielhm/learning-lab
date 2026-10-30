# Gas Laws Lab — Y9 Science

A self-contained static activity built with HTML, CSS, SVG graphs and a 2D particle canvas. It needs no third-party modules or services. The amount of gas is fixed throughout.

- Boyle–Mariotte: `PV = 240 kPa·L` at `T = 300 K`; volume control 1.2–4.8 L.
- Charles: `V/T = 0.008 L/K` at `P = 100 kPa`; temperature control 200–600 K.
- Gay-Lussac/Amontons: `P/T = 1/3 kPa/K` at `V = 2.4 L`; temperature control 200–600 K.

The reference state is 100 kPa, 2.4 L, 300 K. Kelvin is used in all ratios; Celsius appears only as a converted display. The graph's dashed section is an ideal-gas extrapolation, not data taken at absolute zero. Real gases need not obey these laws near phase changes or at high densities.

Live hints compare the changed variable with the reference. Students can record up to 8 distinct states per law and compare the invariant. Three investigations for each law require a target observation before the question is unlocked. Incorrect predictions can be retried with explanation. Reset clears the current experiment's data and challenge progress. Changing law retains that law's previous slider/data/progress.

Particles have a fixed count and illustrative speed proportional to the square root of Kelvin temperature. Their positions and sizes are schematic; the displayed P/V/T values come from the equations, not a measurement of canvas-wall forces. Use the volume slider or drag the piston for Boyle–Mariotte. All controls have keyboard equivalents. Reduced-motion preference pauses the particle animation initially.

## Classroom visuals and connections

The classroom edition adds explicit learning goals, worked substitutions and three self-contained original SVG concept pictures. Sealed-syringe compression connects to Boyle–Mariotte; a balloon is an approximate Charles example because membrane tension also affects pressure; a tyre approximates constant volume, while a rigid vessel is the closer Gay-Lussac model. The breathing connection explicitly notes that lungs are an open system, not a sealed Boyle experiment. All pictures are labelled illustrations, not photos or quantitative measurements. Each example button opens a dedicated cartoon object simulation under `examples/`, with no particle-box model: `syringe.html`, `balloon.html`, and `tyre.html`. They share `examples.js` and `examples.css`, work without external libraries, and offer preset conditions, live gas-law readings, a deduplicated measurement table, reset and an observation-gated question. The syringe plunger supports mouse/touch dragging and keyboard arrows/Home/End/PageUp/PageDown; the slider is its equivalent control. Balloon linear dimensions scale with the cube root of volume. Tyre calculations add atmospheric pressure before applying the law and subtract it for the gauge. Values represent thermal equilibrium. Working tables stay on the page and are never sent to the teacher.

## Revision simulator

`revision.html` uses the shared revision engine and `assets/revision/questions/gas-laws.json`: 80 questions in eight categories, adapted from the supplied “Weather - pressure and Temperature” presentation. Topics cover heat and Kelvin; changes of state and expansion; pressure and units; Boyle–Mariotte; Charles; Gay-Lussac; combined laws and PV = nRT; Avogadro and moles. Students choose topic, difficulty and session length, then immediate-feedback practice or an end-of-test review. Missed answers can be retried. Only Test yourself answers are sent to the configured teacher recorder; practice and the object simulations remain unrecorded.

STP questions specify 273.15 K and 100 kPa (22.7 dm³/mol). Temperature ratios use Kelvin; pressure is absolute. Phase-change questions specify pressure and purity where needed. Absolute-zero graph intercepts are ideal-model extrapolations. The user-provided slide deck remains outside the published site.

Run `node tests/gas-examples.cjs` with the static server running to check the three example links, physical calculations, object responses, plunger mouse/touch/keyboard controls, observation gates, measurement tables, resets and responsive layouts.


The tyre temperature slider ranges from −30°C to 70°C. Cooling progressively squashes only the rubber casing; the rim stays rigid. This deformation is deliberately exaggerated and is not used to infer volume or pressure. Intact readings still use the fixed-volume ideal-gas law. At the chosen 70°C cartoon trigger, the casing bursts with escaping-air and rubber-fragment animations. This is not a real tyre failure threshold. The burst is latched until Reset replaces/reinflates the tyre; gauge pressure is then 0 kPa and absolute pressure 101.3 kPa because it has vented. The equation, sealed-air label, assumptions and measurement table distinguish the open state from sealed readings. Reduced-motion mode keeps the damaged tyre visible without the moving fragments.


A fourth example, `examples/syringe-balloon.html`, places a small tied balloon inside a capped syringe. It is linked beside the original syringe example and from all example-page tabs. The total chamber starts at 20 mL: 5 mL inside the balloon and 15 mL of separate surrounding air, both at 101.3 kPa absolute and 20°C. With negligible membrane tension, the ideal pressures balance; each gas sample obeys its own constant PV. At 10 mL total, the balloon is 2.5 mL and pressure 202.6 kPa; at 40 mL total, the balloon is 10 mL and pressure 50.65 kPa. No gas crosses the balloon or syringe seals. `examples/gas-models.mjs` implements this equilibrium model. Balloon dimensions scale with the cube root of its volume. The plunger supports mouse, touch and keyboard; the table records total, balloon and surrounding volumes separately. Real latex membrane tension is a stated limitation.

## Practice games

The lesson now links to [Name That Gas Law](games/picture-law.html) (nine picture models) and [Mystery Word](games/mystery-word.html) (30 clues and common mix-ups with explanations). These are English, computer-first practice activities with no teacher-result submissions. See [games documentation](games/README.md) for scientific assumptions, scoring, optional timers and checks.

## Mercury barometer

`examples/barometer.html` is the fifth everyday instrument, linked from “Where do we meet gas laws?”, every example tab and the catalogue. Original glass/metal SVG apparatus includes a near-vacuum, atmospheric arrows on the open reservoir, a convex mercury meniscus, a height overlay and a slightly shifting reservoir surface. It measures atmospheric pressure through hydrostatic balance, not by applying a gas law to the vacuum space.

The pressure slider spans **50–110 kPa** in 0.025 kPa increments, with live **Pa and atm** references beside it. One standard atmosphere is exactly **101,325 Pa = 101.325 kPa**, supporting about **760 mm** at the selected mercury density of 13,595.1 kg/m³ (0°C reference) and g = 9.80665 m/s². The model neglects upper mercury-vapour pressure and surface-tension corrections. `P_atm = ρgh` uses h as the vertical difference between liquid surfaces, not the submerged tube length or vacuum-space length. A 20:1 reservoir-to-tube area ratio conserves mercury volume; the virtual zero-height guide follows the reservoir surface. Drawing widths are illustrative.

`barometer-model.mjs` contains the equilibrium calculation and volume geometry. `barometer-art.mjs` produces original apparatus, cover and graph SVGs. `barometer.js` animates current height towards equilibrium, updates all units, cancels interrupted moves, gates measurement recording until settled and supports prediction feedback, local tables and four explanatory checks. Animation is qualitative, not a fluid-dynamics solver. The graph distinguishes the current moving height from the predicted equilibrium point. Reduced motion snaps to equilibrium and keeps air dots static.

The simulator is self-contained, English and computer-first. The atmospheric slider, pressure conversions, presets and record/reset actions are within the instrument panel. Equations define every symbol and unit. The visible air dots stay outside the tube and do not numerically determine pressure. Measurements and checks are local only; the established gas-laws revision bank and recording signatures are unchanged. The final revision invitation remains last. The mercury material hazard is stated as context; no actual construction procedure is provided.

Regenerate the page, cover, lesson link, tabs and catalogue entry using `python3 tools/build_barometer.py`. The builder is idempotent and preserves the other examples and the final lesson revision section. Validate with:

```sh
node tests/barometer.mjs
LEARNING_LAB_BASE_URL=http://127.0.0.1:8067 node tests/barometer-browser.cjs
LEARNING_LAB_BASE_URL=http://127.0.0.1:8067 node tests/barometer-motion.cjs
LEARNING_LAB_BASE_URL=http://127.0.0.1:8067 node tests/gas-examples.cjs
```

Checks cover unit conversion, hydrostatics, linearity, liquid-volume conservation, height/scale alignment, bounds, actual geometry motion, settled-record gates, interrupted moves and reset, predictions, four concept checks, all five tabs, catalogue links, readable no-JS explanations, three desktop sizes and no Google requests.
