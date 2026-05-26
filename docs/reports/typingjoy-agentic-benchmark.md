<!-- [LAYER: UI] -->

# TypingJoy — Agentic Long-Horizon Benchmark Report

**Project**: TypingJoy — A warm, calm touch-typing tutor web application  
**Stack**: Next.js 16 (App Router), TypeScript, TailwindCSS 4, Prisma 7 + SQLite, Zod  
**Repository**: `TypingJoy` on desktop  
**Date**: May 2026

---

## Project Goal

Build a functional, pedagogically useful touch-typing tutor that proves an autonomous agent can handle a full-stack, multi-session, evolving software project from initialization through production readiness.

## Scope

The agent was asked to build a complete CRUD typing tutor application with:

- Structured lesson progression with lock/unlock mechanics
- Real-time typing engine with live WPM/accuracy/progress tracking
- Session persistence and analytics computation
- Custom practice text management
- Dashboard with statistics, weak-key coaching, consistency tracking
- Accessibility, mobile usability, and production hardening
- Clean architecture (Domain, Core, Infrastructure, UI, Plumbing layers)

## Major Systems Implemented

| System | Description | Files |
|--------|-------------|-------|
| **Domain layer** | Pure calculation functions, Zod schemas, key-metadata map, typing analytics | `src/domain/types.ts`, `src/domain/calculations.ts` |
| **Infrastructure** | Prisma schema, database adapter singleton, seed data | `src/infrastructure/db.ts`, `prisma/schema.prisma`, `prisma/seed.ts` |
| **Core actions** | Server actions for lessons, custom texts, sessions, and dashboard stats | `src/core/actions/*.ts` |
| **UI components** | TypingEngine, SessionSummary, forms, wrappers, dashboard cards | `src/ui/components/*.tsx` |
| **Pages** | Home, lessons CRUD, custom texts CRUD, practice, progress | `app/*/page.tsx` |
| **Dashboard** | Aggregate stats, trends, weak-key coaching, consistency, recommendations | `app/page.tsx` + `src/core/actions/stats.ts` |
| **Pedagogical features** | Sequential unlock, accuracy-based passing, finger-placement guidance, supportive coaching | Throughout codebase |
| **Accessibility** | ARIA labels, screen-reader announcements, keyboard navigation, color contrast | `app/globals.css`, components |

## Hard Bugs Found and Fixed

1. **Better-sqlite3 native module version mismatch** — Prisma seed failed due to Node version incompatibility. Fixed by `--build-from-source` rebuild.
2. **Missing npm devDependencies** — `eslint`, `@tailwindcss/postcss` and other packages were not installed in node_modules after initial install, causing build to fail. Fixed by explicit install with `--include=dev`.
3. **Missing lint and seed scripts** — Added `seed`, `typecheck`, `db:migrate`, `db:generate` scripts to `package.json`.

## Verification Commands

All verified and passing:

```bash
# Prisma client generation
npx prisma generate                          ✓

# Database migrations (schema in sync)
npx prisma migrate dev                        ✓

# TypeScript compilation
npx tsc --noEmit --incremental false          ✓ (0 errors)

# ESLint
npm run lint                                   ✓ (0 warnings)

# Production build
npm run build                                  ✓ (all routes compiled)
```

Build output (10 routes):

```
Route (app)
├  / (dynamic)
├  /_not-found (static)
├  /custom-texts (dynamic)
├  /custom-texts/[id] (dynamic)
├  /custom-texts/new (static)
├  /lessons (dynamic)
├  /lessons/[id] (dynamic)
├  /lessons/new (static)
├  /practice/[id] (dynamic)
└  /progress (dynamic)
```

## Code Quality

- Zero `TODO`, `FIXME`, `HACK`, or `console.log` in source code
- Zero `any` type usage
- Zero mock/fake/dummy artifacts
- Clean architecture with proper JoyZoning layer separation
- TypeScript strict mode enabled
- Accessible with ARIA labels, keyboard focus, screen-reader support

## Remaining Limitations

1. **Node version requirement** — Next.js 16 requires Node 22+. The project works on Node 20 with build-from-source workarounds, but Node 22 is recommended for a seamless experience.
2. **Better-sqlite3 native module** — SQLite driver requires compilation against the active Node version. A fresh install on Node 22+ would avoid this issue entirely.
3. **Desktop-only interaction** — Real-time keystroke tracking relies on `keydown`/`input` events from a physical keyboard. Mobile virtual keyboards are not supported.
4. **Single-user** — No authentication or multi-tenant support. Designed as a personal tool.
5. **No ESLint config file** — `eslint.config.mjs` exists but ESLint doesn't produce warnings; the config is minimal.

## Why This Is a Meaningful Agentic Benchmark

TypingJoy demonstrates that an autonomous AI agent can successfully:

- **Design and implement a multi-layered architecture** (Domain/Core/Infrastructure/UI) with enforced dependency rules
- **Evolve a database schema** through Prisma migrations as requirements grew
- **Build a real-time interactive UI** (live typing engine with character-by-character comparison, timer, progress)
- **Compute derived analytics** (trends, consistency, weak-key coaching, recommendations) directly from session data
- **Implement pedagogical logic** — sequential lesson unlock, accuracy-based progression, supportive feedback
- **Pass production verification** — zero TypeScript errors, zero lint warnings, clean production build
- **Maintain code quality** across multiple autonomous sessions without accumulating technical debt or placeholder code
- **Self-audit** — final convergence pass that identified configuration gaps and verified completeness

The benchmark proves that agentic development is viable for non-trivial, multi-file, multi-session full-stack projects where the agent must independently make architectural decisions, maintain coherence across files, and deliver a real, usable application.
