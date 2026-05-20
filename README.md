# Aula — Open-Source LMS for Mexican Public Schools

> A learning management system built for the schools that have been left out of the LMS market: Mexican public middle schools, high schools, and universities running on slow internet, non-technical teachers, and zero institutional budget.

**Status:** Work in progress — core API working, full feature roadmap in active development.

---

## The Problem

Public schools in Mexico don't have their own platform. They improvise with WhatsApp, Google Classroom, or Teams — tools designed for a different reality:

- **Canvas** costs money and is in English.
- **Microsoft Teams** assumes Office 365 infrastructure that public schools don't have.
- **Google Classroom** doesn't fit local academic structure (grupos, materias, semestres).

The result: teachers managing assignments over WhatsApp, grades in Excel sheets, and students with no real visibility into their own progress.

**Aula** is being built to be the missing native tool — **in Spanish, lightweight, simple enough for a 55-year-old teacher, usable on a 3G phone, and free for the institution.**

---

## Stack

| Layer | Tech | Why |
|---|---|---|
| Frontend | Vite 5 + React 18 (CDN) + Babel standalone | High-fidelity UI prototype with no local build step; fast design iteration |
| Backend | Java 21 + Spring Boot 3 | Enterprise standard, strong hiring market in Mexico |
| Database | PostgreSQL + Flyway | Relational, reliable, versioned migrations |
| Auth | JWT + BCrypt + Spring Security | Stateless, no external dependencies |
| API | REST + OpenAPI / Swagger | Live docs at `/swagger-ui.html` |
| Storage | `StorageService` interface + local impl (S3-ready) | Transparent swap in production |
| Deploy | Railway (backend) + Vercel (frontend) | Free for prototypes, easy CI/CD |

---

## Architecture

```
aula/
├── backend/                            Spring Boot 3 (Gradle)
│   └── src/main/java/mx/aula/backend/
│       ├── config/                     SecurityConfig, OpenApiConfig
│       ├── controller/                 Auth, Admin, Grupo, Assignment,
│       │                               Submission, Grade, Dashboard
│       ├── service/                    Business logic + StorageService
│       ├── repository/                 Spring Data JPA
│       ├── entity/                     User, Grupo, Membership, Assignment,
│       │                               Submission, Grade, GradeHistory
│       ├── dto/                        Java records — API in/out
│       ├── security/                   JWT filter, UserPrincipal, TokenProvider
│       └── exception/                  GlobalExceptionHandler → ApiError
│   └── resources/db/migration/         V1__init_schema.sql
└── frontend/                           UI prototype (Vite 5 — static server)
    ├── index.html                      Full CSS, design tokens, dark/light theme
    └── public/                         React via CDN + Babel (no transform)
        ├── app.jsx                     App shell + view router
        ├── components.jsx              Topbar, BottomNav, cards, modals, toasts
        ├── views*.jsx                  Dashboard, Courses, Assignments,
        │                               Calendar, Inbox, Groups, History, Help
        └── tweaks-panel.jsx            Live theme / density / variant panel
```

**Data flow:** Controller → Service → Repository → Entity (Hibernate → PostgreSQL).
**API boundary:** DTOs on every endpoint — JPA entities are never exposed directly.

---

## Run it locally

**Requirements:** Java 21, Node.js 18+, PostgreSQL 14+

**Backend**
```bash
cd backend
cp .env.example .env          # set DB_URL, DB_USER, DB_PASSWORD, JWT_SECRET
createdb aula
./gradlew bootRun
# → http://localhost:8080
# → Swagger UI: http://localhost:8080/swagger-ui.html
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000  (UI prototype with mock data — no backend required)
```

**Tests**
```bash
cd backend
./gradlew test
# 10 tests covering AuthService and GradeService
```

---

## Core flow (verifiable in Swagger)

1. Admin creates users → `POST /api/admin/users`
2. Admin creates a grupo → `POST /api/admin/grupos`
3. Admin enrolls students → `POST /api/admin/grupos/{id}/enroll`
4. Teacher creates assignment → `POST /api/grupos/{grupoId}/assignments`
5. Student submits → `POST /api/assignments/{id}/submit`
6. Teacher grades → `POST /api/submissions/{id}/grade`
7. Student sees grade → `GET /api/assignments/{id}/my-submission`
8. Student dashboard → `GET /api/student/dashboard`

---

## Roles & permissions

| Endpoint prefix | Access |
|---|---|
| `POST /api/auth/login` | Public |
| `/api/admin/**` | ADMIN only |
| `/api/grupos/**` | TEACHER (own grupos), STUDENT (enrolled) |
| `/api/assignments/**` | TEACHER (create/edit), STUDENT (view/submit) |
| `/api/submissions/**` | TEACHER (all), STUDENT (own only) |
| `/api/student/**` | STUDENT only |

---

## Database schema (overview)

Designed for the full vision from day one, even though only the core is built:

```
users ← grupos (teacher_id)
      ← memberships (student_id, grupo_id)
grupos ← modules ← assignments ← submissions ← grades → grade_history
                                              (audit trail)
grupos ← announcements
users  ← notifications
grupos ← attendance_sessions ← attendance_records
grupos ← quizzes ← quiz_questions ← quiz_options ← quiz_attempts ← quiz_answers
grupos ← pages
grupos ← file_attachments
```

---

## Roadmap

Schema is ready; these are deliberate scope decisions, not oversights:

- [ ] Canvas-style modules (ordered units of assignments/pages)
- [ ] Auto-graded quizzes (multiple choice + short answer)
- [ ] Session-based attendance tracking
- [ ] In-grupo announcements and messaging
- [ ] Unified calendar across all grupos
- [ ] CSV import for bulk student enrollment
- [ ] Multi-tenancy (one instance, many schools)
- [ ] Full grade history / audit trail
- [ ] Email notifications (currently in-app only)
- [ ] PWA / offline mode (essential for spotty connectivity)
- [ ] Institutional analytics dashboard

---

## Design decisions

- **100% Spanish UI** — including error messages and validation
- **Mobile-first** — usable from 360px because many students only have a phone
- **Native dark mode** — full dark palette in the prototype; the call to ship it in production stays open pending real-user feedback
- **No component frameworks** — own CSS with design tokens, pure React components; full control of bundle size and accessibility
- **`StorageService` as an interface** — transparent swap to S3 in production without changing any controller

---

## License

MIT — built by [Santiago Arias](https://github.com/SantiagoArias07) · Tec de Monterrey.
