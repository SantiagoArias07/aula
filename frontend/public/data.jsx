// data.jsx — datos mock del prototipo "Aula · Regularización de matemáticas con IA"
// Español natural de México. Todo estático; los problemas traen su respuesta real
// para que la práctica compruebe de verdad.

const ESTUDIANTE = {
  nombre: "Diego",
  apellido: "Martínez Luna",
  iniciales: "DM",
  edad: 13,
  etapa: "Secundaria",
  grado: "2°",
  nivelLabel: "Secundaria · 2°",
  escuela: "Sec. Téc. 42 · Xalapa, Ver.",
  tutor: "Sra. Luna (mamá)",
  email: "diego.martinez@aula.mx",
  racha: 12,            // días seguidos practicando
  rachaMax: 15,
  dominioGeneral: 64,   // % de dominio de su nivel
  objetivoDiario: 5,    // problemas al día
  hechosHoy: 3,
  xp: 2480,
  siguienteSkillId: "frac-sumres",
};
// Alias por compatibilidad con componentes antiguos
const USER = ESTUDIANTE;

const HOY = "martes 25 de agosto";

// ── Etapas (todos los niveles) ────────────────────────────────────────
const ETAPAS = [
  { id: "prees", nombre: "Preescolar",     grados: "K1 – K3",  color: "course-quim", desc: "Conteo, formas y primeros números" },
  { id: "prim",  nombre: "Primaria",       grados: "1° – 6°",  color: "course-bio",  desc: "Operaciones, fracciones y decimales" },
  { id: "sec",   nombre: "Secundaria",     grados: "1° – 3°",  color: "course-his",  desc: "Álgebra, proporciones y geometría" },
  { id: "prepa", nombre: "Preparatoria",   grados: "1° – 3°",  color: "course-fis",  desc: "Funciones, trigonometría y cálculo" },
];

// ── Ruta personalizada (unidades → skills) ────────────────────────────
// esRezago = tema de un grado anterior que se está recuperando.
const RUTA = [
  {
    id: "u-frac", unidad: "Repaso · Fracciones", origen: "Primaria 5° – 6°", esRezago: true,
    resumen: "Detectamos un hueco aquí. Lo cerramos antes de seguir con álgebra.",
    skills: [
      { id: "frac-equiv",  nombre: "Fracciones equivalentes", etapa: "Primaria 5°", esRezago: true, estado: "dominado",    dominio: 100, mins: 8,  desc: "Reconoce y crea fracciones que valen lo mismo." },
      { id: "frac-sumres", nombre: "Suma y resta de fracciones", etapa: "Primaria 5°", esRezago: true, estado: "en-progreso", dominio: 60,  mins: 10, desc: "Suma y resta con igual y distinto denominador." },
      { id: "frac-mult",   nombre: "Multiplicación de fracciones", etapa: "Primaria 6°", esRezago: true, estado: "disponible", dominio: 0,   mins: 9,  desc: "Multiplica fracciones y resuelve problemas de área." },
    ],
  },
  {
    id: "u-ent", unidad: "Números con signo", origen: "Secundaria 1°", esRezago: true,
    resumen: "Base para el álgebra: moverse con positivos y negativos.",
    skills: [
      { id: "ent-recta",  nombre: "Recta numérica y enteros", etapa: "Secundaria 1°", esRezago: true, estado: "dominado",   dominio: 100, mins: 7, desc: "Ordena y compara números positivos y negativos." },
      { id: "ent-sumres", nombre: "Suma y resta con negativos", etapa: "Secundaria 1°", esRezago: true, estado: "disponible", dominio: 20,  mins: 10, desc: "Opera con enteros en contextos reales." },
      { id: "ent-mult",   nombre: "Multiplicación y división con signo", etapa: "Secundaria 1°", estado: "bloqueado", dominio: 0, mins: 9, desc: "Reglas de los signos al multiplicar y dividir." },
    ],
  },
  {
    id: "u-alg", unidad: "Álgebra: expresiones y ecuaciones", origen: "Secundaria 2°",
    resumen: "Tu grado actual. Aquí es a donde vamos llegando.",
    skills: [
      { id: "alg-leng",  nombre: "Lenguaje algebraico", etapa: "Secundaria 2°", estado: "bloqueado", dominio: 0, mins: 8,  desc: "Traduce frases a expresiones con literales." },
      { id: "alg-ecu",   nombre: "Ecuaciones de primer grado", etapa: "Secundaria 2°", estado: "bloqueado", dominio: 0, mins: 12, desc: "Resuelve ecuaciones del tipo ax + b = c." },
      { id: "alg-desp",  nombre: "Despeje de fórmulas", etapa: "Secundaria 2°", estado: "bloqueado", dominio: 0, mins: 10, desc: "Despeja una variable de una fórmula." },
    ],
  },
  {
    id: "u-prop", unidad: "Proporcionalidad y porcentajes", origen: "Secundaria 2°",
    resumen: "Lo que más se usa en la vida diaria: descuentos, escalas, tasas.",
    skills: [
      { id: "prop-razon", nombre: "Razones y proporciones", etapa: "Secundaria 2°", estado: "bloqueado", dominio: 0, mins: 9,  desc: "Regla de tres y comparación de razones." },
      { id: "prop-porc",  nombre: "Porcentajes", etapa: "Secundaria 2°", estado: "bloqueado", dominio: 0, mins: 10, desc: "Calcula porcentajes, descuentos e incrementos." },
    ],
  },
];

