"""Small original teaching diagrams; schematic, labelled and independent of a simulator."""
from html import escape
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent

def text(x,y,label,size=20):return f'<text x="{x}" y="{y}" font-size="{size}" text-anchor="middle">{escape(str(label))}</text>'
def line(x,y,x2,y2,c='#537491',w=3):return f'<path d="M{x} {y}L{x2} {y2}" fill="none" stroke="{c}" stroke-width="{w}"/>'
def box(x,y,w,h,c='#d6c9f0'):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="{c}"/>'
def dot(x,y,r=9,c='#4489bc'):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}"/>'
def arrow(x,y,x2,y2,c='#299b8d'):
 import math
 length=math.hypot(x2-x,y2-y) or 1;ux=(x2-x)/length;uy=(y2-y)/length
 ax=x2-10*ux+6*uy;ay=y2-10*uy-6*ux;bx=x2-10*ux-6*uy;by=y2-10*uy+6*ux
 return line(x,y,x2,y2,c,4)+f'<path d="M{ax} {ay}L{x2} {y2}L{bx} {by}" fill="none" stroke="{c}" stroke-width="4"/>'

def draw(kind,lang='es'):
 es=lang=='es';choose=lambda a,b:a if es else b
 if kind=='particles':
  body=''
  for j,title in enumerate(choose(['Sólido','Líquido','Gas'],['Solid','Liquid','Gas'])):
   x=30+j*200;body+=box(x,60,175,170,'#e5eff8')+text(x+87,35,title)
   gas=[(25,25),(90,20),(145,30),(55,65),(120,70),(20,110),(85,115),(145,125),(55,145),(140,85),(85,80),(35,43)]
   for i in range(12):
    if j==0:px,py=42+(i%4)*27,145-(i//4)*27
    elif j==1:px,py=35+(i%4)*26+((i//4)%2)*10,145-(i//4)*25
    else:px,py=gas[i]
    body+=dot(x+px,60+py)
  caption=choose('Modelo de partículas: cambia su organización y separación. Los puntos no son poros ni gotas visibles.','Particle model: organisation and separation change. The dots are not visible pores or droplets.')
 elif kind=='balance':
  body=text(310,44,'2 H₂ + O₂ → 2 H₂O',28)
  for x in [70,160]:body+=dot(x,135,13,'#8d73c4')+dot(x+25,135,13,'#8d73c4')
  body+=dot(250,135,19,'#e38b67')+dot(285,135,19,'#e38b67')+arrow(325,135,370,135)
  for x in [420,535]:body+=dot(x,135,19,'#e38b67')+dot(x-22,157,13,'#8d73c4')+dot(x+22,157,13,'#8d73c4')
  body+=text(310,224,choose('4 H y 2 O antes · 4 H y 2 O después','4 H and 2 O before · 4 H and 2 O after'))
  caption=choose('Se conservan los átomos. Los coeficientes cambian cantidades; los subíndices describen cada entidad.','Atoms are conserved. Coefficients change quantities; subscripts describe each entity.')
 elif kind in ['gas','dilution']:
  body=box(45,60,120 if kind=='dilution' else 200,160,'#d5eaf6')+box(340,60,240 if kind=='dilution' else 100,160,'#d5eaf6')+arrow(200 if kind=='dilution' else 265,135,320,135)
  for j in range(8):body+=dot((65+j%4*26) if kind=='dilution' else (75+j%4*43),95+j//4*80)+dot(360+j%4*(60 if kind=='dilution' else 20),95+j//4*80)
  if kind=='gas':body+=text(145,35,'V')+text(390,35,'V/2')+text(310,253,choose('Misma cantidad y T: menor V → mayor P','Same amount and T: smaller V → higher P'));caption=choose('Modelo isotérmico: comprimir no agrega partículas. Presión y volumen varían inversamente.','Isothermal model: compression does not add particles. Pressure and volume vary inversely.')
  else:body+=text(105,35,'V')+text(460,35,'2V')+text(310,253,choose('Mismo soluto · volumen doble · concentración mitad','Same solute · double volume · half concentration'));caption=choose('Dilución ideal: el soluto transferido se conserva si no hay pérdida ni reacción.','Ideal dilution: transferred solute is conserved if there is no loss or reaction.')
 elif kind in ['energy','catalyst']:
  body=line(60,220,575,220)+line(60,220,60,35)+text(46,30,'E')+text(340,260,choose('Avance de la reacción (esquema)','Reaction progress (schematic)'))+f'<path d="M70 155H150Q260 -50 370 205H565" fill="none" stroke="#8b6bc0" stroke-width="5"/>'+line(100,155,145,155)+line(420,205,520,205)
  if kind=='catalyst':body+='<path d="M70 155H150Q260 35 370 205H565" fill="none" stroke="#2c9c8e" stroke-width="5"/>'+text(400,40,choose('Otra ruta · mismos extremos','New route · same endpoints'),17)
  caption=choose('El cambio de energía depende de los extremos. Una ruta de menor barrera puede ser más rápida sin cambiar el equilibrio a T fija.','The energy change depends on the endpoints. A lower-barrier route can be faster without changing equilibrium at fixed T.')
 elif kind=='molecules':
  body=line(75,145,215,145)+line(380,125,440,175)+line(440,175,500,125)
  for x,t,c in [(75,'O','#de8f75'),(145,'C','#9b86c9'),(215,'O','#de8f75')]:body+=dot(x,145,23,c)+text(x,152,t)
  for x,y,t,c in [(380,125,'H','#c4b4e7'),(440,175,'O','#de8f75'),(500,125,'H','#c4b4e7')]:body+=dot(x,y,23,c)+text(x,y+7,t)
  body+=text(145,55,'CO₂')+text(440,55,'H₂O')+text(145,242,choose('Lineal','Linear'))+text(440,242,choose('Angular','Bent'));caption=choose('Conectividad y forma no son lo mismo. Geometrías esquemáticas; longitudes y ángulos no están a escala.','Connectivity and shape are different. Schematic geometry; lengths and angles are not to scale.')
 elif kind=='redox':
  body=box(45,65,240,100,'#d8edf3')+box(335,65,240,100,'#e4daf4')+text(165,105,'Zn → Zn²⁺ + 2e⁻')+text(455,105,'Cu²⁺ + 2e⁻ → Cu')+text(165,143,choose('Oxidación: cede','Oxidation: loses'),17)+text(455,143,choose('Reducción: recibe','Reduction: gains'),17)+arrow(235,210,385,210)+text(310,245,'2e⁻');caption=choose('Las semirreacciones contabilizan los mismos electrones. No se generan ni se eliminan electrones sin proceso complementario.','Half-equations account for the same electrons. Electron loss is paired with electron gain.')
 elif kind=='equilibrium':
  body=box(55,60,510,150,'#e6f0f5')+text(310,105,'A ⇌ B',34)+text(310,155,choose('Velocidad de ida = velocidad de vuelta','Forward rate = reverse rate'),20)+text(310,245,choose('Equilibrio dinámico ≠ reacción detenida','Dynamic equilibrium ≠ stopped reaction'));caption=choose('A temperatura fija, el equilibrio mantiene composición macroscópica mientras continúan procesos microscópicos. Las cantidades de A y B no tienen por qué ser iguales.','At fixed temperature, composition stays steady while microscopic processes continue. A and B need not have equal amounts.')
 elif kind=='orbitals':
  body=text(310,35,'N · Z = 7')
  for i,label in enumerate(['1s','2s','2p']):
   x=80+i*170;body+=text(x,80,label)
   for j in range(3 if i==2 else 1):body+=box(x-25+j*55,105,45,65,'#e5dcf5')+text(x-2+j*55,148,'↑' if i==2 else '↑↓',28)
  body+=text(310,240,choose('Pauli: máximo 2 por orbital · Hund: repartir primero','Pauli: at most 2 per orbital · Hund: separate first'),18);caption=choose('Esquema de ocupación del estado fundamental del nitrógeno. Las cajas representan orbitales, no regiones físicas con electrones inmóviles.','Ground-state occupancy of nitrogen. Boxes represent orbitals, not physical rooms containing motionless electrons.')
 elif kind=='measurement':
  body=box(55,115,510,55,'#f6dfab')
  for i in range(51):x=55+i*10;body+=line(x,115,x,140 if i%5 else 155,'#6d7790',1)
  body+=''.join(text(55+value*50,193,value,15) for value in range(0,11,2))
  body+=line(475,65,475,190,'#7855ad',4)+text(475,45,'8,4 cm' if es else '8.4 cm')+text(310,230,'L = (8,4 ± 0,1) cm' if es else 'L = (8.4 ± 0.1) cm');caption=choose('Lectura de ejemplo con divisiones de 0,2 cm y criterio instrumental de media división. La incertidumbre debe justificarse.','Example reading with 0.2 cm divisions and a half-division instrumental estimate. The uncertainty criterion must be justified.')
 elif kind in ['motion','functions']:
  body=line(70,225,565,225)+line(70,225,70,35)+text(550,255,'t / s' if kind=='motion' else 'x')+text(48,28,'x / m' if kind=='motion' else 'y')
  if kind=='motion':
   body+=line(70,180,520,45,'#8d6bc0',4)+line(70,225,250,225,'#279b8e',4)+line(250,225,520,22,'#279b8e',4)+dot(520,45,6,'#d88855')+text(350,65,'A: 10 + 2t',18)+text(375,185,'B: 5(t − 4), t ≥ 4',17);caption=choose('Un solo reloj: B espera hasta 4 s; después A y B se encuentran a los 10 s en 30 m. Gráfico esquemático con posición vertical.','One clock: B waits until 4 s, then meets A at 10 s and 30 m. Schematic position–time graph.')
   # Use exact coordinate mapping so the two segments meet at the labelled event.
   body=line(70,225,565,225)+line(70,225,70,35)+line(70,175,520,75,'#8d6bc0',4)+line(70,225,250,225,'#279b8e',4)+line(250,225,520,75,'#279b8e',4)+dot(520,75,7,'#d88855')+text(550,255,'t / s')+text(43,27,'x / m')+text(385,50,'A: 10 + 2t',18)+text(360,190,'B: 5(t − 4), t ≥ 4',17)+text(505,108,'(10 s, 30 m)',15)
  else:body+=line(70,225,490,55,'#8d6bc0',4)+text(380,85,'y = 2x',24);caption=choose('En proporción directa, y/x es constante para x distinto de cero y la recta pasa por el origen.','For direct proportion, y/x is constant for nonzero x and the line passes through the origin.')
 elif kind=='forces':
  body=box(235,100,150,100,'#c0afe6')+text(310,155,'5 kg',30)+arrow(385,140,560,140)+text(480,110,'20 N')+arrow(235,140,130,140,'#d98668')+text(130,110,'5 N')+arrow(235,190,130,190,'#d2a339')+text(130,220,choose('Roce: 5 N','Friction: 5 N'),17)+text(350,260,'Fnet = 20 − 5 − 5 = 10 N → a = 2 m/s²',19);caption=choose('Instante de deslizamiento hacia la derecha. La fuerza neta determina aceleración, que no es lo mismo que velocidad.','Instant of rightward sliding. Net force determines acceleration, which differs from velocity.')
 elif kind=='mechanical-energy':
  body=''
  for x,ep,ec in [(150,15,5),(440,5,15)]:body+=box(x,60,60,ep*8,'#a58bd7')+box(x+70,60,60,ec*8,'#72c4b5')+text(x+30,ep*8+88,f'Ep {ep} J',16)+text(x+100,ec*8+88,f'Ec {ec} J',16)
  caption=choose('Dos estados de un sistema ideal sin pérdidas: la energía mecánica total es 20 J en ambos, aunque cambian sus formas.','Two states of an ideal lossless system: total mechanical energy is 20 J in both, although its forms change.')
 elif kind=='thermal':
  body=line(70,225,570,225)+line(70,225,70,35)+f'<path d="M70 210L150 160H245L405 80H520" fill="none" stroke="#d58c6f" stroke-width="5"/>'+text(550,255,'Q')+text(45,28,'T')+text(196,145,choose('Fusión','Melting'),16)+text(465,65,choose('Ebullición','Boiling'),16);caption=choose('Curva cualitativa de calentamiento de una sustancia pura a presión fija: durante una transición de fase puede entrar energía sin subir T.','Qualitative heating curve of a pure substance at fixed pressure: energy can enter during a phase transition without raising T.')
 elif kind=='engine':
  body=box(35,65,145,90,'#f3c6a4')+box(245,65,145,90,'#cbb9eb')+box(455,65,135,90,'#b7dfe6')+text(108,98,'500 K')+text(108,132,'Qh = 1000 J',16)+text(318,105,choose('Máquina','Engine'))+text(523,98,'300 K')+text(523,132,'Qc = 600 J',16)+arrow(185,110,240,110)+arrow(395,110,450,110)+arrow(318,160,318,205)+text(318,238,'W = 400 J · ηmáx = 40%' if es else 'W = 400 J · ηmax = 40%');caption=choose('Ejemplo del límite reversible de Carnot entre 500 y 300 K. Una máquina real suele tener menor rendimiento.','Example of the reversible Carnot limit between 500 and 300 K. A real engine generally has lower efficiency.')
 elif kind=='circuit':
  body=f'<path d="M115 80H510V210H115Z" stroke="#6c89a0" stroke-width="5" fill="none"/>'+box(85,110,60,70,'#f5d078')+text(115,150,'6 V')+box(260,65,120,35,'#c4b0e5')+text(320,91,'12 Ω')+text(310,260,'I = V/R = 0,5 A' if es else 'I = V/R = 0.5 A');caption=choose('Circuito ideal cerrado de corriente continua. La relación V = IR se aplica aquí a una resistencia óhmica a temperatura constante.','Ideal closed DC circuit. V = IR applies here to an ohmic resistor at constant temperature.')
 elif kind=='induction':
  body=box(70,100,170,70,'#c7b5e8')+text(110,143,'N')+text(200,143,'S')+arrow(250,135,330,135)
  for i in range(7):body+=f'<ellipse cx="{370+i*18}" cy="135" rx="20" ry="65" fill="none" stroke="#d19b55" stroke-width="4"/>'
  body+=text(310,245,choose('Cambiar el flujo puede inducir fem','Changing magnetic flux can induce emf'));caption=choose('Movimiento relativo y geometría pueden cambiar el flujo enlazado. La sola presencia de un imán con flujo constante no induce fem.','Relative motion and geometry can change linked flux. A magnet with constant flux alone does not induce emf.')
 elif kind=='wave':
  import math
  points=[(70+i*5,145-60*math.sin(i*2*math.pi/40)) for i in range(101)]
  body=line(50,145,580,145,'#a3bacb',1)+f'<path d="'+''.join(('M' if i==0 else 'L')+f'{x} {y}' for i,(x,y) in enumerate(points))+'" fill="none" stroke="#8d6ac1" stroke-width="5"/>'+line(120,145,120,85,'#d58e65',3)+text(140,115,'A')+line(120,55,320,55,'#299c8e',3)+text(220,40,'λ')+text(540,185,'x');caption=choose('A mide desplazamiento máximo desde el equilibrio; λ es distancia entre puntos equivalentes consecutivos. La figura es espacial, no un gráfico temporal.','A is maximum displacement from equilibrium; λ is spacing between successive equivalent points. This is a spatial diagram, not a time graph.')
 elif kind=='lens':
  body=line(50,180,580,180,'#9cb3c3',1)+f'<ellipse cx="330" cy="180" rx="13" ry="95" fill="#acdae7"/>'+line(180,180,180,130,'#299c8e',6)+line(405,180,405,205,'#d58769',6)+line(180,130,330,130,'#dfb44b')+line(330,130,450,250,'#dfb44b')+line(180,130,450,220,'#8d6ac1')+dot(280,180,4)+dot(380,180,4)+text(280,210,'F')+text(380,165,'F')+text(310,275,'f = 10 cm · do = 30 cm · di = 15 cm');caption=choose('Lente convergente ideal: imagen real, invertida y de la mitad de altura. Rayos y distancias del ejemplo comparten una escala.','Ideal converging lens: a real inverted image of half the object height. Rays and example distances share one scale.')
 elif kind=='circulation':
  body=box(30,105,130,75,'#ece5f7')+box(235,30,155,65,'#c8e0f2')+box(460,105,130,75,'#e2edf3')+box(235,210,155,65,'#efcbb9')+text(95,150,choose('Cuerpo','Body'))+text(312,69,choose('Corazón derecho','Right heart'),17)+text(525,150,choose('Pulmones','Lungs'))+text(312,249,choose('Corazón izquierdo','Left heart'),17)+arrow(165,125,230,65,'#428ac0')+arrow(395,65,455,125,'#428ac0')+arrow(455,165,395,240,'#d18167')+arrow(230,240,165,165,'#d18167')
  caption=choose('Recorrido funcional de la doble circulación, no una disposición anatómica. Colores indican distinto contenido de oxígeno; toda la sangre es roja.','Functional route of double circulation, not anatomical positioning. Colours label oxygen content; all blood is red.')
 elif kind=='breathing':
  body=box(35,65,190,150,'#d9edf6')+box(395,65,190,150,'#eac9c0')+text(130,100,choose('Aire alveolar','Alveolar air'))+text(490,100,choose('Sangre que llega','Arriving blood'))+text(130,145,choose('Más O₂','Higher O₂'),18)+text(490,145,choose('Menos O₂','Lower O₂'),18)+arrow(240,140,380,140,'#d18167')+text(310,118,'O₂',18)+arrow(380,192,240,192,'#4389bc')+text(310,225,'CO₂',18)+text(310,270,choose('Difusión a través de una barrera delgada','Diffusion across a thin barrier'),20)
  caption=choose('Ventilación y circulación renuevan gases a cada lado. O₂ y CO₂ tienen gradientes distintos y flujos netos opuestos en condiciones normales.','Ventilation and circulation renew gases on each side. O₂ and CO₂ have different gradients and opposite net flows under normal conditions.')
 elif kind=='organic':
  body=box(35,25,550,65,'#e6dcf4')+text(310,65,'CH₃—CH₃    ·    '+choose('Alcano','Alkane'),24)+box(35,110,550,65,'#d8eee8')+text(310,150,'CH₂=CH₂    ·    '+choose('Alqueno','Alkene'),24)+box(35,195,550,65,'#f7e5bb')+text(310,235,'CH₂=CH—CH=CH₂    ·    '+choose('Dieno','Diene'),23)
  caption=choose('Estructuras condensadas: un enlace C—C, un C=C o dos C=C. Los hidrógenos completan la valencia cuatro del carbono en estos ejemplos.','Condensed structures: a C—C bond, one C=C or two C=C bonds. Hydrogens complete carbon valence four in these examples.')
 elif kind=='photons':
  body=box(40,60,240,150,'#e6edf6')+box(340,60,240,150,'#e5dcf4')+text(160,100,'hf < Φ')+text(160,155,choose('No emite electrones','No electrons emitted'),17)+text(460,100,'hf > Φ')+text(460,155,'Kmax = hf − Φ',20)+dot(560,175,9,'#299c8e');caption=choose('En el efecto fotoeléctrico ideal, frecuencia controla energía por fotón. Aumentar intensidad no reemplaza una frecuencia por debajo del umbral.','In the ideal photoelectric effect, frequency sets photon energy. Greater intensity does not replace a below-threshold frequency.')
 else:
  body=box(45,60,145,110,'#e4d9f5')+box(235,60,145,110,'#d4eee9')+box(425,60,145,110,'#f6e5bd')+text(117,110,choose('Observar','Observe'))+text(307,110,choose('Modelar','Model'))+text(497,110,choose('Comprobar','Check'))+arrow(195,115,230,115)+arrow(385,115,420,115);caption=choose('Un modelo relaciona observaciones bajo hipótesis que hay que comprobar.','A model relates observations under assumptions that must be checked.')
 svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 290" role="img" aria-label="'+escape(caption,quote=True)+'"><rect width="620" height="290" rx="18" fill="#f5f8fc"/><g font-family="system-ui,sans-serif" fill="#29445c">'+body+'</g></svg>'
 return svg,caption
MAP={
'nivel-inicial-serie-1':'particles','nivel-inicial-serie-2':'balance','nivel-inicial-serie-3':'gas','nivel-inicial-serie-4':'dilution',
'nivel-1-serie-1':'balance','nivel-1-serie-2':'molecules','nivel-1-serie-3':'energy','nivel-1-serie-4':'redox',
'nivel-2-serie-1':'equilibrium','nivel-2-serie-2':'orbitals','nivel-2-serie-3':'catalyst','nivel-2-serie-4':'equilibrium',
'oaf-medicion':'measurement','oaf-cinematica':'motion','oaf-dinamica':'forces','oaf-energia-choques':'mechanical-energy','oaf-rotacion-gravitacion':'motion','oaf-fluidos':'particles','oaf-calor':'thermal','oaf-termodinamica':'engine','oaf-electricidad':'circuit','oaf-magnetismo':'induction','oaf-ondas-sonido':'wave','oaf-optica':'lens','oaf-radiacion-materia':'photons'}
def course_figure(unit,prefix):
 # Only use figures that directly explain the unit; no decorative substitute for a missing diagram.
 if unit['id'] in ['oaf-rotacion-gravitacion','oaf-fluidos','nivel-1-serie-1']:return ''
 kind=MAP[unit['id']];svg,caption=draw(kind);path=ROOT/'assets/learn-first/figures'/f'{unit["id"]}.svg';path.parent.mkdir(parents=True,exist_ok=True);path.write_text(svg)
 return f'<figure class="reading-figure"><img src="{prefix}assets/learn-first/figures/{unit["id"]}.svg" width="620" height="290" alt="{escape(caption,quote=True)}"><figcaption>{escape(caption)}</figcaption></figure>'
