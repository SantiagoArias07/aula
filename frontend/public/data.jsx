// data.jsx — mock data for the prototype, all in natural Mexican Spanish

const USER = {
  nombre: "María Elena",
  apellido: "Hernández Castro",
  matricula: "A01234567",
  rol: "Estudiante",
  carrera: "Ingeniería en Sistemas Computacionales",
  semestre: "5° semestre",
  institucion: "Universidad Pública de Ejemplo",
  email: "maria.hernandez@aula.mx",
  promedio: 8.7,
  creditosCursados: 142,
  creditosTotales: 320,
  iniciales: "ME",
};

const HOY = "Sábado 16 de mayo";
const HORA_SALUDO = "Buenas tardes";

const CURSOS = [
  { id: "mat", clave: "MAT-301", nombre: "Cálculo Integral", docente: "Dr. Roberto Mendoza", grupo: "501", color: "course-mat", creditos: 8, calif: 9.1, progreso: 72, proximas: 2 },
  { id: "his", clave: "HIS-210", nombre: "Historia de México Contemporáneo", docente: "Mtra. Lucía Ramírez", grupo: "503", color: "course-his", creditos: 6, calif: 8.9, progreso: 64, proximas: 1 },
  { id: "bio", clave: "BIO-105", nombre: "Biología Celular", docente: "Dra. Adriana Solís", grupo: "501", color: "course-bio", creditos: 7, calif: 8.4, progreso: 58, proximas: 3 },
  { id: "quim", clave: "QUI-220", nombre: "Química Orgánica", docente: "Dr. Fernando Cruz", grupo: "502", color: "course-quim", creditos: 7, calif: 7.8, progreso: 51, proximas: 2 },
  { id: "let", clave: "LET-150", nombre: "Taller de Lectura y Redacción", docente: "Mtra. Patricia Vega", grupo: "504", color: "course-let", creditos: 4, calif: 9.4, progreso: 80, proximas: 0 },
  { id: "fis", clave: "FIS-301", nombre: "Física Moderna", docente: "Dr. Andrés Ochoa", grupo: "501", color: "course-fis", creditos: 8, calif: 8.0, progreso: 60, proximas: 2 },
];

// Tareas por día relativos a "hoy"
const TAREAS = [
  { id: "t1", curso: "mat",  titulo: "Problemario · Integrales por partes", tipo: "Tarea",       puntos: 100, vence: "hoy 23:59", urgencia: "hoy",    estado: "pendiente" },
  { id: "t2", curso: "bio",  titulo: "Reporte · Práctica de mitosis",        tipo: "Reporte",     puntos: 50,  vence: "mañana 23:59", urgencia: "manana", estado: "pendiente" },
  { id: "t3", curso: "let",  titulo: "Ensayo argumentativo (2da entrega)",   tipo: "Ensayo",      puntos: 100, vence: "lun 19, 14:00", urgencia: "semana", estado: "borrador" },
  { id: "t4", curso: "his",  titulo: "Lectura: La Revolución Mexicana, cap. 3", tipo: "Lectura", puntos: 0,   vence: "mar 20",       urgencia: "semana", estado: "pendiente" },
  { id: "t5", curso: "quim", titulo: "Examen parcial · Hidrocarburos",       tipo: "Examen",      puntos: 100, vence: "mié 21, 09:00", urgencia: "semana", estado: "pendiente" },
  { id: "t6", curso: "fis",  titulo: "Tarea 7 · Efecto fotoeléctrico",       tipo: "Tarea",       puntos: 50,  vence: "jue 22",       urgencia: "semana", estado: "pendiente" },
  { id: "t7", curso: "mat",  titulo: "Quiz aplicaciones de la integral",     tipo: "Quiz",        puntos: 20,  vence: "vie 23",       urgencia: "semana", estado: "pendiente" },
];

