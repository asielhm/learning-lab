"""Rebuild the five syllabus-aligned Y7 Maths banks; uses exact rational arithmetic."""
from fractions import Fraction as F
from pathlib import Path
from math import gcd,isqrt
import json
ROOT=Path(__file__).resolve().parent.parent
banks={}
def txt(value):
 if isinstance(value,F):return str(value.numerator) if value.denominator==1 else f'{value.numerator}/{value.denominator}'
 if isinstance(value,float):return f'{value:.8f}'.rstrip('0').rstrip('.')
 return str(value)
def begin(topic,title,categories):
 global bank
 bank=dict(topicId=topic,title=title,categories=categories,questions=[]);banks[topic]=bank
def q(cat,prompt,correct,wrong,why,level='Application'):
 options=[txt(correct)]
 for v in wrong:
  if txt(v) not in options:options.append(txt(v))
 assert len(options)>=4,(prompt,options)
 options=options[:4];position=len(bank['questions'])%4;options=options[1:position+1]+[options[0]]+options[position+1:]
 bank['questions'].append(dict(id=bank['topicId']+'-'+f'{len(bank["questions"])+1:03}',category=bank['categories'][cat],difficulty=level,prompt=prompt,options=options,answer=position,explanation=why))
def n(cat,prompt,correct,why,level='Application',wrong=()):
 value=F(str(correct)) if not isinstance(correct,F) else correct
 candidates=list(wrong)+[value+1,value-1,value*2,value/2,value+2,value+3,value+4]
 # Compare values as exact fractions, so numerically equivalent distractors are never included.
 unique=[]
 for v in candidates:
  try:fv=F(str(v))
  except ValueError:continue
  if fv!=value and fv not in unique:unique.append(fv)
 q(cat,prompt,correct,unique,why,level)

begin('numbers-i','Numbers I',['Primes and prime factors','Factors multiples HCF and LCM','Decimals and place value','Powers and roots in N','BIDMAS in N','Number reasoning'])
for prompt,correct,wrong,why,level in [
 ('Which number is prime?',29,[21,27,35],'29 has exactly two positive factors: 1 and 29.','Foundation'),
 ('Which statement about 1 is correct?','It is neither prime nor composite.',['It is prime.','It is composite.','It has no factors.'],'1 has one positive factor; primes have exactly two.','Foundation'),
 ('Which is the prime factorisation of 60?','2 × 2 × 3 × 5',['2 × 3 × 10','4 × 3 × 5','2 × 2 × 15'],'All factors in the prime factorisation must themselves be prime.','Application'),
 ('Which is the prime factorisation of 72?','2³ × 3²',['2² × 3³','2 × 3 × 12','8 × 9'],'72 = 8 × 9 = 2³ × 3².','Application'),
 ('Why is 51 not prime?','It is divisible by 3.',['It is odd.','It is greater than 50.','It ends in 1.'],'5 + 1 = 6 is divisible by 3; 51 = 3 × 17.','Application'),
 ('Which list contains only prime numbers?','2, 3, 5, 7',['1, 2, 3, 5','3, 5, 9, 11','2, 4, 7, 13'],'2 is the only even prime; 1, 4 and 9 are not prime.','Foundation'),
 ('A number has prime factorisation 2² × 3 × 7. What is the number?',84,[42,56,168],'4 × 3 × 7 = 84.','Application'),
 ('Which is the prime factorisation of 100?','2² × 5²',['2 × 5²','10²','2² × 5'],'100 = 4 × 25 = 2² × 5². Although 10² equals 100, 10 is not prime.','Application'),
 ('Which prime must divide every even integer greater than 2?',2,[3,5,7],'An even integer is divisible by 2.','Foundation'),
 ('What is the smallest prime factor of 91?',7,[3,11,13],'91 = 7 × 13; neither 2, 3 nor 5 divides it.','Challenge')]:q(0,prompt,correct,wrong,why,level)
for a,b,kind in [(18,24,'HCF'),(24,36,'HCF'),(28,42,'HCF'),(35,49,'HCF'),(6,8,'LCM'),(9,12,'LCM'),(10,15,'LCM'),(12,18,'LCM')]:
 answer=gcd(a,b) if kind=='HCF' else a*b//gcd(a,b)
 n(1,f'What is the {kind} of {a} and {b}?',answer,f'{kind} = {answer}. '+('It is the greatest positive divisor of both.' if kind=='HCF' else 'It is the least positive multiple of both.'),'Foundation' if a<25 else 'Application',wrong=[a+b,a*b,1])
