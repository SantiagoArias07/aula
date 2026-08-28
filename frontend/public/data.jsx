// data.jsx — datos mock de "Aula · Regularización de matemáticas con IA".
// Todo se adapta por NIVEL (etapa): preescolar, primaria (modo niños) y
// secundaria, prepa (modo estudiante). Los problemas traen su respuesta real.

const HOY = "jueves 27 de agosto";

// ── Etapas / niveles ──────────────────────────────────────────────────
const ETAPAS = [
  { id: "prees", nombre: "Preescolar",   grados: "K1 – K3", color: "course-quim", modo: "kids", emoji: "🧸", desc: "Conteo, formas y primeros números" },
  { id: "prim",  nombre: "Primaria",     grados: "1° – 6°", color: "course-bio",  modo: "kids", emoji: "✏️", desc: "Operaciones, tablas y fracciones" },
  { id: "sec",   nombre: "Secundaria",   grados: "1° – 3°", color: "course-his",  modo: "teen", emoji: "🧭", desc: "Álgebra, proporciones y geometría" },
  { id: "prepa", nombre: "Preparatoria", grados: "1° – 3°", color: "course-fis",  modo: "teen", emoji: "🎓", desc: "Funciones, trigonometría y cálculo" },
];

// ── Perfiles (un estudiante demo por nivel) ───────────────────────────
const PERFILES = {
  prees: {
    nombre: "Emma", apellido: "Ríos Pardo", iniciales: "ER", edad: 5,
    etapa: "Preescolar", grado: "K2", nivelLabel: "Preescolar · K2", modo: "kids",
    escuela: "Jardín de Niños Juan Escutia", tutor: "papá (Sr. Ríos)", email: "familia.rios@aula.mx",
    racha: 4, rachaMax: 6, dominioGeneral: 55, objetivoDiario: 3, hechosHoy: 1, xp: 320,
    siguienteSkillId: "pre-contar",
  },
  prim: {
    nombre: "Sofía", apellido: "Gómez Lara", iniciales: "SG", edad: 9,
    etapa: "Primaria", grado: "4°", nivelLabel: "Primaria · 4°", modo: "kids",
    escuela: "Primaria Benito Juárez · Coatepec", tutor: "mamá (Sra. Lara)", email: "familia.gomez@aula.mx",
    racha: 8, rachaMax: 11, dominioGeneral: 62, objetivoDiario: 4, hechosHoy: 2, xp: 1180,
    siguienteSkillId: "pri-sumallevar",
  },
  sec: {
    nombre: "Diego", apellido: "Martínez Luna", iniciales: "DM", edad: 13,
    etapa: "Secundaria", grado: "2°", nivelLabel: "Secundaria · 2°", modo: "teen",
    escuela: "Sec. Téc. 42 · Xalapa, Ver.", tutor: "Sra. Luna (mamá)", email: "diego.martinez@aula.mx",
    racha: 12, rachaMax: 15, dominioGeneral: 64, objetivoDiario: 5, hechosHoy: 3, xp: 2480,
    siguienteSkillId: "frac-sumres",
  },
  prepa: {
    nombre: "Regina", apellido: "Ávila Soto", iniciales: "RA", edad: 17,
    etapa: "Preparatoria", grado: "2°", nivelLabel: "Prepa · 2°", modo: "teen",
    escuela: "CBTIS 190 · Veracruz", tutor: "ella misma", email: "regina.avila@aula.mx",
    racha: 10, rachaMax: 18, dominioGeneral: 58, objetivoDiario: 6, hechosHoy: 2, xp: 3120,
    siguienteSkillId: "pr-funciones",
  },
};