const ENTREGADAS = [
  { id: "e1", curso: "let", titulo: "Ensayo argumentativo (1ra entrega)", calif: 95, total: 100, fecha: "9 may" },
  { id: "e2", curso: "mat", titulo: "Quiz: derivadas parciales",          calif: 88, total: 100, fecha: "7 may" },
  { id: "e3", curso: "his", titulo: "Línea del tiempo · Independencia",   calif: 90, total: 100, fecha: "5 may" },
  { id: "e4", curso: "bio", titulo: "Examen parcial 1",                   calif: 84, total: 100, fecha: "30 abr" },
  { id: "e5", curso: "fis", titulo: "Tarea 6 · Relatividad especial",     calif: 78, total: 100, fecha: "28 abr", retro: "Falta justificar el paso 4. Vamos bien." },
];

const HORARIO_HOY = [
  { hora: "08:00", curso: "fis", titulo: "Física Moderna",    sala: "Salón B-204", estado: "asistido" },
  { hora: "10:00", curso: "mat", titulo: "Cálculo Integral",  sala: "Salón A-110", estado: "asistido" },
  { hora: "12:00", curso: "let", titulo: "Lectura y Redacción", sala: "Salón C-301", estado: "ahora" },
  { hora: "14:00", curso: "his", titulo: "Historia de México", sala: "Salón A-205", estado: "proximo" },
  { hora: "16:00", curso: "bio", titulo: "Biología Celular",   sala: "Lab 3",       estado: "proximo" },
];

const GRUPOS = [
  { id: "g1", nombre: "Equipo · Cálculo aplicado", miembros: 4, curso: "mat",  ultimo: "Carlos compartió un PDF", hace: "hace 12 min", noLeidos: 2 },
  { id: "g2", nombre: "Proyecto integrador",        miembros: 5, curso: "fis",  ultimo: "Sara: Yo hago la intro",   hace: "hace 1 h",   noLeidos: 0 },
  { id: "g3", nombre: "Lectura de Historia",        miembros: 3, curso: "his",  ultimo: "Mtra. Lucía añadió material", hace: "ayer",    noLeidos: 4 },
  { id: "g4", nombre: "Bio · Estudio examen",       miembros: 6, curso: "bio",  ultimo: "Nos vemos el viernes",     hace: "lunes",      noLeidos: 0 },
];

const MENSAJES = [
  { id: "m1", de: "Dr. Roberto Mendoza", curso: "mat", asunto: "Sobre tu duda del problema 14", preview: "Hola María, sí, ahí debes usar integración por partes. Si quieres pasa al cubículo…", hace: "hace 8 min",  noLeido: true,  avatar: "RM" },
  { id: "m2", de: "Mtra. Lucía Ramírez", curso: "his", asunto: "Material complementario semana 7", preview: "Subí dos lecturas optativas al curso. No son obligatorias pero las van a disfrutar…", hace: "hace 2 h",    noLeido: true,  avatar: "LR" },
  { id: "m3", de: "Coordinación académica", curso: null, asunto: "Recordatorio: solicitud de constancia", preview: "Si solicitaste constancia de estudios, está lista para recoger en ventanilla…", hace: "ayer", noLeido: false, avatar: "CA" },
  { id: "m4", de: "Dra. Adriana Solís", curso: "bio", asunto: "Práctica de laboratorio pospuesta", preview: "Buenas tardes, la práctica del jueves se mueve al martes 27. Misma hora, mismo lab.", hace: "ayer", noLeido: false, avatar: "AS" },
  { id: "m5", de: "Mtra. Patricia Vega", curso: "let", asunto: "Retroalimentación del ensayo", preview: "María, qué buen trabajo. Solo dos comentarios menores para la entrega final…", hace: "lun", noLeido: false, avatar: "PV" },
];

const NOTIFICACIONES = [
  { id: "n1", tipo: "calif",   titulo: "Quiz: derivadas parciales", detalle: "Cálculo · 88/100",      hace: "hace 1 h", curso: "mat" },
  { id: "n2", tipo: "tarea",   titulo: "Nueva tarea publicada",      detalle: "Física · Tarea 7",     hace: "hace 3 h", curso: "fis" },
  { id: "n3", tipo: "mensaje", titulo: "Dr. Roberto Mendoza",         detalle: "Sobre tu duda del problema 14", hace: "hace 8 min", curso: "mat" },
  { id: "n4", tipo: "anuncio", titulo: "Universidad Pública",         detalle: "Periodo de bajas: 23–27 may",   hace: "ayer", curso: null },
];