n(1,'Bells ring every 8 minutes and 12 minutes. They ring together now. In how many minutes will they next ring together?',24,'Use LCM(8,12) = 24.','Application',wrong=[4,20,96])
n(1,'There are 30 red beads and 42 blue beads. All are used in identical packs with the same number of each colour. What is the greatest possible number of packs?',6,'Use HCF(30,42) = 6 packs. Each contains 5 red and 7 blue beads.','Challenge',wrong=[12,30,72])
for prompt,answer,why in [('What is the value of the digit 7 in 3.72?',F(7,10),'The 7 is in the tenths place: 7/10.'),('What is the value of the digit 7 in 0.47?',F(7,100),'The 7 is in the hundredths place: 7/100.'),('Write 6 tenths and 3 hundredths as a decimal.',F(63,100),'6/10 + 3/100 = 63/100 = 0.63.'),('How many hundredths are in 2.35?',235,'Each whole has 100 hundredths, so 2.35 = 235/100.'),('What is 0.8 + 0.06?',F(86,100),'Align the place values: 0.80 + 0.06 = 0.86.'),('What is 1.5 − 0.27?',F(123,100),'Write 1.50 − 0.27 = 1.23.')]:n(2,prompt,answer,why,'Foundation')
q(2,'Which decimal is greatest?','0.7',['0.65','0.607','0.067'],'0.700 is larger than 0.650, 0.607 and 0.067.','Foundation')
q(2,'Which list is in ascending order?','0.09, 0.19, 0.9',['0.9, 0.19, 0.09','0.19, 0.09, 0.9','0.09, 0.9, 0.19'],'Compare hundredths: 9, 19 and 90.','Application')
n(2,'What is 0.4 × 0.3?',F(12,100),'4 tenths × 3 tenths = 12 hundredths.','Application',wrong=[F(12,10),12,F(7,10)])
n(2,'What is 3.6 ÷ 0.4?',9,'Scale both numbers by 10: 36 ÷ 4 = 9.','Challenge',wrong=[F(9,10),90,F(144,100)])
for expression,answer,why,level in [('7²',49,'7 × 7 = 49.','Foundation'),('4³',64,'4 × 4 × 4 = 64.','Foundation'),('2⁵',32,'Multiply five copies of 2.','Application'),('√81',9,'9² = 81; the square root symbol gives the non-negative root.','Foundation'),('∛125',5,'5³ = 125.','Foundation'),('10³',1000,'10 × 10 × 10 = 1000.','Foundation'),('3⁴',81,'3 × 3 × 3 × 3 = 81.','Application'),('√144',12,'12 × 12 = 144.','Application'),('∛216',6,'6 × 6 × 6 = 216.','Challenge'),('5² + 2³',33,'25 + 8 = 33.','Application')]:n(3,f'What is {expression}?',answer,why,level)
for expression,answer,why,level in [('6 + 3 × 4',18,'Multiply first: 3 × 4 = 12; then add 6.','Foundation'),('(6 + 3) × 4',36,'Brackets first: 9 × 4 = 36.','Foundation'),('20 − 2 × 6',8,'20 − 12 = 8.','Foundation'),('4 + 2³ × 3',28,'Index first: 8; then 8 × 3 = 24; add 4.','Application'),('24 ÷ 6 × 2',8,'Division and multiplication share priority: work left to right, 4 × 2.','Application'),('18 − 6 + 2',14,'Addition and subtraction share priority: work left to right, 12 + 2.','Application'),('3 × (5 + 7) − 8',28,'3 × 12 − 8 = 36 − 8.','Application'),('36 ÷ (3 × 2)',6,'Brackets: 6. Then 36 ÷ 6 = 6.','Application'),('5² − 3² + 2',18,'25 − 9 + 2 = 16 + 2 = 18.','Challenge'),('(8 + 4) × 3 − 2³',28,'12 × 3 − 8 = 36 − 8 = 28.','Challenge')]:n(4,f'Evaluate {expression}.',answer,why,level)
for prompt,answer,why,level in [('A square has area 121 cm². What is its side length in cm?',11,'Side = √121 = 11 cm.','Foundation'),('Which positive whole number has a cube of 343?',7,'7³ = 343.','Application'),('Two buses leave every 15 and 20 minutes. They leave together at 09:00. How many minutes until the next shared departure?',60,'LCM(15,20) = 60 minutes.','Application'),('A teacher has 48 pens and 60 clips. What is the greatest number of identical packs using everything?',12,'HCF(48,60) = 12. Each pack has 4 pens and 5 clips.','Challenge'),('How many positive factors does 16 have?',5,'The factors are 1, 2, 4, 8 and 16.','Application'),('What is the smallest whole number greater than 1 that is both a square and a cube?',64,'64 = 8² = 4³ = 2⁶.','Challenge'),('What is the missing index in 2 to the power n = 128?',7,'2⁷ = 128.','Challenge'),('Evaluate 48 ÷ (2 × 3) + 5² − 4.',29,'48 ÷ 6 + 25 − 4 = 8 + 25 − 4 = 29.','Challenge'),('What number added to 0.375 makes 1?',F(625,1000),'1.000 − 0.375 = 0.625.','Application'),('The HCF of two numbers is 6 and their LCM is 60. One number is 12. What is the other?',30,'The product is HCF × LCM = 360. The other number is 360 ÷ 12 = 30.','Challenge')]:n(5,prompt,answer,why,level)

begin('geometry-i','Geometry I',['Triangles and quadrilaterals','Polygon angles','Angles and parallel lines','Bisector constructions','Area and perimeter','Compound shapes'])
for prompt,answer,wrong,why,level in [
 ('Which triangle has three equal sides?','Equilateral',['Scalene','Right-angled','Isosceles with exactly two equal sides'],'Equilateral means all three sides are equal.','Foundation'),
 ('Which property must every rectangle have?','Four right angles',['Four equal sides','Exactly one pair of parallel sides','Four lines of symmetry'],'Every rectangle has four right angles; equal adjacent sides are not required.','Foundation'),
 ('Which statement about a square is correct?','It is both a rectangle and a rhombus.',['It is neither a rectangle nor a rhombus.','It is a rectangle but never a rhombus.','It is a rhombus but never a rectangle.'],'A square has four right angles and four equal sides.','Application'),
 ('How many lines of symmetry does a non-square rectangle have?',2,[1,4,0],'Its two symmetry lines pass through the midpoints of opposite sides.','Foundation'),
 ('How many lines of symmetry does an equilateral triangle have?',3,[1,2,0],'Each vertex-to-opposite-midpoint line is a symmetry line.','Foundation'),
 ('Which property describes a parallelogram?','Both pairs of opposite sides are parallel.',['Exactly one pair of sides is parallel.','All angles must be 90°.','All sides must be equal.'],'A parallelogram has two pairs of parallel opposite sides.','Foundation'),
 ('In this course, a trapezium has exactly one pair of parallel sides. Which shape meets that definition?','A quadrilateral with one parallel pair and one non-parallel pair',['Any rectangle','Any rhombus','Any square'],'This uses the stated exclusive definition; conventions can differ between textbooks.','Application'),
 ('A triangle has two equal sides. What can you conclude about the opposite angles?','They are equal.',['They add to 90°.','Both are right angles.','They must be 60°.'],'Equal sides in a triangle have equal opposite angles.','Application'),
 ('Which statement must be true for a rhombus?','All four sides are equal.',['All four angles are right angles.','It has exactly one parallel pair.','Its diagonals are always equal.'],'A rhombus has equal sides, but need not have right angles.','Application'),
 ('Which property describes a kite?','Two pairs of adjacent equal sides',['Exactly three equal sides','Four right angles','Exactly one pair of equal opposite sides'],'The equal sides in a kite meet at adjacent vertices.','Challenge')]:q(0,prompt,answer,wrong,why,level)