// ── Rutas por nivel (unidades → skills) ───────────────────────────────
const RUTAS = {
  prees: [
    { id: "up-num", unidad: "Números y conteo", origen: "Preescolar", resumen: "Aprende a contar y comparar cantidades.",
      skills: [
        { id: "pre-contar",   nombre: "Contar hasta 10", etapa: "Preescolar", estado: "en-progreso", dominio: 40, mins: 5, desc: "Cuenta objetos y di cuántos hay." },
        { id: "pre-comparar", nombre: "Más y menos",     etapa: "Preescolar", estado: "disponible",  dominio: 0,  mins: 5, desc: "¿Dónde hay más? ¿Dónde hay menos?" },
      ] },
    { id: "up-form", unidad: "Formas y colores", origen: "Preescolar", resumen: "Reconoce las figuras que te rodean.",
      skills: [
        { id: "pre-formas",   nombre: "Figuras",  etapa: "Preescolar", estado: "disponible", dominio: 0, mins: 5, desc: "Círculo, cuadrado y triángulo." },
        { id: "pre-patrones", nombre: "Patrones", etapa: "Preescolar", estado: "bloqueado",  dominio: 0, mins: 5, desc: "¿Qué sigue en la fila?" },
      ] },
  ],
  prim: [
    { id: "upr-sr", unidad: "Sumas y restas", origen: "Primaria 2° – 3°", esRezago: true, resumen: "Cierra las bases de sumar y restar llevando.",
      skills: [
        { id: "pri-sumallevar", nombre: "Sumas llevando", etapa: "Primaria 2°", esRezago: true, estado: "en-progreso", dominio: 55, mins: 8, desc: "Suma números de dos cifras llevando." },
        { id: "pri-restas",     nombre: "Restas prestando", etapa: "Primaria 3°", esRezago: true, estado: "bloqueado", dominio: 0, mins: 8, desc: "Resta pidiendo prestado a la decena." },
      ] },
    { id: "upr-mult", unidad: "Multiplicación", origen: "Primaria 4°", resumen: "Domina las tablas y los grupos iguales.",
      skills: [
        { id: "pri-tablas", nombre: "Tablas de multiplicar", etapa: "Primaria 4°", estado: "disponible", dominio: 0, mins: 9, desc: "Las tablas del 1 al 10." },
        { id: "pri-divi",   nombre: "División sencilla", etapa: "Primaria 4°", estado: "bloqueado", dominio: 0, mins: 9, desc: "Repartir en partes iguales." },
      ] },
    { id: "upr-frac", unidad: "Fracciones (introducción)", origen: "Primaria 4°", resumen: "Medios, cuartos y partes de un entero.",
      skills: [
        { id: "pri-fracintro", nombre: "Medios y cuartos", etapa: "Primaria 4°", estado: "disponible", dominio: 0, mins: 8, desc: "Partes iguales de una pizza o chocolate." },
        { id: "pri-decimales", nombre: "Decimales con dinero", etapa: "Primaria 5°", estado: "bloqueado", dominio: 0, mins: 9, desc: "Pesos y centavos." },
      ] },
  ],
  sec: [
    { id: "u-frac", unidad: "Repaso · Fracciones", origen: "Primaria 5° – 6°", esRezago: true, resumen: "Detectamos un hueco aquí. Lo cerramos antes de seguir con álgebra.",
      skills: [
        { id: "frac-equiv",  nombre: "Fracciones equivalentes", etapa: "Primaria 5°", esRezago: true, estado: "dominado",    dominio: 100, mins: 8,  desc: "Reconoce y crea fracciones que valen lo mismo." },
        { id: "frac-sumres", nombre: "Suma y resta de fracciones", etapa: "Primaria 5°", esRezago: true, estado: "en-progreso", dominio: 60,  mins: 10, desc: "Suma y resta con igual y distinto denominador." },
        { id: "frac-mult",   nombre: "Multiplicación de fracciones", etapa: "Primaria 6°", esRezago: true, estado: "disponible", dominio: 0,   mins: 9,  desc: "Multiplica fracciones y resuelve problemas de área." },
      ] },
    { id: "u-ent", unidad: "Números con signo", origen: "Secundaria 1°", esRezago: true, resumen: "Base para el álgebra: moverse con positivos y negativos.",
      skills: [
        { id: "ent-recta",  nombre: "Recta numérica y enteros", etapa: "Secundaria 1°", esRezago: true, estado: "dominado",   dominio: 100, mins: 7, desc: "Ordena y compara números positivos y negativos." },
        { id: "ent-sumres", nombre: "Suma y resta con negativos", etapa: "Secundaria 1°", esRezago: true, estado: "disponible", dominio: 20,  mins: 10, desc: "Opera con enteros en contextos reales." },
        { id: "ent-mult",   nombre: "Multiplicación y división con signo", etapa: "Secundaria 1°", estado: "bloqueado", dominio: 0, mins: 9, desc: "Reglas de los signos al multiplicar y dividir." },
      ] },
    { id: "u-alg", unidad: "Álgebra: expresiones y ecuaciones", origen: "Secundaria 2°", resumen: "Tu grado actual. Aquí es a donde vamos llegando.",
      skills: [
        { id: "alg-leng", nombre: "Lenguaje algebraico", etapa: "Secundaria 2°", estado: "bloqueado", dominio: 0, mins: 8,  desc: "Traduce frases a expresiones con literales." },
        { id: "alg-ecu",  nombre: "Ecuaciones de primer grado", etapa: "Secundaria 2°", estado: "bloqueado", dominio: 0, mins: 12, desc: "Resuelve ecuaciones del tipo ax + b = c." },
        { id: "alg-desp", nombre: "Despeje de fórmulas", etapa: "Secundaria 2°", estado: "bloqueado", dominio: 0, mins: 10, desc: "Despeja una variable de una fórmula." },
      ] },
  ],
  prepa: [
    { id: "upp-fun", unidad: "Funciones", origen: "Prepa 1°", resumen: "El lenguaje base del bachillerato: f(x).",
      skills: [
        { id: "pr-funciones", nombre: "Evaluar funciones", etapa: "Prepa 1°", estado: "en-progreso", dominio: 50, mins: 9, desc: "Sustituye valores en f(x) y calcula." },
        { id: "pr-pendiente", nombre: "Pendiente de una recta", etapa: "Prepa 1°", estado: "disponible", dominio: 0, mins: 9, desc: "y = mx + b y razón de cambio." },
      ] },
    { id: "upp-trig", unidad: "Trigonometría", origen: "Prepa 2°", resumen: "Triángulos, ángulos y razones.",
      skills: [
        { id: "pr-trig", nombre: "Razones trigonométricas", etapa: "Prepa 2°", estado: "disponible", dominio: 0, mins: 10, desc: "Seno, coseno y tangente (SOH-CAH-TOA)." },
        { id: "pr-ident", nombre: "Identidades básicas", etapa: "Prepa 2°", estado: "bloqueado", dominio: 0, mins: 11, desc: "Relaciones entre razones." },
      ] },
    { id: "upp-cal", unidad: "Cálculo (introducción)", origen: "Prepa 3°", resumen: "La antesala de la universidad.",
      skills: [
        { id: "pr-limites", nombre: "Noción de límite", etapa: "Prepa 3°", estado: "bloqueado", dominio: 0, mins: 12, desc: "Qué pasa cuando te acercas a un valor." },
        { id: "pr-deriv",   nombre: "Idea de derivada", etapa: "Prepa 3°", estado: "bloqueado", dominio: 0, mins: 13, desc: "Razón de cambio instantánea." },
      ] },
  ],
};

