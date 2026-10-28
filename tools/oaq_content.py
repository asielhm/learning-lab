"""Lecciones originales en español, organizadas por Anexo II del PDF aportado.
El reglamento define el temario; las explicaciones y problemas son de Learning Lab.
"""
LEVELS = [
 {'id':'nivel-inicial','name':'Nivel Inicial','intro':'Construí las herramientas de química: observar sistemas, representar sustancias y calcular cantidades.','inherits':[],'pages':'8–9'},
 {'id':'nivel-1','name':'Nivel 1','intro':'Conectá estructura, cantidad de sustancia y energía para explicar y predecir reacciones.','inherits':['nivel-inicial'],'pages':'9–10'},
 {'id':'nivel-2','name':'Nivel 2','intro':'Usá modelos cuantitativos de materia, termodinámica, cinética y equilibrio.','inherits':['nivel-inicial','nivel-1'],'pages':'10–12'},
]
UNITS=[]
def Q(prompt, options, answer, explanation, area=0, level='Aplicación'):
 return dict(prompt=prompt,options=options,answer=answer,explanation=explanation,area=area,level=level)
def L(title, text, formula, example, trap, check):
 return dict(title=title,text=text.split('|'),formula=formula,example=example.split('|'),trap=trap,check=check)
def U(level,series,title,topics,lab,lessons,review):
 UNITS.append(dict(id=f'{level}-serie-{series}',level=level,series=series,title=title,topics=topics.split('|'),lab=lab,lessons=lessons,review=review))

U('nivel-inicial',1,'Materia, sistemas y átomos',
'Ciencia experimental y ramas de la química; materia y energía; cuerpo, elemento, sustancia simple y compuesta, mezcla y atomicidad|Masa, volumen, densidad, peso específico, temperatura y presión; SI/SIMELA, notación científica y escalas Celsius/Kelvin|Estados y teoría cinética; cambios de estado; puntos de fusión y ebullición; cambios físicos, químicos, endo y exotérmicos|Sistemas homogéneos y heterogéneos, fases e interfases; propiedades intensivas y extensivas; solubilidad y separación|Bohr, partículas subatómicas, Z, A, isótopos, estado fundamental, capas e iones|Tabla periódica: grupos, períodos, familias, metales, no metales, representativos, transición e interna; sustancias orgánicas e inorgánicas',
'separation',[
 L('Observar, medir y describir','La química relaciona lo que observamos con modelos de partículas. Una sustancia tiene composición definida; una mezcla tiene composición variable. O₂ es una sustancia simple de atomicidad 2; H₂O es compuesta. El aire es una mezcla, aunque se vea uniforme.|Masa y volumen son extensivas: aumentan al reunir muestras. Densidad y temperatura son intensivas. El peso es una fuerza, P = mg; el peso específico es peso/volumen, no masa/volumen. En el SI se usan kg, m³, K y Pa. La química orgánica estudia principalmente compuestos del carbono; CO₂ y carbonatos se tratan habitualmente como inorgánicos.',
 'ρ = m/V · T(K) = t(°C) + 273,15',
 'Una pieza tiene m = 54 g y V = 20 cm³.|ρ = 54/20 = 2,7 g/cm³ = 2700 kg/m³.|Al partirla por la mitad cambian m y V; la densidad permanece igual si el material es uniforme.',
 'Confundir densidad con masa: una muestra pequeña puede ser más densa que una grande.',
 Q('Duplicás una muestra homogénea a la misma temperatura. ¿Qué permanece igual?',['Masa','Volumen','Densidad'],2,'Masa y volumen se duplican; su cociente permanece igual.',0,'Fundamentos')),
 L('Fases, soluciones y separación','Una fase es una región uniforme con propiedades propias. Agua y aceite forman dos fases; agua con sal completamente disuelta forma una. Sustancia y fase no son sinónimos: dos líquidos miscibles pueden compartir fase.|La filtración retiene partículas insolubles; la evaporación recupera un soluto no volátil y la destilación permite recuperar también el solvente. Una solución saturada está en equilibrio con soluto sin disolver a esa temperatura; sobresaturada contiene más soluto disuelto que el equilibrio y es inestable. Disolver no implica siempre una reacción química.',
 'Mezcla → separar según tamaño, solubilidad o volatilidad',
 'Hay arena, sal y agua en un vaso.|Filtrá: la arena queda en el papel; la sal atraviesa disuelta en el filtrado.|Evaporá el agua del filtrado para recuperar sal; no filtres esperando retener sus iones.',
 'Un sistema transparente no tiene necesariamente una sola sustancia.',
 Q('¿Qué recuperás en el papel al filtrar agua, arena y sal disuelta?',['Solo arena','Arena y toda la sal','Solo agua'],0,'La arena es insoluble; los iones disueltos atraviesan el filtro.',1)),
 L('Partículas y transformaciones','En un sólido las partículas oscilan alrededor de posiciones; en un líquido conservan proximidad y pueden desplazarse; en un gas están muy separadas. Fundir o hervir cambia la organización, no la identidad química. A presión fija una sustancia pura presenta temperaturas características de cambio de estado.|Una reacción reorganiza átomos y produce especies nuevas. En una combinación se unen reactivos; en una descomposición un compuesto origina sustancias más simples. Un proceso endotérmico absorbe energía del entorno; uno exotérmico la entrega. El punto de ebullición cambia con la presión externa.',
 'Cambio físico: H₂O(l) → H₂O(g) · Cambio químico: 2 H₂ + O₂ → 2 H₂O',
 'Calentás hielo a presión constante.|Primero aumenta su temperatura; durante la fusión de una muestra pura coexisten sólido y líquido.|El calor de fusión cambia las interacciones entre partículas, no convierte las moléculas en H₂ y O₂.',
 'Durante un cambio de estado puede entrar energía sin aumentar la temperatura.',
 Q('Al evaporarse agua pura, ¿qué pasa con sus moléculas?',['Se convierten en átomos','Se separan más y siguen siendo H₂O','Se convierten en oxígeno'],1,'El cambio de fase conserva la identidad de las moléculas.',2,'Fundamentos')),
 L('Del núcleo a la tabla periódica','El número atómico Z cuenta protones y define el elemento. A cuenta protones y neutrones. Isótopos de un elemento tienen igual Z y distinto A. Un catión perdió electrones; un anión los ganó. El modelo de Bohr organiza electrones por capas, pero no describe con precisión todos los átomos.|En la tabla, los períodos se relacionan con capas ocupadas y los grupos principales con electrones de valencia. Los metales suelen conducir y formar cationes; los no metales muestran otras tendencias. Mendeleiev ordenó propiedades periódicas antes de conocerse Z; la ley moderna las relaciona con el número atómico.',
 'Neutrones = A − Z · Electrones de un ion = Z − carga algebraica',
 'Para ²³Na⁺, Z = 11.|Tiene 11 protones y 23 − 11 = 12 neutrones.|La carga +1 indica 10 electrones; el núcleo no cambió al ionizarse.',
 'Un ion y un isótopo no describen el mismo cambio: electrones frente a neutrones.',
 Q('Un ion ³⁵Cl⁻ tiene Z = 17. ¿Cuántos electrones tiene?',['16','17','18'],2,'La carga −1 corresponde a un electrón adicional: 18.',3))
],[Q('¿Cuánto son 25 °C en kelvin?',['248,15 K','298,15 K','25 K'],1,'Sumá 273,15; kelvin se escribe sin símbolo de grado.',0),Q('Agua líquida y hielo puro juntos contienen…',['Dos sustancias y una fase','Una sustancia y dos fases','Dos elementos'],1,'La composición es H₂O en ambas fases.',1),Q('Quemar una vela es principalmente…',['Solo un cambio de estado','Una reacción que produce sustancias nuevas','Una separación por filtración'],1,'La combustión produce principalmente CO₂ y agua si es completa; la cera también se funde.',2),Q('Dos isótopos de carbono difieren en…',['Número de protones','Número de neutrones','Símbolo del elemento'],1,'El Z se conserva; cambia A por los neutrones.',3)])

U('nivel-inicial',2,'Fórmulas, nombres y ecuaciones',
'Óxidos, hidrácidos, hidruros, hidróxidos, oxoácidos, sales y oxosales|Nomenclatura tradicional, sistemática/IUPAC y Stock|Balanceo por tanteo y método algebraico|Síntesis, descomposición, combinación, óxidos con agua, neutralización, combustión completa e incompleta|Propiedades de óxidos ácidos y básicos; ácidos e hidróxidos',
'balance',[
 L('Leer y construir fórmulas','En una fórmula iónica la suma de cargas debe ser cero. Los subíndices indican la proporción más simple de iones: CaCl₂ contiene un Ca²⁺ por cada dos Cl⁻. Un ion poliatómico conserva su identidad entre paréntesis cuando se repite.|Los óxidos contienen oxígeno con otro elemento; los hidróxidos contienen OH⁻. Hidrácidos como HCl(ac) no tienen oxígeno; los oxoácidos como H₂SO₄ sí. Las sales combinan cationes y aniones. Los hidruros metálicos contienen formalmente H⁻; no asignes siempre +1 al hidrógeno.',
 '2(+3) + 3(−2) = 0 → Al₂O₃',
 'Combiná Al³⁺ y SO₄²⁻.|El mínimo común múltiplo de 3 y 2 es 6: necesitás 2 cationes y 3 aniones.|La fórmula es Al₂(SO₄)₃; los paréntesis multiplican todo el sulfato.',
 'No confundas el subíndice del ion con la carga del ion.',
 Q('¿Qué fórmula corresponde a Ca²⁺ y OH⁻?',['CaOH','Ca(OH)₂','Ca₂OH'],1,'Dos hidróxidos compensan la carga +2 del calcio.',0)),
 L('Nombrar sin perder información','Stock usa un número romano para el estado de oxidación cuando hace falta: FeCl₃ es cloruro de hierro(III). La sistemática usa prefijos de cantidad: CO₂ es dióxido de carbono. La tradicional utiliza nombres como ferroso/férrico o ácido sulfúrico, que conviene conectar con la fórmula.|Calculá primero estados de oxidación y verificá neutralidad. En oxosales, sulfato procede del ácido sulfúrico y sulfito del sulfuroso. El nombre especifica composición o estado formal de oxidación; no demuestra por sí solo cómo están distribuidos los electrones en un enlace real.',
 'Fe₂O₃: 2x + 3(−2) = 0 → x = +3',
 'Nombrá Fe₂O₃ por tres sistemas.|Stock: óxido de hierro(III). Sistemática: trióxido de dihierro.|Tradicional: óxido férrico. Son nombres del mismo compuesto.',
 'Hierro(III) no significa que haya tres átomos de hierro.',
 Q('En Cu₂O, el estado de oxidación de Cu es…',['+1','+2','−2'],0,'El oxígeno aporta −2: dos cobres deben aportar +2 en total.',1)),
 L('Balancear conservando átomos','Una ecuación balanceada tiene igual cantidad de átomos de cada elemento a ambos lados. Cambiá coeficientes, nunca subíndices: modificar H₂O a H₂O₂ cambia la sustancia. El tanteo sirve para ecuaciones simples; el método algebraico transforma los balances en ecuaciones simultáneas.|Si a H₂ + b O₂ → c H₂O, el balance de H es 2a = 2c y el de O es 2b = c. Podés fijar b = 1 para obtener la proporción mínima entera. La masa total se conserva en un sistema cerrado, aunque cambien el número de moléculas y el estado físico.',
 '2 H₂ + O₂ → 2 H₂O',
 'Balanceá Al + O₂ → Al₂O₃.|Igualá oxígeno usando 3 O₂ y 2 Al₂O₃: seis O por lado.|Completá con 4 Al. Resultado: 4 Al + 3 O₂ → 2 Al₂O₃.',
 'Una ecuación no se balancea haciendo iguales todos los coeficientes.',
 Q('¿Qué coeficientes balancean N₂ + H₂ → NH₃?',['1, 1, 1','1, 3, 2','2, 3, 1'],1,'Hay 2 N y 6 H a cada lado.',2)),
 L('Reconocer familias de reacciones','En una neutralización un ácido reacciona con una base; para ácido fuerte e hidróxido fuerte la ecuación iónica neta es H⁺ + OH⁻ → H₂O. Muchos óxidos metálicos son básicos y varios no metálicos son ácidos; existen excepciones y óxidos anfóteros.|La combustión completa de un hidrocarburo produce CO₂ y H₂O con suficiente oxígeno. Con oxígeno limitado puede formarse CO o carbono, y no hay una única ecuación de combustión incompleta sin especificar productos. Una descomposición como CaCO₃ → CaO + CO₂ requiere condiciones apropiadas.',
 'CH₄ + 2 O₂ → CO₂ + 2 H₂O',
 'Neutralizá H₂SO₄ con NaOH completamente.|Cada mol de ácido aporta dos equivalentes ácidos en la neutralización total.|H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O.',
 'No todos los óxidos reaccionan con agua; no inventes una reacción solo por su familia.',
 Q('¿Cuál es un producto de combustión completa del metano?',['CO₂','H₂','NaCl'],0,'El carbono termina como CO₂ y el hidrógeno como agua.',3))
],[Q('¿Cuál es una oxosal?',['Na₂SO₄','HCl','CaO'],0,'El sulfato es un oxoanión y forma una sal con sodio.',0),Q('CO se nombra sistemáticamente…',['Dióxido de carbono','Monóxido de carbono','Óxido de calcio'],1,'Un O por un C: monóxido de carbono.',1),Q('En 2 H₂O, ¿cuántos átomos de H se representan?',['2','4','6'],1,'Coeficiente 2 × subíndice 2 = 4.',2),Q('SO₃ + H₂O produce idealmente…',['H₂SO₄','H₂S','NaOH'],0,'Es la hidratación de un óxido ácido; ya está balanceada.',3)])

