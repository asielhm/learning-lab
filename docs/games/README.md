# Learning games for Y7 Maths and Y10 Physics / Chemistry

34 original games across all 16 existing unit pages: six maths units (including both algebra activities), six physics units and four chemistry units. Each unit has a card game and a construction/target puzzle, with three authored rounds each. Algebra I also has two six-mission games: 108 rounds total. English, computer-first, original SVG illustrations, keyboard and mouse support. No third-party runtime, account or Google calls.

## Online research and provenance (29 October 2026)

Direct access to NRICH, Transum, RSC and live PhET simulation pages was blocked by this execution environment. The public PhET GitHub repositories were accessible. Their front pages now describe a move to a monorepo; retained model documentation provides historical, primary-source descriptions. We do not claim that the current live simulations were tested, or that every simulation below is itself a game. We read the model documents listed below and checked the linked repository identities for the additional resources.

The useful patterns were linked representations, visual construction, target challenges, matching and feedback. For example, Graphing Lines explicitly documents Make the Equation / Graph the Line / Place the Points challenges; Forces and Motion describes a draggable tug-of-war; Area Builder distinguishes area from boundary length; Build a Molecule describes atom construction and target quantities. Those informed the choice of mechanics. No PhET code, illustrations, screenshots, names or assets were copied into these games. The platform is not endorsed by PhET.

Sources:

- [Area Builder model](https://github.com/phetsims/area-builder/blob/main/doc/model.md): unit squares and total boundary length.
- [Fractions: Equality model entry](https://github.com/phetsims/fractions-equality/blob/main/doc/model.md), which points to the common fractions model: equivalent representations.
- [Number Line: Integers model](https://github.com/phetsims/number-line-integers/blob/main/doc/model.md): signed positions with elevation, bank and temperature contexts.
- [Expression Exchange model](https://github.com/phetsims/expression-exchange/blob/main/doc/model.md): objects/terms, overlap hints and a game matching constructed expressions to target collection areas.
- [Proportion Playground model](https://github.com/phetsims/proportion-playground/blob/main/doc/model.md): bead repetition, paint mixing and billiards with ratio/GCD connections.
- [Fractions Suite common model](https://github.com/phetsims/fractions-common/blob/main/doc/model.md): circular/bar/cake pieces, building targets and matching games; followed from the Fractions: Equality entry.
- [Graphing Lines model](https://github.com/phetsims/graphing-lines/blob/main/doc/model.md): synchronised equations/graphs and three explicit game challenge types.
- [Wave on a String model](https://github.com/phetsims/wave-on-a-string/blob/main/doc/model.md): frequency, amplitude, driving and propagation; our game uses an analytic travelling sinusoid instead of its numerical string model.
- [Forces and Motion: Basics model](https://github.com/phetsims/forces-and-motion-basics/blob/main/doc/model.md): draggable pullers, net force and acceleration.
- [Acid-Base Solutions model](https://github.com/phetsims/acid-base-solutions/blob/main/doc/model.md): strength versus concentration and pH definitions. Our titration is a separate, ideal strong-acid/strong-base stoichiometry model.
- [Balancing Chemical Equations model](https://github.com/phetsims/balancing-chemical-equations/blob/main/doc/model.md): atom conservation and meaningful nonzero coefficients. Our electron delivery and diene product balance are original tasks.
- [Build a Molecule model](https://github.com/phetsims/build-a-molecule/blob/main/doc/model.md): constructing atoms/bonds and molecule/formula targets. Our game uses open-chain bond order accounting, not its PubChem library.
- Related repositories verified: [Arithmetic](https://github.com/phetsims/arithmetic), [Ohm’s Law](https://github.com/phetsims/ohms-law), [Bending Light](https://github.com/phetsims/bending-light), [Energy Forms and Changes](https://github.com/phetsims/energy-forms-and-changes). Their current front-page notices were read; no current live gameplay is asserted.

## Unit and mechanic map

| Unit | Familiar format | Original interactive challenge / relationship |
| --- | --- | --- |
| Numbers I | Factor sorts, BIDMAS matches | The 24 Machine: four individually tracked number tiles, arithmetic parser, alternative solutions |
| Geometry I | Polygon-angle matching | Fence & Floor: resize a rectangle to meet area AND perimeter |
| Numbers II | Integer/expression ordering | Number-Line Rover: programme three signed moves and watch the path |
| Algebra I | Story/table/formula matching | Coordinate Quest: translate coordinates, direct and inverse proportion into checkpoints |
| Boxes & Brackets | Like-term and power sorting | Bag Factory: identical bags multiply every coefficient, including constants |
| Numbers III | Fraction/percent/discount matching | Pizza Proportions: select equal slices for fractions, percentages and two-part ratios |
| Electricity | Circuit/safety/Coulomb card challenges | Circuit Rescue: resistor selection, series ammeter and on-bench DC switch |
| Waves | Wave vocabulary/effect matching | Wave DJ: tune wavelength and amplitude, with a particle moving on the travelling curve |
| Optics | Ray laws/image classification | Focus Finder: object and screen distances satisfying the lens equation and image size |
| Thermal | Heat-transfer sort and phase ordering | Energy Budget Kitchen: heating, retained energy and insulation |
| Kinematics | Story/graph/vector matching | Catch-Up Flag: positional head start and delayed release, targeting a meeting after launch |
| Dynamics | Newton-law/force matching | Tugboat Targets: signed pulls, friction and target instantaneous acceleration |
| Acids and Bases | Reaction/strength/concentration/salt matching | Neutralisation Drop Quest: burette additions over the flask with falling drops and indicator |
| Metals | Reactivity/extraction ordering | Displacement Vault: plate a target metal with the least reactive offered solid that works |
| Redox | Electron-transfer sorting | Electron Delivery: cathode polarity, electron balance, anode product, animated DC cell |
| Organic | Families/function/process cards | Carbon Chain Studio: clickable bonds, hydrogen counting, challenge diene + hydrogen balance |

“Original” means authored for this platform, not a claim that a mechanic has never appeared elsewhere. 24, matching, sorting and ordering are established classroom formats. The unit wrappers and source notes link from `/activities/games/`.

## Learning and model boundaries

- Three stars first try, two second try, one later or after a hint, zero for reveal; every solution has a causal explanation. Retry includes wrong, hinted and revealed rounds. Scores stay in memory on the page.
- All cards shuffle. Each full game contains all three rounds once. Matching/ordering destinations hold one card; sorting bins may hold several. Drag or select then place, with a return-to-tray control.
- Number tiles track identities, including repeated 5s. A recursive-descent arithmetic parser accepts only numeric tiles, four operations and brackets. No `eval` or Function constructor.
- The circuit is an ideal low-voltage resistive circuit. A parallel ammeter is blocked, not simulated as a real short.
- The wave is a transverse travelling sinusoid; horizontal scale is 60 drawing units per metre, amplitude 23 drawing units per cm. Motion is slowed to 35% real time and the marked particle stays on the wave.
- Lenses are ideal thin converging lenses. Virtual and infinite images cannot be caught on the screen; focus and magnification are independently checked.
- Heating uses c = 4200 J/(kg °C). Insulated means 100% retained, leaky 80%. Above 100 °C, remaining energy is allocated to vaporisation at L = 2.26 MJ/kg, not an unphysical temperature rise. Apparatus heat capacity is omitted.
- Catch-up explicitly excludes a shared initial position from the requested AFTER-launch encounter. B stays still during its delay. The motion is accelerated for viewing.
- Friction is a known force opposing initial rightward sliding. Forces are checked at that instant; the game does not extend a fixed friction direction after reversal.
- Titration uses HCl + NaOH, ideal additive volumes at 25 °C, equal-mole equivalence and a schematic universal indicator. Reset is a fresh virtual trial, not removal of base from a real flask.
- Displacement is an ideal aqueous model. It shows a coating, not hydrogen gas. The least-reactive constraint is among the four offered solids.
- Electrolysis rounds are explicitly molten salts: no aqueous water competition. The diagram represents balanced individual cation reduction alongside the anode gas; full equations require balancing both half-equations.
- Chains are unbranched, acyclic, single/double C–C bonds, hydrogen completing carbon valence four. The diene example `C8H18 → C4H6 + C4H10 + H2` conserves atoms but is an illustrative product balance, not a unique or guaranteed cracking outcome.
- Animations respect reduced motion. Native controls, SVG buttons and selectable cards have keyboard routes; neither colour nor dragging is the only way to answer.
- Only the separate revision simulator’s Test yourself can record. No personal data fields, analytics, Google requests or changes to existing question-bank signatures/backend.

## Maintain and check

Authoring: `assets/unit-games/data.mjs`. Pure models: `models.mjs`; vector scenes: `art.mjs`; UI: `games.js`; standalone styles: `games.css`; isolated lesson banner: `links.css`.

Run `python3 tools/build_unit_games.py` after content/art changes. It deterministically generates 16 hubs, 34 game pages, 34 illustrations and one all-games directory. `unit_games_integration.py` idempotently inserts lesson links immediately before the final revision invitation and appends 16 catalogue discovery entries without changing the primary activities. Chemistry and physics page builders call this integration after regeneration.

Checks:

```sh
node tests/unit-games.mjs
python3 tools/validate_catalog.py
python3 tools/serve.py --port 8067
LEARNING_LAB_BASE_URL=http://127.0.0.1:8067 node tests/unit-games-browser.cjs
LEARNING_LAB_BASE_URL=http://127.0.0.1:8067 node tests/unit-games-motion.cjs
```

Browser checks cover all 96 rounds, errors/hints/reveal/retry/scoring, mouse and keyboard, real drag/drop, all three computer viewports, prefixed deployment links and absence of Google requests. Motion checks observe changing geometry/positions, not just CSS class names. Existing desktop layout and unit checks cover lesson integration.

## Two additional Algebra I games

Mystery Machine Mission follows the numerical Mystery/Equations patterns in [PhET Function Builder’s public model documentation](https://github.com/phetsims/function-builder/blob/main/doc/model.md), consulted 29 October 2026. The Basics variant uses images, so it is not described as the numerical source. Students probe inputs, place two operation tiles, and use counterexamples to revise. The model accepts all equivalent affine rules, not just one chosen tile order; fractional results and negative multipliers occur in later challenges. Identity is an explicit Pass through tile.

Proportion Paintworks follows the visual ratio idea in the previously cited Proportion Playground paint documentation. Original mural orders add exact quantities, a constant-product robot crew model, and a two-stage finale. Paint hue is schematic RGB mixing; it does not claim to predict real pigments. Robots have equal rates and no interference. A mission requests completion in exactly the stated time, not merely before a deadline. Final correctness is independent of animation frames and reduced-motion settings.

The two games have six scaffolded missions each, first-class hub/tabs/catalogue links, visible How to play before starting, independent hints/reveal/retry and no recording calls. Authoring: `algebra-data.mjs`; pure rules: `algebra-models.mjs`; vector scenes: `algebra-art.mjs`; controller/style: `algebra-games.js` / `algebra-games.css`. Check `node tests/algebra-games.mjs` and `LEARNING_LAB_BASE_URL=http://127.0.0.1:8067 node tests/algebra-games-browser.cjs`.
