# Gas Laws Lab — Y9 Science

A self-contained static activity built with HTML, CSS, SVG graphs and a 2D particle canvas. It needs no third-party modules or services. The amount of gas is fixed throughout.

- Boyle–Mariotte: `PV = 240 kPa·L` at `T = 300 K`; volume control 1.2–4.8 L.
- Charles: `V/T = 0.008 L/K` at `P = 100 kPa`; temperature control 200–600 K.
- Gay-Lussac/Amontons: `P/T = 1/3 kPa/K` at `V = 2.4 L`; temperature control 200–600 K.

The reference state is 100 kPa, 2.4 L, 300 K. Kelvin is used in all ratios; Celsius appears only as a converted display. The graph's dashed section is an ideal-gas extrapolation, not data taken at absolute zero. Real gases need not obey these laws near phase changes or at high densities.

Live hints compare the changed variable with the reference. Students can record up to 8 distinct states per law and compare the invariant. Three investigations for each law require a target observation before the question is unlocked. Incorrect predictions can be retried with explanation. Reset clears the current experiment's data and challenge progress. Changing law retains that law's previous slider/data/progress.

Particles have a fixed count and illustrative speed proportional to the square root of Kelvin temperature. Their positions and sizes are schematic; the displayed P/V/T values come from the equations, not a measurement of canvas-wall forces. Use the volume slider or drag the piston for Boyle–Mariotte. All controls have keyboard equivalents. Reduced-motion preference pauses the particle animation initially.

## Classroom visuals and connections

The classroom edition adds explicit learning goals, worked substitutions and three self-contained original SVG concept pictures. Sealed-syringe compression connects to Boyle–Mariotte; a balloon is an approximate Charles example because membrane tension also affects pressure; a tyre approximates constant volume, while a rigid vessel is the closer Gay-Lussac model. The breathing connection explicitly notes that lungs are an open system, not a sealed Boyle experiment. All pictures are labelled illustrations, not photos or quantitative measurements. Example buttons load matching simulator conditions.