U('nivel-inicial',3,'Mol, composición y gases',
'Masas atómicas y moleculares; mol y número de Avogadro|Composición centesimal de sustancias y mezclas; fórmula mínima y molecular|Boyle, Charles, Gay-Lussac, Avogadro; ecuación de estado y ecuación general del gas ideal|Volumen molar y condiciones normales de presión y temperatura',
'gas',[
 L('Contar partículas con el mol','Un mol contiene exactamente 6,02214076 × 10²³ entidades especificadas. La masa molar M conecta la balanza con ese conteo: para agua M ≈ 18,0 g/mol. Una masa molecular en u y una masa molar en g/mol tienen valores numéricos relacionados, pero son magnitudes distintas.|Siempre nombrá la entidad: átomos, moléculas o unidades fórmula. En 1 mol de CO₂ hay 1 mol de moléculas y 2 mol de átomos de oxígeno. En una red iónica como NaCl se habla de unidades fórmula, no de moléculas individuales.',
 'n = m/M · N = n Nₐ',
 'Tenés 9,0 g de H₂O.|n = 9,0/18,0 = 0,50 mol de moléculas.|N ≈ 3,01 × 10²³ moléculas; contiene 1,00 mol de átomos H.',
 'Dividir por Nₐ cuando convertís moles a partículas invierte la conversión.',
 Q('18 g de agua (M = 18 g/mol) contienen…',['1 mol de moléculas','18 mol de moléculas','1 molécula'],0,'n = m/M = 1 mol.',0)),
 L('Deducir fórmulas a partir de masas','La composición centesimal indica qué fracción de la masa corresponde a cada elemento. Para obtener una fórmula empírica, convertí cada masa en moles de átomos y dividí por el menor. Si aparecen fracciones sencillas, multiplicá todas las proporciones por el mismo entero.|La fórmula molecular es un múltiplo entero de la empírica. En una mezcla, la fracción másica global se obtiene ponderando la composición de cada componente por su masa: no se promedian porcentajes sin tener en cuenta las cantidades.',
 '% elemento = masa del elemento / masa total × 100',
 'Una sustancia tiene 40,0 % C, 6,7 % H y 53,3 % O.|En 100 g: 40/12 ≈ 3,33 mol C; 6,7/1 ≈ 6,7 mol H; 53,3/16 ≈ 3,33 mol O.|Proporción 1:2:1 → CH₂O. Si M = 180 g/mol y M empírica = 30, la molecular es C₆H₁₂O₆.',
 'La fórmula empírica no determina sola la masa molar.',
 Q('Fórmula empírica CH₂, M empírica = 14 y M molecular = 42 g/mol: ¿fórmula molecular?',['CH₂','C₂H₄','C₃H₆'],2,'42/14 = 3; multiplicá todos los subíndices por 3.',1)),
 L('Relacionar presión, volumen y temperatura','En el modelo ideal las partículas tienen volumen despreciable y no interactúan salvo choques. A cantidad y temperatura constantes, comprimir aumenta la frecuencia de choques con las paredes: P aumenta cuando V disminuye. A presión constante, V crece proporcionalmente con T absoluta.|A volumen constante P/T es constante; a T y P constantes V/n es constante. En cada ley identificá primero qué magnitudes se mantienen. El modelo funciona mejor a baja presión y lejos de la condensación; no extrapoles hasta temperaturas negativas en kelvin.',
 'PV = nRT · P₁V₁/T₁ = P₂V₂/T₂ (n constante)',
 'Un gas ocupa 40 mL a 100 kPa y temperatura constante.|Al comprimirlo a 20 mL, P₂ = 100 × 40/20.|La presión absoluta final es 200 kPa, no 50 kPa.',
 'Las leyes de gases requieren temperatura absoluta y presión absoluta.',
 Q('Un gas sellado pasa de 20 a 40 mL a T constante. Su presión…',['Se duplica','Se reduce a la mitad','No cambia'],1,'PV se conserva al mantener n y T.',2)),
 L('Usar unidades y condiciones de referencia','Elegí R según las unidades: 8,314 L·kPa/(mol·K) o 0,082057 L·atm/(mol·K). En las condiciones convencionales de 273,15 K y 1 atm, el volumen molar ideal es aproximadamente 22,414 L/mol. A 1 bar el valor es distinto; no uses 22,4 sin comprobar la referencia.|La ley de Avogadro dice que volúmenes iguales de gases ideales a igual T y P contienen igual cantidad de partículas. No significa que tengan igual masa: la masa depende de la masa molar. Convertí mL a L antes de sustituir con R en litros.',
 'Vₘ = RT/P · 1 atm = 101,325 kPa',
 'Calculá V de 0,50 mol a 300 K y 100 kPa.|V = nRT/P = 0,50 × 8,314 × 300/100.|V = 12,47 L; no corresponde usar directamente el volumen molar a 273,15 K.',
 'Las condiciones de referencia deben expresarse, porque «normal» puede usar convenciones diferentes.',
 Q('A igual T y P, 1 L de He y 1 L de CO₂ ideales tienen igual…',['Masa','Cantidad de partículas','Densidad'],1,'n = PV/RT es el mismo; las masas molares son distintas.',3))
],[Q('¿Cuántos moles hay en 44 g de CO₂ (M = 44)?',['0,5','1','2'],1,'44/44 = 1 mol.',0),Q('En 18 g de H₂O, la masa de O es aproximadamente…',['2 g','8 g','16 g'],2,'La fracción másica del O es 16/18.',1),Q('A volumen constante, duplicar T en kelvin…',['Duplica P','Reduce P a la mitad','No afecta P'],0,'P/T es constante para n fijo.',2),Q('Usando R = 8,314 L·kPa/(mol·K), la presión debe estar en…',['Pa sin conversión','kPa','atm sin conversión'],1,'Las unidades de R fijan las unidades de las demás magnitudes.',3)])