for sides in [3,4,5,6]:n(1,f'What is the interior-angle sum of a {sides}-sided convex polygon, in degrees?',(sides-2)*180,f'({sides} − 2) × 180 = {(sides-2)*180}°.','Foundation')
for sides in [5,6,8]:n(1,f'What is each interior angle of a regular {sides}-sided polygon, in degrees?',F((sides-2)*180,sides),f'Divide the sum {(sides-2)*180}° by {sides}.','Application')
n(1,'A regular polygon has exterior angles of 30°. How many sides does it have?',12,'360 ÷ 30 = 12 sides.','Challenge')
n(1,'A convex polygon has interior-angle sum 1260°. How many sides does it have?',9,'n − 2 = 1260 ÷ 180 = 7, so n = 9.','Challenge')
q(1,'Can a regular polygon have exterior angles of 50°?','No, because 360 ÷ 50 is not a whole number.',['Yes, it has 7 sides.','Yes, it has 8 sides.','No, because 50° is less than 90°.'],'The number of equal exterior angles must be a positive whole number; 7.2 sides is impossible.','Challenge')
for prompt,answer,why,level in [('Two angles on a straight line are 67° and x. What is x in degrees?',113,'180 − 67 = 113.','Foundation'),('Angles at a point are 80°, 110°, 95° and x. What is x in degrees?',75,'360 − 80 − 110 − 95 = 75.','Application'),('Two lines intersect. An angle is 48°. What is its vertically opposite angle in degrees?',48,'Vertically opposite angles are equal.','Foundation'),('Parallel lines are crossed by a transversal. An angle is 72°. What is its corresponding angle in degrees?',72,'Corresponding angles between parallel lines are equal.','Foundation'),('Parallel lines are crossed by a transversal. An angle is 115°. What is its alternate interior angle in degrees?',115,'Alternate interior angles between parallel lines are equal.','Application'),('Two co-interior angles between parallel lines are 124° and x. What is x in degrees?',56,'Co-interior angles add to 180°, so x = 56.','Application'),('A triangle has angles 35° and 65°. What is its third angle in degrees?',80,'180 − 35 − 65 = 80.','Foundation'),('An isosceles triangle has vertex angle 40°. What is either base angle in degrees?',70,'The two equal base angles share 140°: 140 ÷ 2 = 70.','Application'),('A quadrilateral has angles 90°, 75°, 110° and x. What is x in degrees?',85,'360 − 90 − 75 − 110 = 85.','Application')]:n(2,prompt,answer,why,level)
q(2,'When do corresponding angles have to be equal?','When the two lines crossed by the transversal are parallel.',['Whenever any two lines are crossed.','Only when the transversal is vertical.','Only when the angles are acute.'],'Parallelism is the condition that guarantees corresponding-angle equality.','Challenge')
for prompt,answer,wrong,why,level in [
 ('What does a perpendicular bisector do to a segment?','It passes through the midpoint at 90°.',['It halves an angle only.','It is parallel to the segment.','It passes through an endpoint at 45°.'],'Perpendicular specifies 90°; bisector specifies the midpoint.','Foundation'),
 ('To construct the perpendicular bisector of AB, how should the two compass radii compare?','They must be equal.',['One must be twice the other.','They must equal AB exactly.','They must be different.'],'Equal radii make the arc intersections equidistant from A and B.','Foundation'),
 ('For a perpendicular-bisector construction, the compass radius must be…','greater than half of AB.',['less than half of AB.','zero.','exactly one quarter of AB.'],'The arcs need two intersections, one on each side of the segment.','Application'),
 ('What should be joined after the two equal-radius arc pairs intersect?','The two arc-intersection points',['The two endpoints of the original segment again','An endpoint to the other endpoint’s arc centre','Any two points on one arc'],'Joining the intersections produces the perpendicular bisector.','Foundation'),
 ('Every point on the perpendicular bisector of AB is…','equally distant from A and B.',['twice as far from A as B.','on the segment AB.','closer to A than B.'],'Equal distance from the endpoints characterises the perpendicular bisector.','Application'),
 ('What does an angle bisector create?','Two equal angles',['Two right angles in every case','Two equal line segments only','Two angles adding to 90° in every case'],'An angle bisector halves the original angle.','Foundation'),
 ('Which tools perform a standard compass-and-straightedge bisector construction?','Compass and an unmarked straightedge',['Calculator and protractor','A marked ruler only','A set square only'],'The arcs establish equal distances and the straightedge joins the required points.','Foundation'),
 ('In an angle-bisector construction, why draw matching arcs from the two points on the arms?','To find a point equally distant from those two points',['To measure the original angle in degrees','To make the two arms parallel','To choose any convenient point'],'Together with the first equal-radius arc, this gives congruent triangles.','Challenge'),
 ('Is measuring half an angle with a protractor the same method as a compass-and-straightedge construction?','No; the compass construction uses equal-distance arcs.',['Yes; both use a calculator.','Yes; arcs are unnecessary in a compass construction.','No; angle bisection is impossible without a protractor.'],'The construction should be justified by equal distances, not a measured approximation.','Application'),
 ('Why must you keep the same compass opening for paired arcs?','To preserve the equal distances needed by the construction',['To make the picture more colourful','To ensure every angle is 60°','To avoid ever drawing circles'],'Changing the radius breaks the equal-distance argument.','Challenge')]:q(3,prompt,answer,wrong,why,level)
