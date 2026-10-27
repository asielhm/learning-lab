"""Rebuild syllabus-aligned Y10 Chemistry questions. No external services are required."""
from pathlib import Path
from fractions import Fraction as F
import json
ROOT=Path(__file__).resolve().parent.parent
banks={}
def begin(topic,title,categories):
 global bank
 bank=dict(topicId=topic,title=title,categories=categories,questions=[]);banks[topic]=bank
def txt(value):
 if isinstance(value,(int,float,F)):return f'{float(value):.6g}'
 return str(value)
def q(cat,prompt,correct,wrong,why,level='Application'):
 choices=[txt(correct)]+[txt(w) for w in wrong];assert len(choices)==4 and len(set(choices))==4,(prompt,choices)
 position=len(bank['questions'])%4;choices=choices[1:position+1]+[choices[0]]+choices[position+1:]
 bank['questions'].append(dict(id=bank['topicId']+'-'+f'{len(bank["questions"])+1:03}',category=bank['categories'][cat],difficulty=level,prompt=prompt,options=choices,answer=position,explanation=why))
def rows(cat,data):
 for row in data.strip().splitlines():
  fields=[v.strip() for v in row.split('|')];assert len(fields)==7,fields
  level,prompt,answer,a,b,c,why=fields;q(cat,prompt,answer,[a,b,c],why,{'F':'Foundation','A':'Application','C':'Challenge'}[level])
def n(cat,prompt,correct,why,level='Application',wrong=()):
 c=F(str(correct)).limit_denominator(1000000);candidates=list(wrong)+[c*2,c/2,c*10,c/10,c+1,c+2,c+3];distinct=[]
 for v in candidates:
  if txt(v)!=txt(c) and txt(v) not in [txt(w) for w in distinct]:distinct.append(v)
 q(cat,prompt,correct,distinct[:3],why,level)