// ── Banco de problemas (respuesta real) ───────────────────────────────
// tipo: 'opcion' (correcta = índice) | 'numerica' (correcta = número)
const PROBLEMAS = {
  // ——— Preescolar ———
  "pre-contar": [
    { id: "pc1", tipo: "numerica", enunciado: "¿Cuántas manzanas hay? 🍎🍎🍎", correcta: 3,
      pistas: ["Cuéntalas con el dedo: 1, 2, 3."], pasos: ["Toca cada manzana y di un número.", "1, 2, 3.", "¡Son 3! 🎉"], explica: "Contar es decir un número por cada cosa." },
    { id: "pc2", tipo: "opcion", enunciado: "1, 2, 3, 4, … ¿qué número sigue?", opciones: ["5", "3", "6", "2"], correcta: 0,
      pistas: ["Cuenta hacia adelante desde el 4."], pasos: ["Después del 4 viene el 5."], explica: "Cada número es uno más que el anterior." },
    { id: "pc3", tipo: "numerica", enunciado: "Cuenta las estrellas ⭐⭐⭐⭐⭐", correcta: 5,
      pistas: ["Tócalas una por una."], pasos: ["1, 2, 3, 4, 5.", "¡Son 5! ⭐"], explica: "Una por una, sin saltarte ninguna." },
  ],
  "pre-comparar": [
    { id: "pm1", tipo: "opcion", enunciado: "¿Dónde hay MÁS? 🍎🍎 ó 🍎🍎🍎🍎", opciones: ["🍎🍎🍎🍎", "🍎🍎", "Igual", "No sé"], correcta: 0,
      pistas: ["Más es la cantidad más grande."], pasos: ["4 manzanas es más que 2."], explica: "Más quiere decir mayor cantidad." },
    { id: "pm2", tipo: "numerica", enunciado: "Tienes 2 dulces 🍬 y te dan 1 más. ¿Cuántos tienes?", correcta: 3,
      pistas: ["Junta: 2 y 1 más."], pasos: ["2 + 1 = 3.", "¡Ahora tienes 3! 🍬"], explica: "Juntar cosas es sumar." },
    { id: "pm3", tipo: "opcion", enunciado: "¿Qué número es MENOR: 2 ó 5?", opciones: ["2", "5", "Igual", "No sé"], correcta: 0,
      pistas: ["Menor es el más chiquito."], pasos: ["2 es más pequeño que 5."], explica: "Menor = más pequeño." },
  ],
  "pre-formas": [
    { id: "pf1", tipo: "opcion", enunciado: "¿Cuál es un círculo?", opciones: ["⚫", "🔺", "🟦", "⭐"], correcta: 0,
      pistas: ["El círculo es redondito, sin picos."], pasos: ["El redondo es el círculo."], explica: "El círculo no tiene esquinas." },
    { id: "pf2", tipo: "opcion", enunciado: "¿Cuál tiene 3 lados?", opciones: ["🔺 triángulo", "🟦 cuadrado", "⚫ círculo", "❤️ corazón"], correcta: 0,
      pistas: ["Cuenta los lados de cada figura."], pasos: ["El triángulo tiene 3 lados."], explica: "Tri quiere decir tres." },
    { id: "pf3", tipo: "opcion", enunciado: "¿Cuál es un cuadrado?", opciones: ["🟦", "🔺", "⚫", "⭐"], correcta: 0,
      pistas: ["Tiene 4 lados iguales."], pasos: ["El cuadrado tiene 4 lados iguales."], explica: "4 lados del mismo tamaño." },
  ],
  // ——— Primaria ———
  "pri-sumallevar": [
    { id: "ps1", tipo: "numerica", enunciado: "Calcula 27 + 15", correcta: 42,
      pistas: ["Unidades: 7 + 5 = 12. Escribe 2 y llevas 1.", "Decenas: 2 + 1 + 1 = 4."],
      pasos: ["Unidades: 7 + 5 = 12 → pones 2 y llevas 1.", "Decenas: 2 + 1 + 1(que llevabas) = 4.", "Resultado: 42."], explica: "Cuando pasa de 9, llevas 1 a la siguiente columna." },
    { id: "ps2", tipo: "numerica", enunciado: "Juntaste 38 taparroscas ♻️ y luego 24 más. ¿Cuántas tienes?", correcta: 62,
      pistas: ["38 + 24.", "8 + 4 = 12 (lleva 1); 3 + 2 + 1 = 6."], pasos: ["8 + 4 = 12 → pon 2, lleva 1.", "3 + 2 + 1 = 6.", "Son 62."], explica: "Suma llevando, columna por columna." },
    { id: "ps3", tipo: "opcion", enunciado: "¿Cuánto es 49 + 26?", opciones: ["75", "65", "74", "85"], correcta: 0,
      pistas: ["9 + 6 = 15, lleva 1."], pasos: ["9 + 6 = 15 → 5 y lleva 1.", "4 + 2 + 1 = 7.", "75."], explica: "No olvides sumar lo que llevabas." },
  ],
  "pri-tablas": [
    { id: "pt1", tipo: "opcion", enunciado: "¿Cuánto es 6 × 7?", opciones: ["42", "36", "48", "40"], correcta: 0,
      pistas: ["Cuenta de 7 en 7: 7, 14, 21, 28, 35, 42."], pasos: ["6 veces 7.", "7,14,21,28,35,42.", "6 × 7 = 42."], explica: "Multiplicar es sumar el mismo número varias veces." },
    { id: "pt2", tipo: "numerica", enunciado: "Hay 4 cajas con 5 galletas 🍪 cada una. ¿Cuántas galletas hay?", correcta: 20,
      pistas: ["4 grupos de 5.", "5 + 5 + 5 + 5 = 20."], pasos: ["4 × 5 = 20."], explica: "Grupos iguales se multiplican." },
    { id: "pt3", tipo: "opcion", enunciado: "¿Cuánto es 8 × 3?", opciones: ["24", "21", "18", "27"], correcta: 0,
      pistas: ["8, 16, 24."], pasos: ["8 × 3 = 24."], explica: "Tabla del 8." },
  ],
  "pri-fracintro": [
    { id: "pfi1", tipo: "opcion", enunciado: "Una pizza 🍕 se parte en 4 partes iguales y te comes 1. ¿Qué fracción comiste?", opciones: ["1/4", "1/2", "4/1", "2/4"], correcta: 0,
      pistas: ["1 parte de 4."], pasos: ["4 partes iguales → abajo va 4.", "Comiste 1 → arriba va 1.", "1/4."], explica: "Arriba lo que tomas, abajo el total de partes." },
    { id: "pfi2", tipo: "opcion", enunciado: "¿Qué fracción es la MITAD?", opciones: ["1/2", "1/4", "2/1", "1/3"], correcta: 0,
      pistas: ["Mitad = 1 de 2 partes iguales."], pasos: ["Mitad → 1/2."], explica: "Un medio es partir en 2 y tomar 1." },
    { id: "pfi3", tipo: "opcion", enunciado: "Un chocolate 🍫 en 2 partes iguales, te comes las 2. ¿Cuánto comiste?", opciones: ["2/2 (todo)", "1/2", "1/4", "0/2"], correcta: 0,
      pistas: ["Comiste todas las partes."], pasos: ["2 de 2 partes = todo = 2/2."], explica: "Cuando tomas todas las partes, es el entero." },
  ],
  // ——— Secundaria ———
  "frac-equiv": [
    { id: "fe1", tipo: "opcion", enunciado: "¿Cuál fracción es equivalente a 1/2?", opciones: ["2/4", "1/3", "2/3", "3/4"], correcta: 0,
      pistas: ["Multiplica el numerador y el denominador por el mismo número.", "1/2 = (1×2)/(2×2) = 2/4."],
      pasos: ["Multiplica arriba y abajo por el mismo número.", "1×2 = 2 y 2×2 = 4.", "1/2 = 2/4."], explica: "Una fracción equivalente vale lo mismo, con otros números." },
    { id: "fe2", tipo: "opcion", enunciado: "¿Cuál es equivalente a 3/4?", opciones: ["6/8", "4/5", "2/4", "3/8"], correcta: 0,
      pistas: ["Multiplica arriba y abajo por 2."], pasos: ["3×2 = 6, 4×2 = 8.", "3/4 = 6/8."], explica: "Multiplicar por el mismo número no cambia el valor." },
    { id: "fe3", tipo: "opcion", enunciado: "Simplifica 4/8 a su forma más simple.", opciones: ["1/2", "2/8", "4/4", "1/4"], correcta: 0,
      pistas: ["Divide arriba y abajo entre 4."], pasos: ["4÷4 = 1, 8÷4 = 2.", "4/8 = 1/2."], explica: "Simplificar es dividir arriba y abajo entre el mismo número." },
  ],
  "frac-sumres": [
    { id: "fs1", tipo: "opcion", enunciado: "Calcula 1/4 + 2/4", opciones: ["3/4", "3/8", "2/8", "1/2"], correcta: 0,
      pistas: ["Los denominadores ya son iguales (4). Suma solo los numeradores.", "1 + 2 = 3."],
      pasos: ["Denominador igual: sumamos numeradores 1 + 2 = 3.", "El denominador se queda en 4.", "Resultado: 3/4."], explica: "Con igual denominador, sumas numeradores y conservas el denominador." },
    { id: "fs2", tipo: "opcion", enunciado: "Calcula 1/2 + 1/3", opciones: ["5/6", "2/5", "2/6", "1/6"], correcta: 0,
      pistas: ["Denominador común de 2 y 3 es 6.", "1/2 = 3/6 y 1/3 = 2/6."],
      pasos: ["Denominador común: 6.", "1/2 = 3/6 y 1/3 = 2/6.", "3 + 2 = 5.", "Resultado: 5/6."], explica: "Con distinto denominador, primero igualas denominadores." },
    { id: "fs3", tipo: "opcion", enunciado: "Calcula 3/4 − 1/2", opciones: ["1/4", "2/2", "1/2", "2/4"], correcta: 0,
      pistas: ["1/2 = 2/4.", "3/4 − 2/4 = 1/4."], pasos: ["1/2 = 2/4.", "3 − 2 = 1.", "Resultado: 1/4."], explica: "Iguala denominadores y resta los numeradores." },
    { id: "fs4", tipo: "opcion", enunciado: "En un salón, 2/5 juegan futbol y 1/5 básquetbol. ¿Qué fracción hace deporte?", opciones: ["3/5", "3/10", "2/5", "1/5"], correcta: 0,
      pistas: ["Mismo denominador (5): suma numeradores."], pasos: ["2 + 1 = 3.", "Resultado: 3/5."], explica: "Igual denominador se suma directo." },
    { id: "fs5", tipo: "opcion", enunciado: "Calcula 5/6 − 1/3", opciones: ["1/2", "4/3", "4/6", "1/6"], correcta: 0,
      pistas: ["1/3 = 2/6.", "5/6 − 2/6 = 3/6 = 1/2."], pasos: ["1/3 = 2/6.", "5/6 − 2/6 = 3/6.", "3/6 = 1/2."], explica: "Iguala, resta y simplifica." },
  ],
  "frac-mult": [
    { id: "fmm1", tipo: "opcion", enunciado: "Calcula 1/2 × 1/3", opciones: ["1/6", "1/5", "2/3", "1/2"], correcta: 0,
      pistas: ["Multiplica numeradores entre sí y denominadores entre sí.", "1×1 = 1 y 2×3 = 6."], pasos: ["1×1 = 1.", "2×3 = 6.", "Resultado: 1/6."], explica: "Al multiplicar fracciones se multiplica en línea, sin denominador común." },
    { id: "fmm2", tipo: "opcion", enunciado: "Calcula 2/3 × 3/4", opciones: ["1/2", "6/7", "5/7", "6/4"], correcta: 0,
      pistas: ["2×3 = 6 y 3×4 = 12, luego simplifica."], pasos: ["6/12.", "6/12 = 1/2."], explica: "Multiplica en línea y simplifica." },
    { id: "fmm3", tipo: "numerica", enunciado: "Un terreno mide 1/2 km de ancho y 4 km de largo. ¿Cuál es su área en km²?", correcta: 2,
      pistas: ["Área = 1/2 × 4.", "La mitad de 4 es 2."], pasos: ["Área = 1/2 × 4.", "= 2 km²."], explica: "Multiplicar por 1/2 es sacar la mitad." },
  ],
  "ent-sumres": [
    { id: "es1", tipo: "numerica", enunciado: "En Xalapa amaneció a −2 °C y subió 9 °C. ¿Qué temperatura hay?", correcta: 7,
      pistas: ["Parte de −2 y avanza 9 a la derecha.", "−2 + 9 = 7."], pasos: ["Partimos de −2.", "Subir 9 = sumar 9.", "−2 + 9 = 7 °C."], explica: "Sumar avanza a la derecha en la recta." },
    { id: "es2", tipo: "numerica", enunciado: "Un buzo está a −15 m y baja 8 m más. ¿A qué profundidad queda? (ej. −23)", correcta: -23,
      pistas: ["Bajar es restar (hacerse más negativo).", "−15 − 8 = −23."], pasos: ["Empieza en −15.", "Bajar 8 = restar 8.", "−15 − 8 = −23 m."], explica: "Bajar aumenta la profundidad (más negativo)." },
    { id: "es3", tipo: "opcion", enunciado: "Calcula −4 + (−6)", opciones: ["−10", "−2", "10", "2"], correcta: 0,
      pistas: ["Como deber $4 y deber $6."], pasos: ["4 + 6 = 10, con signo negativo.", "−10."], explica: "Negativo más negativo da negativo." },
    { id: "es4", tipo: "numerica", enunciado: "Debías $50 y pagaste $30. ¿Cuánto debes ahora? Escribe el monto.", correcta: 20,
      pistas: ["Deber 50 = −50; pagar 30 = +30.", "−50 + 30 = −20."], pasos: ["−50 + 30 = −20.", "Aún debes $20."], explica: "Pagar reduce la deuda." },
  ],
  // ——— Preparatoria ———
  "pr-funciones": [
    { id: "prf1", tipo: "opcion", enunciado: "Si f(x) = 2x + 1, ¿cuánto vale f(3)?", opciones: ["7", "6", "9", "5"], correcta: 0,
      pistas: ["Sustituye x por 3.", "2(3) + 1 = 7."], pasos: ["f(3) = 2·3 + 1.", "= 6 + 1.", "= 7."], explica: "Evaluar una función es sustituir el valor en la x." },
    { id: "prf2", tipo: "numerica", enunciado: "Si g(x) = x^2 − 4, ¿cuánto vale g(3)?", correcta: 5,
      pistas: ["3 al cuadrado es 9.", "9 − 4 = 5."], pasos: ["g(3) = 3^2 − 4.", "= 9 − 4.", "= 5."], explica: "Primero la potencia, luego la resta." },
    { id: "prf3", tipo: "opcion", enunciado: "Si f(x) = 5x, ¿cuánto vale f(0)?", opciones: ["0", "5", "1", "10"], correcta: 0,
      pistas: ["5 por 0."], pasos: ["f(0) = 5·0 = 0."], explica: "Cualquier número por 0 es 0." },
  ],
  "pr-pendiente": [
    { id: "prp1", tipo: "opcion", enunciado: "En y = 3x + 2, ¿cuál es la pendiente?", opciones: ["3", "2", "5", "x"], correcta: 0,
      pistas: ["En y = mx + b, la m es la pendiente."], pasos: ["Compara con y = mx + b.", "m = 3."], explica: "La pendiente es el número que multiplica a x." },
    { id: "prp2", tipo: "numerica", enunciado: "Pendiente entre (0,1) y (2,7): (7 − 1) ÷ (2 − 0). ¿Cuánto es?", correcta: 3,
      pistas: ["Cambio en y sobre cambio en x.", "6 ÷ 2 = 3."], pasos: ["Δy = 7 − 1 = 6.", "Δx = 2 − 0 = 2.", "m = 6 ÷ 2 = 3."], explica: "Pendiente = subida ÷ avance." },
    { id: "prp3", tipo: "opcion", enunciado: "En y = −2x + 5, ¿la recta sube o baja?", opciones: ["Baja", "Sube", "Es horizontal", "Es vertical"], correcta: 0,
      pistas: ["Pendiente negativa → baja."], pasos: ["m = −2 (negativa).", "Pendiente negativa → la recta baja."], explica: "Pendiente positiva sube, negativa baja." },
  ],
  "pr-trig": [
    { id: "prt1", tipo: "opcion", enunciado: "¿Cuánto vale sen(30°)?", opciones: ["0.5", "1", "0", "0.87"], correcta: 0,
      pistas: ["Es un valor clásico.", "sen(30°) = 1/2."], pasos: ["sen(30°) es un valor conocido.", "= 1/2 = 0.5."], explica: "Conviene memorizar 30°, 45° y 60°." },
    { id: "prt2", tipo: "opcion", enunciado: "El seno es el cateto…", opciones: ["opuesto / hipotenusa", "adyacente / hipotenusa", "opuesto / adyacente", "hipotenusa / opuesto"], correcta: 0,
      pistas: ["SOH: Seno = Opuesto / Hipotenusa."], pasos: ["Recuerda SOH-CAH-TOA.", "Seno = Opuesto / Hipotenusa."], explica: "SOH-CAH-TOA relaciona lados y razones." },
    { id: "prt3", tipo: "numerica", enunciado: "Cateto opuesto 3, hipotenusa 6. ¿Cuánto es el seno? (decimal)", correcta: 0.5,
      pistas: ["Seno = opuesto / hipotenusa = 3/6."], pasos: ["sen = 3 ÷ 6.", "= 0.5."], explica: "Divide el opuesto entre la hipotenusa." },
  ],
};