for prompt,answer,why,level in [('A rectangle is 8 cm by 5 cm. What is its area in cm²?',40,'8 × 5 = 40 cm².','Foundation'),('A rectangle is 8 cm by 5 cm. What is its perimeter in cm?',26,'2 × (8 + 5) = 26 cm.','Foundation'),('A triangle has base 10 cm and perpendicular height 6 cm. What is its area in cm²?',30,'½ × 10 × 6 = 30 cm².','Foundation'),('A parallelogram has base 7 cm and perpendicular height 4 cm. What is its area in cm²?',28,'Base × perpendicular height = 7 × 4 = 28.','Application'),('A square has side length 3.5 cm. What is its perimeter in cm?',14,'4 × 3.5 = 14 cm.','Application'),('A rectangle has area 36 cm² and width 4 cm. What is its length in cm?',9,'Length = area ÷ width = 36 ÷ 4.','Application'),('A triangle has area 24 cm² and base 8 cm. What is its perpendicular height in cm?',6,'Height = 2 × area ÷ base = 48 ÷ 8.','Challenge'),('A rectangle is 4.5 cm by 2 cm. What is its area in cm²?',9,'4.5 × 2 = 9 cm².','Application'),('A square has area 49 cm². What is its perimeter in cm?',28,'Side = 7 cm; perimeter = 4 × 7 = 28 cm.','Challenge')]:n(4,prompt,answer,why,level)
q(4,'Which unit is appropriate for area?','cm²',['cm','cm³','degrees'],'Area measures two-dimensional coverage, so square units are needed.','Foundation')
for w,h,a,b in [(10,8,4,3),(9,7,3,2),(12,8,5,4)]:n(5,f'A {w} cm by {h} cm rectangle has a {a} cm by {b} cm corner removed. What is the remaining area in cm²?',w*h-a*b,f'{w} × {h} − {a} × {b} = {w*h-a*b} cm².','Application')
for w,h,a,b in [(10,8,4,3),(12,9,5,2)]:n(5,f'A {w} cm by {h} cm rectangle has a {a} cm by {b} cm corner notch removed. What is the L-shape perimeter in cm?',2*(w+h),'Removing a rectangular corner replaces two boundary lengths with equal inward lengths; total = 2(width + height).','Challenge')
n(5,'Three rectangles have non-overlapping interiors and areas 12 cm², 15 cm² and 8 cm². What is their combined area in cm²?',35,'Add the three non-overlapping areas: 12 + 15 + 8 = 35.','Foundation')
n(5,'A compound region consists of three non-overlapping rectangles: 4 cm by 3 cm, 2 cm by 5 cm and 3 cm by 2 cm. What is the total area in cm²?',28,'12 + 10 + 6 = 28 cm².','Challenge')
n(5,'A 6.5 cm by 4 cm rectangle has a 1.5 cm by 2 cm corner removed. What is the remaining area in cm²?',23,'26 − 3 = 23 cm².','Challenge')
n(5,'Two 3 cm by 2 cm rectangles are joined along a complete 2 cm side without overlap. What is the perimeter of the combined shape in cm?',16,'Each perimeter is 10 cm, but the shared 2 cm edge is internal and counted twice: 20 − 4 = 16 cm.','Challenge')
q(5,'Why can adding the separate rectangle perimeters give a wrong compound-shape perimeter?','Shared internal edges are not on the outer boundary.',['Areas must always be subtracted.','Perimeter uses square units.','A compound shape has no perimeter.'],'Trace only the boundary, or subtract twice every shared edge.','Application')

begin('numbers-ii','Numbers II',['Number sets','Adding and subtracting integers','Multiplying and dividing integers','Indices with integers','Roots and equations','BIDMAS with integers'])
for label,answer,why in [('5','N','5 is natural, so it is also integer and rational.'),('−4','Z','−4 is an integer, but is not natural.'),('0','Z','Here N starts at 1. Zero belongs to Z and Q.'),('3/4','Q','3/4 is rational but is not an integer.'),('12/3','N','12/3 = 4, so its value is natural.'),('−6/2','Z','−6/2 = −3, which is an integer.'),('0.25','Q','0.25 = 1/4 is rational but not integer.')]:q(0,f'Use N = {{1, 2, 3, …}}. What is the smallest of N, Z and Q containing {label}?',answer,[x for x in ['N','Z','Q','None of these'] if x!=answer],why,'Foundation')
q(0,'Which statement is true?','Every integer is rational.',['Every rational number is an integer.','Every negative number is irrational.','Zero has no number set.'],'Any integer n can be written as n/1.','Application')
q(0,'Which calculation shows that division can take integers outside Z?','1 ÷ 2 = 1/2',['2 × 3 = 6','−2 + 5 = 3','−4 − 1 = −5'],'1/2 is rational but not an integer.','Application')
q(0,'Which number is rational but not an integer?','−7/2',['−7','0','14/2'],'−7/2 = −3.5 is not a whole number.','Challenge')
for a,b,op in [(-3,5,'+'),(4,-7,'+'),(-6,-2,'+'),(-5,8,'+'),(7,-3,'−'),(-2,5,'−'),(-4,-9,'−'),(0,-6,'−'),(-8,12,'+'),(9,14,'−')]:
 answer=a+b if op=='+' else a-b;n(1,f'Evaluate ({a}) {op} ({b}).',answer,'Add a signed change.' if op=='+' else f'Subtracting ({b}) means adding ({-b}).','Foundation' if abs(a)<7 else 'Application')