// ── Banco de problemas por skill (con respuesta real) ─────────────────
// tipo: 'opcion' (correcta = índice) | 'numerica' (correcta = número)
const PROBLEMAS = {
  "frac-equiv": [
    { id: "fe1", tipo: "opcion", enunciado: "¿Cuál fracción es equivalente a 1/2?",
      opciones: ["2/4", "1/3", "2/3", "3/4"], correcta: 0,
      pistas: ["Multiplica el numerador y el denominador por el mismo número.", "1/2 = (1×2)/(2×2) = 2/4."],
      pasos: ["Para una fracción equivalente, multiplica arriba y abajo por el mismo número.", "1×2 = 2 y 2×2 = 4.", "Entonces 1/2 = 2/4."],
      explica: "Una fracción equivalente representa la misma parte del entero, con otros números." },
    { id: "fe2", tipo: "opcion", enunciado: "¿Cuál es equivalente a 3/4?",
      opciones: ["6/8", "4/5", "2/4", "3/8"], correcta: 0,
      pistas: ["Multiplica arriba y abajo por 2.", "3×2 = 6 y 4×2 = 8."],
      pasos: ["Multiplica numerador y denominador por 2.", "3×2 = 6, 4×2 = 8.", "3/4 = 6/8."],
      explica: "Multiplicar por el mismo número arriba y abajo no cambia el valor." },
    { id: "fe3", tipo: "opcion", enunciado: "Simplifica 4/8 a su forma más simple.",
      opciones: ["1/2", "2/8", "4/4", "1/4"], correcta: 0,
      pistas: ["Divide arriba y abajo entre el mismo número.", "4 y 8 se dividen entre 4."],
      pasos: ["Busca un número que divida a 4 y a 8: el 4.", "4÷4 = 1, 8÷4 = 2.", "4/8 = 1/2."],
      explica: "Simplificar es dividir numerador y denominador entre el mismo número." },
  ],
  "frac-sumres": [
    { id: "fs1", tipo: "opcion", enunciado: "Calcula 1/4 + 2/4",
      opciones: ["3/4", "3/8", "2/8", "1/2"], correcta: 0,
      pistas: ["Los denominadores ya son iguales (4). Solo suma los numeradores.", "1 + 2 = 3, el denominador se queda en 4."],
      pasos: ["El denominador es el mismo, así que sumamos numeradores: 1 + 2 = 3.", "El denominador no cambia: 4.", "Resultado: 3/4."],
      explica: "Con igual denominador, sumas los numeradores y conservas el denominador." },
    { id: "fs2", tipo: "opcion", enunciado: "Calcula 1/2 + 1/3",
      opciones: ["5/6", "2/5", "2/6", "1/6"], correcta: 0,
      pistas: ["Busca un denominador común: el mínimo común múltiplo de 2 y 3 es 6.", "1/2 = 3/6 y 1/3 = 2/6."],
      pasos: ["Denominador común de 2 y 3: 6.", "Convierte: 1/2 = 3/6 y 1/3 = 2/6.", "Suma numeradores: 3 + 2 = 5.", "Resultado: 5/6."],
      explica: "Con distinto denominador, primero igualas denominadores y luego sumas." },
    { id: "fs3", tipo: "opcion", enunciado: "Calcula 3/4 − 1/2",
      opciones: ["1/4", "2/2", "1/2", "2/4"], correcta: 0,
      pistas: ["1/2 equivale a 2/4.", "3/4 − 2/4 = 1/4."],
      pasos: ["Convierte 1/2 a cuartos: 1/2 = 2/4.", "Resta numeradores: 3 − 2 = 1.", "Resultado: 1/4."],
      explica: "Iguala denominadores y luego resta los numeradores." },
    { id: "fs4", tipo: "opcion", enunciado: "En un salón, 2/5 juegan futbol y 1/5 básquetbol. ¿Qué fracción hace deporte?",
      opciones: ["3/5", "3/10", "2/5", "1/5"], correcta: 0,
      pistas: ["Mismo denominador (5): suma los numeradores.", "2 + 1 = 3."],
      pasos: ["Denominador igual (5).", "Suma numeradores: 2 + 1 = 3.", "Resultado: 3/5."],
      explica: "Fracciones con el mismo denominador se suman directo." },
    { id: "fs5", tipo: "opcion", enunciado: "Calcula 5/6 − 1/3",
      opciones: ["1/2", "4/3", "4/6", "1/6"], correcta: 0,
      pistas: ["1/3 = 2/6.", "5/6 − 2/6 = 3/6, y 3/6 se simplifica."],
      pasos: ["Convierte 1/3 a sextos: 1/3 = 2/6.", "5/6 − 2/6 = 3/6.", "Simplifica 3/6 = 1/2."],
      explica: "Iguala denominadores, resta y simplifica el resultado." },
    { id: "fs6", tipo: "opcion", enunciado: "Ana leyó 1/3 de un libro el lunes y 1/6 el martes. ¿Cuánto lleva en total?",
      opciones: ["1/2", "2/9", "2/6", "1/9"], correcta: 0,
      pistas: ["Denominador común de 3 y 6 es 6.", "1/3 = 2/6, y 2/6 + 1/6 = 3/6 = 1/2."],
      pasos: ["Denominador común: 6.", "1/3 = 2/6.", "2/6 + 1/6 = 3/6 = 1/2."],
      explica: "Primero un denominador común, luego sumas y simplificas." },
  ],
  "frac-mult": [
    { id: "fm1", tipo: "opcion", enunciado: "Calcula 1/2 × 1/3",
      opciones: ["1/6", "1/5", "2/3", "1/2"], correcta: 0,
      pistas: ["Multiplica numeradores entre sí y denominadores entre sí.", "1×1 = 1 y 2×3 = 6."],
      pasos: ["Multiplica numeradores: 1×1 = 1.", "Multiplica denominadores: 2×3 = 6.", "Resultado: 1/6."],
      explica: "Al multiplicar fracciones NO se busca denominador común: multiplicas en línea." },
    { id: "fm2", tipo: "opcion", enunciado: "Calcula 2/3 × 3/4",
      opciones: ["1/2", "6/7", "5/7", "6/4"], correcta: 0,
      pistas: ["2×3 = 6 y 3×4 = 12, luego simplifica.", "6/12 = 1/2."],
      pasos: ["Multiplica: 2×3 = 6 y 3×4 = 12.", "Queda 6/12.", "Simplifica 6/12 = 1/2."],
      explica: "Multiplica en línea y simplifica el resultado." },
    { id: "fm3", tipo: "numerica", enunciado: "Un terreno mide 1/2 km de ancho y 4 km de largo. ¿Cuál es su área en km²?",
      correcta: 2,
      pistas: ["Área = ancho × largo = 1/2 × 4.", "La mitad de 4 es 2."],
      pasos: ["Área = 1/2 × 4.", "Multiplicar por 1/2 es sacar la mitad.", "La mitad de 4 es 2 km²."],
      explica: "Multiplicar por 1/2 equivale a dividir entre 2." },
  ],
  "ent-recta": [
    { id: "er1", tipo: "opcion", enunciado: "¿Qué número es mayor: −3 o −7?",
      opciones: ["−3", "−7", "Son iguales", "No se puede saber"], correcta: 0,
      pistas: ["En la recta numérica, a la derecha están los mayores.", "−3 está a la derecha de −7."],
      pasos: ["Ubica ambos en la recta.", "−3 está más a la derecha que −7.", "Por eso −3 es mayor."],
      explica: "Entre negativos, el más cercano a cero es el mayor." },
    { id: "er2", tipo: "numerica", enunciado: "¿Cuál es el valor absoluto de −8? Escribe el número.",
      correcta: 8,
      pistas: ["El valor absoluto es la distancia al 0, siempre positiva."],
      pasos: ["El valor absoluto mide qué tan lejos está del 0.", "−8 está a 8 unidades del 0.", "Su valor absoluto es 8."],
      explica: "|−8| = 8. La distancia nunca es negativa." },
    { id: "er3", tipo: "opcion", enunciado: "Ordena de menor a mayor: 0, −2, 3, −5",
      opciones: ["−5, −2, 0, 3", "−2, −5, 0, 3", "0, −2, 3, −5", "3, 0, −2, −5"], correcta: 0,
      pistas: ["Los más negativos van primero.", "−5 es el menor; 3 es el mayor."],
      pasos: ["El menor es el más negativo: −5.", "Sigue −2, luego 0.", "El mayor es 3."],
      explica: "De izquierda a derecha en la recta: −5, −2, 0, 3." },
  ],
  "ent-sumres": [
    { id: "es1", tipo: "numerica", enunciado: "En Xalapa amaneció a −2 °C y subió 9 °C. ¿Qué temperatura hay? Escribe el número.",
      correcta: 7,
      pistas: ["Parte de −2 y avanza 9 a la derecha en la recta.", "−2 + 9 = 7."],
      pasos: ["Partimos de −2.", "Subir 9 grados es sumar 9.", "−2 + 9 = 7 °C."],
      explica: "Sumar avanza a la derecha en la recta numérica." },
    { id: "es2", tipo: "numerica", enunciado: "Un buzo está a −15 m y baja 8 m más. ¿A qué profundidad queda? (ej. −23)",
      correcta: -23,
      pistas: ["Bajar es hacerse más negativo (restar).", "−15 − 8 = −23."],
      pasos: ["Empieza en −15.", "Bajar 8 = restar 8.", "−15 − 8 = −23 m."],
      explica: "Bajar aumenta la profundidad, es decir, es más negativo." },
    { id: "es3", tipo: "opcion", enunciado: "Calcula −4 + (−6)",
      opciones: ["−10", "−2", "10", "2"], correcta: 0,
      pistas: ["Sumar dos negativos da un negativo más grande.", "Como deber $4 y deber $6."],
      pasos: ["Dos negativos se suman en magnitud.", "4 + 6 = 10 y el signo es negativo.", "Resultado: −10."],
      explica: "Negativo más negativo da negativo." },
    { id: "es4", tipo: "numerica", enunciado: "Debías $50 y pagaste $30. ¿Cuánto debes ahora? Escribe el monto que aún debes.",
      correcta: 20,
      pistas: ["Deber 50 es −50; pagar 30 es +30.", "−50 + 30 = −20, es decir, debes 20."],
      pasos: ["Deuda inicial: −50.", "Pagas 30: −50 + 30 = −20.", "Aún debes $20."],
      explica: "Pagar reduce la deuda (suma hacia el cero)." },
  ],
};

