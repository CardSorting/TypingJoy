# TypingJoy — Typing Tutor App

TypingJoy is a warm, calm, and playful typing tutor CRUD web application built with Next.js, Tailwind CSS, Prisma, and SQLite. It is designed to help users learn touch typing through structured lessons, practice custom texts, and track their real-time typing metrics and progress history.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: SQLite (via `@prisma/adapter-better-sqlite3` and `better-sqlite3`)
- **Validation**: [Zod](https://zod.dev/)
- **Language**: TypeScript

## Project Structure

- `app/` — Next.js routing, pages, layouts, and API/Server actions integration.
  - `lessons/` — CRUD pages for touch typing lessons.
  - `custom-texts/` — CRUD pages for user's custom practice texts.
  - `practice/[id]/` — Live keyboard typing tutor interface, tracking real-time WPM, accuracy, progress, and saving typing session statistics.
  - `progress/` — User statistics dashboard and complete practice sessions log.
- `src/` — Clean architecture layers containing core, domain, infrastructure, and ui.
  - `core/actions/` — Server actions orchestrating domain actions with database queries.
  - `domain/` — Pure business logic, calculations, Zod schemas, and types.
  - `infrastructure/` — Database adapter singleton configurations.
  - `ui/components/` — Reusable components and form handlers.
- `prisma/` — Database schemas, SQLite migrations, and starter seeds.

## Setup Instructions

### 1. Prerequisites
- **Node.js**: v20 or higher is recommended.
- **npm** (comes with Node.js)

### 2. Install Dependencies
Clone the repository and install npm packages:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (if not already present):
```env
DATABASE_URL="file:./dev.db"
```

### 4. Database Setup & Migrations
Sync the SQLite database schema and run the migrations:
```bash
npx prisma migrate dev
```

### 5. Seed the Database
Populate starter beginner-level typing lessons:
```bash
npx tsx prisma/seed.ts
```

### 6. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

## Build and Check Commands

- **Production Build**: Compiles Next.js for production deployment.
  ```bash
  npm run build
  ```
- **Type Check**: Validates TypeScript code type-safety.
  ```bash
  npx tsc --noEmit
  ```
- **Code Lint**: Scans for patterns and syntax recommendations.
  ```bash
  npm run lint
  ```

## Known Limitations

- **Browser Context**: Desktop keyboard touch typing is first-class. Real-time visual keystroke detection relies on keyboard events, which are not suitable for mobile virtual/on-screen keyboards.