for a,b,op in [(-3,4,'×'),(-5,-6,'×'),(8,-2,'×'),(-9,0,'×'),(-24,6,'÷'),(35,-7,'÷'),(-42,-6,'÷'),(0,-4,'÷')]:
 answer=a*b if op=='×' else F(a,b);n(2,f'Evaluate ({a}) {op} ({b}).',answer,'For multiplication/division, equal signs give a positive result and different signs give a negative result; zero products and zero numerators are zero.','Foundation')
q(2,'What is (−5) ÷ 0?','Undefined',['0','−5','5'],'Division by zero is undefined.','Application')
n(2,'What is (−7) ÷ 2? Give an exact value.',F(-7,2),'Different signs give a negative quotient: −7/2.','Challenge')
for expression,answer,why,level in [('(−3)²',9,'Two negative factors multiply to a positive.','Foundation'),('−3²',-9,'Square 3 first, then apply the leading minus.','Application'),('(-2)³',-8,'Three negative factors give a negative product.','Foundation'),('(-2)⁴',16,'Four negative factors give a positive product.','Application'),('−2⁴',-16,'The index applies before the unbracketed minus.','Application'),('(-1)⁵',-1,'An odd number of factors of −1 gives −1.','Foundation'),('(-4)²',16,'(−4) × (−4) = 16.','Foundation'),('(-5)³',-125,'An odd power preserves the negative sign.','Challenge')]:n(3,f'What is {expression}?',answer,why,level)
q(3,'Why are (−4)² and −4² different?','Only the first expression squares the negative sign with the base.',['A square is always negative.','Brackets never affect indices.','Both expressions equal −16.'],'(−4)² = 16, while −4² = −16.','Challenge')
q(3,'Which is positive?','(−3)⁴',['−3⁴','(−3)³','−(3²)'],'An even power of a bracketed negative base is positive.','Application')
for prompt,answer,why,level in [('What is √64?',8,'The principal square root is non-negative.','Foundation'),('What is ∛(−27)?',-3,'(−3)³ = −27.','Foundation'),('What is ∛(−64)?',-4,'(−4)³ = −64.','Foundation'),('What is √((-5)²)?',5,'√25 = 5, not −5.','Application'),('How many integer solutions does x² = 36 have?',2,'The solutions are x = 6 and x = −6.','Application'),('How many real solutions does x² = −9 have?',0,'The square of a real number cannot be negative.','Challenge'),('What is the integer solution of x³ = −125?',-5,'(−5)³ = −125.','Application')]:n(4,prompt,answer,why,level)
q(4,'What is √(−16) in the real numbers?','It has no real value.',['−4','4','−8'],'No real number has a negative square.','Challenge')
q(4,'Which are all the integer solutions of x² = 49?','−7 and 7',['7 only','−7 only','−49 and 49'],'Both (−7)² and 7² equal 49.','Application')
q(4,'Which statement correctly distinguishes a root from an equation?','√25 = 5, while x² = 25 has solutions −5 and 5.',['√25 = ±5, while x² = 25 has only solution 5.','Both have only value −5.','Neither has a real value.'],'The square root symbol names the principal non-negative root.','Challenge')
for expression,answer,why,level in [('−3 + 2 × 5',7,'Multiply first: −3 + 10.','Foundation'),('4 − 3 × (−2)',10,'4 − (−6) = 10.','Application'),('(−2 + 5)²',9,'Brackets give 3, then square.','Foundation'),('−2² + 3',-1,'−4 + 3 = −1; the square comes before the leading minus.','Application'),('(-2)² + 3',7,'4 + 3 = 7.','Foundation'),('12 ÷ (−3) × 2',-8,'Division/multiplication left to right: −4 × 2.','Application'),('−5 − (−3) + 2',0,'−5 + 3 + 2 = 0.','Application'),('2 × (−3 − 1)² − 5',27,'2 × 16 − 5 = 27.','Challenge'),('18 ÷ (−3) + (−2)³',-14,'−6 + (−8) = −14.','Challenge'),('(-4 + 1)² − 2 × (−5)',19,'9 − (−10) = 19.','Challenge')]:n(5,f'Evaluate {expression}.',answer,why,level)

begin('algebra-i','Algebra I',['Variables and formulas','Coordinates','Direct proportion tables','Direct proportion formulas and graphs','Inverse proportion tables','Inverse proportion reasoning'])
for prompt,answer,wrong,why,level in [
 ('A box holds x pens. Which expression describes the pens in three identical boxes?','3x',['x + 3','x³','3 + x³'],'Three equal groups of x make 3x.','Foundation'),
 ('There are x pens in a box and 4 loose pens. What is the total?','x + 4',['4x','x − 4','x/4'],'Add the four known pens to the unknown box count.','Foundation'),
 ('A box holds x pens and a clip box holds y clips. What represents all the items in one of each?','x + y',['xy','2x','x − y'],'The two unknown counts are added.','Foundation'),
 ('A notebook costs £3. What formula connects total cost y and number of notebooks x, with no other charges?','y = 3x',['y = x + 3','y = 3/x','y = x/3'],'Every notebook contributes £3.','Foundation'),
 ('A taxi charges £4 plus £2 per kilometre x. What is the total cost y?','y = 2x + 4',['y = 6x','y = 4x + 2','y = 2/x + 4'],'The fixed charge is added once, and 2x represents the distance charge.','Application')]:q(0,prompt,answer,wrong,why,level)
