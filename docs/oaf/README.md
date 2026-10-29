# OAF · física para estudiar por cuenta propia

Sección pública: `activities/oaf/`, junto a los años, OAQ y el enlace OAF de la cabecera. Las secciones olímpicas se presentan en español; los cursos escolares mantienen su idioma.

## Fuente y alcance

El docente aportó `normas_oaf_2022.pdf`, un PDF escaneado de 18 páginas. Se extrajo por OCR y se verificaron visualmente las páginas de contenido. No se republica el documento completo.

- Apartado 5.2.2, p. 8: Nivel 1 = prueba básica; Nivel 2 = básica más extensión de mayor complejidad. **No hay un temario de materias separado por nivel.** Las dos rutas de la plataforma orientan el estudio sobre el mismo contenido y no asignan un nivel oficial a los estudiantes.
- Apartados 5.2.3 y 5.2.3.1, p. 8: tres problemas teóricos de áreas distintas y uno experimental, en dos días, hasta cuatro horas por parte según esa edición.
- Programa esquemático, pp. 14–15: movimientos/mecánica/fluidos; fenómenos térmicos; electricidad/magnetismo; ondas; óptica.
- Contenidos conceptuales y procedimentales, pp. 15–17: incluyen también relatividad, radiación/materia, espectros, efecto fotoeléctrico/Compton, núcleo, decaimiento, fisión/fusión y habilidades experimentales.
- P. 17: las normas se editan anualmente. La web identifica explícitamente la edición 2022 y no promete que las reglas administrativas sigan vigentes.

Las reglas de ingreso y equipamiento del certamen se describen como contexto del examen, no como instrucciones que restrinjan estudiar en la web. No se ofrece inscripción oficial. Las explicaciones, ejemplos, asociaciones, preguntas y modelos son originales de Learning Lab.

## Recorrido

Seis agrupaciones didácticas, 13 unidades y 52 lecciones: herramientas; cinemática/encuentros; dinámica; energía/choques; rotación/gravitación/relatividad; fluidos; calor; termodinámica; electricidad; magnetismo; ondas/sonido; óptica; radiación/materia.

Cada unidad incluye requisitos, cuatro explicaciones, ejemplo visible antes de desplegar la solución, desafío, asociación causal para recordar, error frecuente, pista y pregunta con devolución. La investigación sigue predicción → colocar instrumentos → accionar sobre la mesa → observar/registrar → comparar dos condiciones → explicar. La ayuda realiza solo el paso actual. El repaso tiene ocho preguntas por unidad (104 en total), filtros de casillas en desplegables, modo práctica, autoevaluación que avanza al guardar, devolución y reintento de errores.

El buscador normaliza tildes y mayúsculas y abre unidades, lecciones específicas y variantes de laboratorio. La ruta Nivel 1 lleva al comienzo de cada unidad; la de profundización lleva a ampliaciones y comparación. Esta es una decisión didáctica, no una clasificación oficial de temas del PDF.

## Diecisiete investigaciones

1. Regla/cursor: lectura y criterio de media división.
2. Encuentros: primer encuentro válido en tramos antes/después de la partida de B, posiciones, velocidades y demoras; puede no haber encuentro.
3. Carro: fuerza neta, masa y rozamiento cinético. Parte deslizando y el ensayo evita atravesar el instante de inversión para no usar un signo de rozamiento incorrecto.
4. Choques 1D: momento y restitución, transformación de energía cinética.
5. Plataforma: masas radiales, I y L constantes según las condiciones; variar r requiere trabajo y puede cambiar Ec.
6. Órbita circular: r desde centro terrestre, g, v y T; ángulo visual acelerado/ilustrativo.
7. Empuje: volumen sumergido y sujeción con signo, capaz de tirar o empujar.
8. Mezcla térmica: balance ideal, calores opuestos, sin pérdidas/cambio de fase.
9. Pistón isotérmico: PV, W = nRT ln(Vf/Vi), Q = W y ΔU = 0, con trabajo positivo realizado por el gas.
10. Carnot: reservorios, máximo ideal, Qh = W + Qc; no es eficiencia garantizada de un motor real.
11. Circuito CC: amperímetro en serie, voltímetro en paralelo, interruptor, I y P.
12. Coulomb: cargas, distancia, fuerza y campo, cero carga y cambio de signo.
13. Inducción: perfil de flujo ilustrativo, fem = −N dΦ/dt, pasada guiada y arrastre; cero al detenerse. El pico de la pasada se calcula con el modelo, independiente de cuadros de animación.
14. Onda viajera: generador, frecuencia/amplitud, λ y T, sin confundir oscilación local con propagación.
15. Lente: pantalla arrastrable y validación de enfoque; imágenes virtuales y en infinito reconocidas sin fingir que una pantalla las captura.
16. Fotoeléctrico: umbral, energía por fotón, Kmax y señal relativa; intensidad no aumenta Kmax a f fija.
17. Decaimiento: población media esperada y actividad, no predicción del instante individual de cada núcleo.

Cada mesa declara hipótesis y unidades. Los gráficos identifican curvas teóricas y puntos del estado actual. Ratón, selección/colocación, teclado y ayuda están disponibles; las escenas tienen objetivos 1366×768, 1440×900 y 1920×1080, con vista ampliada y salida mediante Escape. Las animaciones respetan movimiento reducido.

## Datos y mantenimiento

`learning-lab-oaf-v1` es una clave de almacenamiento local independiente de OAQ. Se guardan lecciones comprobadas, último repaso y hasta diez filas de cuaderno por investigación. No se pide identidad ni se importa el grabador de Google. Los ejercicios OAF no se envían al panel docente. El cuaderno se descarga como CSV.

- Contenido: `tools/oaf_content.py`; generar: `python3 tools/build_oaf.py`.
- Modelos: `assets/oaf/models.mjs`; definición de procedimientos: `experiments.mjs`; dibujo/gráficos: `scenes.mjs`; interacción: `lab.js`.
- La estructura de lección se adapta de OAQ y reutiliza su CSS de estudio, con tema físico propio. Los datos y controles de laboratorio son independientes.
- `node tests/oaf-models.mjs`
- `LEARNING_LAB_BASE_URL=http://127.0.0.1:8066 node tests/oaf-browser.cjs`
- `LEARNING_LAB_BASE_URL=http://127.0.0.1:8066 node tests/oaf-live-motion.cjs`
- `python3 tools/validate_catalog.py`

Las pruebas usan solo datos locales y no escriben en Google. El repaso no sustituye un examen oficial ni certifica dominio del programa o habilidades con material real.
