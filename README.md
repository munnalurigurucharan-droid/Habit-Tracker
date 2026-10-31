# Habit Tracker

A full-stack recreation of the "Habit Tracker" spreadsheet-style app shown in the
provided screenshots: a daily habit checklist grid, a monthly overview dashboard
(line chart, weekly bars, donut, top-10 ranking), and an overall-progress ranking view.

## Architecture

```
habit-tracker/
├── server/        Express + TypeScript + Prisma + PostgreSQL API
├── web/           Next.js 14 Full-Stack Frontend (Connected to server API)
└── web-local/     Next.js 14 Local-First Frontend (Zero backend, browser localStorage, 1-click Vercel deploy)
```

### Modes Available:
1. **Full-Stack Mode (`server/` + `web/`)**: Multi-user, PostgreSQL persistence, JWT auth, cross-device sync.
2. **Local-First Mode (`web-local/`)**: 100% serverless and private, data stored in browser `localStorage`, with JSON backup/restore buttons. Ideal for instant, free deployment on Vercel without configuring any databases.

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

## Setup & Running

### 1. Database
```bash
# using local PostgreSQL or Docker:
docker run --name habit-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=habit_tracker -p 5432:5432 -d postgres:16
```

### 2. Backend
```bash
cd server
cp .env.example .env        # edit DATABASE_URL / JWT_SECRET if needed
npm install
npm run prisma:generate
npm run dev                 # http://localhost:4000
```

### 3. Frontend (Full-Stack Mode)
```bash
cd web
cp .env.local.example .env.local
npm install
npm run dev                 # http://localhost:3000
```

### 3b. Frontend (Local-First Mode - No Backend Needed)
```bash
cd web-local
npm install
npm run dev                 # http://localhost:3000
```
> **Vercel Deployment**: When deploying to Vercel, set **Root Directory** to `web-local`. No backend or environment variables required!

### 4. Experience It
1. Visit `http://localhost:3000`. You will be welcomed by the **Student Journal Login Screen**.
2. Click **⚡ 1-Click Student Demo Login** (or sign in with your own credentials).
3. On the **Home Study Desk**, view your **Left Corner Dashboard** with today's checklist and consistency metrics, centered around the nostalgic study motivation centerpiece.
4. Move your cursor to the **far right edge** to slide open your **Shelves & Folders** sideboard.
5. Click **Daily Works** to access your monthly spreadsheet habit tracking grid with live checkboxes and instant sync.