for x in [0,3,5]:n(0,f'If y = 4x + 2 and x = {x}, what is y?',4*x+2,f'Substitute x: 4 × {x} + 2 = {4*x+2}.','Foundation' if x<4 else 'Application')
q(0,'In y = 5x, which quantity is the independent input in this formula?','x',['5','y','The equals sign'],'x is chosen as the input; y is calculated from it.','Application')
q(0,'Which relationship is directly proportional?','y = 5x',['y = 5x + 2','y = 5/x','y = x²'],'The ratio y/x is constant and the graph passes through the origin.','Challenge')
for label,answer,wrong,why,level in [
 ('Which coordinate describes 3 right and 2 up from the origin?','(3, 2)',['(2, 3)','(−3, 2)','(3, −2)'],'x is horizontal first, y is vertical second.','Foundation'),
 ('Which coordinate describes 4 left and 1 up?','(−4, 1)',['(4, −1)','(1, −4)','(−4, −1)'],'Left gives negative x; up gives positive y.','Foundation'),
 ('Which point lies on the y-axis?','(0, −3)',['(−3, 0)','(3, 3)','(1, −3)'],'All points on the y-axis have x = 0.','Foundation'),
 ('Which point lies on the x-axis?','(5, 0)',['(0, 5)','(5, 5)','(−1, 5)'],'All points on the x-axis have y = 0.','Foundation'),
 ('Which point lies in the quadrant with x negative and y negative?','(−2, −5)',['(2, −5)','(−2, 5)','(2, 5)'],'Both coordinates must be negative.','Application'),
 ('Reflect (3, −2) in the y-axis. What is the image?','(−3, −2)',['(3, 2)','(−3, 2)','(−2, 3)'],'Negate x and keep y.','Application'),
 ('Reflect (−4, 1) in the x-axis. What is the image?','(−4, −1)',['(4, 1)','(4, −1)','(1, −4)'],'Keep x and negate y.','Application'),
 ('Move (−2, 3) four units right and five units down. What is the new point?','(2, −2)',['(−6, 8)','(2, 8)','(−2, 2)'],'Add 4 to x and subtract 5 from y.','Application'),
 ('Three rectangle vertices are (1, 1), (5, 1) and (5, 4). What is the fourth?','(1, 4)',['(4, 1)','(1, 5)','(4, 5)'],'The fourth corner shares x with the first and y with the third.','Challenge'),
 ('A point makes a half-turn about the origin from (2, −3). What is the image?','(−2, 3)',['(−2, −3)','(2, 3)','(3, −2)'],'A half-turn negates both coordinates.','Challenge')]:q(1,label,answer,wrong,why,level)
for count,cost,target in [(2,6,5),(3,12,7),(4,10,8),(5,15,2),(6,24,9),(8,20,4),(3,9,0),(4,28,6)]:n(2,f'{count} identical notebooks cost £{cost}. The cost is directly proportional to the quantity. What do {target} notebooks cost in pounds?',F(cost,count)*target,f'Unit price = {cost}/{count}. Multiply by {target}.','Foundation' if cost%count==0 and target else 'Application')
q(2,'Which table can represent direct proportion?','x: 1, 2, 3; y: 4, 8, 12',['x: 1, 2, 3; y: 5, 9, 13','x: 1, 2, 3; y: 12, 6, 4','x: 1, 2, 3; y: 1, 4, 9'],'Each ratio y/x equals 4.','Application')
n(2,'A direct-proportion table has x = 3, y = 15 and x = 8, y = a. What is a?',40,'k = 15 ÷ 3 = 5, so a = 5 × 8 = 40.','Challenge')
for prompt,answer,wrong,why,level in [
 ('Which graph represents y directly proportional to x?','A straight line through the origin',['Any straight line','Any increasing curve','A descending curve with constant xy'],'Direct proportion means y = kx.','Foundation'),
 ('y is directly proportional to x. When x = 4, y = 12. Which formula is correct?','y = 3x',['y = x + 8','y = 12/x','y = x/3'],'k = y/x = 12/4 = 3.','Application'),
 ('Which quantity stays constant when y is directly proportional to x?','y/x for non-zero x',['x + y','xy','y − x for every rate'],'The unit rate y/x = k is constant.','Foundation'),
 ('A straight graph has equation y = 2x + 3. Is y directly proportional to x?','No, because it does not pass through the origin.',['Yes, because all straight graphs show direct proportion.','Yes, because 2 is constant.','No, because the slope is positive.'],'The fixed intercept 3 prevents a constant ratio y/x.','Application'),
 ('If x triples in a direct-proportion relationship, what happens to y?','It triples.',['It increases by 3.','It is divided by 3.','It stays unchanged.'],'Multiplying x by 3 multiplies kx by 3.','Foundation'),
 ('A graph of total cost against quantity passes through (0,0) and (4,10). What is its unit rate?',F(5,2),[4,10,F(2,5)],'Rate = rise/run = 10/4 = 2.5 per item.','Application'),
 ('y = 6x. What is y when x = 0?',0,[6,1,'Undefined'],'Multiplying zero by the constant gives zero.','Foundation'),
 ('A service charges £5 per item plus a £2 fee. Which statement is correct?','Cost is linear but not directly proportional to item count.',['Cost is directly proportional.','Cost is inversely proportional.','Cost has a constant product with item count.'],'The fee means zero items do not correspond to zero total cost in the formula.','Challenge')]:q(3,prompt,answer,wrong,why,level)