// ── Tutor IA · sugerencias y conversación semilla ─────────────────────
const TUTOR_SUGERENCIAS = [
  "Explícame las fracciones con distinto denominador",
  "¿Cómo despejo la x en una ecuación?",
  "No entiendo los números negativos",
  "¿Cómo saco un porcentaje?",
];

const TUTOR_SEMILLA = [
  { mio: true,  hora: "hace 5 min", txt: "Profe IA, no entiendo cómo sumar 1/2 + 1/3 😩" },
  { mio: false, hora: "hace 5 min", pasos: [
      "¡Tranqui, Diego! Vamos paso a paso, no te doy el resultado de golpe.",
      "El problema es que los denominadores (el de abajo) son distintos: 2 y 3.",
      "Necesitamos un denominador común. El más pequeño que sirve para 2 y 3 es 6.",
      "Convierte cada una: 1/2 = 3/6 y 1/3 = 2/6.",
      "Ahora sí: como ya tienen el mismo denominador, suma los de arriba: 3 + 2 = 5.",
      "¿Qué crees que queda de resultado? 👇",
    ] },
  { mio: true,  hora: "hace 4 min", txt: "¿5/6?" },
  { mio: false, hora: "hace 4 min", txt: "¡Exacto! 🎉 5/6. Lo entendiste perfecto. ¿Quieres que te ponga uno parecido para practicar?" },
];

