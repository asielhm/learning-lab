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