// ── Diagnóstico por nivel ─────────────────────────────────────────────
const DIAGNOSTICOS = {
  prees: [
    { id: "dpe1", area: "Conteo", nivel: "Preescolar", tipo: "numerica", enunciado: "Cuenta: 🍎🍎🍎🍎", correcta: 4 },
    { id: "dpe2", area: "Formas", nivel: "Preescolar", tipo: "opcion", enunciado: "¿Cuál es un círculo?", opciones: ["⚫", "🔺", "🟦"], correcta: 0 },
    { id: "dpe3", area: "Comparar", nivel: "Preescolar", tipo: "opcion", enunciado: "¿Dónde hay más? 🐤🐤 ó 🐤🐤🐤", opciones: ["🐤🐤🐤", "🐤🐤", "Igual"], correcta: 0 },
    { id: "dpe4", area: "Conteo", nivel: "Preescolar", tipo: "numerica", enunciado: "1, 2, 3, … ¿qué sigue?", correcta: 4 },
  ],
  prim: [
    { id: "dpr1", area: "Multiplicación", nivel: "Primaria", tipo: "opcion", enunciado: "¿Cuánto es 7 × 8?", opciones: ["56", "54", "63"], correcta: 0 },
    { id: "dpr2", area: "Sumas", nivel: "Primaria", tipo: "numerica", enunciado: "Calcula 27 + 15", correcta: 42 },
    { id: "dpr3", area: "Fracciones", nivel: "Primaria", tipo: "opcion", enunciado: "¿Qué fracción es la mitad?", opciones: ["1/2", "1/4", "2/2"], correcta: 0 },
    { id: "dpr4", area: "Restas", nivel: "Primaria", tipo: "numerica", enunciado: "Calcula 100 − 45", correcta: 55 },
  ],
  sec: [
    { id: "d1", area: "Aritmética", nivel: "Primaria", tipo: "opcion", enunciado: "¿Cuánto es 7 × 8?", opciones: ["56", "54", "63", "48"], correcta: 0 },
    { id: "d2", area: "Fracciones", nivel: "Primaria", tipo: "opcion", enunciado: "Calcula 1/2 + 1/4", opciones: ["3/4", "2/6", "1/6", "2/4"], correcta: 0 },
    { id: "d3", area: "Números con signo", nivel: "Secundaria 1°", tipo: "numerica", enunciado: "Calcula −5 + 12.", correcta: 7 },
    { id: "d4", area: "Álgebra", nivel: "Secundaria 2°", tipo: "opcion", enunciado: "Resuelve x + 7 = 12. ¿Cuánto vale x?", opciones: ["5", "19", "7", "−5"], correcta: 0 },
    { id: "d5", area: "Proporcionalidad", nivel: "Secundaria 2°", tipo: "opcion", enunciado: "¿Cuánto es el 20% de 150?", opciones: ["30", "25", "20", "35"], correcta: 0 },
    { id: "d6", area: "Funciones", nivel: "Preparatoria", tipo: "opcion", enunciado: "Si f(x) = 2x + 1, ¿cuánto vale f(3)?", opciones: ["7", "6", "5", "9"], correcta: 0 },
  ],
  prepa: [
    { id: "dpp1", area: "Funciones", nivel: "Prepa", tipo: "opcion", enunciado: "Si f(x) = 2x + 1, ¿cuánto vale f(3)?", opciones: ["7", "6", "5"], correcta: 0 },
    { id: "dpp2", area: "Rectas", nivel: "Prepa", tipo: "opcion", enunciado: "Pendiente de y = 3x + 2", opciones: ["3", "2", "5"], correcta: 0 },
    { id: "dpp3", area: "Funciones", nivel: "Prepa", tipo: "numerica", enunciado: "Si g(x) = x^2 − 4, calcula g(3)", correcta: 5 },
    { id: "dpp4", area: "Trigonometría", nivel: "Prepa", tipo: "opcion", enunciado: "¿Cuánto vale sen(30°)?", opciones: ["0.5", "1", "0"], correcta: 0 },
    { id: "dpp5", area: "Álgebra", nivel: "Secundaria", tipo: "opcion", enunciado: "Resuelve 2x = 10", opciones: ["5", "20", "8"], correcta: 0 },
  ],
};