begin('y10-acids-bases','Acids and Bases',['Indicators and pH','Strength and ionisation','Concentration dilution and ppm','Neutralisation and salts','Acids with metals and carbonates','Titration','Salt preparation and solubility','Everyday acid–base chemistry'])
rows(0,'''
F | At 25°C, what is the pH of neutral pure water? | 7 | 0 | 14 | 1 | At 25°C, neutral water has equal H⁺ and OH⁻ concentrations and pH 7.
F | Which solution is acidic at 25°C? | A solution of pH 3 | A solution of pH 7 | A solution of pH 10 | A solution of pH 12 | Acidic aqueous solutions have pH below the neutral value at the stated temperature.
F | Universal indicator is green in an approximately neutral solution. What is the likely pH at 25°C? | About 7 | About 1 | About 13 | Always exactly 0 | Universal indicator provides an approximate colour-based range, not a highly precise pH.
A | Why can phenolphthalein be colourless in both pH 2 and pH 7 solutions? | Both are below its visible alkaline transition range. | Both solutions must be equally concentrated. | Both solutions must be strong acids. | Phenolphthalein only detects carbon dioxide. | A single indicator cannot distinguish every pH below its transition range.
F | What colour does blue litmus paper turn in an acidic solution? | Red | Blue because acids never affect it | Green | Orange in every acid | Acids turn blue litmus red.
F | What happens to red litmus paper in an alkaline solution? | It turns blue. | It turns redder in every case. | It turns into universal indicator. | It always dissolves instantly. | Alkalis turn red litmus blue.
A | Why should a fresh sample be used when comparing indicators? | Earlier reagents could contaminate or change the sample. | Every indicator needs a different chemical identity of sample. | Indicators cannot be used on solutions. | Water is always pH 1. | Fresh portions keep the comparison fair and avoid mixing indicator reagents.
A | What can red-cabbage extract normally tell you? | An approximate acid–base range from its colour | An exact molar concentration for every acid | Whether every solute is a metal | The exact number of molecules in a beaker | Natural indicator colours depend on preparation and conditions and are approximate.
C | Two indicators give different colours in the same unchanged sample. Which explanation is best? | They have different transition ranges and colours. | The sample must have two different pH values at once. | One colour proves the sample has no ions. | The indicators must have identical chemistry. | Each indicator responds differently over its own pH interval.
C | If [H⁺] increases tenfold in an ideal dilute solution, what happens to pH? | It decreases by 1. | It increases by 1. | It doubles. | It must become 7. | pH = −log₁₀[H⁺], so a tenfold increase lowers pH by one unit.
''')
rows(1,'''
F | What does a strong acid do in a dilute aqueous solution? | It ionises essentially completely. | It must have a high concentration. | It cannot be diluted. | It contains no hydrogen. | Strength describes the extent of ionisation, not the amount per volume.
F | What does a weak acid establish in water? | An equilibrium with only partial ionisation | No ions under any conditions | Complete ionisation by definition | A permanent precipitate in every solution | Weak acids partially ionise and have an equilibrium between acid and ions.
F | Which statement correctly defines concentration? | Amount of solute per solution volume | Fraction of acid molecules ionised only | Reactivity of every metal | Colour of any indicator | Concentration is an amount-to-volume ratio.
A | Equal-concentration HCl and ethanoic acid solutions are compared at 25°C. Which normally has the lower pH? | HCl | Ethanoic acid | Both must have pH 7 | pH cannot differ at equal concentration | HCl ionises more completely, giving a higher H⁺ concentration under this comparison.
A | What changes when a solution of HCl is diluted with water? | Its concentration falls while HCl remains a strong acid. | HCl becomes ethanoic acid. | Its amount of HCl increases. | Strong means it cannot be diluted. | Dilution changes amount per volume, not the intrinsic acid identity or strength.
A | Why is a comparison of pH alone insufficient to rank acid strength without other information? | Concentration also affects pH. | pH measures only mass. | All acids have identical pH. | Weak acids never contain H⁺. | Control concentration and conditions when comparing ionisation strength.
A | Which is a weak base in water? | Ammonia | Sodium hydroxide as a strong-base comparison | Hydrochloric acid | Sodium chloride as a neutral-salt comparison | Ammonia reacts partially with water to form NH₄⁺ and OH⁻.
C | Which equation correctly represents ethanoic acid ionisation? | CH₃COOH ⇌ H⁺ + CH₃COO⁻ | CH₃COOH → Na⁺ + Cl⁻ | CH₃COOH → CO₂ + H₂ | CH₃COOH ⇌ CH₄ + O₂ | The reversible arrow represents partial ionisation equilibrium.
C | Why may a strong electrolyte conduct better than a weak electrolyte at equal analytical concentration? | It generally provides more mobile ions. | Its ions are always stationary. | The word strong guarantees a larger beaker. | It has no charged particles. | Ion concentration matters, though ion mobility and temperature also affect conductivity.
C | Which statement can be true? | A weak acid can be concentrated and a strong acid dilute. | Every weak acid is dilute by definition. | Every strong acid is concentrated by definition. | Dilution changes all strong acids into weak acids. | Strength and concentration describe different properties.
''')
for amount,volume in [(F(1,50),F(1,5)),(F(3,100),F(3,10)),(F(1,40),F(1,2)),(F(1,10),2)]:n(2,f'{txt(amount)} mol of solute is in {txt(volume)} L of solution. What is its concentration in mol/L?',amount/volume,'Use c = n/V with volume in litres.','Foundation')
for mass,vol in [(60,2),(20,4),(150,3)]:n(2,f'A dilute water-based solution has {mass} mg of solute in {vol} L. Assuming density about 1 kg/L, what is its approximate ppm by mass?',F(mass,vol),'mg/L is approximately ppm by mass for this dilute aqueous density assumption.','Application')
n(2,'A 0.200 mol/L solution is diluted from 50.0 mL to 200.0 mL without losing solute. What is the final concentration in mol/L?',F(1,20),'c₁V₁ = c₂V₂: 0.200 × 50.0 / 200.0 = 0.0500 mol/L.','Application')
n(2,'A solution contains 80 mg of solute in 2 L. Add 2 L of water. What is its final mass concentration in mg/L?',20,'The same 80 mg is now in 4 L, giving 20 mg/L.','Application')
q(2,'Which extra information is needed to convert a mass concentration to molar concentration?','The solute molar mass',['The indicator colour only','The beaker shape','The word strong alone'],'Divide mass concentration in g/L by molar mass in g/mol.','Challenge')
rows(3,'''
F | What are the products of an acid reacting with an alkali? | A salt and water | A metal and oxygen | Only hydrogen | Only carbon dioxide | Neutralisation between acid and alkali forms salt and water.
F | What salt forms from hydrochloric acid and sodium hydroxide? | Sodium chloride | Sodium sulfate | Sodium nitrate | Calcium chloride | Hydrochloric acid supplies chloride and sodium hydroxide supplies sodium ions.
F | What salt forms from nitric acid and potassium hydroxide? | Potassium nitrate | Potassium chloride | Potassium sulfate | Sodium nitrate | Nitric acid forms nitrates; potassium is the cation.
A | What is the formula of the salt from sulfuric acid and potassium hydroxide? | K₂SO₄ | KSO₄ | K₂SO₃ | KNO₃ | Two K⁺ balance one SO₄²⁻; the full equation uses 2KOH.
F | Which net ionic equation describes strong-acid / strong-alkali neutralisation? | H⁺ + OH⁻ → H₂O | Na⁺ + Cl⁻ → H₂ | H₂O → H⁺ + 2e⁻ | CO₂ + O₂ → H₂O | H⁺ and OH⁻ combine to form water; spectator ions are omitted.
A | In HCl + NaOH → NaCl + H₂O, which ions are spectators? | Na⁺ and Cl⁻ | H⁺ and OH⁻ | Only H⁺ | Only OH⁻ | Sodium and chloride remain aqueous and unchanged in the net ionic equation.
A | Does mixing equal acid and alkali volumes always give equivalence? | No; concentration and stoichiometry also matter. | Yes, regardless of concentration. | Yes, because every acid has one proton. | No acid can react with an alkali. | Equal amounts of reacting H⁺ and OH⁻, not equal volumes alone, determine equivalence.
C | At 25°C, what is the ideal pH at equivalence for HCl and NaOH? | 7 | Always 1 | Always 14 | Always 10 | A strong acid and strong base form a neutral salt solution in this ideal comparison.
A | Which describes the thermal effect of acid–alkali neutralisation? | It is generally exothermic. | It always freezes the mixture. | It never transfers energy. | It creates electrical charge from nothing. | Formation of water from H⁺ and OH⁻ releases heat in the usual dilute strong-acid/base reaction.
C | How many moles of NaOH are needed to neutralise 1 mol of H₂SO₄ completely? | 2 | 1 | 0.5 | 4 | H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O.
''')
rows(4,'''
F | Which gas is produced by magnesium and dilute HCl? | Hydrogen | Oxygen | Carbon dioxide | Nitrogen | Mg + 2HCl → MgCl₂ + H₂.
F | Which gas is produced by calcium carbonate and dilute HCl? | Carbon dioxide | Hydrogen | Chlorine | Oxygen | Carbonates react with acids to form salt, CO₂ and water.
F | Which test identifies carbon dioxide? | It turns limewater milky. | It relights a glowing splint. | It always turns litmus blue. | It gives the characteristic hydrogen pop. | CO₂ reacts with limewater to form a calcium carbonate precipitate.
F | Which test identifies hydrogen? | A burning splint gives a pop. | A glowing splint relights. | It turns anhydrous CuSO₄ blue. | It turns limewater milky. | The pop is a small hydrogen combustion test.
A | Which metal does not release H₂ from dilute non-oxidising HCl in this list? | Copper | Magnesium | Zinc | Iron | Copper lies below hydrogen in the relevant school reactivity comparison.
A | What salt normally forms from iron and dilute HCl? | Iron(II) chloride | Iron(III) chloride only | Iron sulfate | Iron nitrate | Fe + 2HCl → FeCl₂ + H₂ under these conditions.
A | Which balanced equation is correct for Mg and HCl? | Mg + 2HCl → MgCl₂ + H₂ | Mg + HCl → MgCl₂ + H | Mg₂ + HCl → MgCl + H₂ | Mg + 2HCl → MgCl + H₂O | Balance two Cl and two H atoms with 2HCl.
A | What products are expected from an acid and a carbonate? | Salt, water and carbon dioxide | Salt and hydrogen only | Metal and oxygen only | Alkene and water | The carbonate ion is converted into CO₂ and water by acid.
C | Equal masses of Mg and Zn react fully with excess acid. Why can their H₂ amounts differ? | Equal masses are not equal amounts in moles. | The gas must always have different identities. | Mg and Zn have the same molar mass. | Every metal produces oxygen. | Different molar masses mean different moles of metal for the same mass.
C | Which condition is important when comparing metal reaction rates? | Keep temperature, concentration and surface-area conditions comparable. | Use any different acid and any temperature. | Measure only the metal colour. | Assume surface coatings never matter. | A fair rate comparison controls the factors that affect reaction speed.
''')
for acidml,baseml,basec in [(25,20,F(1,10)),(20,15,F(1,10)),(25,30,F(1,10)),(10,12,F(1,5))]:n(5,f'A monoprotic acid sample of {acidml}.0 mL neutralises {baseml}.0 mL of {txt(basec)} mol/L NaOH. What is the acid concentration in mol/L?',basec*baseml/acidml,'Use the 1:1 mole ratio: c(acid) = c(base) × V(base) / V(acid).','Application')
rows(5,'''
F | What does a burette measure in a titration? | The volume of solution delivered | The exact acid identity automatically | The solute mass directly | Only the room temperature | Delivered volume is the final reading minus the initial reading.
A | Why use smaller additions near a titration endpoint? | A small volume change can cause a large pH change there. | The acid stops having any ions. | The burette stops measuring volume. | The indicator becomes a catalyst for gas production. | Add dropwise near the endpoint to avoid excess titrant.
A | What indicates the chosen phenolphthalein endpoint for diluted vinegar and NaOH? | A faint persistent pink | An intense permanent dark pink as the target | A blue precipitate | A glowing splint relighting | Faint pink marks entry into the indicator transition; deep pink often means overshooting.
C | Why can a weak-acid / strong-base equivalence point be above pH 7? | The conjugate base reacts with water to produce some OH⁻. | Every equivalence point is above 14. | Na⁺ alone creates all the OH⁻. | All acids are neutral before titration. | Ethanoate hydrolysis makes the equivalence mixture alkaline.
C | Why are repeat concordant titres useful? | They support precision and help identify inconsistent trials. | They prove the exact true value without any systematic error. | They remove the need for correct apparatus. | They change the acid strength. | Agreement improves confidence in repeatability, though systematic errors can remain.
''')
n(5,'A titration finds 0.0800 mol/L in a vinegar sample that was diluted by a factor of 10. What was the original concentration in mol/L?',F(4,5),'Multiply the diluted concentration by 10: 0.800 mol/L.','Challenge')
rows(6,'''
F | After adding excess CuO to dilute sulfuric acid, why filter? | To remove unreacted insoluble CuO | To remove dissolved copper sulfate ions | To remove every water molecule | To turn the salt into a gas | The desired salt is dissolved; excess solid is the residue.
A | How do you recover crystals from the copper sulfate filtrate? | Concentrate gently, then allow it to cool. | Add all the insoluble residue back. | Filter the dissolved ions out with ordinary filter paper. | Assume crystals must form without a concentration change. | Cooling a sufficiently concentrated solution can form crystals.
A | Why is adding excess insoluble base useful? | It uses up the acid and the excess can be filtered away. | It guarantees the final product contains excess dissolved acid. | It removes all spectator ions by itself. | It converts every salt into an insoluble solid. | Choose a reactant whose unreacted excess is separable.
F | What is the formula of Epsom salt? | MgSO₄·7H₂O | MgSO₄ | MgCl₂·7H₂O | Na₂SO₄·5H₂O | Epsom salt is magnesium sulfate heptahydrate.
F | Which family of salts is generally soluble in water? | Nitrates | Every carbonate without exception | Every silver halide without exception | Every barium salt without exception | Common nitrates are soluble; other families have important exceptions.
A | Which pair of aqueous ions forms an insoluble silver chloride precipitate? | Ag⁺ and Cl⁻ | Na⁺ and NO₃⁻ | K⁺ and NO₃⁻ | NH₄⁺ and NO₃⁻ | Ag⁺ + Cl⁻ → AgCl(s).
A | Which equation represents a barium sulfate precipitate? | Ba²⁺ + SO₄²⁻ → BaSO₄(s) | Ba²⁺ + Cl⁻ → BaCl(s) | Na⁺ + NO₃⁻ → NaNO₃(s) | Ba → Ba²⁺ + H₂ | Barium sulfate is an important insoluble sulfate exception.
A | After filtering a precipitate, why wash it with distilled water? | To remove soluble impurities from the solid | To dissolve every precipitate completely by definition | To add tap-water ions intentionally | To make new metal atoms | Washing removes solution containing soluble spectator ions.
C | Which method suits an insoluble salt? | Mix soluble ion sources, then filter, wash and dry the precipitate. | Always use titration followed by complete evaporation. | Filter the ions before mixing. | Distil the solid into the filter paper. | Precipitation makes the insoluble product directly as a filterable solid.
C | Where do the waters in a hydrated crystal come from? | Water incorporated from the crystallising solution | Oxygen atoms created from nothing | The filter paper turning into hydrogen | Only the metal oxide lattice | Water of crystallisation becomes part of the crystal structure during crystallisation.
''')
rows(7,'''
F | What makes an acid–bicarbonate bath-bomb mixture fizz when wet? | Carbon dioxide is released. | Oxygen is split from water by a battery. | Hydrogen forms from every salt. | Nitrogen is made from soap. | Acid reacts with hydrogencarbonate to form CO₂ and water.
F | Why can baking powder release CO₂ when water is added? | It contains bicarbonate and suitable acid salts. | It is pure sodium chloride. | All powders are acids. | It contains metallic sodium. | Water lets the acid and bicarbonate partners react.
A | What is cream of tartar? | An acid salt, potassium hydrogen tartrate | Sodium hydroxide | Pure sodium bicarbonate | A neutral metal alloy | It can supply the acid partner in a raising mixture.
A | Why does bicarbonate plus water alone not show the same room-temperature acid fizz? | The required acid partner is missing. | Water always supplies unlimited strong acid. | Bicarbonate contains no atoms. | Bicarbonate must always release hydrogen. | Strong heating can cause a different decomposition, but that is not this unheated comparison.
A | What is a common soap chemically? | A sodium or potassium salt of a long-chain fatty acid | A pure alkane only | An insoluble metal oxide only | Pure hydrochloric acid | Soap ions contain a hydrophilic head and hydrophobic tail.
A | How does soap help disperse oil in water? | It stabilises oil droplets with water-attracting heads facing outward. | It changes oil molecules into water molecules. | It makes every oil molecularly soluble without interfaces. | It removes all electrical charge from water. | Soap supports emulsification rather than converting oil into water.
C | What is saponification of a fat in this context? | Alkaline hydrolysis forming glycerol and fatty-acid salts | Fractional distillation of crude oil | Addition polymerisation of ethene | Oxidation of sodium chloride | A fat is an ester; alkaline hydrolysis gives soap salts and glycerol.
A | Which net ionic equation describes acid reacting with hydrogencarbonate? | H⁺ + HCO₃⁻ → CO₂ + H₂O | H⁺ + Cl⁻ → H₂ | CO₂ + H₂O → Na | Na⁺ + OH⁻ → O₂ | Atoms and charge balance in acid-driven carbon dioxide release.
C | Why can two bath-bomb formulations fizz at different rates? | Particle size, ingredient proportions and conditions affect the rate. | Every mixture must have the same rate. | Rate is determined by the colour of the bowl alone. | More foam always proves more moles of acid. | Qualitative appearance is not by itself a quantitative amount or rate measurement.
C | Which statement about a soap emulsion is correct? | Oil is dispersed in droplets; it has not become a true molecular solution. | Oil atoms have disappeared. | All water molecules become soap ions. | A permanent emulsion must be an element. | Emulsification stabilises a dispersed phase at oil–water interfaces.
''')
begin('y10-metals','Metals',['Atoms elements and compounds','Metallic bonding and properties','Group properties and trends','Ionic formulas','Reactivity and acids','Displacement reactions','Extraction','Alloys and uses'])
rows(0,'''
F | What defines an element? | Only one type of atom | Only one atom in the entire sample | Any mixture with one colour | Any substance containing two types of atom | An element is defined by atomic type, not sample size or colour.
F | Which is a compound? | Water, H₂O | Copper, Cu | Oxygen, O₂ | Sulfur, S₈ | Water has different elements chemically bonded in a fixed composition.
F | Which is a molecular element? | O₂ | NaCl | H₂O | CuSO₄ | O₂ contains only oxygen atoms in discrete molecules.
A | Why is solid NaCl not described as separate NaCl molecules? | It is an extended ionic lattice. | It contains no atoms or ions. | Its composition changes continuously. | All solids are metals. | NaCl describes the ratio of Na⁺ and Cl⁻ ions in the lattice.
F | What is copper metal made of structurally? | An extended metallic structure | Separate Cu₂ molecules in ordinary bulk copper | Water molecules with a copper colour | Only Cu²⁺ ions with no electrons | Metallic bonding involves positive metal centres and delocalised electrons.
A | Which sample is a mixture? | Brass | Pure water | Pure sodium chloride | Pure oxygen | Brass is an alloy mixture of copper and zinc, not a fixed-formula compound.
A | What distinguishes a compound from a mixture? | Its elements are chemically combined in fixed proportions. | It can contain only one element. | It must always be a gas. | It is separated by ordinary filtration into its elements. | Compounds have defined chemical composition; mixtures have variable composition.
A | Graphite is best described as… | an element with a giant covalent layered structure. | a molecular compound of carbon and oxygen. | a metal because it conducts. | a mixture of carbon and sodium. | Graphite contains carbon only, in extended covalent layers.
C | Which statement about molecules is correct? | Some elements are molecular and some compounds are molecular. | Every compound consists of discrete molecules. | Every element is monatomic in every state. | Molecule and mixture mean the same thing. | O₂ is a molecular element and H₂O a molecular compound, unlike metallic Cu and ionic NaCl.
C | What changes when a physical mixture is made? | Substances are combined without necessarily forming new chemical bonds between components. | Every component must become a new element. | Atomic numbers change. | The mixture must acquire a fixed molecular formula. | Physical mixing does not by itself create a fixed-ratio compound.
''')
rows(1,'''
F | What carries electrical charge through a solid metal? | Delocalised electrons | Free-moving positive metal ions through the solid | Neutral molecules only | Stationary protons leaving nuclei | Delocalised electrons are mobile; the metal ions occupy the lattice.
F | What holds a metallic structure together? | Attraction between positive metal centres and delocalised electrons | Attraction between neutral gas bubbles | Covalent bonds only between pairs of isolated metal molecules | Gravity alone | Electrostatic metallic bonding extends throughout the structure.
A | Why can many metals be bent without shattering? | Layers can move while metallic bonding remains. | Every bond is permanently removed. | Metal atoms turn into water. | All ions become neutral molecules. | Metallic bonding can persist as layers or dislocations move.
F | Which is a conducting non-metal? | Graphite | Sulfur as a solid | Diamond in the ordinary insulating comparison | Dry solid sodium chloride | Graphite has delocalised electrons within its layers.
A | Why does solid NaCl not conduct by ion movement? | Its ions are held in fixed lattice positions. | It has no charged particles. | It has only free electrons. | It is a molecular gas. | It contains ions, but they are not mobile in the solid.
A | Why can molten NaCl conduct? | Its ions are mobile. | Its nuclei become electrons. | It stops containing ions. | It becomes a metal alloy. | Mobile ions carry charge through the melt.
A | Which property helps make copper suitable for wires? | Electrical conductivity and ductility | Brittleness and electrical insulation | A tendency to dissolve in cold pure water instantly | Being a molecular gas at room temperature | Copper conducts and can be drawn into thin wires.
A | Why is conduction alone not enough to classify a sample as a metal? | Some non-metals such as graphite also conduct. | Every non-metal conducts perfectly. | Metals never conduct. | Conduction proves the sample is an ionic compound. | Use several properties and structural evidence rather than a single observation.
C | In a solid metal connected to a battery, which description is best? | Electrons drift while the lattice ions remain near their positions. | The entire positive-ion lattice flows down the wire. | All atoms move at light speed. | The wire must melt before any charge moves. | Conduction is distinct from bulk movement of the lattice.
C | Which statement about metal properties is most accurate? | Common trends have exceptions, so test and specify the material. | Every metal has exactly the same melting point. | Every shiny solid must be a metal. | Every metal is magnetic. | Properties vary; for example, only some metals show strong ferromagnetism.
''')
rows(2,'''
F | What products form when sodium reacts with water? | Sodium hydroxide and hydrogen | Sodium chloride and oxygen | Sodium oxide and carbon dioxide only | Sodium nitrate and nitrogen | 2Na + 2H₂O → 2NaOH + H₂.
F | How does reactivity generally change down Group 1? | It increases. | It decreases. | Every element becomes a halogen. | It is exactly zero for all members. | The outer electron is farther from the nucleus and more shielded.
A | Why is potassium generally more reactive with water than lithium? | Its outer electron is lost more readily. | Potassium has no electrons. | Lithium gains two electrons more readily. | Potassium is a non-metal gas. | Increased shielding and distance make electron loss easier down Group 1.
F | How does halogen reactivity generally change down Group 17? | It decreases. | It increases like Group 1. | It is identical for all members. | Halogens stop forming molecules. | Attraction for an incoming electron weakens down the group.
A | Which reaction is expected? | Chlorine displaces bromine from bromide. | Iodine displaces chlorine from chloride. | Bromine displaces chlorine from chloride. | Every halogen displaces itself. | Chlorine is more reactive than bromine and iodine.
A | Which is a typical transition-element feature? | Variable oxidation states in many compounds | Only +1 ions in every case | Violent cold-water reaction in every case | Never forming coloured compounds | Many transition elements show variable oxidation states.
F | Which halogen is a red-brown liquid at ordinary room temperature? | Bromine | Chlorine | Iodine | Fluorine | Bromine is liquid; chlorine and fluorine are gases and iodine is a solid at ordinary room temperature.
A | Which statement about transition-metal catalysts is correct? | Many transition elements or their compounds can act as catalysts. | Every metal catalyses every reaction. | A catalyst must be used up in the overall reaction. | Catalysts change the identities of elements. | Catalysts provide alternative pathways and are regenerated overall; their effects are reaction-specific.
C | Why do Group 1 and halogen reactivity trends run in opposite directions? | Group 1 reactions involve electron loss, while halogen reactions involve electron gain. | Both groups have exactly the same electron-transfer role. | Neither trend involves electrons. | Every atom gains and loses all its electrons at once. | Shielding and distance affect electron loss and gain differently.
C | Which conclusion is justified by no iodine displacement from bromide? | Iodine is less reactive than bromine in this comparison. | Iodine is a metal. | Bromide contains no electrons. | All halogen displacement reactions are impossible. | A less reactive halogen cannot oxidise the halide of a more reactive one under the stated comparison.
''')
for name,formula,wrong,why in [
 ('magnesium chloride','MgCl₂',['MgCl','Mg₂Cl','MgCl₃'],'Mg²⁺ needs two Cl⁻.'),
 ('aluminium oxide','Al₂O₃',['AlO','Al₃O₂','AlO₂'],'Two Al³⁺ balance three O²⁻.'),
 ('calcium nitrate','Ca(NO₃)₂',['CaNO₃','Ca₂NO₃','Ca(NO₂)₂'],'Ca²⁺ needs two NO₃⁻ ions, kept together in brackets.'),
 ('sodium sulfate','Na₂SO₄',['NaSO₄','Na₂SO₃','Na(SO₄)₂'],'Two Na⁺ balance SO₄²⁻.'),
 ('iron(II) chloride','FeCl₂',['FeCl₃','Fe₂Cl','FeCl'],'Iron(II) means Fe²⁺, requiring two Cl⁻.'),
 ('iron(III) oxide','Fe₂O₃',['FeO','Fe₃O₂','FeO₂'],'Two Fe³⁺ balance three O²⁻.'),
 ('copper(II) hydroxide','Cu(OH)₂',['CuOH','Cu₂OH','CuO₂H'],'Two OH⁻ groups balance Cu²⁺.'),
 ('potassium carbonate','K₂CO₃',['KCO₃','K₂CO₂','K(CO₃)₂'],'Two K⁺ balance CO₃²⁻.'),
 ('ammonium sulfate','(NH₄)₂SO₄',['NH₄SO₄','(NH₄)SO₃','NH₄(SO₄)₂'],'Two NH₄⁺ balance SO₄²⁻.'),
 ('magnesium nitride','Mg₃N₂',['MgN','Mg₂N₃','MgN₂'],'Three Mg²⁺ balance two N³⁻.')]:q(3,f'What is the neutral formula of {name}?',formula,wrong,why,'Challenge' if 'nitrate' in name or 'ammonium' in name or 'nitride' in name else 'Application')