n(3,'y is directly proportional to x. If y = 18 when x = 6, what is x when y = 27?',9,'k = 3, so x = 27 ÷ 3 = 9.','Challenge')
n(3,'A recipe uses 250 g of flour for 5 portions. How many grams are needed for 8 portions at the same rate?',400,'50 g per portion × 8 = 400 g.','Application')
for workers,hours,new in [(2,12,4),(3,8,6),(4,9,6),(5,12,10),(6,4,3),(8,3,2),(2,18,6),(3,20,5)]:n(4,f'{workers} equal-rate workers finish a fixed job in {hours} hours. Assuming perfect sharing, how many hours would {new} workers take?',F(workers*hours,new),f'Keep worker-hours constant: {workers} × {hours} = {workers*hours}; time = {workers*hours} ÷ {new}.','Foundation' if new==2*workers else 'Application')
q(4,'Which table shows inverse proportion?','x: 1, 2, 4; y: 12, 6, 3',['x: 1, 2, 4; y: 3, 6, 12','x: 1, 2, 4; y: 11, 10, 8','x: 1, 2, 4; y: 1, 4, 16'],'Every product xy equals 12.','Application')
n(4,'x and y are inversely proportional. A table gives x = 4 and y = 15. What is y when x = 12?',5,'xy = 60, so y = 60/12 = 5.','Challenge')
for prompt,answer,wrong,why,level in [
 ('Which formula shows inverse proportion?','y = 24/x',['y = 24x','y = 24 − x','y = x + 24'],'Inverse proportion means xy = constant.','Foundation'),
 ('Which quantity stays constant in inverse proportion?','xy',['x + y','y/x','x − y'],'If y = k/x, then xy = k.','Foundation'),
 ('If x doubles in an inverse-proportion relationship, y…','halves.',['doubles.','increases by 2.','becomes zero.'],'The constant product must be preserved.','Foundation'),
 ('If x is multiplied by 3 in inverse proportion, y is…','divided by 3.',['multiplied by 3.','reduced by 3.','unchanged.'],'Use the reciprocal scale factor.','Application'),
 ('A graph of y = 12/x for positive x is…','a descending curve, not a straight line.',['a straight line through the origin.','a horizontal line.','a vertical line.'],'Equal increases in x do not produce equal decreases in y.','Application'),
 ('Why is y = 12 − x not inverse proportion?','Its product xy is not constant.',['It decreases as x increases.','Every decreasing relationship is inverse proportion.','It has a negative slope, which proves inverse proportion.'],'A decreasing relationship alone does not prove inverse proportion; xy must be constant.','Challenge'),
 ('Which assumption is needed for the simple worker-time inverse model?','Workers have equal rates and can share the fixed job without delays.',['Every worker adds an extra hour of work.','The amount of work increases with worker count.','Every real job always follows inverse proportion.'],'Fixed work and equal effective productivity are essential.','Application'),
 ('Which formula fits y inversely proportional to x with x = 3 and y = 8?','y = 24/x',['y = 8x/3','y = x + 5','y = 3/(8x)'],'k = xy = 24.','Challenge')]:q(5,prompt,answer,wrong,why,level)
n(5,'For y = 36/x, what is x when y = 9?',4,'xy = 36, so x = 36 ÷ 9 = 4.','Application')
n(5,'Two positive inverse-proportion pairs are (2, 18) and (6, y). What is y?',6,'2 × 18 = 36; 36 ÷ 6 = 6.','Challenge')

begin('numbers-iii','Numbers III',['Ratio sharing','Map scales','Fractions decimals and percentages','Percentage changes','Fraction operations','Rational BIDMAS and powers'])
for total,a,b in [(30,2,3),(42,3,4),(64,3,5),(72,5,4)]:n(0,f'£{total} is shared between A and B in the ratio {a}:{b}. How many pounds does A receive?',F(total*a,a+b),f'{a+b} parts; one part = {total}/{a+b}; A receives {a} parts.','Foundation')
for total,a,b,c in [(54,2,3,4),(60,1,2,3),(84,2,3,7)]:n(0,f'£{total} is shared in the ratio A:B:C = {a}:{b}:{c}. How many pounds does B receive?',F(total*b,a+b+c),f'Total parts = {a+b+c}. B receives {b}/{a+b+c} of £{total}.','Challenge')
q(0,'Which ratio is equivalent to 2:3?','6:9',['4:9','3:2','2:6'],'Multiply both parts by the same factor, here 3.','Foundation')
n(0,'Red:blue counters = 3:5. What fraction of all counters is red?',F(3,8),'There are 3 + 5 = 8 equal parts in total.','Application',wrong=[F(3,5),F(5,8),F(5,3)])
n(0,'A:B = 2:7 and B receives £35. How many pounds are shared in total?',45,'One part is £5; there are 9 parts, giving £45.','Challenge')
for scale,cm in [(10000,3),(25000,4),(50000,6),(100000,2)]:n(1,f'A map has scale 1:{scale:,}. Two points are {cm} cm apart on the map. What is the real distance in kilometres?',F(cm*scale,100000),f'{cm} × {scale} cm = {txt(F(cm*scale,100000))} km.','Foundation' if scale>=50000 else 'Application')
for scale,km in [(25000,2),(50000,3),(100000,5)]:n(1,f'At scale 1:{scale:,}, a real distance of {km} km is how many centimetres on the map?',F(km*100000,scale),f'Convert {km} km to {km*100000} cm, then divide by {scale}.','Application')
q(1,'What does a map scale 1:50,000 mean?','1 cm on the map represents 50,000 cm in real life.',['1 cm represents 50,000 m.','50,000 cm on the map represents 1 cm in real life.','1 cm represents 50,000 km.'],'The ratio compares the same units.','Foundation')
n(1,'A scale drawing shows 4 cm for a real length of 1 m. What is the scale factor n in 1:n?',25,'1 m = 100 cm; 100 ÷ 4 = 25.','Challenge')
n(1,'On a 1:10,000 map, a square park has real side 1 km. What is the map area in cm²?',100,'1 km = 100,000 cm. Map side = 10 cm, so area = 100 cm². Scale areas using the square of the length scale.','Challenge')
for prompt,answer,why,level in [('Write 3/4 as a decimal.',F(3,4),'3 ÷ 4 = 0.75.','Foundation'),('Write 0.4 as a fraction in simplest form.',F(2,5),'0.4 = 4/10 = 2/5.','Foundation'),('Write 35% as a fraction in simplest form.',F(7,20),'35/100 simplifies by 5 to 7/20.','Application'),('Write 1/8 as a percentage. Enter its numerical value.',F(25,2),'1/8 = 0.125, so 12.5%.','Application'),('Write 0.06 as a percentage. Enter its numerical value.',6,'0.06 × 100 = 6%.','Foundation'),('What numerator completes 3/5 = n/20?',12,'Multiply numerator and denominator by 4.','Foundation'),('What denominator completes 7/8 = 21/n?',24,'The numerator triples, so the denominator must triple.','Application'),('Write 125% as a decimal.',F(5,4),'125 ÷ 100 = 1.25.','Application'),('Write 0.375 as a fraction in simplest form.',F(3,8),'375/1000 simplifies by 125 to 3/8.','Challenge')]:n(2,prompt,answer,why,level)
q(2,'Which value is greatest?','0.45',['2/5','42%','0.405'],'Compare decimals: 0.45, 0.4, 0.42 and 0.405.','Challenge')
for price,rate,kind in [(80,25,'discount'),(120,10,'increase'),(60,15,'discount'),(200,12,'increase'),(48,25,'discount'),(250,20,'increase')]:
 answer=F(price*(100-rate if kind=='discount' else 100+rate),100);n(3,f'An item costs £{price}. After a {rate}% {kind}, what is its new price in pounds?',answer,f'The multiplier is {txt(F(100-rate if kind=="discount" else 100+rate,100))}. Multiply the original £{price} by it.','Foundation' if rate in [10,20,25] else 'Application')