// ── Áreas por nivel (para Progreso) ───────────────────────────────────
const AREAS_POR_NIVEL = {
  prees: [
    { id: "conteo", nombre: "Conteo", dominio: 60, color: "course-quim" },
    { id: "formas", nombre: "Formas", dominio: 45, color: "course-fis" },
    { id: "comparar", nombre: "Comparar cantidades", dominio: 52, color: "course-bio" },
  ],
  prim: [
    { id: "mult", nombre: "Multiplicación", dominio: 70, color: "course-mat" },
    { id: "sumres", nombre: "Sumas y restas", dominio: 64, color: "course-bio", rezago: true },
    { id: "frac", nombre: "Fracciones", dominio: 48, color: "course-his" },
    { id: "geo", nombre: "Geometría", dominio: 55, color: "course-fis" },
  ],
  sec: [
    { id: "arit", nombre: "Aritmética", dominio: 82, color: "course-mat" },
    { id: "frac", nombre: "Fracciones", dominio: 58, color: "course-bio", rezago: true },
    { id: "alg", nombre: "Álgebra", dominio: 34, color: "course-his" },
    { id: "geo", nombre: "Geometría", dominio: 61, color: "course-fis" },
    { id: "datos", nombre: "Datos y azar", dominio: 47, color: "course-quim" },
  ],
  prepa: [
    { id: "fun", nombre: "Funciones", dominio: 52, color: "course-fis" },
    { id: "alg", nombre: "Álgebra", dominio: 60, color: "course-his" },
    { id: "trig", nombre: "Trigonometría", dominio: 40, color: "course-quim" },
    { id: "geoan", nombre: "Geometría analítica", dominio: 47, color: "course-mat" },
    { id: "cal", nombre: "Cálculo", dominio: 30, color: "course-bio" },
  ],
};

