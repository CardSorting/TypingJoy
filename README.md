# ⌨️ TypingJoy — Typing Tutor App

TypingJoy is a warm, calm, and playful touch-typing tutor built with Next.js 16, Tailwind CSS 4, Prisma 7, and SQLite. It helps users learn touch typing through structured lessons, custom practice texts, real-time typing metrics, and detailed progress tracking.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router, Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4
- **Database ORM**: [Prisma](https://www.prisma.io/) 7
- **Database**: SQLite (via `@prisma/adapter-better-sqlite3` and `better-sqlite3`)
- **Validation**: [Zod](https://zod.dev/) 4
- **Language**: TypeScript (strict mode)

## Features

- **Structured Lessons** — Progressive typing lessons organized by difficulty and focus area (home row, top row, bottom row, numbers, symbols, mixed)
- **Sequential Unlock** — Lessons unlock in sequence when you achieve 90%+ accuracy on the previous lesson
- **Custom Practice Texts** — Create, edit, and practice your own texts with optional tag categorization
- **Real-Time Typing Engine** — Live WPM, accuracy, progress bar, and mistake tracking as you type
- **Pause / Resume** — Press `Esc` to pause or resume practice at any time
- **Session Persistence** — Every completed practice session is saved with full metrics
- **Dashboard Analytics** — Aggregate statistics, WPM/accuracy trends, personal bests, and weak-key coaching
- **7-Day Consistency** — Track practice frequency over the last week
- **Smart Recommendations** — Adaptive suggestions based on recent performance and weak areas
- **Finger-Placement Guidance** — Key-specific advice showing which finger to use and how to reach each character
- **Supportive Feedback** — Encouraging completion summaries that prioritize accuracy over speed
- **Accessible** — ARIA labels, keyboard focus rings, screen-reader announcements, semantic HTML

## Project Structure

```
app/                     — Next.js App Router pages
├── lessons/             — Lesson CRUD pages
├── custom-texts/        — Custom text CRUD pages
├── practice/[id]/       — Live typing practice screen
├── progress/            — Session history and stats
└── page.tsx             — Home dashboard

src/                     — Clean architecture layers
├── domain/              — Pure business logic (types, calculations)
├── core/actions/        — Server actions (orchestration)
├── infrastructure/      — Database adapter
└── ui/components/       — Reusable React components

prisma/                  — Database schema, migrations, seed data
docs/reports/            — Agentic benchmark report
```

## Setup Instructions

### Prerequisites

- **Node.js**: v22 or higher recommended (v20 works with build workarounds)
- **npm** (comes with Node.js)

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
# Create .env with: DATABASE_URL="file:./dev.db"

# 3. Generate Prisma client
npx prisma generate

# 4. Run database migrations
npx prisma migrate dev

# 5. Seed starter lessons
npm run seed

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build and Check Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type check |
| `npm run seed` | Seed database with starter lessons |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:generate` | Regenerate Prisma client |

## Pedagogical Design

- **Accuracy-first**: Pass a lesson by reaching 90%+ accuracy. Speed follows naturally.
- **Sequential progression**: Each lesson unlocks the next, providing a clear learning path.
- **Weak-key coaching**: After every session, see which keys were missed most and get specific finger-placement advice.
- **Smart recommendations**: The dashboard adapts — suggesting repeats for low accuracy, new lessons for strong performance, or weak-area focus practice.
- **Supportive tone**: Coaching emphasizes "accuracy matters more than speed" and never shames the learner.

## Benchmark Note

This application was developed autonomously by an AI agent as part of a long-horizon agentic benchmark. See [docs/reports/typingjoy-agentic-benchmark.md](docs/reports/typingjoy-agentic-benchmark.md) for the full benchmark report.

## Known Limitations

- **Desktop keyboard required**: Real-time keystroke tracking relies on physical keyboard events. Mobile virtual keyboards are not supported.
- **Single-user**: No authentication or multi-user support. Designed as a personal tool.
- **Node version sensitivity**: Next.js 16 targets Node 22+. Using Node 20 may require `npm rebuild better-sqlite3 --build-from-source`.