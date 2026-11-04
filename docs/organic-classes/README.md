# Three separate Y10 organic chemistry classes

The Organic Chemistry topic now contains three independently addressable classes:

1. `alcohols-carboxylic-acids/`: structures and bond counts, alcohol properties,
   ethanol production/oxidation, acid strength versus concentration, neutralisation
   and carbonate reactions.
2. `esters-polyesters/`: ester connectivity/naming, reversible esterification,
   catalyst behaviour, bifunctional monomers, finite-chain water counts and
   material/recycling connections.
3. `amines-amides-polyamides/`: nitrogen/lone pairs, proton acceptance, adjacent
   carbonyls and delocalisation, salt versus amide formation, polyamide monomers,
   finite chains, nylon and peptide links.

The alcohol/carboxylic-acid class is a ten-chapter introductory illustrated book,
including two naming chapters, new-word definitions, numbered-chain examples,
worked steps and pause-and-think checks. Its whole acid group is coral with C=O
angled upwards and OH downwards; alcohol OH is teal. The other two classes retain
six detailed chapters each. All have an instrument-driven practical and six local
practice checks with explanatory feedback.
The text remains readable with JavaScript disabled. Every check is taught earlier
in its class; practical distractors are scoped to the concepts just introduced.
Desktop layouts are checked at 1366×768, 1440×900 and 1920×1080.

`organic-classes.mjs` filters cloned controls/definitions from the existing organic
lab, preserving apparatus IDs, keyboard/drag actions and one-step help. The first
class compares ethanol/ethanoic acid; the second compares ester/polyester
condensation; the third compares amine/amide structures and polyamide condensation.
The original eight-investigation organic page remains available. The small-ester
practical now asks about esterification products rather than assuming its
single-ended reactants can form a long condensation polymer.

The lesson distinguishes amine–acid salt formation from amide formation under
appropriate activation/dehydrating conditions. Polymer counts refer explicitly
to one unbranched, open finite chain: N monomer molecules make N−1 links. Thus n
pairs of complementary monomers give 2n−1 waters in these chosen acid routes.
Repeat-unit n and end-group omissions are explained separately.

The three class cards precede the general organic reading/lab and are separately
linked in Y10 Chemistry's topic menu and the full catalogue (110 entries). The
full 80-question organic revision remains a whole-unit activity. Alcohols and
carboxylic acids additionally has an exclusive 60-question bank and 14-round
Molecule Mission game, with structures, naming and real-life applications taught
in the book. The six inline checks per class remain local practice. Recording
the new quiz/game requires the latest three Google files deployed by the owner.

Authored content: `tools/organic_class_content.py`. Rebuild using
`python3 tools/build_organic_classes.py`, or rebuild the chemistry shells using
`tools/build_y10_chemistry_pages.py`, which calls the class builder. The shared
branding/copyright helper retains Learning Lab by Asiel and the author notice.
The class builder is byte-idempotent and preserves the other catalogue entries.

Validation: `node tests/organic-classes.mjs`, the organic-classes browser suite,
and the existing chemistry model, apparatus, full chemistry browser, catalogue,
featured-catalogue and assessment-preparation checks. Browser tests exercise
actual SVG dragging, restricted controls, notebook gating, all 18 practice
answers and no-JS text. Google submissions are excluded from local class checks.

The book source is `tools/alcohols_book.py`; game/art/formatting modules are under
`assets/y10-chemistry/alcohols/`. Rebuild its exclusive bank with
`tools/build_alcohols_questions.py`, then run the class builder and
`tools/build_google_question_bank.py`. The latter updates teaching references,
public readiness metadata and the complete owner-deployed Google ZIP. All 24
previous revision-bank signatures and 42 previous game signatures are preserved.
Additional checks: `tests/alcohol-book.mjs` and `tests/alcohol-book-browser.cjs`
cover colour semantics, SVG geometry, all ten book pages, no-JS reading, actual
molecule dragging, all fourteen game rounds and the dedicated quiz recording.