rows(4,'''
F | Which metal is most reactive in Mg, Zn, Fe and Cu? | Magnesium | Zinc | Iron | Copper | The simplified order is Mg > Zn > Fe > Cu.
F | Which metal lies below hydrogen in this list? | Copper | Magnesium | Zinc | Iron | Copper does not release H₂ from dilute non-oxidising HCl.
A | What gas forms when zinc reacts with excess dilute HCl? | H₂ | O₂ | CO₂ | Cl₂ | Zn + 2HCl → ZnCl₂ + H₂.
A | Which equation represents iron with dilute HCl? | Fe + 2HCl → FeCl₂ + H₂ | Fe + 3HCl → FeCl₃ + H₃ | Fe + HCl → FeO + Cl₂ | Fe + HCl → FeSO₄ + H₂ | Iron(II) chloride is the salt in this comparison.
A | Why can an aluminium sample react more slowly than its position suggests? | A protective surface oxide can impede the reaction. | Aluminium is always below copper in the series. | It has no tendency to form ions. | Reaction rate never depends on the surface. | Passivation can mask the reactivity of the underlying metal.
F | Which comparison marker in the school reactivity series is not a metal? | Carbon | Zinc | Iron | Copper | Carbon is included as an extraction comparison marker; hydrogen is another non-metal marker.
A | What should be controlled in a fair metal–acid rate comparison? | Acid concentration, temperature and surface-area conditions | Only the colour of the test-tube rack | None of the conditions | The metal symbol alone | These variables influence observed reaction speed.
C | Equal masses of magnesium and zinc produce different final H₂ volumes with excess acid. What must you consider? | Their different molar masses | Only which metal is shinier | That one gas is necessarily oxygen | That equal mass always means equal moles | Compare moles and stoichiometry when interpreting total gas amount.
A | What is the main chemical tendency represented by a metal reactivity comparison? | Tendency to lose electrons and form positive ions under the comparison | Tendency to gain protons into the nucleus | The exact rate in every possible experiment | Alphabetical order of element symbols | Reactivity is connected to oxidation tendency; conditions still matter.
C | Why is dilute nitric acid not interchangeable with dilute HCl for every “metal + acid gives H₂” prediction? | Nitric acid is an oxidising acid and can give different reduction products. | Every acid has identical chemistry. | Nitric acid contains no ions. | Hydrogen is always the only possible gas from every acid. | The simple hydrogen prediction is for appropriate non-oxidising acid conditions.
''')
for metal,ion,yes in [('Mg','Cu',True),('Zn','Cu',True),('Fe','Cu',True),('Cu','Zn',False),('Zn','Mg',False),('Mg','Zn',True)]:
 q(5,f'A clean {metal} strip is placed in an aqueous solution containing {ion}²⁺ ions. What does the simplified reactivity model predict?',f'{metal} is oxidised and {ion} metal deposits.' if yes else 'No net metal displacement.',(['No net metal displacement.'] if yes else [f'{ion} metal must deposit spontaneously.'])+['Sulfate or another spectator anion becomes the metal.','All ions disappear without products.'],f'The comparison is Mg > Zn > Fe > Cu. {metal} is '+('more reactive, so displacement is predicted.' if yes else 'not more reactive than the dissolved metal.'),'Application')