U('nivel-inicial',4,'Soluciones y estequiometría directa',
'Soluto y solvente; molaridad, molalidad y fracción molar|ppm, % m/V, g/L, % m/m y % V/V|Preparación de soluciones y diluciones|Estequiometría directa sin pureza ni reactivo limitante',
'dilution',[
 L('Elegir cómo expresar concentración','La molaridad usa moles de soluto por litro de solución. La molalidad usa moles por kilogramo de solvente; por eso no cambia con la expansión térmica del volumen. La fracción molar divide los moles de un componente por la suma de moles de todos los componentes.|El solvente no siempre es agua. La concentración no es una cantidad total: dos recipientes de igual molaridad pueden contener diferentes moles si sus volúmenes son distintos. Para pasar entre concentraciones por masa y por volumen puede hacer falta la densidad.',
 'c = n/Vsolución · b = n/msolvente(kg) · xᵢ = nᵢ/Σn',
 'Disolvé 0,20 mol hasta un volumen final de 0,50 L.|c = 0,20/0,50 = 0,40 mol/L.|Si retirás 0,10 L de solución homogénea, esa porción contiene 0,040 mol.',
 'El denominador de molaridad es volumen de solución; el de molalidad es masa de solvente.',
 Q('0,10 mol en 250 mL de solución tienen molaridad…',['0,025 M','0,40 M','2,5 M'],1,'250 mL = 0,250 L; 0,10/0,250 = 0,40.',0)),
 L('Porcentajes y trazas','5 % m/V significa 5 g de soluto por 100 mL de solución. 5 % m/m significa 5 g por 100 g de solución. 5 % V/V indica un volumen de componente referido a 100 mL de solución; los volúmenes al mezclar no son necesariamente aditivos.|En fracción másica, 1 ppm = 1 mg/kg. En soluciones acuosas muy diluidas de densidad aproximada 1 kg/L, se aproxima a 1 mg/L. Especificá la base de una expresión en ppm para evitar ambigüedad.',
 '% m/V = g de soluto / mL de solución × 100',
 'Una solución tiene 2 g de soluto en 200 mL finales.|Es 1 % m/V, porque hay 1 g cada 100 mL.|También es 10 g/L. No podés deducir % m/m exacto sin la masa total.',
 'No reemplaces mL por g sin justificar una densidad.',
 Q('Una solución 3 % m/V contiene en 200 mL…',['1,5 g','3 g','6 g'],2,'3 g/100 mL × 200 mL = 6 g.',1)),
 L('Preparar y diluir con material volumétrico','Para preparar una solución desde sólido, pesá el soluto, disolvé en una porción de solvente y transferí cuantitativamente al matraz. Enjuagá el recipiente, completá hasta la marca y homogeneizá. El volumen final se mide después de disolver.|En una dilución sin reacción ni pérdidas, los moles de soluto se conservan. Una pipeta mide la alícuota; un matraz aforado fija el volumen final. Observá el menisco a la altura de los ojos; un vaso de precipitados no sustituye material aforado para mediciones precisas.',
 'c₁V₁ = c₂V₂',
 'Prepará 100 mL de 0,020 M desde 0,100 M.|V₁ = 0,020 × 100/0,100 = 20,0 mL.|Pipeteá 20,0 mL y completá hasta 100,0 mL finales; no agregues 100 mL adicionales.',
 'Diluir cambia c y V, pero no los moles transferidos de soluto.',
 Q('Diluir 10 mL de 1,0 M hasta 100 mL finales produce…',['0,10 M','1,0 M','10 M'],0,'El volumen aumenta diez veces y c disminuye diez veces.',2)),
 L('De la ecuación a la cantidad de producto','Una ecuación balanceada expresa proporciones de moles, no de gramos. Para estequiometría directa convertí la masa conocida a moles, aplicá la relación entre coeficientes y convertí al pedido. En esta serie suponemos sustancias puras y los otros reactivos suficientes.|Anotá unidades en cada paso: funcionan como control de la cadena de conversiones. Si se pide un gas, elegí PV = nRT para las condiciones dadas. Si se pide una solución, su volumen se obtiene a partir de los moles y su concentración.',
 'nproducto = nreactivo × coeficiente producto / coeficiente reactivo',
 'CaCO₃ → CaO + CO₂. Se descomponen 10,0 g de CaCO₃ (M = 100,0).|n = 0,100 mol; la relación con CO₂ es 1:1.|Se forman 0,100 mol de CO₂, aproximadamente 4,40 g.',
 'Multiplicar directamente masas por coeficientes omite las masas molares.',
 Q('En 2 H₂ + O₂ → 2 H₂O, 3 mol de H₂ con O₂ suficiente dan…',['1,5 mol H₂O','3 mol H₂O','6 mol H₂O'],1,'La proporción H₂:H₂O es 2:2, equivalente a 1:1.',3))
],[Q('La molalidad se expresa en…',['mol/L de solución','mol/kg de solvente','g/L de soluto'],1,'Su denominador es masa del solvente en kg.',0),Q('En agua diluida de densidad 1 kg/L, 2 mg/L son aproximadamente…',['2 ppm','2000 ppm','0,002 ppm'],0,'1 L tiene aproximadamente 1 kg; 2 mg/kg = 2 ppm másicas.',1),Q('Para diluir, ¿qué se conserva sin pérdidas ni reacción?',['Moles de soluto','Concentración','Volumen'],0,'Los moles transferidos se reparten en mayor volumen.',2),Q('2 Mg + O₂ → 2 MgO: 0,20 mol Mg producen…',['0,10 mol MgO','0,20 mol MgO','0,40 mol MgO'],1,'La razón de coeficientes MgO/Mg es 1.',3)])

U('nivel-1',1,'Gases, soluciones y reactivo limitante',
'Densidad y estados; relaciones cualitativas P, V y T; gases ideales y mezclas|Soluciones y concentración de especies; solubilidad de sólidos con T y gases con P|Conservación de masa, estequiometría, reactivo limitante, pureza y rendimiento',
'limiting',[
 L('Mezclas gaseosas y densidad','En una mezcla ideal, cada gas contribuye una presión parcial como si ocupara solo todo el recipiente. La suma es la presión total. La fracción molar relaciona la composición con las presiones parciales.|Combiná m = nM con PV = nRT para obtener densidad. A igual T y P, un gas de mayor masa molar es más denso. A mayor T y presión fija, la densidad disminuye. No traslades esta ley ideal directamente a líquidos y sólidos.',
 'Ptotal = ΣPᵢ · Pᵢ = xᵢPtotal · ρ = PM/RT',
 'Una mezcla tiene 1 mol N₂ y 3 mol He a 200 kPa.|x(N₂) = 1/4 = 0,25.|P(N₂) = 50 kPa y P(He) = 150 kPa.',
 'Presión parcial no es la presión medida después de cambiar el volumen de un componente.',
 Q('Un gas representa 20 % de los moles a Ptotal = 150 kPa. Su P parcial es…',['30 kPa','75 kPa','150 kPa'],0,'0,20 × 150 = 30 kPa.',0)),
 L('Solubilidad y concentración de especies','Solubilidad es la máxima cantidad disuelta en equilibrio bajo condiciones dadas; concentración es la cantidad que realmente hay. Muchos sólidos aumentan su solubilidad al calentarse, pero no todos. Leé la curva correspondiente al soluto.|Para un gas diluido a T constante, la ley de Henry se puede escribir c = kH Pgas si se define así kH. La presión relevante es la parcial del gas. En NaCl acuoso 0,10 M idealmente disociado hay 0,10 M Na⁺ y 0,10 M Cl⁻, no 0,05 M de cada ion.',
 'cgas = kH Pgas (convención concentración/presión)',
 'Si una sal tiene solubilidad de 30 g por 100 g de agua, agregás 40 g.|En equilibrio se disuelven 30 g y quedan 10 g sólidos.|Al elevar T solo podrás predecir el cambio si conocés la curva de esa sal.',
 'Concentrado no significa saturado y diluido no significa débil.',
 Q('En CaCl₂ 0,10 M idealmente disociado, [Cl⁻] es…',['0,05 M','0,10 M','0,20 M'],2,'Cada unidad fórmula aporta dos cloruros.',1)),
 L('Encontrar el reactivo que se agota','Con más de un reactivo, calculá n/ν para cada uno usando la ecuación balanceada. El valor menor determina el avance máximo y el reactivo limitante. El exceso queda parcialmente sin reaccionar.|La pureza corrige la masa disponible de sustancia activa antes de convertir a moles. Si una muestra de 10 g tiene 80 % de CaCO₃ inerte acompañado, solo 8 g participan. La conservación de masa incluye el exceso y todos los productos, también los gases que pueden escapar de un vaso abierto.',
 'ξmáx = mínimo(nᵢ/νᵢ) · mactiva = mmuestra × fracción de pureza',
 '2 H₂ + O₂ → 2 H₂O, con 3 mol H₂ y 1 mol O₂.|H₂: n/ν = 1,5; O₂: n/ν = 1. O₂ limita.|Se forman 2 mol H₂O y sobra 1 mol H₂.',
 'El reactivo con menor masa o menos moles no es necesariamente el limitante.',
 Q('Con 1 mol N₂ y 1 mol H₂ en N₂ + 3 H₂ → 2 NH₃, ¿qué limita?',['N₂','H₂','Ninguno'],1,'n/ν es 1 para N₂ y 1/3 para H₂.',2)),
 L('Separar rendimiento de pureza','El rendimiento compara producto obtenido con producto teórico según la cantidad activa y el limitante. La pureza describe el reactivo inicial; no son factores intercambiables aunque ambos puedan expresarse en porcentaje.|Una pérdida durante filtración, reacción secundaria o equilibrio puede reducir el rendimiento. Un valor aparente mayor que 100 % suele indicar producto húmedo, impurezas o una medición incorrecta, no que se crearon átomos extra.',
 '% rendimiento = mobtenida/mteórica × 100',
 'El cálculo con reactivo puro da 5,00 g de producto teórico.|Se aíslan 4,00 g secos.|Rendimiento = 4,00/5,00 × 100 = 80,0 %. Si el sólido estuviera húmedo, habría que secarlo antes de evaluar.',
 'Aplicar dos veces el porcentaje de pureza reduce artificialmente el resultado.',
 Q('Se predicen 12 g y se aíslan 9 g. El rendimiento es…',['75 %','133 %','3 %'],0,'9/12 × 100 = 75 %.',3))
],[Q('A igual P y T, la densidad de CO₂ respecto de He es…',['Menor','Mayor','Igual'],1,'ρ es proporcional a M; 44 es mayor que 4.',0),Q('Al duplicar P parcial en una solución diluida a T fija según Henry, c del gas…',['Se duplica','Se anula','Se reduce a la mitad'],0,'c = kH Pgas con kH fija.',1),Q('10 g de muestra al 60 % contienen…',['6 g de sustancia activa','10,6 g','0,6 g'],0,'10 × 0,60 = 6 g.',2),Q('Si el producto aislado pesa más del 100 % teórico, conviene comprobar…',['Si está húmedo o impuro','Si se creó masa','Si el mol dejó de valer'],0,'La masa adicional puede ser agua o contaminantes.',3)])