// ── Progreso · áreas, racha, logros, estadísticas ─────────────────────
const AREAS = [
  { id: "arit",  nombre: "Aritmética",     dominio: 82, color: "course-mat" },
  { id: "frac",  nombre: "Fracciones",     dominio: 58, color: "course-bio", rezago: true },
  { id: "alg",   nombre: "Álgebra",        dominio: 34, color: "course-his" },
  { id: "geo",   nombre: "Geometría",      dominio: 61, color: "course-fis" },
  { id: "datos", nombre: "Datos y azar",   dominio: 47, color: "course-quim" },
];

// Heatmap de práctica: 6 semanas × 7 días, intensidad 0–3
const RACHA_SEMANAS = [
  [0, 1, 2, 1, 3, 2, 0],
  [1, 2, 1, 0, 2, 3, 1],
  [2, 3, 2, 1, 1, 0, 2],
  [1, 2, 3, 2, 2, 1, 0],
  [0, 1, 2, 3, 2, 2, 3],
  [2, 3, 3, 2, 3, 1, 0],
];

const LOGROS = [
  { id: "l1", nombre: "Racha de 7 días",      icono: "flame",  hecho: true,  desc: "Practicaste una semana seguida" },
  { id: "l2", nombre: "100 problemas",         icono: "target", hecho: true,  desc: "Resolviste tus primeros 100" },
  { id: "l3", nombre: "Sesión perfecta",       icono: "trophy", hecho: true,  desc: "Cero errores en una práctica" },
  { id: "l4", nombre: "Madrugador",            icono: "clock",  hecho: true,  desc: "Practicaste antes de las 8 am" },
  { id: "l5", nombre: "Cierra el rezago",      icono: "medal",  hecho: false, desc: "Domina todo el repaso de Primaria", progreso: 70 },
  { id: "l6", nombre: "Maestro de fracciones", icono: "star",   hecho: false, desc: "Domina toda el área de fracciones", progreso: 58 },
];

