# TypingJoy — Architecture & Build Plan

## JoyZoning Mapping

**DOMAIN** (`lib/domain/`)
- `types.ts` — Zod schemas: Lesson, TypingSession, CustomPracticeText, form inputs
- `calculations.ts` — Pure functions: calcWPM, calcAccuracy, formatDuration
- No I/O, no imports from infra/core/UI

**INFRASTRUCTURE** (`lib/db.ts`, `prisma/schema.prisma`, `prisma/seed.ts`)
- `schema.prisma` — SQLite models for Lesson, TypingSession, CustomPracticeText
- `db.ts` — Singleton PrismaClient
- `seed.ts` — Beginner lesson seed data
- `calculations.ts` domain functions used here for seed TYPING session data

**CORE** (`lib/actions/`)
- `lessons.ts` — Server Actions: createLesson, updateLesson, deleteLesson, getLesson, getLessons
- `sessions.ts` — Server Actions: createSession, getSessions, getSession
- `custom-texts.ts` — Server Actions: createText, updateText, deleteText, getText, getTexts
- `stats.ts` — Server Actions: getDashboardStats

**UI** (`app/`, `components/`)
- Dashboard, Lesson CRUD pages, Practice screen, Custom text CRUD, Progress history
- Typing engine component with live tracking
- Warm classroom design (TailwindCSS)

## Build Order
1. Init project + install deps
2. Prisma schema + client
3. Domain types + calculations
4. Seed data
5. Server Actions (all CRUD)
6. UI Components (typing engine, cards, forms, layout)
7. Pages (dashboard, lessons, practice, progress)
8. Polish: loading/empty/error states, mobile, accessibility
9. Audit pass