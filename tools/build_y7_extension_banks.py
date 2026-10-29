"""New self-contained Statistics and Algebra II banks; preserve every older scoring bank."""
import json
from pathlib import Path
from fractions import Fraction as F
from statistics import median
ROOT=Path(__file__).resolve().parent.parent

def text(x):
 if isinstance(x,F):return str(x.numerator) if x.denominator==1 else str(x)
 return str(x)
def bank(topic,title,categories):return dict(topicId=topic,title=title,categories=categories,questions=[])
def add(b,cat,prompt,answer,why,level='Application',wrong=None):
 if isinstance(why,list):
  options=why;why,level,wrong=level,wrong if isinstance(wrong,str) else 'Application',options
 choices=[text(answer)]
 numeric=isinstance(answer,(int,float,F))
 candidates=list(wrong or [])
 if numeric:
  n=F(str(answer));candidates += [n+1,n-1,n*2,n/2,n+2,n+3,n+4,n+10]
 seen=[]
 for x in candidates:
  if numeric:
   try:value=F(str(x))
   except ValueError:continue
   if value==F(str(answer)) or value in seen:continue
   seen.append(value)
  if text(x) not in choices:choices.append(text(x))
  if len(choices)==4:break
 assert len(choices)==4,(prompt,choices)
 n=len(b['questions']);pos=n%4;choices=choices[1:pos+1]+[choices[0]]+choices[pos+1:]
 b['questions'].append(dict(id=b['topicId']+'-'+f'{n+1:03}',category=b['categories'][cat],difficulty=level,prompt=prompt,options=choices,answer=pos,explanation=why))
def quartiles(a):
 a=sorted(a);m=len(a)//2;return median(a[:m]),median(a[m+(len(a)%2):])
S=bank('statistics','Statistics',['Data and pictograms','Bar charts and frequencies','Pie charts and percentages','Mean median and mode','Range and quartiles','Discrete frequency tables'])
for key,symbols in [(2,3),(4,3),(2,F(5,2)),(4,F(7,2)),(5,4),(10,3)]:add(S,0,f'A pictogram key says one full symbol represents {key} students. How many students do {text(symbols)} full-symbol equivalents represent?',key*symbols,f'Multiply symbol equivalents by the key: {text(symbols)} × {key} = {text(key*symbols)}.','Foundation')
add(S,0,'A pictogram shows 18 books, with one full symbol representing 4 books. How many full-symbol equivalents are needed?',F(9,2),'18 ÷ 4 = 4.5 symbols: four full symbols and one half.','Application')
add(S,0,'Which is discrete numerical data?','Number of siblings',['Favourite colour','A person’s measured height','Time measured continuously'],'A count of siblings takes separate whole-number values.','Foundation')
add(S,0,'What does frequency mean?','The number of times a value or category occurs',['The largest data value','The sum of all data values','The angle of a whole circle'],'Frequency counts occurrences.','Foundation')
add(S,0,'When the pictogram key changes from 2 people per symbol to 4, while the data stay the same, what happens to the number of symbol equivalents?','It halves.',['It doubles.','It stays the same.','It becomes four times larger.'],'Each symbol represents twice as many people, so half as many symbol equivalents are needed.','Challenge')
for rows,kind in [([6,8,4,2],'total'),([3,5,7,5],'total'),([4,9,2,5],'largest'),([7,6,3,4],'difference'),([8,8,2,2],'ties'),([10,4,3,3],'fraction')]:
 table='Bus '+str(rows[0])+', Walk '+str(rows[1])+', Car '+str(rows[2])+', Cycle '+str(rows[3])
 if kind=='total':add(S,1,f'Travel survey frequencies: {table}. How many students were surveyed?',sum(rows),'Add all category frequencies.','Foundation')
 elif kind=='largest':add(S,1,f'Travel frequencies are {table}. Which category has the tallest bar?','Walk',['Bus','Car','Cycle'],'The largest frequency, 9, belongs to Walk.','Foundation')
 elif kind=='difference':add(S,1,f'Travel frequencies are {table}. How many more travel by Bus than by Car?',rows[0]-rows[2],'Subtract the Car frequency from the Bus frequency.','Application')
 elif kind=='ties':add(S,1,f'Travel frequencies are {table}. Which categories tie for the greatest frequency?','Bus and Walk',['Car and Cycle','Bus and Car','Walk and Cycle'],'Bus and Walk both have frequency 8.','Application')
 else:add(S,1,f'Travel frequencies are {table}. What fraction travel by Bus?',F(rows[0],sum(rows)),'Bus frequency divided by total frequency is 10/20 = 1/2.','Application')
