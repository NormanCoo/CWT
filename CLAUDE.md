# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cross-Platform Calendar Task Manager (CP-CTM) → **CWT** (Calendar With Tasks) — a lightweight, cross-platform calendar/planning app with a responsive web UI (desktop) and PWA (mobile). Data syncs in real-time across devices via Supabase.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Library**: shadcn/ui (Calendar, Dialog, Form, Button, Card)
- **Backend/Auth/DB**: Supabase (PostgreSQL + Auth + Realtime)
- **State Management**: Zustand
- **Date Handling**: date-fns
- **Deployment**: Vercel (frontend) + Supabase (backend)

## Project Status

This project is in Phase 1 (environment initialization). No source code has been generated yet. See `development-plan.md` for the full roadmap.

## Development Commands

When the project is initialized, the following commands will be standard:

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build
pnpm build

# Type checking
pnpm type-check    # (tsc --noEmit)

# Linting
pnpm lint          # (next lint)

# Run tests
pnpm test          # (vitest or jest)
pnpm test:watch
```

## Database Schema (Planned)

Two tables in Supabase PostgreSQL:

- **profiles** — extends auth.users with `full_name`, `avatar_url`
- **tasks** — `id`, `user_id`, `title`, `description`, `start_time`, `end_time`, `status` (enum: todo/in-progress/done), `priority` (enum: low/medium/high), `created_at`

Status and priority use PostgreSQL enums. All RLS policies scoped to `auth.uid()`.

## Development Phases

| Phase | Focus |
|-------|-------|
| 1 | Next.js init, Tailwind/shadcn setup, Supabase client |
| 2 | Auth (login, register, password reset), `useAuth` hook, middleware |
| 3 | Calendar engine (date-fns), responsive dashboard with month/week views |
| 4 | CRUD for tasks, click-to-create dialog, realtime sync via Supabase |
| 5 | PWA (next-pwa, manifest, service worker), mobile swipe gestures |

## Architecture Patterns

- **App Router**: all routes under `src/app/`, layout hierarchy for auth vs dashboard
- **Auth guard**: middleware protects `/dashboard` routes, redirects to login
- **Data layer**: Supabase client calls from server components or server actions; Zustand for client-side UI state only
- **Realtime**: Supabase Realtime subscriptions for live task updates across clients
- **Responsive**: desktop = sidebar + calendar grid; mobile = compact calendar bar + scrollable task list
- **Dark mode**: default dark theme using Tailwind `dark:` variants

## Key Conventions

- All new files use TypeScript with proper type exports
- UI components from shadcn/ui go in `src/components/ui/`
- Supabase client helpers in `src/lib/supabase/`
- Zustand stores in `src/stores/`
- Auth hooks in `src/hooks/`
- Enums and types in `src/types/`
- Environment variables in `.env.local` (not committed)
- Mobile swipe interactions use `framer-motion` or native touch events