// ── Datos compartidos ─────────────────────────────────────────────────
const RACHA_SEMANAS = [
  [0, 1, 2, 1, 3, 2, 0], [1, 2, 1, 0, 2, 3, 1], [2, 3, 2, 1, 1, 0, 2],
  [1, 2, 3, 2, 2, 1, 0], [0, 1, 2, 3, 2, 2, 3], [2, 3, 3, 2, 3, 1, 0],
];

const LOGROS = [
  { id: "l1", nombre: "Racha de 7 días", icono: "flame", hecho: true, desc: "Practicaste una semana seguida" },
  { id: "l2", nombre: "100 problemas", icono: "target", hecho: true, desc: "Resolviste tus primeros 100" },
  { id: "l3", nombre: "Sesión perfecta", icono: "trophy", hecho: true, desc: "Cero errores en una práctica" },
  { id: "l4", nombre: "Madrugador", icono: "clock", hecho: true, desc: "Practicaste antes de las 8 am" },
  { id: "l5", nombre: "Cierra el rezago", icono: "medal", hecho: false, desc: "Domina todo tu repaso pendiente", progreso: 70 },
  { id: "l6", nombre: "Domina un tema", icono: "star", hecho: false, desc: "Lleva un área al 100%", progreso: 58 },
];

const ESTADISTICAS = {
  skillsDominadas: 14, problemasResueltos: 342, precision: 88, minutos: 620, rezagoRecuperado: 3,
};