U('nivel-1',2,'Enlace, geometría e interacciones',
'Óxidos, hidruros, ácidos, hidróxidos y sales de elementos representativos|Enlace iónico y covalente; Lewis y TREPEV|Energía de enlace y propiedades periódicas: radio, estado, fusión y ebullición|Interacciones intra e intermoleculares: London, dipolo-dipolo y enlace hidrógeno',
'geometry',[
 L('Enlaces y representaciones de Lewis','Un enlace covalente comparte densidad electrónica; una red iónica se estabiliza por atracciones entre iones. Los dibujos de Lewis cuentan electrones de valencia y muestran pares enlazantes y libres. Sumá electrones si la especie es anión y restá si es catión.|Una estructura correcta respeta el total de electrones y, cuando corresponde, octetos. El hidrógeno completa dos. La energía para romper un enlace es positiva; formar el mismo enlace libera energía. La reactividad de óxidos e hidruros se interpreta con su estructura y con el elemento, no solo con un nombre de familia.',
 'Electrones totales = suma de valencias − carga algebraica',
 'Dibujá H₂O: O aporta 6 electrones y dos H aportan 2.|Total: 8. Dos enlaces O–H usan 4 electrones.|Los 4 restantes son dos pares libres del oxígeno.',
 'Los pares libres cuentan para la geometría aunque no sean enlaces.',
 Q('¿Cuántos electrones de valencia totales tiene NH₄⁺?',['8','9','10'],0,'5 del N + 4 de H − 1 por la carga positiva = 8.',0)),
 L('Predecir forma con TREPEV','Las regiones de densidad electrónica alrededor del átomo central se orientan para reducir repulsiones. Dos regiones dan disposición lineal; tres, trigonal plana; cuatro, tetraédrica. Un enlace doble cuenta como una región al identificar la disposición general.|La geometría molecular nombra posiciones de átomos; la electrónica incluye pares libres. NH₃ es piramidal y H₂O angular aunque ambos tengan disposición electrónica aproximadamente tetraédrica. Los pares libres suelen comprimir ángulos respecto de 109,5°.',
 'AX₂: lineal · AX₃: trigonal plana · AX₄: tetraédrica',
 'CO₂ tiene dos enlaces dobles alrededor del C y ningún par libre central.|Son dos regiones: disposición lineal, ángulo 180°.|En H₂O hay cuatro regiones, dos libres: forma angular, aproximadamente 104,5°.',
 'Contar cada línea de un enlace doble como una región predice formas equivocadas.',
 Q('CH₄ sin pares libres centrales tiene geometría…',['Lineal','Tetraédrica','Angular'],1,'Cuatro regiones enlazantes se distribuyen tetraédricamente.',1)),
 L('De la polaridad a la ebullición','La polaridad molecular depende de enlaces y geometría. En CO₂ los dipolos se cancelan por simetría; en H₂O no. Todas las especies presentan dispersión de London; las polares también pueden presentar interacciones dipolo-dipolo.|Un H unido a N, O o F puede participar en enlace hidrógeno con un par libre apropiado. Al hervir una sustancia molecular se vencen interacciones entre moléculas, no se rompen todos sus enlaces covalentes. Mayor tamaño y polarizabilidad suelen aumentar London al comparar especies semejantes.',
 'Polaridad molecular = suma vectorial de dipolos de enlace',
 'HF y HCl son moléculas polares.|HF forma enlaces hidrógeno fuertes en su líquido; HCl no tiene H unido a N, O o F.|Por eso la masa molar sola no permite ordenar siempre puntos de ebullición.',
 'No confundas enlace O–H dentro del agua con enlace hidrógeno entre moléculas.',
 Q('Al hervir agua, principalmente se vencen…',['Enlaces covalentes O–H','Interacciones entre moléculas','Enlaces del núcleo'],1,'Las moléculas siguen siendo H₂O en el vapor.',2)),
 L('Explicar tendencias periódicas','En un período, el aumento de carga nuclear efectiva suele reducir el radio de los átomos representativos. Al bajar por un grupo se agregan capas y suele aumentar el radio. Un catión suele ser menor que su átomo; un anión, mayor.|Los puntos de fusión dependen del tipo de estructura: molecular, iónica, metálica o red covalente. No existe una única flecha de la tabla que ordene todas las temperaturas. Para comparar, justificá qué partículas y qué interacciones se separan al fundir.',
 'Misma capa: mayor atracción nuclear efectiva → radio generalmente menor',
 'Compará Na y Cl en el mismo período.|Cl tiene mayor carga nuclear efectiva sobre sus electrones de valencia.|Su radio atómico es menor; esto no implica que Na⁺ sea mayor que Cl⁻.',
 'No mezcles sin aclaración radios atómicos e iónicos.',
 Q('Al bajar de Li a Na en el grupo 1, el radio atómico suele…',['Aumentar','Disminuir','Ser idéntico'],0,'Aparece una capa electrónica adicional.',3))
],[Q('¿Qué sustancia forma principalmente una red iónica?',['NaCl sólido','CH₄ gas','O₂ gas'],0,'Está formada por cationes y aniones en una red extendida.',0),Q('La forma molecular de H₂O es…',['Tetraédrica','Angular','Lineal'],1,'Tiene dos enlaces y dos pares libres centrales.',1),Q('CO₂ es globalmente apolar porque…',['No tiene enlaces polares','Los dipolos se cancelan en su geometría lineal','No tiene electrones'],1,'Cada C=O es polar, pero la suma vectorial es cero.',2),Q('¿Qué contribuye a London en moléculas grandes?',['Mayor polarizabilidad','Ausencia de electrones','Solo carga positiva'],0,'La nube electrónica se deforma con mayor facilidad.',3)])

U('nivel-1',3,'Energía y neutralización',
'Combustión, energía liberada por masa y entalpía de reacción|Reacciones de óxidos, sales, hidruros e hidróxidos con agua|Neutralización, formación de sales y relaciones cuantitativas para ácidos y bases fuertes',
'calorimetry',[
 L('Interpretar la entalpía de reacción','A presión constante, el calor intercambiado por una reacción corresponde a ΔH bajo las condiciones indicadas. Una combustión exotérmica tiene ΔH negativo para el sistema: los alrededores reciben energía. Los estados físicos importan, especialmente H₂O(l) frente a H₂O(g).|La entalpía escrita corresponde a la ecuación tal como está balanceada. Si duplicás coeficientes, duplicás ΔH; si invertís la reacción, cambia el signo. La energía específica permite comparar combustibles por gramo y no solo por mol.',
 'qreacción = n × ΔH molar',
 'CH₄(g) + 2 O₂(g) → CO₂(g) + 2 H₂O(l), ΔH ≈ −890 kJ/mol CH₄.|8,0 g de CH₄ son 0,50 mol.|qreacción ≈ −445 kJ y los alrededores reciben aproximadamente 445 kJ si no hay pérdidas.',
 'Liberar 445 kJ no significa ΔH = +445 kJ para la reacción.',
 Q('Una combustión exotérmica tiene ΔH…',['Negativo','Positivo','Siempre cero'],0,'El sistema transfiere energía como calor al entorno.',0)),
 L('Medir calor con un calorímetro','Un calorímetro relaciona cambio de temperatura con energía. Si la solución aumenta su temperatura, absorbió calor; la reacción lo cedió. Para una primera aproximación usá c del agua y suponé aislamiento.|Un cálculo más cuidadoso incluye el recipiente mediante Ccal. No confundas capacidad calorífica C (J/K) con calor específico c (J/g·K). Registrar la temperatura antes y después de mezclar permite estimar la energía, pero las pérdidas al ambiente limitan el modelo.',
 'qsolución = mcΔT · qreacción = −(qsolución + CcalΔT)',
 '100 g de solución aumentan 5,0 K con c = 4,18 J/(g·K).|qsolución = 100 × 4,18 × 5,0 = 2090 J.|Si se desprecia el calorímetro, qreacción = −2,09 kJ.',
 'El calor absorbido por la solución tiene signo opuesto al calor de reacción.',
 Q('200 g de agua aumentan 2 K, c = 4,18 J/(g·K). Absorben…',['418 J','1672 J','8360 J'],1,'200 × 4,18 × 2 = 1672 J.',1)),
 L('Predecir reacciones con agua','Na₂O + H₂O forma NaOH; SO₃ + H₂O forma H₂SO₄. Un hidruro como NaH libera H₂ con agua. Algunas sales modifican pH por hidrólisis de sus iones. Un hidróxido puede disolverse aportando OH⁻ si es suficientemente soluble.|Estas son familias con límites: CuO no se transforma en un hidróxido soluble por mezclarlo con agua. Distinguí disolución, reacción e ionización. En prácticas reales, materiales muy reactivos se manejan con procedimientos específicos; acá se explora el modelo virtual.',
 'NaH + H₂O → NaOH + H₂',
 'Escribí la hidratación de CaO.|CaO + H₂O → Ca(OH)₂.|Se conserva cada elemento; es exotérmica y el producto tiene comportamiento básico.',
 '«Óxido metálico» no garantiza una reacción rápida y completa con agua.',
 Q('El producto básico de CaO con agua es…',['CaCO₃','Ca(OH)₂','HCl'],1,'La hidratación del óxido produce hidróxido de calcio.',2)),
 L('Calcular una neutralización fuerte','Para ácido y base fuertes, identificá cuántos protones y OH⁻ reaccionan por unidad fórmula. En equivalencia los equivalentes se igualan, no necesariamente los moles de sustancias ni sus volúmenes.|Para HCl y NaOH la proporción es 1:1; para H₂SO₄ en neutralización total con NaOH es 1:2. Los iones espectadores permiten nombrar la sal: HCl con KOH produce KCl. Después de equivalencia, el exceso fuerte determina el pH.',
 'νH cácido Vácido = νOH cbase Vbase',
 '25,0 mL de HCl 0,100 M requieren NaOH 0,200 M.|nH⁺ = 0,100 × 0,0250 = 0,00250 mol.|Vbase = 0,00250/0,200 = 0,0125 L = 12,5 mL.',
 'Igualdad de volúmenes solo vale con concentraciones y capacidades equivalentes apropiadas.',
 Q('1 mol de Ca(OH)₂ neutraliza completamente…',['1 mol HCl','2 mol HCl','0,5 mol HCl'],1,'Cada mol de hidróxido aporta 2 mol OH⁻.',3))
],[Q('Si invertís una reacción de ΔH = −50 kJ, el nuevo ΔH es…',['−100 kJ','+50 kJ','0 kJ'],1,'Invertir cambia el signo.',0),Q('Si la solución se enfría al reaccionar en un calorímetro ideal, la reacción es…',['Endotérmica','Exotérmica','Necesariamente una combustión'],0,'La reacción absorbe calor de la solución.',1),Q('SO₃ con agua produce…',['H₂SO₄','NaOH','H₂'],0,'Es la hidratación del óxido ácido.',2),Q('10 mL HCl 0,1 M equivalen a NaOH 0,1 M en…',['5 mL','10 mL','20 mL'],1,'Proporción 1:1 e igual concentración.',3)])