rows(5,'''
F | In Zn + Cu²⁺ → Zn²⁺ + Cu, which species gains electrons? | Cu²⁺ | Zn | Zn²⁺ after it forms | Every species loses electrons | Cu²⁺ + 2e⁻ → Cu is reduction.
A | What role do sulfate ions play when zinc displaces copper from CuSO₄? | Spectator ions | They are reduced to copper metal. | They are the only electron donors. | They become hydrogen gas. | Sulfate remains aqueous and unchanged in the simplified ionic reaction.
A | Why does a copper coating appear on iron in CuSO₄? | Cu²⁺ gains electrons from the oxidised iron. | Copper atoms are created from sulfate. | Iron changes its atomic number to copper. | The beaker supplies new copper nuclei. | Iron is oxidised and dissolved copper ions are reduced.
C | Can a copper strip displace copper from its own Cu²⁺ solution as a net reaction? | No; there is no net displacement of itself. | Yes; it must double the copper amount. | Yes; all Cu²⁺ must become zinc. | Yes; sulfate becomes gold. | The same metal/ion pair does not give the proposed net competition reaction.
''')
rows(6,'''
F | Which reducing gas is central to the blast-furnace reduction of iron oxide? | Carbon monoxide | Oxygen only | Nitrogen only | Chlorine | CO removes oxygen from iron oxides.
A | Which equation is balanced for iron(III) oxide reduction by CO? | Fe₂O₃ + 3CO → 2Fe + 3CO₂ | Fe₂O₃ + CO → Fe + CO₂ | FeO + CO₂ → Fe₂O₃ | Fe₂O₃ → Fe + O₂ | Three CO molecules accept the three oxygen atoms from Fe₂O₃.
F | Why can carbon be used to extract some metals from oxides? | It can remove oxygen from oxides of less reactive metals under suitable conditions. | It is more reactive than every metal. | It turns into every extracted metal. | It eliminates the need for energy. | The reactivity comparison helps identify suitable reduction routes.
A | Why is aluminium not normally extracted by carbon reduction? | Aluminium oxide is too stable for that route in the usual school comparison. | Aluminium is below copper. | Aluminium contains no electrons. | Carbon reduction works equally for every oxide. | Aluminium is above carbon in the reactivity series.
F | What is the usual industrial route to aluminium? | Electrolysis of alumina dissolved in molten cryolite | Filtering aluminium oxide from water to obtain metal | Distilling the oxide at room temperature | Adding dilute HCl to turn the oxide into metal | Electrical energy drives reduction of Al³⁺ in the molten electrolyte.
A | What is limestone used for in a blast furnace? | Producing CaO to remove silica as slag | Providing all the iron atoms | Acting as the only reducing metal | Making the furnace cold | CaCO₃ decomposes; CaO reacts with SiO₂ to form calcium silicate slag.
A | Which slag-forming equation is correct? | CaO + SiO₂ → CaSiO₃ | CaO + Fe → CaFe | CaCO₃ → Cu + O₂ | SiO₂ + H₂O → Fe | Basic calcium oxide reacts with acidic silica.
A | In CuO reduction by carbon, what happens to copper? | Copper is reduced from +2 to 0. | Copper is oxidised from 0 to +2. | Copper changes into carbon atoms. | Copper remains oxide while only its colour changes. | Oxygen removal corresponds to reduction of the metal ion.
C | Why might an extraction route that is chemically possible still not be chosen industrially? | Energy, cost, ore composition and environmental factors also matter. | Every possible route costs the same. | Only the element name matters. | Industrial extraction never uses electricity. | Practical process selection goes beyond chemical feasibility alone.
C | What is oxidised in Fe₂O₃ + 3CO → 2Fe + 3CO₂? | Carbon in CO | Iron in Fe₂O₃ | Oxygen from −2 to −2 | Both iron and carbon are reduced | Carbon goes from +2 in CO to +4 in CO₂, while iron is reduced.
''')
rows(7,'''
F | What is an alloy? | A mixture containing at least one metal | A pure element with a fixed atomic number only | Always a fixed-ratio compound | Always a gas | Alloys are metallic mixtures whose compositions can vary.
F | What are the principal components of brass? | Copper and zinc | Copper and tin | Iron and carbon only | Aluminium and oxygen | Brass is a copper–zinc alloy.
F | What are the principal components of bronze? | Copper and tin | Copper and zinc | Sodium and chlorine | Iron and sulfur only | Bronze is a copper–tin alloy in this standard comparison.
F | What is the base metal in carbon steel? | Iron | Copper | Sodium | Tin | Carbon steel is mainly iron with a small amount of carbon.
A | Why can adding a different-sized atom make a metal harder? | It can hinder layer or dislocation motion. | It removes every metallic bond. | It creates a molecular gas. | It makes all atoms identical in size. | Distortion can impede deformation.
A | Why is stainless steel resistant to corrosion? | Chromium supports a protective oxide film. | It has no metal atoms. | It cannot react under any conditions. | It is made entirely of copper. | A chromium-rich passive film protects the surface; conditions still matter.
A | Why might an alloy be chosen instead of a pure metal? | Its combination of properties may better suit the use. | Every alloy is always cheaper and better in every way. | Alloys never conduct at all. | Alloys have no composition. | Hardness, corrosion resistance, conductivity and processability involve trade-offs.
A | Which statement about alloy composition is correct? | Its composition can vary and affect its properties. | It must always have a single fixed formula. | It can contain no non-metal. | The proportions never matter. | Steel can contain carbon; alloy composition and processing are important.
C | Why is pure copper often preferred to brass for electrical wiring? | It generally has higher electrical conductivity and good ductility. | Brass is not a material. | Copper is an electrical insulator. | Brass has no electrons. | Alloying commonly trades some conductivity for other useful properties.
C | Does the simple distorted-lattice picture predict every alloy property quantitatively? | No; composition, phases and processing also influence properties. | Yes; any drawing gives an exact strength. | Yes; all alloys have identical hardness. | No alloy contains a crystal structure. | The model explains a mechanism but is not a complete material-performance calculation.
''')
begin('y10-redox','Redox',['Oxidation reduction and agents','Half-equations and oxidation states','Electrolytes and electrode rules','Molten electrolysis','Aqueous electrolysis','Water electrolysis and gas tests','Aluminium electrolysis','Photography and thermite'])
rows(0,'''
F | Oxidation in electron-transfer terms is… | loss of electrons. | gain of electrons. | gain of neutrons in every reaction. | a change of state only. | Oxidation means electron loss.
F | Reduction in electron-transfer terms is… | gain of electrons. | loss of electrons. | always oxygen gain. | evaporation. | Reduction means electron gain.
F | In Zn → Zn²⁺ + 2e⁻, zinc is… | oxidised. | reduced. | unchanged in oxidation state. | converted into copper nuclei. | Zinc loses two electrons.
F | In Cu²⁺ + 2e⁻ → Cu, the copper ion is… | reduced. | oxidised. | the electron donor. | unchanged in charge. | Cu²⁺ gains two electrons to form neutral copper.
A | What does an oxidising agent do? | Accepts electrons and is itself reduced | Donates electrons and is itself reduced | Always produces oxygen gas | Never changes in the reaction | It causes another species to lose electrons by accepting them.
A | What does a reducing agent do? | Donates electrons and is itself oxidised | Accepts electrons and is itself oxidised | Always contains hydrogen only | Is always an inert spectator | It supplies the electrons gained by the reduced species.
A | In Mg + Cu²⁺ → Mg²⁺ + Cu, the reducing agent is… | Mg. | Cu²⁺. | Mg²⁺ after formation. | Water by definition. | Magnesium donates electrons and is oxidised.
A | In the same Mg / Cu²⁺ reaction, the oxidising agent is… | Cu²⁺. | Mg. | Cu after formation only. | Every spectator anion. | Cu²⁺ accepts electrons and is reduced.
C | Which oxidation-state change represents oxidation? | +2 to +3 | +3 to +2 | +2 to 0 | 0 to −2 | An increase in oxidation state is oxidation.
C | Why must oxidation and reduction be paired in a complete redox process? | Electrons lost by one species are gained by another. | Electrons are created without a source. | Both species must gain all electrons. | Charge need not be conserved. | Overall electron and charge conservation requires matched loss and gain.
''')
rows(1,'''
F | Which is a balanced oxidation half-equation for magnesium? | Mg → Mg²⁺ + 2e⁻ | Mg + 2e⁻ → Mg²⁺ | Mg → Mg⁺ + 2e⁻ | Mg²⁺ → Mg + 2e⁻ | Atoms and charge balance: 0 = +2 − 2.
F | Which is a balanced reduction half-equation for Cu²⁺? | Cu²⁺ + 2e⁻ → Cu | Cu²⁺ → Cu + 2e⁻ | Cu + 2e⁻ → Cu²⁺ | Cu²⁺ + e⁻ → Cu | Two electrons neutralise the +2 charge.
A | Which is a balanced oxidation half-equation for bromide? | 2Br⁻ → Br₂ + 2e⁻ | Br⁻ → Br₂ + e⁻ | 2Br⁻ + 2e⁻ → Br₂ | Br₂ → 2Br⁻ + 2e⁻ | Two bromide ions form one Br₂ molecule and release two electrons.
A | Which half-equation produces aluminium metal? | Al³⁺ + 3e⁻ → Al | Al³⁺ → Al + 3e⁻ | Al + 3e⁻ → Al³⁺ | Al³⁺ + e⁻ → Al | Three electrons are needed per Al³⁺ ion.
F | What is the oxidation state of a pure element such as Cu(s)? | 0 | +2 in every pure element | −1 in every pure element | Equal to its mass number | An element in its uncombined form has oxidation state zero.
A | What is the oxidation state of iron in Fe₂O₃? | +3 | +2 | 0 | −3 | Three O atoms contribute −6; two Fe atoms must total +6.
A | What is the oxidation state of carbon in CO₂? | +4 | +2 | 0 | −4 | Two oxygens contribute −4, so carbon is +4.
A | What is the oxidation state of carbon in CO? | +2 | +4 | −2 | 0 | Oxygen is −2 here, so carbon is +2.
C | How many electrons must 2Al atoms lose when they become 2Al³⁺? | 6 | 2 | 3 | 4 | Each Al loses three electrons; two lose six.
C | What must be balanced in a half-equation? | Both atoms and total charge | Atoms only, never charge | Charge only, never atoms | Only the number of words | Electrons are included to balance charge while preserving atoms.
''')
rows(2,'''
F | What carries charge through an electrolyte? | Mobile ions | Electrons travelling freely through the liquid like in a wire | Stationary neutral molecules only | Protons moving between atomic nuclei | Positive and negative ions move through the electrolyte.
F | What carries charge through the external metal wires? | Electrons | Sodium ions moving through copper | Water droplets | Whole salt crystals | Metallic wires conduct through mobile electrons.
F | In an electrolytic cell, cations migrate towards the… | negative cathode. | positive anode. | salt bridge only in every setup. | flame. | Opposite charges attract; cations move towards the negative electrode.
F | In an electrolytic cell, anions migrate towards the… | positive anode. | negative cathode. | battery casing instead of the electrolyte. | neutral gas outlet only. | Negative ions move towards the positive electrode.
F | At which electrode does reduction always occur? | Cathode | Anode | Both electrodes are always oxidation sites only | Neither electrode | Cathode names the electrode where reduction occurs.
F | At which electrode does oxidation always occur? | Anode | Cathode | The beaker wall only | Neither electrode | Anode names the electrode where oxidation occurs.
A | Why can a molten ionic compound conduct while its solid may not? | Melting frees the ions to move. | Melting removes every charge. | The melt always becomes a metal. | Solid ions are not charged. | Ion mobility changes; the solid already contains ions but they are fixed in the lattice.
A | What drives a non-spontaneous electrolytic reaction? | An external electrical supply | Ordinary filtration | Only a colour change | A catalyst that supplies unlimited electrons without a circuit | Electrical energy drives the electrode reactions.
C | Is “cathode is negative” a universal rule for every electrochemical cell type? | No; cathode always means reduction, while polarity depends on cell type. | Yes; every galvanic cathode is negative too. | No; cathode always means oxidation. | Electrode names have no meaning. | Electrolytic cathodes are negative; galvanic cathodes are positive.
C | Which distinction is correct? | Ion migration moves ions through solution; discharge transfers electrons at an electrode. | Ion migration means ions become neutral halfway through the solution automatically. | Discharge is the same as filtering. | Electrons carry all electrolyte current without any ions. | Transport and electrode reaction are related but different processes.
''')
for compound,cathode,anode,why in [('NaCl','Na','Cl₂','Molten NaCl contains Na⁺ and Cl⁻, with no water competing.'),('PbBr₂','Pb','Br₂','Pb²⁺ is reduced; bromide is oxidised to Br₂.'),('MgCl₂','Mg','Cl₂','Mg²⁺ gains electrons; chloride loses electrons.'),('CaBr₂','Ca','Br₂','Ca²⁺ is reduced and bromide forms Br₂.')]:
 q(3,f'With inert electrodes, what metal forms at the cathode during electrolysis of molten {compound}?',cathode,['H₂','O₂','CO₂'],why,'Foundation')
 q(3,f'With inert electrodes, what forms at the anode during electrolysis of molten {compound}?',anode,['H₂','The metal from the salt','Water'],why,'Application')
