# Inside your blood vessels

Y9 → Science → Blood vessels and blood is a separate topic beside the heart, breathing and gases. Three catalogue activities: lab, Transport Dispatch and revision simulator. All content is English and computer-first.

## Sources consulted, 29 October 2026

Biology was checked against the public source of OpenStax *Anatomy and Physiology 2e*, chapters 18 and 20:

- [m46710 — Overview of blood](https://github.com/openstax/osbooks-anatomy-physiology/tree/main/modules/m46710): components, transport, regulation and protection.
- [m46707 — Erythrocytes](https://github.com/openstax/osbooks-anatomy-physiology/tree/main/modules/m46707): biconcave structure, haemoglobin, oxygen loading/unloading.
- [m46701 — Leukocytes and platelets](https://github.com/openstax/osbooks-anatomy-physiology/tree/main/modules/m46701) and [m46705 — Haemostasis](https://github.com/openstax/osbooks-anatomy-physiology/tree/main/modules/m46705): cell diversity, platelet plug and plasma fibrinogen/fibrin.
- [m46597 — Vessel structure](https://github.com/openstax/osbooks-anatomy-physiology/tree/main/modules/m46597) and [m46586 — Capillary exchange](https://github.com/openstax/osbooks-anatomy-physiology/tree/main/modules/m46586).

The public textbook source was read through its GitHub repository because the direct OpenStax, NIH/NHLBI, NCBI, BBC and Nobel educational pages returned access errors in the execution environment. No third-party illustrations, text passages or runtime code were copied. Student prose and SVG art are original. OpenStax's own licensing/contributor information is in its repository; the links are references to underlying facts, not a claim that our platform is an official OpenStax product.

For game design, the [public Blood Typing Game README](https://github.com/gunjanjaswal/BloodTypingGame#readme) documents a sequence of identify → choose a blood-related intervention → observe a consequence. Our original missions use carrier → destination → explanation, with visible journeys, retries and no timer; they do not teach ABO/Rh transfusion compatibility. The [PhET public membrane-transport model description](https://github.com/phetsims/membrane-channels/blob/main/doc/model.md) informed qualitative particle/gradient visualisation and explicit visual-scale limits. Its broader pump/transporter model is not reused here. These were documentation reads, not live playthroughs or empirical claims about engagement.

## Teaching sequence and model boundaries

1. Four static beginner chapters define circulation/exchange, every blood component, vessel structures, gradients and gas formulas. Formula key: P = F/A with pressure, force, area and SI units; μm, O₂, CO₂, nucleus, haemoglobin, ions, hormones, endothelium, lumen and partial pressure are unpacked. Everyday examples include exercise, a cut and a laboratory count.
2. The moving cutaway compares an elastic artery, a valved limb vein and a capillary. Fixed component selectors provide alternatives to moving targets. Valve back-pressure stops longitudinal flow; it is not a pump. The model does not imply every vein has valves, or every artery is oxygen-rich. Red cells stay inside the intact lumen, capillary cells are single-file and both oxygenated and deoxygenated blood are red. Capillary speed, dimensions and pulse amplitude are illustrative, not predictions.
3. The centrifuge requires load → close → spin → open → inspect. Students can drag or click the sample, close the actual lid, use the machine's front panel and inspect the actual tube; equivalent controls and one-step help remain in the same workbench. A pre-fitted balance tube and anticoagulant are explicit. The sealed tube is not shown outside while spinning. Density separation is physical, not clotting. Layers are illustrative volume fractions: 55% plasma, 0.5% buffy coat, 44.5% red cells. Labels round red-cell share to about 45%; buffy coat is less than 1%. Real proportions vary and a layer height is not a cell count. The buffy coat is not separately split into white-cell and platelet volumes.
4. Transport Dispatch has ten authored missions: oxygen twice for different contexts, glucose, bicarbonate/CO₂, urea, hormone, heat, immune response, platelet plug and clotting proteins. Body-to-body routes include right heart → lungs → left heart. Glucose starts at the liver after intestinal absorption rather than depicting an incorrect direct intestinal shortcut. The map is a route diagram, not anatomical geography or a measured transit time. A left-heart origin means material already circulating, not being produced there. Branch crossings are not anatomical junctions. Close-ups keep red cells inside while oxygen moves out, show lung CO₂ release rather than tissue uptake at the lung destination, and distinguish a platelet plug from its fibrin support.
5. Immediate conceptual checks follow the practicals. Sources and real-life links precede the final separate revision invitation. All four components have transport and additional defence/regulatory functions explained. No clinical diagnosis, practical blood handling or real transfusion protocol is simulated.

Animation can pause; reduced-motion users start with stationary flow and can opt into movement. Game journeys become immediate and CSS close-ups are static under reduced motion. All interactive choices have native controls or keyboard equivalents. Game scores are deliberately local to the page. No identity is collected in a game or lab.

## Authoring and regeneration

- `assets/blood-vessels/model.mjs`: biological profiles, vessel explanations, ten missions, route geometry and step gates.
- `art.mjs`: original cell, vessel, centrifuge, organ-map and delivery SVGs.
- `lab.js`, `game.js`, `blood.css`: direct interactions and desktop layout.
- `tools/build_blood_vessels.py`: static chapters, shell, covers, revision wrapper and catalogue entries.
- `tools/build_blood_questions.py`: 60 stable questions, six areas, balanced answer positions.

```sh
python3 tools/build_blood_questions.py
python3 tools/build_blood_vessels.py
python3 tools/build_google_question_bank.py
python3 tools/validate_catalog.py
python3 tools/validate_questions.py
node tests/blood-vessels.mjs
LEARNING_LAB_BASE_URL=http://127.0.0.1:8067 node tests/blood-vessels-browser.cjs
LEARNING_LAB_BASE_URL=http://127.0.0.1:8067 node tests/blood-vessels-motion.cjs
```

The new bank brings the owner-side recording bundle to 22 banks / 1,450 questions; the previous 21 scoring signatures remain unchanged. `data-recording="auto"` keeps the new revision local until the private Google deployment confirms its signature. Publishing GitHub Pages cannot update the owner's private Google script. Use `teacher/setup.html#update-recording` to install the complete matching bundle. Only separate Test yourself answers record; practice, practical checks, notebook work and games do not.