U('nivel-1',4,'Redox, electrólisis y pH',
'Oxidantes y reductores; reacciones de óxido-reducción|Carga, corriente y masa: leyes de la electroquímica|pH y concentración de ácidos y bases fuertes; relación cualitativa con Ka y Kb; ordenar acidez|Problemas combinados',
'electrolysis',[
 L('Seguir electrones en redox','Oxidar es perder electrones y aumentar el número de oxidación; reducir es ganarlos. El agente oxidante se reduce y el reductor se oxida. El balance debe conservar átomos y carga, no solo masa.|En Zn + Cu²⁺ → Zn²⁺ + Cu, el zinc cede dos electrones y el cobre(II) los recibe. Escribí semirreacciones para identificar el intercambio. El estado de oxidación es un conteo formal; no siempre representa una carga localizada real.',
 'Zn → Zn²⁺ + 2 e⁻ · Cu²⁺ + 2 e⁻ → Cu',
 'Identificá agentes en Mg + 2 H⁺ → Mg²⁺ + H₂.|Mg pasa de 0 a +2: se oxida, es reductor.|H⁺ pasa de +1 a 0: se reduce, es oxidante.',
 'El oxidante no es la sustancia que se oxida.',
 Q('En Zn + Cu²⁺ → Zn²⁺ + Cu, el oxidante es…',['Zn','Cu²⁺','Zn²⁺'],1,'Cu²⁺ acepta electrones y se reduce.',0)),
 L('Usar corriente para producir sustancias','La carga que circula es Q = It para corriente constante. Cada mol de electrones transporta aproximadamente 96485 C. Si producir un mol de metal requiere z moles de electrones, nmetal = Q/(zF).|En electrólisis la fuente fuerza una reacción. El cátodo es donde hay reducción y el ánodo donde hay oxidación. En agua con electrolito adecuado e ideal, se obtienen H₂ y O₂ en razón molar 2:1; otras soluciones pueden dar productos distintos.',
 'm = ItM/(zF) · F ≈ 96485 C/mol e⁻',
 'Electrólisis ideal con 1 A durante 193 s.|Q = 193 C y ne⁻ ≈ 0,00200 mol.|Se producen 0,00100 mol H₂ y 0,000500 mol O₂.',
 'Igual carga en ambos electrodos no implica igual cantidad de moles de todos los productos.',
 Q('Si duplicás I manteniendo t y eficiencia, la masa depositada…',['Se duplica','Se reduce a la mitad','No cambia'],0,'La carga It se duplica.',1)),
 L('Calcular pH de especies fuertes','En el modelo ideal diluido a 25 °C, pH = −log[H₃O⁺] y pOH = −log[OH⁻], con pH + pOH ≈ 14. Para ácido fuerte monoprótico lejos de la dilución extrema, [H₃O⁺] ≈ c.|Un cambio de una unidad de pH corresponde a un factor diez en actividad de H₃O⁺, no una diferencia lineal. En soluciones muy diluidas debe incluirse el agua; en soluciones concentradas las actividades difieren de concentraciones. La neutralidad significa igualdad de H₃O⁺ y OH⁻, y su pH depende de T.',
 'pH = −log[H₃O⁺] · Kw ≈ 10⁻¹⁴ a 25 °C',
 'NaOH 0,0010 M se disocia completamente.|pOH = −log(10⁻³) = 3.|pH = 14 − 3 = 11 a 25 °C.',
 'Una base fuerte no tiene pH igual a −log de su concentración.',
 Q('HCl 0,010 M ideal tiene pH aproximadamente…',['2','7','12'],0,'−log(10⁻²) = 2.',2)),
 L('Comparar fuerza y concentración','La fuerza describe la extensión de reacción con agua; la concentración mide cantidad por volumen. Un ácido débil concentrado puede ser más ácido que un fuerte muy diluido. Ka mayor indica mayor disociación al comparar ácidos bajo condiciones equivalentes.|Para HA débil, Ka = [H₃O⁺][A⁻]/[HA]. Para B débil, Kb = [BH⁺][OH⁻]/[B]. Ordená soluciones usando concentración y equilibrio juntos. En problemas combinados, resolvé primero qué reacción consume especies fuertes y después calculá el equilibrio restante.',
 'KaKb = Kw para un par conjugado a una T dada',
 'Compará dos ácidos monopróticos débiles de igual c.|Si Ka(A) > Ka(B), A genera más H₃O⁺ en el mismo modelo.|A tiene menor pH; esta comparación no es válida si cambiás arbitrariamente sus concentraciones.',
 'Débil no significa diluido; fuerte no significa concentrado.',
 Q('A igual concentración, un ácido débil con Ka mayor tiene generalmente…',['Mayor pH','Menor pH','Siempre pH 7'],1,'Disocia más y produce mayor [H₃O⁺].',3))
],[Q('La oxidación ocurre siempre en el…',['Ánodo','Cátodo','Electrolito sin electrodo'],0,'La definición de ánodo es el electrodo de oxidación.',0),Q('2 A durante 50 s transportan…',['25 C','52 C','100 C'],2,'Q = It = 100 C.',1),Q('Una solución pH 3 tiene frente a otra pH 5…',['100 veces más H₃O⁺ ideal','2 veces más','100 veces menos'],0,'10⁻³/10⁻⁵ = 100.',2),Q('Para calcular el pH tras mezclar ácido y base, primero hay que…',['Promediar los pH','Resolver los moles que reaccionan','Sumar los pH'],1,'La neutralización cambia las especies presentes.',3)])

U('nivel-2',1,'Fases, idealidad y propiedades coligativas',
'Estados e interacciones; hipótesis del gas ideal; Dalton y presiones parciales|Conservación de masa; balanceo incluso redox; masas, volúmenes, fórmulas empíricas y concentraciones|Solubilidad de gases, sólidos y líquidos; equilibrio de fases y presión de vapor con T|Raoult, Henry y desviaciones positivas y negativas|Ascenso ebulloscópico, descenso crioscópico, presión osmótica y determinación de masas molares',
'raoult',[
 L('Equilibrio de fases y presión de vapor','En un recipiente cerrado, evaporación y condensación alcanzan iguales velocidades. La presión del vapor en equilibrio aumenta al aumentar T. Un líquido hierve cuando su presión de vapor alcanza la presión externa; por eso hierve a menor temperatura en altura.|Para un soluto no volátil en una solución ideal, Raoult reduce la presión de vapor del solvente. Si ambos componentes son volátiles, cada uno aporta xᵢPᵢ° y el vapor suele enriquecerse en el más volátil. Idealidad supone interacciones de mezcla comparables a las de los líquidos puros.',
 'Pᵢ = xᵢPᵢ° · Ptotal = ΣxᵢPᵢ°',
 'A una T dada, Pagua° = 3,17 kPa y xagua = 0,90 con soluto no volátil.|Pagua = 0,90 × 3,17.|La presión de vapor ideal es 2,853 kPa.',
 'La presión de vapor no aumenta al agregar soluto no volátil ideal.',
 Q('Con soluto no volátil ideal y xsolvente = 0,8, P es…',['0,8 P°','1,8 P°','P°/0,8'],0,'Raoult: P = xsolvente P°.',0)),
 L('Henry y desviaciones de idealidad','Henry describe un soluto gaseoso diluido y Raoult aproxima al solvente ideal cerca de pureza. Sus constantes y unidades deben definirse: algunos textos usan P = kx y otros c = kP. No se sustituyen valores de una convención en otra.|Desviaciones positivas de Raoult indican mayor tendencia al escape que la ideal, asociada a interacciones A–B menos favorables. Las negativas indican menor tendencia al escape. Mezclas no ideales pueden formar azeótropos, que limitan una separación por destilación simple.',
 'Desviación positiva: Preal > Pideal · negativa: Preal < Pideal',
 'Una mezcla tiene Pideal = 40 kPa y se mide 48 kPa a igual T y composición.|La desviación es positiva.|Las moléculas escapan con mayor facilidad que en la referencia ideal; no se deduce de esto una reacción química.',
 'La fracción molar del líquido no tiene por qué coincidir con la del vapor.',
 Q('Se mide una presión menor que la predicha por Raoult. La desviación es…',['Positiva','Negativa','Necesariamente nula'],1,'Preal < Pideal define desviación negativa.',1)),
 L('Contar partículas en propiedades coligativas','Las propiedades coligativas dependen del número efectivo de partículas de soluto en el límite diluido. Un soluto no volátil eleva la ebullición y baja la congelación. El factor de van ’t Hoff i aproxima cuántas partículas aporta cada unidad de soluto; las interacciones pueden modificar su valor real.|Usá molalidad para ΔTf y ΔTb, y molaridad para presión osmótica ideal. Una membrana semipermeable deja pasar solvente, no soluto. La presión osmótica necesaria para detener ese flujo permite determinar masas molares de especies grandes.',
 'ΔTf = iKf b · ΔTb = iKb b · π = icRT',
 '0,10 mol/kg de glucosa en agua, Kf = 1,86 K·kg/mol, i = 1.|ΔTf = 0,186 K.|La congelación ideal a 1 atm comienza aproximadamente a −0,186 °C.',
 'No uses molaridad en lugar de molalidad en crioscopía sin justificación.',
 Q('NaCl ideal con disociación completa a igual molalidad produce respecto de glucosa…',['Aproximadamente doble ΔTf','La mitad de ΔTf','Ningún descenso'],0,'En el límite ideal i(NaCl) ≈ 2 e i(glucosa) = 1.',2)),
 L('De una medición a una fórmula o masa molar','Para obtener M desde una propiedad coligativa, despejá primero la cantidad de partículas. Luego obtené moles de soluto considerando i y finalmente M = m/n. Verificá que el soluto no se asocie, disocie ni reaccione sin incluirlo en el modelo.|El balance redox también conserva carga: en medio ácido podés balancear O con agua, H con H⁺ y carga con electrones, igualando después los electrones de ambas semirreacciones. En medio básico neutralizá los H⁺ con OH⁻ y simplificá.',
 'M = i msoluto Kf / (ΔTf msolvente en kg)',
 '1,00 g de soluto no electrolito en 0,100 kg de agua produce ΔTf = 0,186 K.|b = 0,186/1,86 = 0,100 mol/kg; n = 0,0100 mol.|M = 1,00/0,0100 = 100 g/mol.',
 'Una masa molar aparente puede reflejar disociación si suponés i = 1 erróneamente.',
 Q('En medio ácido, para balancear oxígeno de una semirreacción se usa…',['H₂O','Electrones únicamente','NaCl'],0,'Se ajusta O con H₂O, luego H con H⁺ y carga con electrones.',3))
],[Q('A menor presión externa, el agua hierve a temperatura…',['Menor','Mayor','Invariable'],0,'Alcanza antes la condición Pvapor = Pexterna.',0),Q('La ley de Henry para gas diluido usa la presión…',['Parcial del gas','Total siempre','Del líquido puro únicamente'],0,'La solubilidad responde a la presión parcial del gas sobre la solución.',1),Q('π ideal aumenta al aumentar…',['Concentración de partículas','Masa del recipiente','Volumen sin cambiar moles'],0,'π = icRT.',2),Q('Si i real es 2 y se calcula M suponiendo i = 1, M aparente resulta…',['La mitad de la real','El doble de la real','Exactamente igual'],0,'Se atribuye el efecto de dos partículas a dos veces más moles de soluto.',3)])

