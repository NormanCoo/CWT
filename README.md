# CWT — Calendar With Tasks

A lightweight, cross-platform calendar and task management app with real-time sync across all your devices.

**Production:** [https://cp-ctm.vercel.app](https://cp-ctm.vercel.app)

## Features

- **Responsive Calendar** — Month and week views with smooth swipe navigation (mobile) or button controls (desktop)
- **Task Management** — Create, edit, complete, and delete tasks with a single tap. Optimistic updates for instant feedback
- **Real-time Sync** — Tasks sync across all devices instantly via Supabase Realtime
- **Chinese Calendar** — Built-in solar terms (节气) and Chinese holidays display
- **Dark / Light Mode** — Toggle between themes, persisted across sessions
- **PWA Support** — Add to home screen on mobile for a native-like experience. Offline-capable via Service Worker
- **Mobile-first** — Touch-optimized with swipe gestures for task actions (swipe left to delete, right to change status)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Backend / Auth / DB | Supabase (PostgreSQL + Auth + Realtime) |
| Date Handling | date-fns |
| Animations | framer-motion |
| PWA | @serwist/next |
| Deployment | Vercel |

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/NormanCoo/CP-CTM.git
cd CP-CTM

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase project credentials

# 4. Start dev server
npm run dev
# Open http://localhost:3000
```

### Environment Variables

Create `.env.local` with your Supabase project credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

### Database Setup

Run the following SQL in your Supabase SQL Editor to create the required tables, enums, and RLS policies:

```sql
-- Enums
CREATE TYPE task_status AS ENUM ('todo', 'in-progress', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  status task_status NOT NULL DEFAULT 'todo',
  priority task_priority NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own tasks"
  ON tasks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Realtime (for cross-device task sync)
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
```

> **Note:** Profiles are automatically created via a Supabase database trigger on user signup. See `src/lib/supabase/client.ts` for the trigger setup.

## Deployment

The project is configured for automatic deployment on Vercel. Push to the `master` branch triggers a new build:

```bash
git push origin master
```

Manual deploy:
```bash
npx vercel --prod
```

### Local Network Testing (mobile on same WiFi)

```bash
start.bat
# Or manually:
npm start -- -p 3467
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, register, forgot-password pages
│   ├── (dashboard)/     # Main dashboard layout
│   ├── auth/callback    # Supabase auth callback
│   ├── globals.css      # Tailwind + CSS variables (light/dark)
│   ├── layout.tsx       # Root layout with ThemeProvider
│   ├── manifest.ts      # PWA manifest route
│   └── page.tsx         # Landing page
├── components/
│   ├── auth/            # AuthProvider, LoginForm, RegisterForm
│   ├── dashboard/       # CalendarView, TaskPanel, TaskDialog, MobileHeader
│   └── ui/              # shadcn/ui components (button, dialog, card, etc.)
├── hooks/               # useAuth, useTasks, useChineseCalendar
├── lib/
│   └── supabase/        # Supabase client, auth helpers, task API
├── stores/              # Zustand stores (useAuthStore, useTaskStore)
├── types/               # TypeScript type definitions
└── sw.ts                # Serwist Service Worker
```

## Development Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | Done | Project initialization, Tailwind/shadcn setup, Supabase client |
| 2 | Done | User authentication (login, register, password reset) |
| 3 | Done | Calendar engine with month/week views, responsive layout |
| 4 | Done | Task CRUD, task dialog, real-time sync via Supabase Realtime |
| 5 | Done | PWA (Service Worker, manifest, icons), mobile swipe gestures, theme toggle |
| 6 | Done | Vercel deployment, README documentation |