const ESTADISTICAS = {
  skillsDominadas: 14,
  problemasResueltos: 342,
  precision: 88,
  minutos: 620,
  rezagoRecuperado: 3, // temas de grados anteriores ya dominados
};

// ── Diagnóstico adaptativo (multinivel) ───────────────────────────────
const DIAGNOSTICO = [
  { id: "d1", area: "Aritmética",       nivel: "Primaria",     tipo: "opcion",   enunciado: "¿Cuánto es 7 × 8?",
    opciones: ["56", "54", "63", "48"], correcta: 0 },
  { id: "d2", area: "Fracciones",       nivel: "Primaria",     tipo: "opcion",   enunciado: "Calcula 1/2 + 1/4",
    opciones: ["3/4", "2/6", "1/6", "2/4"], correcta: 0 },
  { id: "d3", area: "Números con signo", nivel: "Secundaria 1°", tipo: "numerica", enunciado: "Calcula −5 + 12. Escribe el número.",
    correcta: 7 },
  { id: "d4", area: "Álgebra",          nivel: "Secundaria 2°", tipo: "opcion",   enunciado: "Resuelve x + 7 = 12. ¿Cuánto vale x?",
    opciones: ["5", "19", "7", "−5"], correcta: 0 },
  { id: "d5", area: "Proporcionalidad", nivel: "Secundaria 2°", tipo: "opcion",   enunciado: "¿Cuánto es el 20% de 150?",
    opciones: ["30", "25", "20", "35"], correcta: 0 },
  { id: "d6", area: "Funciones",        nivel: "Preparatoria", tipo: "opcion",   enunciado: "Si f(x) = 2x + 1, ¿cuánto vale f(3)?",
    opciones: ["7", "6", "5", "9"], correcta: 0 },
];