const NOTIFICACIONES = [
  { id: "n1", tipo: "racha", titulo: "¡No pierdas tu racha! 🔥", detalle: "Te falta 1 práctica hoy", hace: "hace 10 min", color: "course-quim" },
  { id: "n2", tipo: "logro", titulo: "¡Nuevo tema dominado!", detalle: "Sumaste dominio a tu nivel", hace: "hace 2 h", color: "course-bio" },
  { id: "n3", tipo: "tutor", titulo: "Tu tutor IA revisó tu sesión", detalle: "3 sugerencias para mejorar", hace: "ayer", color: "course-his" },
  { id: "n4", tipo: "reto", titulo: "Nuevo reto diario listo", detalle: "Gana XP y sube de nivel", hace: "ayer", color: "course-fis" },
];

const TUTOR_SUGERENCIAS = [
  "Explícame las fracciones con distinto denominador",
  "¿Cómo despejo la x en una ecuación?",
  "No entiendo los números negativos",
  "¿Cómo saco un porcentaje?",
];

const TUTOR_SEMILLA = [
  { mio: true, hora: "hace 5 min", txt: "Profe IA, no entiendo cómo sumar 1/2 + 1/3 😩" },
  { mio: false, hora: "hace 5 min", pasos: [
      "¡Tranqui! Vamos paso a paso, no te doy el resultado de golpe.",
      "Los denominadores (el de abajo) son distintos: 2 y 3.",
      "El denominador común más pequeño para 2 y 3 es 6.",
      "Convierte: 1/2 = 3/6 y 1/3 = 2/6.",
      "Ya con el mismo denominador, suma los de arriba: 3 + 2 = 5.",
      "¿Qué crees que queda de resultado? 👇",
    ] },
  { mio: true, hora: "hace 4 min", txt: "¿5/6?" },
  { mio: false, hora: "hace 4 min", txt: "¡Exacto! 🎉 5/6. Lo entendiste perfecto. ¿Quieres que te ponga uno para practicar?" },
];