add(S,1,'Why should a standard bar chart’s numerical baseline normally start at zero?','Bar lengths represent frequencies, so truncation can exaggerate comparisons.',['Every graph must have both axes starting at zero.','The categories must be numerical.','A nonzero baseline changes the data values.'],'A bar’s length is the encoding being compared; an unequal starting point can distort its apparent ratio.','Challenge')
add(S,1,'Which display is most suitable for comparing counts of four favourite fruits?','A labelled bar chart',['An unlabelled curve','A list of continuous intervals with no counts','A graph with no scale'],'Categories and their frequencies can be compared with separate bars.','Foundation')
add(S,1,'A bar reaches 8 on an axis labelled 0, 2, 4, 6, 8, 10. What is its frequency?',8,'Read the labelled vertical scale, not the number of tick marks.','Foundation')
add(S,1,'A category’s frequency rises from 4 to 10. What is the increase?',6,'10 − 4 = 6 observations.','Application')
for f,n in [(3,12),(4,12),(2,12),(5,20),(3,8),(4,10)]:add(S,2,f'A pie chart represents {n} observations. A category has frequency {f}. What is its sector angle in degrees?',F(f*360,n),f'Sector angle = (frequency / total) × 360° = ({f}/{n}) × 360°.','Foundation' if n in [12,20] else 'Application')
add(S,2,'A sector angle is 90°. What percentage of the data does it represent?',25,'90/360 × 100% = 25%.','Foundation')
add(S,2,'A 120° sector represents 8 people. How many people are represented by the whole pie chart?',24,'120° is one third of 360°, so the total is 3 × 8 = 24.','Challenge')
add(S,2,'Three pie-chart angles are 100°, 80° and 70°. What is the remaining angle?',110,'The whole circle is 360°: 360 − 100 − 80 − 70 = 110.','Application')
add(S,2,'Two correct pie charts have the same category percentages but different total sample sizes. What must be the same?','Corresponding sector angles',['Every category frequency','The total number of observations','The physical radius used for drawing'],'Angles encode proportions, so the same proportions have the same angles even if totals differ.','Challenge')
for data,measure in [([2,4,6,8],'mean'),([1,3,5,7,9],'mean'),([2,2,4,6,6],'mean'),([2,5,8,9,10],'median'),([1,3,4,8,9,11],'median'),([4,2,8,3,6],'median')]:
 answer=F(sum(data),len(data)) if measure=='mean' else F(median(data));add(S,3,f'Find the {measure} of {", ".join(map(str,data))}.',answer,'Mean = sum / number of observations.' if measure=='mean' else 'Sort first; select the middle value or average the two middle values.','Foundation' if len(data)<6 else 'Application')
add(S,3,'Find the mode of 2, 3, 3, 4, 5, 5, 5, 7.',5,'5 occurs three times, more often than any other value.','Foundation')
add(S,3,'What are the modes of 1, 2, 2, 3, 4, 4, 5?','2 and 4',['2 only','4 only','3'],'Both 2 and 4 share the greatest frequency.','Application')
add(S,3,'Which statement fits the data 1, 3, 5, 7, with every value occurring once?','There is no mode under this course convention.',['The mode is 4.','The mode is 7.','The mode is 1.'],'No value occurs more often than the others; we report no mode.','Application')
add(S,3,'For 2, 3, 4, 5, 16, which centre is more affected by replacing 16 with 100?','The mean',['The median','The mode','Neither mean nor median changes'],'The mean uses every magnitude; the middle sorted value stays 4.','Challenge')
for data,measure in [([3,7,2,9,5],'range'),([1,4,4,6,10],'range'),([2,3,5,7,8,11,13],'q1'),([2,3,5,7,8,11,13],'q3'),([1,2,4,6,8,10,12,14],'q1'),([1,2,4,6,8,10,12,14],'q3'),([2,2,4,5,7,8,10],'q1'),([2,2,4,5,7,8,10],'q3')]:
 answer=max(data)-min(data) if measure=='range' else quartiles(data)[measure=='q3'];name={'q1':'lower quartile Q₁','q3':'upper quartile Q₃','range':'range'}[measure]
 add(S,4,f'Find the {name} of {", ".join(map(str,data))}. For quartiles, use medians of the halves, excluding the overall median when the count is odd.',F(str(answer)),'Range = maximum − minimum.' if measure=='range' else 'Order the values, split into lower and upper halves using the stated convention, and find the relevant half’s median.','Foundation' if measure=='range' else 'Application')
add(S,4,'A list contains 9 sorted observations. Which position gives its median?',5,'The middle position is (9 + 1)/2 = 5.','Foundation')
add(S,4,'Why can different software sometimes give different quartiles for the same small data set?','Different quartile conventions or interpolation rules may be used.',['The sum of the data must have changed.','The largest value becomes the median.','Quartiles never depend on a definition.'],'State the convention; this course uses medians of the halves, excluding the overall median when the count is odd.','Challenge')
tables=[([0,1,2,3],[1,2,4,1]),([1,2,3,4],[2,3,4,1]),([0,1,2,3,4],[1,3,6,3,2]),([1,2,3],[2,5,3])]
for i,(values,frequencies) in enumerate(tables):
 pairs=', '.join(f'{x}: {f}' for x,f in zip(values,frequencies));data=[x for x,f in zip(values,frequencies) for _ in range(f)]
 add(S,5,f'Frequency table (value: frequency): {pairs}. What is the total frequency N?',len(data),'Add frequencies, not the distinct data values.','Foundation')
 add(S,5,f'Frequency table (value: frequency): {pairs}. What is the mean?',F(sum(data),len(data)),'Compute Σ(fx), then divide by Σf. Do not give each distinct value equal weight.','Challenge')