U('nivel-2',2,'Estructura cuántica y enlace',
'Conceptos cuánticos, átomos polielectrónicos y orbitales hidrogenoides|Configuraciones: Aufbau, Pauli y Hund; tendencias de electronegatividad, radios, oxidación, energía de ionización y afinidad electrónica|Carácter iónico/covalente, poder polarizante, polarizabilidad y energética de enlace|Lewis: octeto, carga formal, hipervalencia y resonancia; enlace de valencia, σ y π e hibridización|Fórmulas orgánicas, isomería constitucional, grupos funcionales y nomenclatura',
'orbitals',[
 L('Llenar orbitales con reglas claras','Un orbital es una función que describe un estado electrónico, no una órbita planetaria. Los números cuánticos distinguen nivel, subnivel, orientación y espín. Los subniveles s, p y d tienen 1, 3 y 5 orbitales; cada orbital admite hasta dos electrones de espines opuestos por Pauli.|Aufbau orienta el llenado energético del estado fundamental; Hund ocupa orbitales degenerados individualmente con espines paralelos antes de aparearlos. En átomos polielectrónicos intervienen apantallamiento y repulsión; hay excepciones al esquema simple. Al formar cationes de transición se retiran habitualmente electrones ns antes que (n−1)d.',
 'Capacidades: s², p⁶, d¹⁰, f¹⁴',
 'N tiene Z = 7: configuración 1s² 2s² 2p³.|Los tres electrones 2p se distribuyen ↑ ↑ ↑.|No se emparejan dos en un orbital dejando otro vacío: eso contradice Hund para el estado fundamental.',
 'Un orbital p admite dos electrones; el subnivel p completo admite seis.',
 Q('En el estado fundamental de N, los electrones 2p se distribuyen…',['↑↓, ↑, vacío','↑, ↑, ↑','Tres en un único orbital'],1,'Hund ocupa los tres orbitales degenerados antes de aparear.',0)),
 L('Interpretar tendencias y polarización','La energía de ionización es el costo de retirar un electrón de una especie gaseosa. Suele aumentar a lo largo de un período y disminuir al bajar en un grupo, con excepciones por subniveles y apareamientos. La afinidad electrónica describe el cambio energético al añadir un electrón; verificá la convención de signo.|Un catión pequeño y con carga alta polariza más; un anión grande es más polarizable. Esa deformación aumenta la contribución covalente en un enlace descrito inicialmente como iónico. Electronegatividad, radio y número de oxidación son conceptos relacionados pero distintos.',
 'Carga alta + radio pequeño del catión → mayor poder polarizante',
 'Compará Na⁺ con Al³⁺ frente al mismo anión.|Al³⁺ tiene mayor densidad de carga.|Polariza más la nube del anión; se espera mayor carácter covalente en su interacción.',
 'Las tendencias periódicas son generales, no reglas sin excepciones.',
 Q('¿Qué catión suele tener mayor poder polarizante?',['Na⁺','Al³⁺','K⁺'],1,'Mayor carga y menor tamaño favorecen polarización.',1)),
 L('Lewis, resonancia y tipos de enlace','La carga formal asigna la mitad de los electrones compartidos a cada átomo. Sirve para comparar estructuras de Lewis; no equivale a carga parcial real. Resonancia describe una única estructura electrónica deslocalizada mediante varias formas contribuyentes, no moléculas que alternan físicamente entre dibujos.|Un enlace simple tiene componente σ; uno doble añade π y uno triple añade dos π. La hibridización sp, sp² o sp³ es un modelo útil de enlace de valencia. En especies hipervalentes, las etiquetas como sp³d no deben interpretarse como prueba de participación fuerte de orbitales d.',
 'CF = electrones de valencia − no enlazantes − ½ enlazantes',
 'En CO₃²⁻ se dibujan tres formas equivalentes con un C=O.|La suma de cargas formales es −2 en cada forma.|Los tres enlaces C–O reales son equivalentes por deslocalización; no hay un doble fijo que salta.',
 'Resonancia no cambia las posiciones de los átomos ni rompe el esqueleto.',
 Q('Un enlace C≡C contiene…',['3 σ','1 σ y 2 π','2 σ y 1 π'],1,'El primer solapamiento es σ; los dos adicionales son π.',2)),
 L('Leer estructuras orgánicas e isomería','En fórmulas de esqueleto, cada vértice y extremo sin símbolo representa carbono; los H sobre C se completan según valencia. Alcohol, éter, aldehído, cetona, ácido, éster, amina y amida tienen grupos funcionales característicos y reactividad diferente.|Los isómeros constitucionales comparten fórmula molecular pero difieren en conectividad. Elegí una cadena principal que incluya el grupo prioritario, numerá y ubicá sustituyentes. No confundas cambiar la orientación del dibujo con cambiar conexiones.',
 'C₂H₆O → CH₃CH₂OH o CH₃OCH₃',
 'Etanol y dimetil éter tienen C₂H₆O.|En etanol el O está unido a H y C; en el éter, a dos C.|Cambian grupo funcional y conectividad: son isómeros constitucionales.',
 'La misma fórmula molecular no garantiza iguales propiedades ni el mismo grupo funcional.',
 Q('¿Qué par es isomería constitucional?',['Etanol y dimetil éter','Dos giros del etano','¹²C y ¹³C'],0,'El par comparte fórmula y tiene conectividad distinta.',3))
],[Q('Un subnivel d completo contiene…',['5 electrones','10 electrones','14 electrones'],1,'Cinco orbitales con dos electrones cada uno.',0),Q('Al retirar un electrón gaseoso se define una energía de…',['Ionización','Fusión','Combustión'],0,'Corresponde a formar un catión gaseoso.',1),Q('En dos formas de resonancia cambian…',['Posiciones de núcleos','Distribución electrónica dibujada','Número total de electrones'],1,'Conectividad y carga total se conservan.',2),Q('Un carbono aproximadamente sp² suele tener entorno…',['Trigonal plano','Lineal','Octaédrico'],0,'Tres orbitales híbridos orientados aproximadamente a 120°.',3)])

U('nivel-2',3,'Termodinámica y cinética',
'Primer principio: calor, trabajo, energía, funciones de estado, procesos, capacidad calorífica y entalpía|Hess, ciclos termoquímicos, estado estándar y entalpías de formación, combustión, solución y solvatación|Segundo principio, entropía, Gibbs y espontaneidad a P y T constantes|Velocidad, leyes experimentales, órdenes 0/1/2 y dependencia temporal|Arrhenius, coordenada de reacción, estado de transición, mecanismos, intermediarios, paso limitante, estado estacionario y preequilibrio',
'kinetics',[
 L('Conservar energía y usar Hess','Con la convención química, ΔU = q + w y el trabajo de expansión es w = −PexternaΔV. U y H son funciones de estado: dependen de estados inicial y final; q y w dependen del camino. A presión constante y con solo trabajo PV, qP = ΔH.|La ley de Hess permite sumar reacciones y sus entalpías. Las entalpías estándar de formación se refieren a formar 1 mol de sustancia desde elementos en sus estados de referencia. Un elemento en su estado estándar tiene ΔHf° = 0 por convención, no energía absoluta cero.',
 'ΔrH° = Σν ΔfH°(productos) − Σν ΔfH°(reactivos)',
 'Un sistema recibe q = 100 J y realiza 30 J de trabajo sobre el entorno.|Con w = −30 J, ΔU = 100 − 30.|ΔU = +70 J. Si recorrés otro camino, q y w pueden cambiar conservando la misma ΔU.',
 'ΔH de una reacción no se calcula sumando reactivos menos productos.',
 Q('Si q = +50 J y w = −20 J, ΔU es…',['+70 J','+30 J','−30 J'],1,'ΔU = q + w = 30 J.',0)),
 L('Predecir espontaneidad con Gibbs','La entropía se relaciona con la cantidad de microestados compatibles con un macroestado; «desorden» es una analogía incompleta. A T y P constantes, ΔG < 0 indica dirección espontánea para la composición considerada. Espontáneo no significa instantáneo.|ΔG = ΔH − TΔS exige unidades compatibles y T absoluta. ΔG° se refiere a estados estándar; en otras composiciones ΔG = ΔG° + RT ln Q. Un proceso con ΔH > 0 y ΔS > 0 puede ser favorable a alta T.',
 'ΔG = ΔH − TΔS · ΔG° = −RT ln K',
 'ΔH = +40 kJ/mol y ΔS = +150 J/(mol·K).|Convertí ΔS = 0,150 kJ/(mol·K). A 300 K, ΔG = 40 − 45 = −5 kJ/mol.|Es favorable bajo esas condiciones; la rapidez requiere estudiar cinética.',
 'Mezclar J y kJ puede invertir erróneamente el signo de ΔG.',
 Q('Una reacción favorable pero con barrera alta puede ser…',['Muy lenta','Imposible por definición','Obligatoriamente instantánea'],0,'La barrera controla rapidez; ΔG controla favorabilidad termodinámica.',1)),
 L('Determinar una ley de velocidad','La velocidad se obtiene de la variación de concentración normalizada por el coeficiente estequiométrico. Una ley v = k[A]ᵐ[B]ⁿ se determina experimentalmente: no deduzcas exponentes de la ecuación global salvo que se trate de una etapa elemental.|Para orden 0, [A] disminuye linealmente; para primer orden, ln[A] es lineal con t; para segundo orden simple, 1/[A] es lineal. El tiempo de semirreacción de primer orden no depende de [A]₀. Las unidades de k dependen del orden total.',
 'Orden 1: [A]t = [A]₀e⁻ᵏᵗ · t½ = ln 2/k',
 'En una cinética de primer orden, k = 0,10 s⁻¹ y [A]₀ = 1,0 M.|A los 10 s: [A] = e⁻¹ = 0,368 M.|t½ ≈ 6,93 s; tras dos semividas queda 1/4 de la concentración inicial.',
 'Una concentración que baja no demuestra por sí sola primer orden; contrastá las linealizaciones.',
 Q('Duplicar [A] cuadruplica la velocidad, con otras condiciones fijas. El orden en A es…',['0','1','2'],2,'2ᵐ = 4 implica m = 2.',2)),
 L('Relacionar barreras y mecanismos','Arrhenius conecta k con T mediante energía de activación. Un catalizador ofrece otro mecanismo y acelera aproximación al equilibrio sin cambiar K ni ΔG° global. El estado de transición está en el máximo de una barrera; un intermediario corresponde a un mínimo local.|Una etapa lenta puede controlar la velocidad, pero su ley debe expresarse en especies medibles. En preequilibrio, una etapa rápida reversible establece una relación de equilibrio; en estado estacionario se aproxima d[intermediario]/dt ≈ 0 tras un período inicial. Son hipótesis distintas que requieren condiciones.',
 'k = Ae^(−Ea/RT) · ln(k₂/k₁) = −Ea/R(1/T₂ − 1/T₁)',
 'A + B ⇌ I rápido; I → P lento.|Preequilibrio: [I] = K[A][B].|v = k₂[I] = k₂K[A][B]. El intermediario desaparece de la ley observable.',
 'Un catalizador cambia la velocidad directa e inversa; no desplaza el equilibrio.',
 Q('Un catalizador a T fija cambia principalmente…',['La constante K','La barrera y la rapidez','ΔG° de los productos'],1,'Ofrece una ruta cinética distinta sin cambiar la termodinámica global.',3))
],[Q('En Hess, al multiplicar una reacción por 3, ΔH…',['Se multiplica por 3','Se divide por 3','No cambia'],0,'La entalpía escala con la cantidad de reacción.',0),Q('Con ΔH < 0 y ΔS > 0, ΔG es negativo a…',['Toda T positiva en ese modelo','Solo T = 0','Ninguna T'],0,'Ambos términos favorecen ΔG < 0, suponiendo ΔH y ΔS aplicables.',1),Q('Para primer orden, la gráfica lineal es…',['[A] frente a t','ln[A] frente a t','[A]² frente a t'],1,'ln[A] = ln[A]₀ − kt.',2),Q('Un intermediario aparece en el mecanismo y…',['Se produce y luego se consume','Debe quedar en la ecuación global','Es siempre el estado de transición'],0,'Se cancela al sumar etapas.',3)])

