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

Each has six detailed, readable chapters, six worked examples, six highlighted
memory boxes, an original labelled structural-formula cover, an instrument-driven
practical and six independent practice checks with coloured explanatory feedback.
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
linked in Y10 Chemistry's topic menu and the full catalogue (109 entries). The
full 80-question organic revision remains a separate whole-unit activity, with
its preparation link and existing Test yourself connection. The six new checks
per class are labelled local practice; no new recording bank, game or Google
backend deployment is required.

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