n(3,'A £100 price rises by 20%, then the new price falls by 20%. What is the final price in pounds?',96,'100 × 1.2 × 0.8 = 96. The second change uses £120 as the base.','Challenge')
n(3,'After a 25% discount, a price is £60. What was the original price in pounds?',80,'£60 is 75% of the original: 60 ÷ 0.75 = 80.','Challenge')
n(3,'A price rises from £50 to £65. What is the percentage increase?',30,'Change = 15; 15/50 × 100 = 30%.','Application')
n(3,'A £240 price is reduced by 15%, then by a further 10%. What is the final price in pounds?',F(1836,10),'240 × 0.85 = 204; 204 × 0.9 = 183.60.','Challenge')
for a,b,c,d,op in [(1,3,1,6,'+'),(3,4,1,8,'−'),(2,3,3,5,'×'),(3,4,1,2,'÷'),(5,6,1,4,'+'),(7,8,1,3,'−'),(4,5,5,6,'×'),(2,3,4,9,'÷'),(3,2,5,4,'−'),(5,12,7,18,'+')]:
 f,g=F(a,b),F(c,d);answer={'+':lambda:f+g,'−':lambda:f-g,'×':lambda:f*g,'÷':lambda:f/g}[op]();why='Use a common denominator, operate on the numerators, then simplify.' if op in ['+','−'] else 'Multiply numerators and denominators, then simplify.' if op=='×' else 'Multiply the first fraction by the reciprocal of the second, then simplify.';n(4,f'Calculate {a}/{b} {op} {c}/{d}. Give the simplest form.',answer,why,'Foundation' if a<4 and d<9 else 'Application')
for expression,answer,why,level in [('1/2 + 3/4 × 2',2,'Multiply first: 3/2; add 1/2 to give 2.','Foundation'),('(1/2 + 3/4) × 2',F(5,2),'Brackets give 5/4, then multiply by 2.','Application'),('(2/3)²',F(4,9),'Square numerator and denominator: 4/9.','Foundation'),('√(9/16)',F(3,4),'Principal square roots of numerator and denominator are 3 and 4.','Foundation'),('3/4 ÷ 1/2 + 1/4',F(7,4),'Divide first: 3/2, then add 1/4.','Application'),('2 − (1/2 + 3/4)',F(3,4),'Brackets give 5/4; 8/4 − 5/4 = 3/4.','Application'),('(1/2)³ + 3/8',F(1,2),'1/8 + 3/8 = 4/8 = 1/2.','Application'),('(5/6 − 1/3) ÷ 3/4',F(2,3),'Brackets give 1/2; multiply by 4/3 to get 2/3.','Challenge'),('√(25/36) − (1/2)²',F(7,12),'5/6 − 1/4 = 10/12 − 3/12 = 7/12.','Challenge'),('(3/4 + 1/2) × (2/5)²',F(1,5),'5/4 × 4/25 = 1/5.','Challenge')]:n(5,f'Evaluate {expression}.',answer,why,level)

for topic,bank in banks.items():
 assert len(bank['questions'])==60,(topic,len(bank['questions']))
 for question in bank['questions']:
  if question['category']=='Decimals and place value' or 'as a decimal' in question['prompt'] or 'as a percentage' in question['prompt']:
   try: question['options']=[txt(float(F(option))) for option in question['options']]
   except ValueError: pass
 for category in bank['categories']:assert sum(q['category']==category for q in bank['questions'])==10,(topic,category)
 (ROOT/'assets/revision/questions'/f'{topic}.json').write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
 print(f'{topic}: {len(bank["questions"])} questions in {len(bank["categories"])} areas')
