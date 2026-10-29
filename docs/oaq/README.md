# OAQ · estudio autónomo en español

Ruta: `activities/oaq/`. OAQ y OAF son los módulos de preparación en español; los cursos escolares conservan su idioma. Se encuentra junto a los años en el catálogo y mediante el enlace OAQ de la cabecera.

Alcance acordado: Nivel Inicial, Nivel 1 y Nivel 2, cuatro series por nivel. Nivel 1 incluye Inicial; Nivel 2 incluye ambos anteriores. 2-bis y 3 quedan para una ampliación posterior.

## Fuente y autoría

El docente aportó `Reglamento_Operativo_OAQ (3).pdf`. La organización proviene del Anexo II, páginas impresas 8–12; la progresión por certamen se describe en página 15. El documento no se ha republicado. El mapa legible está en `activities/oaq/programa.html`.

Las 48 explicaciones, ejemplos, asociaciones para recordar, preguntas y actividades son originales de Learning Lab. La sección es independiente de la organización OAQ y no asigna un nivel de inscripción. El diagnóstico de tres preguntas solo recomienda un punto de partida para estudiar.

## Recorrido sin intervención docente

1. Orientación para comenzar y enlaces a los requisitos previos.
2. Cuatro lecciones por serie, con concepto, relación matemática y asociación con explicación causal y límites.
3. Problema visible antes de abrir la solución, pista y control con devolución.
4. Laboratorio: predicción → montaje con movimientos o pulsaciones sobre el instrumento → proceso visible → registro → explicación.
5. Investigación comparativa: variable a cambiar, condiciones a mantener, dos ensayos distintos y pregunta de conclusión.
6. Repaso: ocho preguntas por serie, filtros de áreas y nivel con casillas en desplegables; práctica con explicación inmediata o autoevaluación que avanza al guardar. Revisión final, enlaces a la lección y reintento de errores.

El buscador por tema de la página OAQ ofrece coincidencias de unidades, lecciones y laboratorios, ignora mayúsculas y tildes y permite usar flechas/Enter o el ratón. Los enlaces de laboratorio abren la investigación elegida, incluida una variante de la misma serie. La devolución de la predicción aparece al terminar el montaje/proceso, junto a los instrumentos: verde con acierto o ámbar para revisar, con texto e icono además del color. Se oculta al comenzar un nuevo ensayo.

El progreso indica controles respondidos correctamente, no una certificación de dominio. Los resultados de repaso y el cuaderno se guardan solo en `localStorage`, en este navegador. No se solicitan nombres ni se envían registros a Google. El módulo no importa el grabador del panel docente. El cuaderno puede descargarse en CSV.

## Quince investigaciones y talleres

- Inicial: filtración/evaporación, balanceo, jeringa sellada y dilución volumétrica.
- Nivel 1: reactivo limitante y CO₂, TREPEV, calorimetría y electrólisis con fuente CC.
- Nivel 2: presión de vapor/Raoult, orbitales/Pauli/Hund, cinética de órdenes 0/1/2, equilibrio N₂O₄/NO₂, titulación de ácido débil, precipitación de AgCl y pila Zn/Cu.

Los talleres de balanceo, geometría y orbitales son representaciones, no prácticas materiales. Cada mesa declara hipótesis y unidades. Las animaciones de montaje/reacción no predicen velocidades reales; cinética y electrólisis declaran el tiempo de laboratorio acelerado. Nernst es una lectura de circuito abierto, no un modelo de descarga.

Los diseños principales son 1366×768, 1440×900 y 1920×1080. La vista ampliada reúne instrucción, aparato, controles, lecturas y gráfico; Escape vuelve a la lección. Se puede arrastrar o seleccionar y colocar por clic/teclado. La ayuda completa solo el paso actual.

## Mantenimiento y comprobación

- Editar `tools/oaq_content.py` y regenerar con `python3 tools/build_oaq.py`.
- La generación actualiza HTML, cubiertas, `assets/oaq/course.json` y solo la entrada OAQ del catálogo. Es determinista.
- Los modelos puros están en `assets/oaq/models.mjs`; procedimientos y comparaciones en `experiments.mjs`; dibujo en `scenes.mjs`; control de mesa en `lab.js`.
- `node tests/oaq-models.mjs`
- `python3 tools/serve.py --port 8063`
- `LEARNING_LAB_BASE_URL=http://127.0.0.1:8063 node tests/oaq-browser.cjs`
- `LEARNING_LAB_BASE_URL=http://127.0.0.1:8063 node tests/oaq-search.cjs`
- `python3 tools/validate_catalog.py`

Los controles científicos verifican conservación, balance de materia/carga, razones estequiométricas, Boyle, Raoult, semiequivalencia, Kps y Nernst. Las pruebas de navegador no escriben en Google.