U('nivel-2',4,'Equilibrios químicos y electroquímicos',
'Equilibrio dinámico, Kc, Kp, fracción molar, constante termodinámica y Le Chatelier|Ácidos y bases débiles, disociación, pH y titulaciones|Precipitación, Kps, solubilidad, pH, ion común y complejación|Electrodos de primera y segunda clase, referencia, potencial estándar, Nernst y pilas|Latimer, dismutación/comproporción; K, ΔE° y ΔG°; efecto de pH, complejantes y precipitación|Reacciones de grupos 1 y 2 con agua, metales con halógenos y oxígeno, óxidos no metálicos y anfoterismo',
'equilibrium',[
 L('Decidir hacia dónde evoluciona un sistema','En equilibrio las velocidades directa e inversa son iguales; las concentraciones son constantes pero no necesariamente iguales. Q usa la misma expresión que K en una composición cualquiera. Si Q < K, la reacción avanza hacia productos para alcanzar equilibrio.|Las actividades definen K termodinámica adimensional; en aproximación ideal se usan concentraciones o presiones normalizadas. Sólidos y líquidos puros tienen actividad aproximadamente 1. Cambiar T modifica K; cambiar concentración, presión o añadir catalizador a T fija no cambia K.',
 'Kp = Kc(RT)^Δn en la convención ideal usual · ΔG = RT ln(Q/K)',
 'N₂O₄(g) ⇌ 2 NO₂(g), Kc = 0,10 en la convención dada.|Si [NO₂] = 0,10 M y [N₂O₄] = 0,20 M, Qc = 0,010/0,20 = 0,050.|Q < K: aumenta NO₂ hasta equilibrio. Comprimir favorece el lado de menos moles gaseosos.',
 'Agregar gas inerte a volumen fijo no cambia las presiones parciales de los reactivos ideales.',
 Q('Si Q > K, el sistema evoluciona inicialmente hacia…',['Productos','Reactivos','No puede evolucionar'],1,'Debe disminuir Q para alcanzar K.',0)),
 L('Resolver un ácido débil y su titulación','Para HA de concentración c sin otros aportes, planteá un balance de materia y Ka. Si x/c es pequeño, [H₃O⁺] ≈ √(Ka c); comprobá la aproximación. Si no vale, resolvé la cuadrática o el balance completo.|En titulación con base fuerte hay regiones distintas: ácido inicial, mezcla reguladora, equivalencia y exceso de base. En semiequivalencia, pH ≈ pKa. En equivalencia queda la base conjugada y el pH no es necesariamente 7; después domina OH⁻ excedente.',
 'Ka = x²/(c − x) · α = x/c',
 'Ácido acético c = 0,10 M, Ka = 1,8 × 10⁻⁵.|x ≈ √(1,8 × 10⁻⁶) = 1,34 × 10⁻³ M.|pH ≈ 2,87 y α ≈ 1,34 %: la aproximación es razonable.',
 'En equivalencia de ácido débil con base fuerte no queda una solución neutra automáticamente.',
 Q('En semiequivalencia de HA con base fuerte, pH es aproximadamente…',['7 siempre','pKa','14'],1,'Las cantidades de HA y A⁻ son iguales y el cociente regulador vale 1.',1)),
 L('Precipitación, ion común y anfoterismo','Un precipitado aparece cuando el producto iónico Qps supera Kps. Para AgCl, Kps = [Ag⁺][Cl⁻]; para CaF₂, Kps = [Ca²⁺][F⁻]². La relación entre solubilidad s y Kps depende de estequiometría y otros equilibrios.|El ion común suele disminuir solubilidad; protonar un anión básico o complejar un catión puede aumentarla. Un hidróxido anfótero como Al(OH)₃ puede disolverse tanto en ácido como en exceso de base por especies distintas. La disolución de óxidos no metálicos puede originar oxoácidos con proporciones definidas por balance.',
 'CaF₂(s) ⇌ Ca²⁺ + 2 F⁻ · Kps = s(2s)² = 4s³ en agua ideal',
 'AgCl tiene Kps = 1,8 × 10⁻¹⁰.|En agua ideal: s ≈ √Kps = 1,34 × 10⁻⁵ M.|En Cl⁻ 0,10 M, [Ag⁺] ≈ Kps/0,10 = 1,8 × 10⁻⁹ M, si otras reacciones son despreciables.',
 'Kps no es igual a solubilidad; las unidades y potencias dependen de la expresión elegida.',
 Q('Si Qps supera Kps, se favorece…',['Precipitación','Disolución ilimitada','Ausencia de cambio'],0,'La precipitación reduce las concentraciones iónicas hasta equilibrio.',2)),
 L('Predecir una pila con Nernst','En una pila espontánea, ánodo oxida y cátodo reduce. Usá potenciales tabulados de reducción: E°celda = E°cátodo − E°ánodo, sin multiplicar E° por coeficientes. Nernst corrige por actividades y conecta composición con fuerza electromotriz.|Electrodos de primera clase involucran metal/ion; los de segunda, metal/sal poco soluble/ion común. Un electrodo de referencia ofrece potencial conocido. En Latimer, combiná potenciales mediante ΔG°, no promedios simples si cambian electrones. En dismutación una especie se oxida y reduce; en comproporción dos estados originan uno intermedio.',
 'E = E° − (RT/nF) ln Q · ΔG° = −nFE° · ln K = nFE°/RT',
 'Para Zn + Cu²⁺ → Zn²⁺ + Cu, E° ≈ 1,10 V, n = 2.|A 25 °C con [Zn²⁺]/[Cu²⁺] = 100, E ≈ 1,10 − (0,05916/2) log 100.|E ≈ 1,041 V. Q usa concentraciones de iones; los metales puros se omiten.',
 'Nunca multipliques un potencial por 2 para balancear electrones; multiplicá ΔG° si corresponde.',
 Q('Para una reacción redox escrita espontánea en condiciones estándar, E°celda es…',['Positivo','Negativo','Siempre cero'],0,'ΔG° = −nFE°: E° positivo corresponde a ΔG° negativo.',3))
],[Q('A T fija, un catalizador cambia…',['K','Tiempo hasta equilibrio','Composición de equilibrio'],1,'Acelera ambas direcciones sin cambiar K.',0),Q('Un ácido débil muy poco disociado tiene [H⁺] aproximada…',['Ka c','√(Ka c)','c/Ka'],1,'De Ka ≈ x²/c se despeja x.',1),Q('Para CaF₂ en agua ideal sin otros iones, Kps es…',['s²','2s²','4s³'],2,'[Ca²⁺] = s y [F⁻] = 2s.',2),Q('Si Q aumenta para una pila con n fijo, Nernst predice que E…',['Aumenta','Disminuye','Permanece siempre constante'],1,'Se resta (RT/nF) ln Q.',3)])

