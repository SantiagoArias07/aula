# Aula — Sistema de Gestión de Aprendizaje

**Aula** es un LMS (Learning Management System) diseñado para escuelas públicas mexicanas —
nivel secundaria, preparatoria y universidad pública — instituciones que hoy improvisan con
WhatsApp, Google Classroom o Teams porque ninguna herramienta fue construida para su realidad:
internet lento, docentes no técnicos, interfaz en español, y presupuesto cero.

---

## El problema real

Las escuelas públicas en México no tienen un sistema propio. Usan herramientas diseñadas para
otra realidad: Canvas cuesta dinero y está en inglés, Teams requiere infraestructura de Office 365,
Google Classroom no se adapta a la estructura académica local (grupos, materias, semestres).
El resultado: docentes que administran tareas por WhatsApp, calificaciones en hojas de Excel, y
alumnos sin visibilidad de su progreso.

**Aula** nace para ser esa herramienta nativa: española, liviana, simple para un docente de 55 años,
funcional en un teléfono con 3G, y gratuita para la institución.

---

## Stack tecnológico

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Frontend | Vite 5 + React 18 (CDN) + Babel standalone | Prototipo de UI de alta fidelidad, sin build step local, iteración de diseño rápida |
| Backend | Java 21 + Spring Boot 3 | Estándar empresarial, fuerte demanda laboral en México |
| Base de datos | PostgreSQL + Flyway | Relacional, confiable, migraciones versionadas |
| Auth | JWT + BCrypt + Spring Security | Sin dependencias externas, stateless |
| API | REST + OpenAPI/Swagger | Documentación en vivo en `/swagger-ui.html` |
| Storage | Interfaz `StorageService` + impl local (S3-ready) | Swap transparente en producción |
| Deploy | Railway (backend) + Vercel (frontend) | Gratis para prototipos, fácil CI/CD |

---

## Arquitectura

```
aula/
├── backend/          Spring Boot 3 (Gradle)
│   └── src/
│       ├── main/java/mx/aula/backend/
│       │   ├── config/          SecurityConfig, OpenApiConfig
│       │   ├── controller/      AuthController, AdminController, GrupoController,
│       │   │                    AssignmentController, SubmissionController,
│       │   │                    GradeController, DashboardController
│       │   ├── service/         Lógica de negocio + StorageService (interface)
│       │   ├── repository/      Spring Data JPA
│       │   ├── entity/          User, Grupo, Membership, Assignment,
│       │   │                    Submission, Grade, GradeHistory
│       │   ├── dto/             Records Java — entrada/salida de la API
│       │   ├── security/        JWT filter, UserPrincipal, JwtTokenProvider
│       │   └── exception/       GlobalExceptionHandler → ApiError consistente
│       └── resources/
│           └── db/migration/    V1__init_schema.sql (schema completo)
└── frontend/         Prototipo de UI (Vite 5 — servidor estático)
    ├── index.html               CSS completo, tokens de diseño, tema dark/light
    ├── vite.config.mjs          Servidor en puerto 3000
    └── public/                  Servido sin transformación (React vía CDN + Babel)
        ├── app.jsx              Shell de la app + router de vistas
        ├── components.jsx       Topbar, BottomNav, cards, modales, toasts
        ├── views.jsx            Tablero, Cursos, Detalle de curso, Entrega de tarea
        ├── views2.jsx           Calendario (mes/semana/agenda), Bandeja, Grupos
        ├── views3.jsx           Historial, Ayuda, Cuenta
        ├── data.jsx             Datos mock del prototipo
        ├── icons.jsx            SVG icons inline
        └── tweaks-panel.jsx     Panel de tweaks: tema, colores, densidad, variantes
```

**Flujo de datos:** Controller → Service → Repository → Entity (Hibernate → PostgreSQL)
**API boundary:** DTOs en todos los endpoints, nunca se exponen entidades JPA directamente.

---

## Cómo correr localmente

