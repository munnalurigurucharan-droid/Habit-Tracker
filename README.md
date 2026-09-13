# Habit Tracker

A full-stack recreation of the "Habit Tracker" spreadsheet-style app shown in the
provided screenshots: a daily habit checklist grid, a monthly overview dashboard
(line chart, weekly bars, donut, top-10 ranking), and an overall-progress ranking view.

## Architecture

```
habit-tracker/
├── server/        Express + TypeScript + Prisma + PostgreSQL API
│   ├── prisma/schema.prisma
│   └── src/
│       ├── index.ts
│       ├── routes/        auth.ts, habits.ts, entries.ts, overview.ts
│       ├── middleware/     auth.ts (JWT), errorHandler.ts
│       └── lib/prisma.ts
└── web/           Next.js 14 (App Router) + TypeScript + Tailwind CSS
    ├── app/
    │   ├── page.tsx           Tracker grid (Screen 1)
    │   ├── dashboard/page.tsx Overview dashboard (Screen 2)
    │   └── progress/page.tsx  Overall progress ranking (Screen 3)
    ├── components/    HabitTable, MonthSelector, ProgressLineChart,
    │                  MonthlyDonut, WeeklyOverview, TopHabitsList
    ├── lib/           api.ts (fetch client), dates.ts (calendar helpers)
    └── types/habit.ts
```

## Database ER Diagram (text)

```
User (1) ──< Habit (1) ──< HabitEntry
User (1) ──< MonthConfig

User
  id (PK), email (unique), passwordHash, displayName, createdAt, updatedAt

Habit
  id (PK), userId (FK -> User), name, monthlyGoal, sortOrder, isArchived, createdAt, updatedAt

HabitEntry
  id (PK), habitId (FK -> Habit), date, completed, createdAt, updatedAt
  UNIQUE(habitId, date)

MonthConfig
  id (PK), userId (FK -> User), year, month, startsOn, createdAt
  UNIQUE(userId, year, month)
```

## API Reference

| Method | Route                       | Auth | Description                                            |
|--------|------------------------------|------|----------------------------------------------------------|
| POST   | /api/auth/register            | No   | Create a user, returns JWT                               |
| POST   | /api/auth/login                | No   | Authenticate, returns JWT                                 |
| GET    | /api/habits                    | Yes  | List active habits (ordered)                              |
| POST   | /api/habits                    | Yes  | Create a habit row                                          |
| PATCH  | /api/habits/:id                | Yes  | Rename / change goal                                         |
| DELETE | /api/habits/:id                | Yes  | Archive (soft delete) a habit                                |
| PATCH  | /api/habits/reorder/bulk       | Yes  | Persist drag-and-drop row order                                |
| GET    | /api/entries?year=&month=      | Yes  | Get all checkbox states for a month                             |
| PUT    | /api/entries/toggle            | Yes  | Upsert one checkbox (habitId, date, completed)                    |
| GET    | /api/overview?year=&month=     | Yes  | Aggregated dashboard payload (line/bar/donut/top10/progress rows)   |

## Business logic notes / assumptions

- **Week grouping**: the sheet groups days into 7-day "WEEK N" blocks starting on
  day 1 of the month (not necessarily Mon–Sun), so the backend and `buildCalendarWeeks`
  helper mirror that exactly.
- **Goals** are per-habit monthly targets (the "GOALS" column). Progress % = completed / goal.
- **Checkbox toggle** is idempotent (`PUT .../toggle` upserts on `(habitId, date)`), so
  double-clicks or retries can't create duplicate entries.
- **Soft delete**: removing a habit sets `isArchived = true` rather than deleting rows,
  preserving historical entries for past months' analytics.
- **Top 10 habits**: ranked by total completions in the selected month (ties broken by
  insertion order); assumption since the source screenshot doesn't show the exact tie-break rule.
- **Auth**: JWT bearer tokens (7-day expiry) via `/api/auth`; every other route requires it.
  This was inferred/added — the screenshots don't show a login screen, but a "your data,
  your dashboard" app needs one, so it's implemented as a reasonable addition and clearly
  optional to disable for a local single-user setup.

## Setup

### 1. Database
```bash
# using local Postgres, or docker:
docker run --name habit-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=habit_tracker -p 5432:5432 -d postgres:16
```

### 2. Backend
```bash
cd server
cp .env.example .env        # edit DATABASE_URL / JWT_SECRET if needed
npm install
npm run prisma:migrate      # creates tables
npm run dev                 # http://localhost:4000
```

### 3. Frontend
```bash
cd web
cp .env.local.example .env.local
npm install
npm run dev                 # http://localhost:3000
```

### 4. Try it
1. POST to `/api/auth/register` (e.g. via curl/Postman) to create a user and grab the token.
2. Store it: in the browser console on localhost:3000, run
   `localStorage.setItem('token', '<your JWT>')`.
3. Refresh — the Tracker page loads, add habits with the inline "Add a habit…" row,
   and check off days. Overview and Overall Progress update automatically.

(A dedicated `/login` and `/register` UI is straightforward to add with the existing
`api.auth.login` / `api.auth.register` client methods — omitted here to stay focused
on the three screens shown in the screenshots.)