# Asociaciones con mecanismo y alcance: no sustituyen condiciones de los modelos.
MEMORY = {
'nivel-inicial-serie-1':[
 ('«Densidad: lo apretada que está la masa».','Imaginá dos mochilas del mismo volumen: la de mayor masa tiene mayor densidad. Al dividir un material uniforme, masa y volumen cambian juntos; su cociente no.'),
 ('«El filtro frena granos, no lo que ya está disuelto».','Asociá el papel con un colador: arena queda, pero sal disuelta pasa con agua. Para separar especies disueltas necesitás otra propiedad, como volatilidad.'),
 ('«Cambio de traje, misma molécula».','Hielo, agua y vapor son distintas organizaciones de H₂O. Una reacción cambia las especies; un cambio de estado conserva su identidad química.'),
 ('«Z da identidad; A agrega neutrones».','Z cuenta protones; A suma protones y neutrones. Para los alcalinos y, en general, alcalinotérreos: «Más lejos y más protegido, más fácil de perder». Al bajar, el electrón de valencia está más lejos y apantallado por capas internas; suele bajar la energía necesaria para retirarlo y aumentar reactividad. No es una regla universal para todos los metales.')],
'nivel-inicial-serie-2':[
 ('«Las cargas se compensan, los grupos se conservan».','En Ca(OH)₂ se necesitan dos OH⁻ para compensar Ca²⁺. El paréntesis recuerda que se repite el grupo completo, no solo el H.'),
 ('«Stock cuenta oxidación, prefijos cuentan átomos».','El III de hierro(III) no es un subíndice: es un estado formal. En trióxido, tri sí señala tres oxígenos.'),
 ('«Ajustá la receta, no cambies los ingredientes».','Los coeficientes cambian cuántas moléculas participan; los subíndices definen la sustancia. Es como duplicar porciones sin convertir agua en otro ingrediente.'),
 ('«Carbono bien oxigenado termina en CO₂».','Con O₂ suficiente, la combustión completa de hidrocarburos forma CO₂ y H₂O; si falta oxígeno pueden aparecer CO y hollín. La regla necesita identificar combustible y condiciones.')],
'nivel-inicial-serie-3':[
 ('«El mol es una docena enorme».','Como una docena cuenta doce objetos, un mol cuenta Nₐ entidades. La masa de esa cantidad cambia con la sustancia, igual que una docena de plumas no pesa como una de ladrillos.'),
 ('«Primero moles, después proporciones».','Los átomos se comparan por cantidad, no por gramos. Convertir masas a moles evita confundir un átomo pesado con muchos átomos livianos.'),
 ('«Menos espacio, más choques».','A n y T constantes, las partículas llegan más seguido a las paredes si reducís V: aumenta P. La asociación no vale si dejás escapar gas o cambiás T sin considerarlo.'),
 ('«R pide sus unidades».','Usá R como una etiqueta que exige L, kPa y K, o L, atm y K según su valor. «22,4» solo viene acompañado de sus condiciones de referencia.')],
'nivel-inicial-serie-4':[
 ('«Molaridad mira el matraz; molalidad mira la masa».','El matraz fija litros de solución para c; la balanza da kg de solvente para b. La diferencia explica por qué expansión térmica afecta c y no b en un sistema cerrado.'),
 ('«Porcentaje: de cada cien, ¿cien qué?».','Antes de calcular, decí g por 100 g, g por 100 mL o mL por 100 mL. El apellido del porcentaje define el denominador.'),
 ('«Más agua, mismo soluto, menor concentración».','Imaginá repartir el mismo colorante en un matraz mayor. No desaparece soluto: baja la cantidad por volumen si no hay reacción ni pérdidas.'),
 ('«Gramos → moles → receta → pedido».','La ecuación es una receta molar. Pasar por moles conecta masas distintas con la proporción correcta de partículas.')],
'nivel-1-serie-1':[
 ('«Cada gas pone su parte».','Las presiones parciales se suman en la mezcla ideal. A igual T y V, cada gas aporta presión según sus propios moles.'),
 ('«Solubilidad es el límite; concentración es lo que hay».','Pensá en capacidad y ocupación de una sala. Estar muy lleno no significa alcanzar el límite; además el límite depende del soluto, T y otras condiciones.'),
 ('«La receta se frena por lo que primero se acaba».','Para armar sándwiches de dos panes y un relleno comparás existencias divididas por lo que usa cada sándwich: es n/ν, no simplemente la menor masa.'),
 ('«Pureza antes; rendimiento después».','La pureza corrige lo que entra como reactivo activo. El rendimiento compara lo que realmente sale con el máximo que esa entrada permitiría.')],
'nivel-1-serie-2':[
 ('«Pares dibujados, electrones contados».','Antes de trazar enlaces sumá valencias y ajustá por carga. Los dibujos no pueden gastar más electrones que el total disponible.'),
 ('«Los pares también piden espacio».','Como personas que se separan alrededor de una mesa, las regiones electrónicas se distribuyen. Los pares libres no se ven como átomos, pero influyen en la forma.'),
 ('«Hervir separa vecinos; reaccionar cambia parejas».','En una sustancia molecular, hervir vence principalmente atracciones entre moléculas; no rompe de forma general sus enlaces internos.'),
 ('«Más capas, más lejos; misma capa, más tirón».','Al bajar un grupo aumenta el tamaño por capas nuevas; en un período suele aumentar atracción nuclear efectiva y disminuir radio. En alcalinos, el electrón más lejano y apantallado se pierde más fácilmente: suele aumentar reactividad hacia abajo. En halógenos la tendencia de reactividad es diferente; no lo generalices a todos los grupos.')],
'nivel-1-serie-3':[
 ('«Exo: el calor sale; endo: el calor entra».','El signo se mira desde el sistema que reacciona: si entrega calor, su ΔH es negativo. La solución que lo recibe puede calentarse.'),
 ('«Lo que pierde uno, lo gana el otro».','En un calorímetro ideal, qreacción + qsolución = 0 si ignorás recipiente y pérdidas. Por eso sus signos son opuestos.'),
 ('«La familia orienta; la sustancia decide».','Na₂O reacciona con agua, pero no todos los óxidos metálicos lo hacen igual. Usá la familia para proponer y luego comprobá propiedades y condiciones.'),
 ('«Contá manos ácidas y manos básicas».','Un mol de Ca(OH)₂ puede entregar dos OH⁻: hacen falta dos H⁺ para neutralizarlo. Equivalencia compara capacidades reactivas, no solo volúmenes.')],
'nivel-1-serie-4':[
 ('«Oxidación pierde; reducción recibe».','El reductor entrega electrones y por eso se oxida. El oxidante los recibe y se reduce: nombrá al agente por lo que provoca en el otro.'),
 ('«Corriente por tiempo: la cuenta de electrones».','I mide cuánta carga pasa cada segundo. Más tiempo o corriente suma carga y, con igual eficiencia y reacción, más producto.'),
 ('«Un escalón de pH, diez veces H⁺».','La escala es logarítmica: bajar de pH 5 a 3 no suma dos unidades de concentración; multiplica aproximadamente por cien en el modelo ideal.'),
 ('«Fuerza es cuánto reacciona; concentración, cuánto hay».','Un ácido fuerte muy diluido puede tener menos H₃O⁺ que uno débil concentrado. No ordenes pH usando solo la palabra fuerte.')],
'nivel-2-serie-1':[
 ('«Menos solvente en la superficie ideal, menos escape».','Raoult expresa P = xsolvente P°. Es una asociación al modelo ideal, no una explicación de bloqueo físico total: las moléculas siguen evaporando y condensando.'),
 ('«Positiva: escapan más; negativa: se retienen más».','Compará siempre contra la mezcla ideal a la misma T y composición. Interacciones A–B relativamente menos favorables aumentan la tendencia de escape.'),
 ('«Coligativas cuentan compañía».','Importa cuántas partículas de soluto hay, no solo cuántos gramos pesaste. Disociación o asociación cambia ese número efectivo mediante i.'),
 ('«El termómetro puede contar moles».','Un descenso de congelación permite obtener partículas por kg de solvente. Si conocés i, obtenés moles y luego masa molar; no es una lectura directa de identidad.')],
'nivel-2-serie-2':[
 ('«Hund reparte asientos; Pauli limita cada asiento».','En orbitales degenerados se ocupan primero cajas separadas con espines paralelos. Cada caja admite como máximo dos electrones con espines opuestos.'),
 ('«Pequeño y cargado, deforma más».','Un catión pequeño y de carga alta tiene fuerte poder polarizante sobre un anión. Un anión grande suele ser más fácil de deformar: es más polarizable.'),
 ('«Primero σ; lo extra es π».','En el modelo usual de enlaces entre dos átomos, simple = σ, doble = σ + π, triple = σ + 2π. Resonancia cambia el dibujo electrónico, no las posiciones de los núcleos.'),
 ('«Misma lista de piezas, distinto armado».','Los isómeros constitucionales tienen igual fórmula molecular y distinta conexión. Rotar un dibujo sin cambiar conexiones no construye otro isómero constitucional.')],
'nivel-2-serie-3':[
 ('«Hess: importa el destino, no el camino».','La entalpía es función de estado: podés sumar rutas y sus ΔH. El calor y el trabajo por separado sí pueden cambiar con el camino.'),
 ('«Gibbs pregunta si conviene; cinética, cuánto tarda».','ΔG negativo permite una dirección espontánea a T y P constantes, pero una barrera alta puede hacerla muy lenta. No deduzcas rapidez de ΔG.'),
 ('«Cero: recta; uno: log; dos: inversa».','Para los casos simples estudiados, [A], ln[A] o 1/[A] frente a t son lineales para órdenes 0, 1 o 2 respectivamente. La ley se verifica con datos, no solo por la ecuación global.'),
 ('«Catalizador abre un paso más bajo, no cambia la llegada».','Ofrece una ruta de menor barrera que acelera ida y vuelta. A T fija no modifica K, ΔG° ni la composición final de equilibrio.')],
'nivel-2-serie-4':[
 ('«Q dice dónde estás; K, dónde equilibrás».','Si Q < K faltan productos respecto del equilibrio; si Q > K sobran relativamente. A T fija, el sistema ajusta composición, no el valor de K.'),
 ('«Media equivalencia, mismo ácido y base: pH cerca de pKa».','Tras neutralizar la mitad de HA con base fuerte, cantidades de HA y A⁻ se igualan. En la región reguladora ideal, log del cociente 1 es cero.'),
 ('«Qps por encima: el sólido aparece».','Si el producto iónico supera Kps se favorece precipitar hasta reducir iones libres. Mezclar diluye: calculá primero las concentraciones finales.'),
 ('«Ánodo oxida; cátodo reduce, siempre».','Los signos de los electrodos cambian entre pila y electrólisis, pero las reacciones definitorias no. Para Nernst: al crecer Q, el término que se resta aumenta y E disminuye para la reacción escrita.')]
}
for unit in UNITS:
 for lesson,(cue,reason) in zip(unit['lessons'],MEMORY[unit['id']]):
  lesson['memory']={'cue':cue,'reason':reason}

TASKS={
'nivel-inicial-serie-1':[
 'Calculá la densidad de la pieza y predecí qué pasará con ella al partir la pieza por la mitad.',
 'Proponé una secuencia para recuperar arena y sal por separado. Justificá qué propiedad aprovecha cada paso.',
 'Explicá qué cambia antes y durante la fusión y si se transforma la identidad de las moléculas.',
 'Determiná protones, neutrones y electrones del ion. Explicá qué indica su carga.'],
'nivel-inicial-serie-2':[
 'Escribí la fórmula neutra que forman esos iones y explicá los subíndices y paréntesis.',
 'Deducí el estado de oxidación del hierro y nombrá el compuesto por Stock, sistemática y tradicional.',
 'Encontrá los coeficientes enteros mínimos sin cambiar las fórmulas de las sustancias.',
 'Escribí y balanceá la neutralización completa e indicá la sal obtenida.'],
'nivel-inicial-serie-3':[
 'Convertí esa masa a moles de moléculas, número de moléculas y moles de átomos de hidrógeno.',
 'Deducí la fórmula empírica. Luego usá M = 180 g/mol para deducir la fórmula molecular.',
 'Calculá la presión final al comprimir el gas a 20 mL, manteniendo la temperatura.',
 'Calculá el volumen y justificá por qué no alcanza con multiplicar por 22,4 L/mol.'],
'nivel-inicial-serie-4':[
 'Calculá la molaridad y los moles contenidos en una porción de 0,10 L de esa solución.',
 'Expresá la concentración en % m/V y en g/L. Indicá qué dato falta para obtener % m/m.',
 'Calculá la alícuota necesaria y describí cómo preparar el volumen final con material aforado.',
 'Calculá los moles y la masa de CO₂ producidos, suponiendo descomposición completa.'],
'nivel-1-serie-1':[
 'Calculá la fracción molar y la presión parcial de cada gas.',
 'Calculá la masa que se disuelve y la que queda sólida en equilibrio.',
 'Determiná el reactivo limitante, los moles de agua producidos y el reactivo sobrante.',
 'Calculá el rendimiento e indicá por qué el producto debe estar seco para evaluarlo.'],
'nivel-1-serie-2':[
 'Contá electrones y dibujá enlaces y pares libres en una estructura de Lewis del agua.',
 'Compará las regiones electrónicas y la forma molecular de CO₂ con las de H₂O.',
 'Usá interacciones intermoleculares para explicar por qué la masa molar sola no ordena su ebullición.',
 'Predecí cuál tiene menor radio atómico y explicá la tendencia con atracción nuclear efectiva.'],
'nivel-1-serie-3':[
 'Calculá el calor de reacción al quemar 8,0 g de metano y distinguí su signo del calor recibido por el entorno.',
 'Calculá el calor absorbido por la solución y el calor de la reacción en un calorímetro ideal.',
 'Escribí la ecuación de hidratación de CaO y describí el carácter ácido-base del producto.',
 'Calculá el volumen de NaOH necesario para alcanzar equivalencia.'],
'nivel-1-serie-4':[
 'Identificá qué especie se oxida, cuál se reduce y quiénes son oxidante y reductor.',
 'Calculá carga, moles de electrones y moles de H₂ y O₂ producidos en el modelo ideal.',
 'Calculá primero pOH y después pH a 25 °C.',
 'Ordená los pH según Ka y explicá qué condición hace válida esa comparación.'],
'nivel-2-serie-1':[
 'Calculá la presión de vapor de la solución y comparala con la del agua pura.',
 'Determiná el signo de la desviación y asociá el resultado con tendencia al escape.',
 'Calculá el descenso crioscópico y la temperatura de inicio de congelación.',
 'Deducí la molalidad, los moles de soluto y su masa molar.'],
'nivel-2-serie-2':[
 'Escribí la configuración y dibujá la ocupación de los tres orbitales 2p respetando Pauli y Hund.',
 'Elegí el catión de mayor poder polarizante y justificá el efecto sobre el carácter del enlace.',
 'Dibujá las formas de resonancia, verificá la carga total y explicá qué es equivalente en la especie real.',
 'Compará las conexiones y los grupos funcionales para decidir qué tipo de isomería presentan.'],
'nivel-2-serie-3':[
 'Calculá ΔU usando la convención química de signos para calor y trabajo.',
 'Calculá ΔG a 300 K con unidades compatibles y distinguí favorabilidad de rapidez.',
 'Calculá [A] a 10 s y el tiempo de semirreacción.',
 'Deducí la ley de velocidad observable usando la hipótesis de preequilibrio.'],
'nivel-2-serie-4':[
 'Calculá Q, comparalo con K y predecí la dirección del cambio. Luego analizá qué favorece comprimir.',
 'Estimá [H₃O⁺], pH y porcentaje de disociación. Verificá la aproximación utilizada.',
 'Calculá la solubilidad ideal en agua y comparala con la de una solución 0,10 M en cloruro.',
 'Calculá E con Nernst para el cociente dado y comparalo con E°.']
}
for unit in UNITS:
 for lesson,task in zip(unit['lessons'],TASKS[unit['id']]):
  lesson['task']=task
