# 3D vinegar titration

Experiment 05 in Y10 Chemistry / Acids and Bases opens `titration-3d.html`.
This first spatial practical replaces that investigation's default illustrated
bench; the old version remains available with `?illustrated-titration=1`.

Original procedural Three.js glassware, stand, bench, tiles and reagents use
local Three.js 0.160.1 / OrbitControls with the bundled MIT licence. No video
assets, student images or external runtime CDN requests are used. References
informed the spatial interaction design, not copied assets.

Students drag or select equipment, or use labels projected onto its position.
The preparation sequence is gated; Guide me marks the next source and Show this
step animates preparation without solving the titration. A stopcock controls
flow, single drops deliver 0.05 mL, drops fall and a transient pink plume appears.
The flask swirls. The burette liquid and concave meniscus follow delivered volume;
a camera preset provides eye-level inspection. Re-centre restores the bench.

The existing ideal weak-acid/strong-base equilibrium model computes pH. Samples
A/B/C have 0.080/0.120/0.160 mol/L diluted ethanoic acid, a 25.0 mL aliquot and
0.100 mol/L NaOH: equivalence volumes 20/30/40 mL. Recording requires indicator,
apparatus placement, a mixed faint-pink solution and 30 seconds of persistence.
Deep-pink overshoots cannot be recorded. Duplicate saves of a trial are blocked.
The local notebook preserves earlier trials and computes diluted concentration.
Its notes do not submit student records; the existing revision quiz remains the
assessment route. Conditioning, pipette filling and air-bubble removal are
assumed, explicitly stated in the lesson. Rendered glassware is illustrative.

Run `python3 tools/integrate_titration_3d.py` after regenerating chemistry pages
(the main chemistry builder invokes it). It restores the link and catalogue
entry without regenerating other chemistry classes. Browser test:

```
node tests/titration-3d.cjs
node tests/y10-chemistry.mjs
python3 tools/validate_catalog.py
```

Serve locally on port 8068. Chromium's software WebGL flags are used in the
browser test. It checks preparation, dosing, swirling, the real 30-second timer,
endpoint/overshoot gates, recording, camera views and desktop widths. Direct
raycast bottle dragging, illustrated fallback and selector navigation were also
checked in Chromium. Videos stay outside the repository.