// ── Notificaciones (campana) ──────────────────────────────────────────
const NOTIFICACIONES = [
  { id: "n1", tipo: "racha",  titulo: "¡Racha de 12 días! 🔥",        detalle: "No la rompas: te falta 1 práctica hoy", hace: "hace 10 min", color: "course-quim" },
  { id: "n2", tipo: "logro",  titulo: "Dominaste Fracciones equivalentes", detalle: "Repaso · Primaria 5°",             hace: "hace 2 h",   color: "course-bio" },
  { id: "n3", tipo: "tutor",  titulo: "Tu tutor IA revisó tu sesión", detalle: "3 sugerencias para mejorar en fracciones", hace: "ayer",     color: "course-his" },
  { id: "n4", tipo: "reto",   titulo: "Nuevo reto diario listo",       detalle: "5 problemas · gana 50 XP",              hace: "ayer",       color: "course-fis" },
];

// ── Preguntas frecuentes (Ayuda) ──────────────────────────────────────
const FAQ = [
  { q: "¿Cómo funciona mi ruta?",
    a: "Aula te hace un diagnóstico corto, detecta en qué temas vienes atrasado (aunque sean de grados anteriores) y arma una ruta que primero cierra esos huecos y luego avanza a tu grado. Cada skill es una lección corta + práctica. Cuando dominas una, se desbloquea la siguiente." },
  { q: "¿El tutor IA me da la respuesta?",
    a: "No de golpe. El tutor te explica paso a paso, te da pistas y te deja intentarlo. La idea es que entiendas el procedimiento, no que copies el resultado. Si de plano te atoras, te muestra la solución completa comentada." },
  { q: "¿Sirve sin internet?",
    a: "Sí. Descarga tu ruta y tus prácticas mientras tengas señal y podrás seguir resolviendo sin conexión — pensado para casas y escuelas con internet intermitente. Tu avance se sincroniza solo cuando vuelve la señal." },
  { q: "Soy mamá / papá / tutor. ¿Puedo ver el avance?",
    a: "Sí. Desde tu cuenta puedes compartir un resumen semanal con tu tutor: cuánto practicó, qué temas domina y en qué necesita apoyo. Sin tecnicismos, en lenguaje claro." },
  { q: "¿Desde qué nivel sirve?",
    a: "Desde preescolar (kínder) hasta preparatoria. Los contenidos siguen los aprendizajes clave del plan de estudios de México, adaptados por edad: conteo y formas para los más pequeños, hasta funciones y cálculo en prepa." },
  { q: "¿Cuánto debo practicar al día?",
    a: "Con 10 a 15 minutos diarios es suficiente para cerrar el rezago sin agobiarte. La constancia (tu racha) importa más que las sesiones largas. Aula te pone una meta diaria realista." },
];

Object.assign(window, {
  ESTUDIANTE, USER, HOY, ETAPAS, RUTA, PROBLEMAS,
  TUTOR_SUGERENCIAS, TUTOR_SEMILLA, AREAS, RACHA_SEMANAS, LOGROS,
  ESTADISTICAS, DIAGNOSTICO, NOTIFICACIONES, FAQ,
});