// Calendario: día (1-31) → eventos del mes en curso
const CALENDARIO_MES = {
  3: [{ curso: "let", tit: "Ensayo 1ra entrega" }],
  7: [{ curso: "mat", tit: "Quiz" }],
  9: [{ curso: "let", tit: "Ensayo 1ra (entrega final)" }],
  13: [{ curso: "his", tit: "Lectura cap. 2" }],
  16: [{ curso: "mat", tit: "Integrales por partes" }],
  17: [{ curso: "bio", tit: "Reporte mitosis" }],
  19: [{ curso: "let", tit: "Ensayo 2da entrega" }],
  20: [{ curso: "his", tit: "Lectura cap. 3" }],
  21: [{ curso: "quim", tit: "Examen parcial" }],
  22: [{ curso: "fis", tit: "Tarea 7" }],
  23: [{ curso: "mat", tit: "Quiz" }],
  27: [{ curso: "bio", tit: "Práctica lab" }],
  30: [{ curso: "fis", tit: "Proyecto integrador" }],
};

const HISTORIAL_RECIENTE = [
  { tipo: "abrir",  texto: "Abriste el curso Cálculo Integral",        hace: "hace 4 min",  icono: "book" },
  { tipo: "entrega", texto: "Entregaste Quiz: derivadas parciales",     hace: "hace 1 h",    icono: "upload" },
  { tipo: "mensaje", texto: "Respondiste al Dr. Roberto Mendoza",       hace: "hace 1 h",    icono: "chat" },
  { tipo: "ver",     texto: "Viste la calificación del Quiz",           hace: "hace 1 h",    icono: "star" },
  { tipo: "leer",    texto: "Leíste Historia de México, cap. 3",        hace: "hace 3 h",    icono: "paper" },
  { tipo: "abrir",   texto: "Abriste Biología Celular",                 hace: "hace 5 h",    icono: "book" },
  { tipo: "logear",  texto: "Iniciaste sesión desde Android",            hace: "hoy 07:42",   icono: "check" },
  { tipo: "entrega", texto: "Entregaste Línea del tiempo",               hace: "ayer 18:20",  icono: "upload" },
];

const FAQ = [
  { q: "¿Cómo entrego una tarea?",
    a: "Entra al curso → pestaña Tareas → selecciona la tarea → botón Entregar. Puedes subir archivos (PDF, imagen, documento) o escribir directo en la caja. Mientras no la marques como 'final', puedes seguir guardando borradores." },
  { q: "Olvidé mi contraseña, ¿qué hago?",
    a: "En la pantalla de inicio de sesión, da clic en '¿Olvidaste tu contraseña?'. Te llegará un correo a tu cuenta institucional con un enlace para restablecerla. Si no llega en 5 minutos, revisa spam." },
  { q: "¿Aula funciona sin internet?",
    a: "Sí, parcialmente. Las tareas y materiales que ya abriste se quedan disponibles sin conexión. Las entregas se sincronizan cuando vuelves a tener señal — verás un ícono de nube en la barra superior." },
  { q: "¿Mi docente puede ver cuándo abro un material?",
    a: "Sólo ve si abriste o no un material asignado, no el tiempo que pasaste en él. Esta información ayuda al docente a saber qué temas reforzar en clase." },
  { q: "¿Cómo me uno a un grupo de trabajo?",
    a: "Tu docente crea los grupos y te asigna. Cuando estás en uno, aparece en la sección Grupos. Si tu docente activó la opción, también puedes proponer un grupo desde el curso." },
  { q: "Me puse mal y no entregué a tiempo. ¿Hay forma de subir tarde?",
    a: "Depende del docente. Algunos permiten entregas tardías con penalización, otros no. Lo verás directo en la tarea: dirá 'Cierra el…' o 'Acepta tardías hasta…'. Si no estás seguro, mándale un mensaje a tu docente." },
];

Object.assign(window, {
  USER, HOY, HORA_SALUDO, CURSOS, TAREAS, ENTREGADAS, HORARIO_HOY, GRUPOS,
  MENSAJES, NOTIFICACIONES, CALENDARIO_MES, HISTORIAL_RECIENTE, FAQ,
});
