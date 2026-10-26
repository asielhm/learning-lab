# Algebra Lab — Year 7 Maths

This lesson adapts the teacher-supplied **Starter_Intro to Algebra**, **Starter_Collecting LIKE terms** and **Starter_brackets** presentations. It uses original HTML/SVG/CSS teaching pictures; the uploaded PowerPoint files and their embedded artwork are not redistributed.

## Teaching sequence

1. **Translate the story:** x is a count of pens in one unopened box; y is a count of clips in another. Controls build x, x+3, x+y, 2x+y and more. Substitution reveals how symbols connect to numbers. Five guided stories require the correct concrete model. Vocabulary contrasts expressions, equations, formulae and identities; lending four pens illustrates subtraction.
2. **Collect like terms:** students tap a term and then its matching group, or drag it with a mouse. Linear, square and cube models distinguish powers of x, y and z. The classroom set collects to `4x + 3x² + 2x³ + 3y + 2y² + z`. Other sets mix more powers or introduce subtraction/cancellation. Sorting must finish before an expanded expression is checked; any term order and either caret or Unicode powers are accepted.
3. **Expand brackets:** identical bags show `2(x+3)` and `2(2x+y)`, then other multipliers. Opening reveals every copy; collecting gives the expanded expression. Students can enter an answer before revealing the collected result. Optional worked examples cover subtraction, a negative factor, a variable factor, and double brackets from the slides.

Representations are schematic, not measured physical objects. Powers are not interchangeable; a square tile is x² rather than two x terms. Negative tokens model subtraction, not negative physical length/area/volume. For the school-bag cost example, p/k/g represent prices, avoiding confusion between letters as numbers and names of objects.

## Review

`revision.html` reuses the shared simulator with a **Year 7 Maths** heading and a separate 60-question bank (`assets/revision/questions/algebra.json`). Categories cover translating, vocabulary, linear terms, powers, brackets and substitution. Foundation/Application/Challenge filters allow teachers to keep initial practice separate from stretch material. Practice gives feedback immediately; Test defers it until the end; students may retry mistakes.

`math.mjs` implements an explicit parser for sums of single-variable terms and constants. It accepts signed integer coefficients, powers1–3 and term reordering. It does not execute input as code, accept arbitrary formulas or numerically test only a few values. This avoids falsely treating x+x as x², or x+y as2x.

No dependencies or build are needed for the website. Run the root static server and visit this folder. Node/browser checks are described in the root README.