### Requisitos
- Java 21 (`/opt/homebrew/opt/openjdk@21` si usas macOS con Homebrew)
- Node.js 18+
- PostgreSQL 14+

### Backend

```bash
cd backend
cp .env.example .env          # configura DB_URL, DB_USER, DB_PASSWORD, JWT_SECRET

# Crea la base de datos
createdb aula

./gradlew bootRun
# → http://localhost:8080
# → Swagger UI: http://localhost:8080/swagger-ui.html
```

### Frontend

```bash
cd frontend
npm install      # instala Vite
npm run dev
# → http://localhost:3000
# (prototipo de UI con datos mock — no requiere backend activo)
```

### Tests del backend

```bash
cd backend
./gradlew test
# 10 tests — AuthService y GradeService
```

---

## Flujo del CORE (probado en Swagger)

1. **Admin crea usuarios** → `POST /api/admin/users`
2. **Admin crea grupo** → `POST /api/admin/grupos`
3. **Admin inscribe alumnos** → `POST /api/admin/grupos/{id}/enroll`
4. **Docente crea tarea** → `POST /api/grupos/{grupoId}/assignments`
5. **Alumno entrega** → `POST /api/assignments/{id}/submit`
6. **Docente califica** → `POST /api/submissions/{id}/grade`
7. **Alumno ve calificación** → `GET /api/assignments/{id}/my-submission`
8. **Dashboard del alumno** → `GET /api/student/dashboard`

---

## Roles y permisos

| Endpoint prefix | Acceso |
|----------------|--------|
| `POST /api/auth/login` | Público |
| `/api/admin/**` | Solo ADMIN |
| `/api/grupos/**` | TEACHER (sus grupos), STUDENT (inscripciones) |
| `/api/assignments/**` | TEACHER (crear/editar), STUDENT (ver/entregar) |
| `/api/submissions/**` | TEACHER (ver todas), STUDENT (solo la propia) |
| `/api/student/**` | Solo STUDENT |

---

## Schema de base de datos (resumen)

Diseñado para la visión completa desde fase 1:

```
users ← grupos (teacher_id)
      ← memberships (student_id, grupo_id)
grupos ← modules ← assignments ← submissions ← grades → grade_history
                                               (audit)
grupos ← announcements
users ← notifications
grupos ← attendance_sessions ← attendance_records
grupos ← quizzes ← quiz_questions ← quiz_options ← quiz_attempts ← quiz_answers
grupos ← pages
grupos ← file_attachments
```

---

## Roadmap (no construido aún — decisiones deliberadas de alcance)

Las siguientes funcionalidades están en el schema pero pendientes de implementar:

- **Módulos Canvas-style** — organizar tareas/páginas en unidades ordenadas
- **Quizzes con autocorrección** — banco de preguntas, opción múltiple + respuesta corta
- **Asistencia por sesión** — registro de presencia por clase
- **Anuncios y mensajería** — comunicación dentro del grupo
- **Calendario unificado** — todas las fechas de entrega en vista de calendario
- **Importación CSV** — alta masiva de alumnos para incorporación de escuelas completas
- **Multi-institución (tenancy)** — una instancia para múltiples escuelas
- **Calificador con historial** — auditoría completa de cambios en calificaciones
- **Notificaciones por email** — actualmente solo in-app
- **PWA / modo offline** — fundamental para zonas con conectividad intermitente
- **Análisis institucional** — dashboard de admin con métricas de rendimiento

---

## Decisiones de diseño

- **100% español** en la UI — incluyendo mensajes de error y validación
- **Mobile-first** — interfaz funcional desde 360px (muchos alumnos solo tienen un teléfono)
- **Dark mode nativo** — toggle en el prototipo con paleta oscura completa; la decisión de activarlo en producción queda abierta según feedback de usuarios reales
- **Sin frameworks de componentes** — CSS propio con tokens de diseño, componentes en React puro; control total del bundle y la accesibilidad
- **StorageService como interfaz** — swap transparente a S3 sin cambiar ningún controller

---

*Construido por Santiago Arias — Tec de Monterrey*