add(S,5,'Values 0, 1, 2, 3 have frequencies 1, 2, 4, 1. What is the median?',2,'N = 8. Positions 4 and 5 both have value 2, so the median is 2.','Application')
add(S,5,'Values 0, 1, 2, 3, 4 have frequencies 1, 3, 6, 3, 2. What is the mode?',2,'The greatest frequency is 6, belonging to value 2.','Application')
assert len(S['questions'])==60,len(S['questions'])
for c in S['categories']:assert sum(q['category']==c for q in S['questions'])==10,c

legacy=json.loads((ROOT/'assets/revision/questions/algebra.json').read_text())
A=bank('algebra-ii','Algebra II',legacy['categories']+['One-step equations','Two- and three-step equations','Unknown on both sides'])
A['questions']=legacy['questions']
for x,k in [(3,5),(7,2),(0,6),(9,-3),(-4,7),(-5,-2),(6,4),(-3,5),(8,-4),(-2,-6)]:
 prompt=f'Solve x + ({k}) = {x+k}.';add(A,6,prompt,x,f'Subtract {k} from both sides: x = {x+k} − ({k}) = {x}.','Foundation' if x>=0 else 'Application')
for a,b,x,bracket in [(2,3,4,False),(3,-4,7,False),(4,5,-2,False),(5,-3,0,False),(2,-6,-4,False),(2,3,4,True),(3,-2,7,True),(4,1,-3,True),(2,-3,10,True),(5,2,-4,True)]:
 rhs=a*(x+b) if bracket else a*x+b;prompt=f'Solve {a}(x + ({b})) = {rhs}.' if bracket else f'Solve {a}x + ({b}) = {rhs}.'
 why=f'Divide both sides by {a}, then subtract {b}: x = {x}.' if bracket else f'Subtract {b} from both sides, then divide by {a}: x = {x}.'
 add(A,7,prompt,x,why,'Application' if x>=0 and not bracket else 'Challenge')
for a,c,b,x,bracket in [(4,2,5,7,False),(5,2,-3,4,False),(3,1,7,-2,False),(6,2,4,3,False),(2,5,1,-4,False),(3,1,-2,7,True),(4,2,1,5,True),(2,1,-3,-5,True),(5,3,2,4,True),(3,2,-4,0,True)]:
 d=a*(x+b)-c*x if bracket else (a-c)*x+b;left=f'{a}(x + ({b}))' if bracket else f'{a}x + ({b})';add(A,8,f'Solve {left} = {c}x + ({d}).',x,f'{"Expand the bracket, then " if bracket else ""}subtract {c}x from both sides, collect constants and divide by {a-c}. Substitution gives x = {x}.','Challenge')
A['categories'].append('Adding and multiplying variable terms')
for prompt,correct,wrong,why,level in [
 ('Simplify 2 × 3.','6',['5','23','9'],'Multiply the two numerical factors: 2 × 3 = 6.','Foundation'),
 ('Simplify 2a × 3.','6a',['5a','6a²','23a'],'Write 2 × a × 3, then group the numbers: (2 × 3) × a = 6a. There is only one factor of a.','Foundation'),
 ('Simplify 2a × 3a.','6a²',['5a','6a','5a²'],'Multiply 2 × 3 = 6 and a × a = a². The exponent 2 counts two a factors.','Application'),
 ('Simplify 2a × 3b.','6ab',['5ab','6a²','6a + b'],'Group the factors: (2 × 3) × (a × b) = 6ab. Different letters remain separate factors.','Application'),
 ('Simplify a + a.','2a',['a²','a','2'],'Two copies of a add to 2a. This is addition, not a × a.','Foundation'),
 ('Simplify 2a + 3a.','5a',['6a²','5a²','6a'],'Add coefficients of like terms: (2 + 3)a = 5a. The variable part a stays unchanged.','Foundation'),
 ('Which is the simplified form of 2a + 3b?','2a + 3b',['5ab','5a','6ab'],'The letters differ, so these are unlike terms. Keep both terms with their own coefficients.','Application'),
 ('Simplify 3a² × 2a.','6a³',['5a³','6a²','6a⁴'],'There are three a factors: a × a × a. Multiply coefficients 3 × 2 = 6, giving 6a³.','Challenge'),
 ('Simplify (−2a) × (−3a).','6a²',['−6a²','−5a','6a'],'Two negative coefficients give positive 6; a × a gives a².','Challenge'),
 ('Let a = 4. What are a² and 2a, in that order?','16 and 8',['8 and 16','8 and 8','16 and 16'],'a² = a × a = 4 × 4 = 16. But 2a = 2 × 4 = 8. The exponent and coefficient have different jobs.','Application')
]:add(A,9,prompt,correct,why,level,wrong)
assert len(A['questions'])==100

for b in [S,A]:(ROOT/'assets/revision/questions'/f'{b["topicId"]}.json').write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n');print(b['topicId'],len(b['questions']),'questions')