rows(3,'''
A | Why is sodium obtained at the cathode of molten NaCl rather than hydrogen? | There is no water in the molten salt to compete. | Sodium is a gas at all temperatures. | The cathode is an oxidation site. | Chloride gains the electrons to make sodium. | Molten-salt and aqueous product rules differ because their available species differ.
C | In molten lead(II) bromide, which pair of half-equations is correct? | Pb²⁺ + 2e⁻ → Pb; 2Br⁻ → Br₂ + 2e⁻ | Pb²⁺ → Pb + 2e⁻; Br₂ + 2e⁻ → 2Br⁻ | Pb → Pb²⁺ + 2e⁻; Br⁻ → Br | Pb²⁺ + e⁻ → Pb; Br⁻ → Br₂ | Lead ions are reduced and bromide ions oxidised with two electrons balanced.
''')
rows(4,'''
F | What normally forms at the cathode in aqueous CuSO₄ with inert electrodes? | Copper | Sodium | Sulfate metal | Oxygen | Cu²⁺ can be reduced to copper under this usual aqueous comparison.
A | What normally forms at the inert anode in aqueous CuSO₄? | Oxygen | Copper | Sulfur metal only | Sodium | Water is oxidised; sulfate is not normally discharged in this school comparison.
A | With copper electrodes in CuSO₄, what happens at the anode? | Copper dissolves as Cu²⁺. | Copper plates out at the anode. | Sulfate becomes copper. | The anode must release chlorine. | Cu → Cu²⁺ + 2e⁻ is anode oxidation.
A | Why can Cu²⁺ concentration remain approximately constant with copper electrodes? | Copper ions are replenished at the dissolving anode as they are removed at the cathode. | No electrons pass. | Every sulfate ion becomes a copper ion. | All ions stay stationary. | Ideal transfer balances copper dissolution and deposition.
A | What cathode gas is expected from ordinary concentrated aqueous NaCl with inert electrodes? | Hydrogen | Sodium vapour | Chlorine | Carbon dioxide | Water is reduced in preference to Na⁺ under the ordinary aqueous conditions.
A | What anode gas is usually produced from concentrated brine with inert electrodes? | Chlorine | Hydrogen | Sodium | Nitrogen | High chloride concentration supports chlorine evolution; conditions matter.
A | What products are expected for concentrated aqueous CuCl₂ with inert electrodes in the stated model? | Copper at the cathode and chlorine at the anode | Hydrogen at both electrodes | Copper at the anode and sodium at the cathode | Sulfur and oxygen only | Cu²⁺ is reduced; chloride can be oxidised at a suitable inert anode.
C | Which information matters when predicting aqueous electrolysis products? | Ion concentrations, electrode materials and conditions | Only the beaker colour | Only the solution volume, regardless of species | Only alphabetical order of ion names | Water competition and electrode kinetics make conditions important.
C | Which equation gives hydrogen from water at an alkaline cathode? | 2H₂O + 2e⁻ → H₂ + 2OH⁻ | 2H₂O → O₂ + 4H⁺ + 4e⁻ | 2Cl⁻ → Cl₂ + 2e⁻ | Na⁺ → Na + e⁻ | Reduction of water produces hydrogen and hydroxide ions.
C | Why is “all anions in water discharge equally easily” incorrect? | Some anions remain spectators while water or another species is oxidised. | Every anion is a neutral atom. | Anions always move to the cathode in electrolysis. | Water cannot ever react at an electrode. | Product selection is not determined by migration alone.
''')
rows(5,'''
F | What is the H₂:O₂ volume ratio from acidified-water electrolysis at equal temperature and pressure? | 2:1 | 1:2 | 1:1 | 3:1 | 2H₂O → 2H₂ + O₂ gives twice as many moles of hydrogen.
F | Which electrode produces H₂ in acidified-water electrolysis? | Cathode | Anode | Both produce only oxygen | The water container wall | H⁺ or water is reduced at the cathode.
F | Which gas relights a glowing splint? | Oxygen | Hydrogen | Carbon dioxide | Chlorine | A glowing-splint test identifies oxygen.
F | Which gas gives the characteristic pop with a burning splint? | Hydrogen | Oxygen | Carbon dioxide | Nitrogen | Hydrogen burns rapidly when mixed with oxygen from air.
A | Why use a suitable electrolyte rather than relying on very pure water alone? | It provides enough mobile ions for useful conduction. | It changes oxygen atoms into hydrogen atoms. | It removes the need for electrodes. | It guarantees chloride-free water gives chlorine. | Very pure water is a poor conductor because its ion concentration is very low.
''')
for oxygen in [5,12,25]:n(5,f'Acidified-water electrolysis gives {oxygen} mL of O₂. At the same temperature and pressure, what H₂ volume is predicted in mL?',2*oxygen,'The mole and volume ratio H₂:O₂ is 2:1.','Application')
n(5,'An ideal water electrolysis gives 18 mL of H₂ and 9 mL of O₂. What is the total gas volume in mL at the same conditions?',27,'Add the two volumes measured at the same conditions: 18 + 9 = 27 mL.','Foundation')
n(5,'At 100% efficiency, 2 mol of electrons pass through an acidified-water cathode. How many moles of H₂ form?',1,'2H⁺ + 2e⁻ → H₂ requires 2 mol e⁻ per mole of hydrogen.','Challenge')
rows(6,'''
F | What is dissolved in molten cryolite for aluminium extraction? | Aluminium oxide (alumina) | Sodium chloride only | Pure aluminium metal only | Iron carbonate | Alumina supplies the aluminium-containing ions.
A | What is an important function of cryolite? | It lowers the operating temperature relative to pure alumina. | It makes electricity unnecessary. | It provides all the aluminium atoms instead of alumina. | It stops all ions moving. | Cryolite forms a conducting molten mixture at a lower temperature than pure alumina would require.
F | Where is aluminium metal formed? | At the cathode | At the carbon anode | In the external copper wire only | By filtering dry alumina | Al³⁺ gains electrons at the cathode.
A | Why are carbon anodes consumed? | Carbon reacts to form carbon oxides. | Every carbon atom becomes aluminium. | The anodes are reduced to sodium. | Aluminium deposits consume them mechanically only. | Oxidation at the carbon anode leads mainly to CO₂ in the ideal model, with real variations.
A | Which is a correct overall ideal carbon-anode equation? | 2Al₂O₃ + 3C → 4Al + 3CO₂ | Al₂O₃ + C → Al + CO₂ | Al₂O₃ → 2Al + 3C | 2Al + 3CO₂ → Al₂O₃ + C | The balanced equation conserves Al, O and C for a CO₂-only anode model.
C | Which is the net carbon-anode half-equation in the CO₂ model? | C + 2O²⁻ → CO₂ + 4e⁻ | Al³⁺ + 3e⁻ → Al | 2Cl⁻ → Cl₂ + 2e⁻ | C + 4e⁻ → C⁴⁻ | Oxide ions and carbon produce CO₂ while four electrons are released.
A | Why is the molten state essential in this cell? | The electrolyte ions must be mobile. | Every solid ionic compound conducts equally well. | Aluminium atoms must become water. | Molten means there are no ions. | Ion movement carries current through the electrolyte.
C | What does assuming 100% current efficiency mean in the mass model? | All passed charge produces the specified electrode reaction. | The electrical supply needs no energy. | All industrial cells have no losses. | Electrons have zero charge. | It is an idealisation; side reactions and inefficiencies can reduce actual yield.
''')
n(6,'How many moles of electrons are required to form 1 mol of Al from Al³⁺?',3,'Al³⁺ + 3e⁻ → Al.','Application')
n(6,'At 100% efficiency, 6 mol of electrons reduce Al³⁺. Using 27 g/mol, what mass of Al forms in grams?',54,'6/3 = 2 mol Al; 2 × 27 = 54 g.','Challenge')
rows(7,'''
F | In silver-halide photography, what forms the dark developed image? | Metallic silver | Pure sodium chloride | Oxygen gas | Copper sulfate crystals | Development reduces silver ions to visible silver metal.
A | What is the role of the developing agent? | It reduces exposed silver-halide grains and is itself oxidised. | It supplies new silver nuclei from carbon. | It oxidises all silver metal to erase the image. | It only dries the film. | The developer supplies reducing action that amplifies the latent image.
A | What does photographic fixer remove? | Remaining unexposed silver halide | All the developed metallic silver in a normal successful process | Every atom of the support film | Only water vapour | Fixing removes light-sensitive unexposed material and stabilises the image.
A | Why is the first photographic image called a negative? | More-exposed regions develop darker while masked regions remain lighter. | It has a negative mass. | Every ion on it has negative charge. | It contains no silver. | The light–dark relationship is reversed relative to the original subject.
C | Which half-equation represents silver-image formation during development? | Ag⁺ + e⁻ → Ag | Ag → Ag⁺ + e⁻ | Ag⁺ → Ag + 2e⁻ | Ag⁻ → Ag⁺ | Silver ions gain electrons, so the process is reduction.
F | What metal removes oxygen from iron(III) oxide in thermite? | Aluminium | Copper | Silver | Gold | Aluminium is sufficiently reactive to reduce the iron oxide in this comparison.
A | Which equation is balanced for thermite? | 2Al + Fe₂O₃ → Al₂O₃ + 2Fe | Al + Fe₂O₃ → AlO + Fe | 2Fe + Al₂O₃ → Fe₂O₃ + Al | Al + FeO → Al₂O₃ | Two Al and two Fe atoms balance, along with three O atoms.
A | Which species is oxidised in thermite? | Aluminium | Iron(III) in the oxide | Oxygen from −2 to −2 | Both metals are reduced | Al goes from 0 to +3, while Fe goes from +3 to 0.
C | How many electrons are transferred in 2Al + Fe₂O₃ → Al₂O₃ + 2Fe? | 6 | 2 | 3 | 4 | Two Al atoms each lose three electrons, matching reduction of two Fe³⁺ centres.
C | Why does copper not replace aluminium in the same iron-oxide thermite comparison? | Copper is less reactive than iron in this comparison. | Copper is more reactive than every metal. | Copper has no electrons. | Iron oxide contains no oxygen. | A less reactive metal cannot perform the same oxygen-removal role under the stated conditions.
''')
begin('y10-organic','Organic Chemistry',['Combustion','Crude oil and fractional distillation','Alkanes and alkenes','Cracking and bromine water','Addition polymers','Alcohols carboxylic acids and esters','Amines and amides','Condensation polymers'])
rows(0,'''
F | What products form in complete combustion of a hydrocarbon? | Carbon dioxide and water | Carbon monoxide only | Hydrogen and oxygen only | Carbon and nitrogen | Complete oxidation of C and H gives CO₂ and H₂O.
F | Which test supports the presence of CO₂? | Limewater turns milky. | A glowing splint relights. | Anhydrous copper sulfate stays white. | The gas must smell fruity. | CO₂ forms a calcium carbonate precipitate in limewater.
F | What colour change indicates water with anhydrous copper(II) sulfate? | White to blue | Blue to white | Red to green | Orange to colourless | Water hydrates the anhydrous salt and produces the blue form.
A | Which can form in incomplete hydrocarbon combustion? | Carbon monoxide and/or soot | Only oxygen gas | Sodium metal | Only nitrogen dioxide in every case | Limited oxygen can leave carbon partially oxidised or as soot.
A | Why is carbon monoxide dangerous? | It interferes with oxygen transport by binding strongly to haemoglobin. | It is the same as oxygen. | It is safe because it is colourless. | It turns every acid into a base. | CO can prevent effective oxygen transport; colourlessness does not imply safety.
A | Which equation is balanced for complete methane combustion? | CH₄ + 2O₂ → CO₂ + 2H₂O | CH₄ + O₂ → CO₂ + H₂O | CH₄ → CO₂ + 2H₂ | CH₄ + 2O₂ → C + 4H₂O | One C, four H and four O atoms are conserved.
C | What is the O₂ coefficient in complete combustion 2C₂H₆ + xO₂ → 4CO₂ + 6H₂O? | 7 | 5 | 6 | 8 | Products contain 14 O atoms, requiring 7O₂.
A | Why is a yellow candle flame not by itself proof that all emitted carbon is unburnt soot? | Glowing soot within the flame may later burn. | Yellow light proves pure oxygen is emitted. | Every yellow flame has zero carbon. | Flame colour is an exact quantitative gas analysis. | Use product tests and conditions, not colour alone.
C | Why is candle wax often represented by one formula only as a model? | Real candle wax is generally a mixture of hydrocarbons. | Wax contains no carbon. | Every candle is pure methane gas. | All hydrocarbons have the same formula. | A representative alkane simplifies equations without making wax a pure compound.
C | Which statement about incomplete combustion is most accurate? | A mixture of CO, soot, CO₂ and water may form depending on conditions. | Only one fixed product is possible under all oxygen shortages. | It creates carbon atoms from oxygen. | It never releases energy. | Product proportions depend on oxygen supply, mixing and temperature.
''')
rows(1,'''
F | What is crude oil? | A mixture mainly of hydrocarbons | One pure alkane only | A single element | A giant ionic salt | Crude oil contains many compounds, primarily hydrocarbons.
F | What property is used in fractional distillation? | Different boiling behaviours | Different atomic numbers alone | Identical boiling points | Only indicator colours | Components vaporise and condense over different temperature ranges.
F | How is temperature arranged in a refinery fractionating column? | Hotter at the bottom, cooler at the top | Colder at the bottom, hotter at the top | Always exactly the same everywhere | Always below 0°C | Vapours rise through cooler regions and condense at different heights.
A | Where do lower-boiling components generally leave the column? | Higher up | Only as bottom residue | Through the furnace wall | They cannot be separated | They remain gaseous until reaching cooler upper regions.
A | A fraction is best described as… | a mixture of hydrocarbons with a range of boiling points. | a pure element. | always a single exact alkane. | a new compound made by breaking every C–C bond. | Fraction ranges overlap and are process-dependent.
A | What happens to C–C bonds during ordinary fractional distillation? | They are not intentionally broken. | Every bond is cracked. | Every bond becomes ionic. | They all become C=C. | Distillation is a physical separation rather than a cracking reaction.
A | Compared with long-chain alkanes, shorter-chain alkanes generally have… | lower boiling points and greater volatility. | higher boiling points in every matched comparison. | no carbon atoms. | identical viscosity by definition. | Intermolecular attractions generally strengthen with increasing chain size.
A | Why does a vapour condense at a particular region of the model column? | The local temperature falls to its boiling/condensation range. | Its atoms turn into metal. | Oxygen is removed from its nucleus. | The column adds hydrogen to every molecule. | Cooling causes a physical gas-to-liquid change.
C | Why should a classroom fraction chart not be treated as a universal exact boundary list? | Real fraction ranges overlap and vary with the process. | Boiling points have no role in separation. | Every refinery collects identical pure molecules. | Distillation changes atomic numbers. | Fraction names describe useful cuts of a mixture, not universally sharp chemical categories.
C | Which observation is consistent with increasing alkane chain length? | Increasing viscosity and decreasing ease of ignition in the usual series trend | All members becoming more volatile | Every member becoming an alkene | All intermolecular attractions disappearing | Larger molecules generally have stronger intermolecular attractions and different handling properties.
''')
for carbons in [2,3,4,6]:n(2,f'How many H atoms are in an acyclic alkane with {carbons} C atoms?',2*carbons+2,'For an acyclic alkane, H = 2n + 2.','Foundation')
for carbons in [3,5,8]:n(2,f'How many H atoms are in an acyclic alkene with {carbons} C atoms and one C=C bond?',2*carbons,'For an acyclic alkene with one double bond, H = 2n.','Application')
rows(2,'''
F | What does saturated mean for an alkane? | Only single carbon–carbon bonds | At least one C=C in every molecule | Completely dissolved in water | No hydrogen atoms | Alkanes have only single C–C bonds in this comparison.
A | What differs between successive members of an alkane homologous series? | One CH₂ unit | One O₂ molecule | One NaCl unit | No atoms at all | Neighbouring members differ by CH₂ while sharing the series pattern.
C | Does the formula CₙH₂ₙ alone prove a compound is an alkene? | No; a cycloalkane can have the same general formula. | Yes; rings never occur in organic chemistry. | Yes; all compounds with that formula have one identical structure. | No; alkenes contain no hydrogen. | Structural information and conditions matter; the general formula here assumes an acyclic monoalkene.
''')
rows(3,'''
F | What is cracking? | Breaking larger hydrocarbons into smaller molecules | Separating unchanged molecules by boiling point only | Dissolving sodium chloride in water | Forming a metal alloy | Cracking is a chemical change involving bond breaking and new products.
A | Which pair can balance C₁₀H₂₂ cracking in a simple alkane + alkene model? | C₈H₁₈ + C₂H₄ | C₈H₂₀ + C₂H₄ | C₈H₁₆ + C₂H₂ | C₁₀H₂₂ + C₂H₄ | C totals 10 and H totals 22 in the correct pair.
A | What is required in the catalytic-cracking model? | Suitable heat and a catalyst | Only cold water | Only room-temperature filtration | No energy input under any conditions | Catalytic cracking uses a suitable catalyst and temperature; thermal cracking uses different conditions.
F | Which sample rapidly decolourises bromine water in a no-UV alkane/alkene comparison? | Hex-1-ene | Hexane | Sodium chloride solution | Pure water | Bromine adds across the C=C bond of the alkene.
A | What type of reaction is alkene decolourisation of bromine? | Addition | Neutralisation | Metal displacement | Simple evaporation | Bromine atoms add across the double bond.
A | What is the product formula for ethene plus Br₂? | C₂H₄Br₂ | C₂H₆Br | C₂H₂Br₂ | CH₄Br₂ | C₂H₄ + Br₂ → C₂H₄Br₂ conserves all atoms.
C | Why specify no UV light in the hexane comparison? | Alkanes can undergo halogen substitution under suitable light. | UV light removes all carbon atoms. | Bromine never reacts with any organic compound. | Hexane is an alkene in bright light only. | Different reaction conditions can allow a different reaction class.
C | Bromine colour moves from water into a hydrocarbon layer. What does that alone prove? | Partition between layers, not necessarily chemical decolourisation | The hydrocarbon must be unsaturated | Every bromine molecule was destroyed | A precipitate of sodium forms | Examine the overall colour and reaction conditions, not just one layer.
A | Why are alkenes valuable cracking products? | They are useful reactive feedstocks, including for addition polymers. | They can never react further. | They are metals. | They contain no covalent bonds. | The C=C bond supports addition reactions and polymer manufacture.
C | Why does one balanced cracking equation not describe every molecule in a real product mixture? | Real cracking follows multiple pathways and produces a distribution. | Atoms need not be conserved in a refinery. | Only one product can exist. | Cracking is not a chemical reaction. | A balanced example illustrates atom conservation but does not specify the entire product spectrum.
''')
rows(4,'''
F | Which type of monomer can form an addition polymer in this course? | An alkene | Sodium chloride | A noble-gas atom only | A metal oxide only | The C=C bond can open as monomers join.
F | What is the repeating unit of poly(ethene)? | [–CH₂–CH₂–] | [–CH=CH–] | [–COO–] only | [–NH–CO–] only | The double bond becomes single in the carbon backbone.
A | What happens to the CH₃ side group when propene polymerises by addition? | It remains attached as a side group. | It must be lost as methane. | It becomes an oxygen atom. | It always forms water. | Addition retains the monomer atoms, including substituents.
F | What small-molecule by-product is required in ordinary alkene addition polymerisation? | None | Water from every monomer | Hydrogen chloride from every monomer | Carbon dioxide from every monomer | Addition conserves all monomer atoms in the growing polymer.
A | What monomer gives poly(chloroethene), PVC? | Chloroethene | Ethanoic acid | Ethanol | Sodium chloride | The C=C monomer CH₂=CHCl forms the substituted carbon chain.
A | Why are bonds drawn through the brackets in a repeat-unit diagram? | They show continuation into a long chain. | They indicate ionic charge only. | They mean the structure is a small isolated gas molecule. | They remove carbon valence requirements. | The repeat unit represents a segment connected to units on either side.
A | Which change is correct when ethene becomes poly(ethene)? | C=C becomes C–C as new links join neighbouring units. | Every C–C bond becomes a triple bond. | Every hydrogen is removed. | All carbon atoms become ions. | Polymer backbone carbons retain four bonds overall.
C | Why must a repeat-unit drawing retain substituents? | They are atoms from the monomer and affect the polymer identity. | Every addition reaction removes side groups. | Substituents are not atoms. | A repeat unit can violate atom conservation. | Atom conservation and connectivity determine the correct repeat unit.
A | A chain segment contains 5 complete ethene-derived repeat units. How many carbon atoms are in those units? | 10 | 5 | 15 | 20 | Each repeat unit contains two carbon atoms.
C | Does a short repeat-unit diagram specify every end group of a real polymer molecule? | No; chain ends are usually omitted from repeat-unit notation. | Yes; no polymer can have chain ends. | Yes; every polymer has exactly two carbon atoms total. | No; polymers have no covalent bonds. | Repeat notation focuses on the repeated interior structure.
''')
rows(5,'''
F | Which functional group identifies an alcohol such as ethanol? | –OH outside a carboxyl group | –COOH | –CONH₂ | –COO– between carbon groups | The alcohol hydroxyl group must be distinguished from the OH within –COOH.
F | Which functional group identifies a carboxylic acid? | –COOH | A C=C bond only | –NH₂ only | A metal ion only | The carboxyl group combines C=O and OH on the same carbon.
A | What is the formula of ethanol? | CH₃CH₂OH | CH₃COOH | CH₃CONH₂ | CH₂=CH₂ | Ethanol has two carbons and an alcohol OH group.
A | How is ethanoic acid classified in water? | A weak acid | A strong alkali | A metal | A neutral noble gas | Ethanoic acid partially ionises in water.
A | Which reactants form ethyl ethanoate in reversible esterification? | Ethanol and ethanoic acid | Methane and oxygen only | Ethene and sodium chloride | Methylamine and sodium hydroxide | The alcohol supplies ethyl and the acid supplies ethanoate.
F | What small molecule forms alongside an ester in acid + alcohol esterification? | Water | Oxygen | Hydrogen in every case | Sodium | Acid and alcohol functional groups join with water eliminated.
A | Which link identifies an ester? | –COO– | –C=C– only | –NH– only | –C≡C– only | The ester group contains a carbonyl carbon bonded to oxygen attached to another carbon group.
C | Why is a reversible arrow appropriate for standard esterification? | Products and reactants can interconvert and establish equilibrium. | Every reaction must go irreversibly to 100% ester. | Atoms are not conserved. | A catalyst changes the elements present. | Esterification and hydrolysis are opposing processes under suitable conditions.
A | What is the usual role of an acid catalyst in esterification? | It speeds the reaction pathway without being consumed overall. | It supplies every carbon atom in the ester. | It makes atom balance unnecessary. | It guarantees the equilibrium yield is 100%. | A catalyst affects rate, not the elemental balance or the equilibrium constant at fixed temperature.
C | Which statement about ester odours is most accurate? | Many small esters have characteristic fruity odours, but this is not universal or a safe identification method alone. | Every ester smells identical. | Every fruity smell proves a pure ester. | Esters cannot have odours. | Functional-group chemistry and analytical evidence matter beyond a general odour association.
''')
rows(6,'''
F | Which compound is an amine? | CH₃NH₂ | CH₃CONH₂ | CH₃COOH | CH₃CH₂OH | Methylamine has nitrogen not directly attached to a carbonyl carbon.
F | Which compound is an amide? | CH₃CONH₂ | CH₃NH₂ | CH₄ | C₂H₄ | Ethanamide has nitrogen directly bonded to a carbonyl carbon.
A | Why can a simple amine act as a base? | Its nitrogen lone pair can accept H⁺. | It must donate a metal ion. | It contains no electrons. | It is always a strong acid. | Proton acceptance forms an alkylammonium ion.
A | What structural feature distinguishes an amide from the simple amine comparison? | Nitrogen attached directly to a C=O carbon | Any N atom anywhere without other information | Only a carbon–carbon double bond | An OH group without nitrogen | The carbonyl connection changes the nitrogen lone-pair behaviour.
C | Why are amides much less basic than comparable amines? | The nitrogen lone pair is delocalised with the carbonyl group. | Amides contain no nitrogen. | Every amide is a metal salt. | The nitrogen has no electrons at all. | Delocalisation makes the lone pair less available for proton binding.
F | What is the name of CH₃CONH₂? | Ethanamide | Ethanol | Ethene | Ethanoic acid | The two-carbon amide is ethanamide.
A | What does CH₃NH₂ form when protonated? | CH₃NH₃⁺ | CH₃NH⁻ | CH₄ + N₂ automatically | CH₃COO⁻ | The nitrogen lone pair bonds to H⁺, giving the cation.
A | Which linkage is characteristic of a polyamide? | –CONH– | –COO– only | –CH=CH– only | –O–O– only | An amide link connects carbonyl carbon to nitrogen.
C | Why is “every nitrogen-containing organic compound is an amine” false? | Amides and other nitrogen functional groups have different structures. | Nitrogen cannot bond to carbon. | Organic compounds never contain nitrogen. | Every amide is an alcohol. | Identify the whole functional group and its connectivity.
C | Which description correctly compares methylamine and ethanamide? | Methylamine is appreciably basic in water; ethanamide is much less basic. | Both must be identical strong bases. | Ethanamide contains no C=O. | Methylamine is a carboxylic acid. | The carbonyl attachment in the amide changes electron availability.
''')
rows(7,'''
F | Which pair can make a polyester by condensation? | A diol and a dicarboxylic acid | Ethene alone by addition | Sodium and chlorine | Methane and oxygen by combustion | Two OH groups and two COOH groups allow repeated ester link formation.
F | Which pair can make a polyamide by condensation? | A diamine and a dicarboxylic acid | A diol and an alkane | Ethene and water only | Pure sodium chloride | Amine and carboxyl groups form amide links.
A | Why are two reactive functional groups per monomer important for chain growth? | A monomer can connect at both ends. | The molecule must always lose every carbon. | Only one bond in the entire chain is possible. | Two groups prevent any reaction. | Bifunctionality supports repeated linking rather than stopping at a small product.
F | Which small molecule is released in the acid + alcohol or acid + amine condensation routes shown? | Water | Oxygen | Sodium | Nitrogen | H and OH are removed as H₂O as a new ester or amide link forms.
A | How does condensation polymerisation differ from the alkene addition model? | These condensation routes release a small molecule as links form. | Condensation never forms covalent bonds. | Addition always releases water. | Only addition conserves atoms. | Both conserve atoms, but a by-product such as water appears in the chosen condensation chemistry.
A | Which link is present in a polyester? | –COO– | –CONH– only | –C=C– in every backbone position | –NaCl– | Polyester links are ester functional groups.
A | Which link is present in a polyamide? | –CONH– | –COO– only | –O=O– | –KCl– | Polyamide links are amide functional groups.
''')
for pairs in [2,3,5]:n(7,f'A finite linear chain is made by joining {pairs} diacid and {pairs} complementary bifunctional monomers. If each new link releases one H₂O, how many waters form?',2*pairs-1,f'{2*pairs} monomers in one non-cyclic chain need {2*pairs-1} links. This count includes the end-group correction.','Challenge')

for topic,bank in banks.items():
 assert len(bank['questions'])==80,(topic,len(bank['questions']))
 for category in bank['categories']:assert sum(q['category']==category for q in bank['questions'])==10,(topic,category)
 (ROOT/'assets/revision/questions'/f'{topic}.json').write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
 print(f'{topic}: 80 questions in eight areas')