const FAQ = [
  { q: "¿Cómo funciona mi ruta?",
    a: "Aula te hace un diagnóstico corto, detecta en qué temas vienes atrasado (aunque sean de grados anteriores) y arma una ruta que primero cierra esos huecos y luego avanza a tu grado. Cada skill es una lección corta + práctica. Cuando dominas una, se desbloquea la siguiente." },
  { q: "¿El tutor IA me da la respuesta?",
    a: "No de golpe. El tutor te explica paso a paso, te da pistas y te deja intentarlo. La idea es que entiendas el procedimiento, no que copies el resultado. Si de plano te atoras, te muestra la solución completa comentada." },
  { q: "¿Cambia según mi nivel escolar?",
    a: "Sí, y bastante. En preescolar y primaria usamos el ‘modo niños’: más grande, más visual, con dibujos, premios y lenguaje sencillo. En secundaria y prepa cambia a un modo con más información y ritmo. El contenido, la ruta y hasta cómo se ve se adaptan a tu edad." },
  { q: "¿Sirve sin internet?",
    a: "Sí. Descarga tu ruta y tus prácticas con señal y podrás seguir resolviendo sin conexión — pensado para casas y escuelas con internet intermitente. Tu avance se sincroniza al reconectar." },
  { q: "Soy mamá / papá / tutor. ¿Puedo ver el avance?",
    a: "Sí. Desde la cuenta puedes compartir un resumen semanal: cuánto practicó, qué domina y en qué necesita apoyo. En lenguaje claro." },
  { q: "¿Cuánto debo practicar al día?",
    a: "Con 10 a 15 minutos diarios basta para cerrar el rezago. La constancia (tu racha) importa más que las sesiones largas." },
];

// ── Estado activo + helpers conscientes del nivel ─────────────────────
const ESTADO = { nivel: "sec" };
const ESTUDIANTE = {};          // se llena con setNivel(); identidad estable
const USER = ESTUDIANTE;        // alias de compatibilidad

function setNivel(id) {
  if (!PERFILES[id]) return;
  ESTADO.nivel = id;
  Object.keys(ESTUDIANTE).forEach(k => delete ESTUDIANTE[k]);
  Object.assign(ESTUDIANTE, PERFILES[id]);
}
function rutaActiva() { return RUTAS[ESTADO.nivel] || []; }
function diagnosticoActivo() { return DIAGNOSTICOS[ESTADO.nivel] || []; }
function areasActivas() { return AREAS_POR_NIVEL[ESTADO.nivel] || []; }
function etapaActiva() { return ETAPAS.find(e => e.id === ESTADO.nivel) || ETAPAS[2]; }
function modoActivo() { return (PERFILES[ESTADO.nivel] || {}).modo || "teen"; }
function todosLosSkills() { return rutaActiva().flatMap(u => u.skills); }
function skillById(id) {
  for (const nivel in RUTAS) { for (const u of RUTAS[nivel]) { const s = u.skills.find(s => s.id === id); if (s) return s; } }
  return null;
}
function unidadDeSkill(id) {
  for (const nivel in RUTAS) { const u = RUTAS[nivel].find(u => u.skills.some(s => s.id === id)); if (u) return u; }
  return null;
}
function problemasDe(id) { return PROBLEMAS[id] || []; }
function siguienteSkill() { return skillById(ESTUDIANTE.siguienteSkillId); }
function saludoHora() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

setNivel("sec");

Object.assign(window, {
  HOY, ETAPAS, PERFILES, RUTAS, PROBLEMAS, DIAGNOSTICOS, AREAS_POR_NIVEL,
  RACHA_SEMANAS, LOGROS, ESTADISTICAS, NOTIFICACIONES, TUTOR_SUGERENCIAS, TUTOR_SEMILLA, FAQ,
  ESTADO, ESTUDIANTE, USER,
  setNivel, rutaActiva, diagnosticoActivo, areasActivas, etapaActiva, modoActivo,
  todosLosSkills, skillById, unidadDeSkill, problemasDe, siguienteSkill, saludoHora,
});
