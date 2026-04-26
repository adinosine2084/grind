# GRIND — Brutally Simple Task Manager

> Fast. Ruthless. No BS.

A neo-brutalist task manager for teams that ship. Built with Next.js 14, Supabase, and Tailwind CSS. Deployable in minutes on free tier infrastructure.

**Live stack:** Next.js App Router · TypeScript · Supabase (Auth + DB + Realtime) · Tailwind CSS · Vercel

---

## What's inside

| Route | Description |
|---|---|
| `/` | Marketing site — hero, features, pricing, CTA |
| `/auth/login` | Email + password login |
| `/auth/signup` | Account creation |
| `/app/onboarding` | First workspace setup |
| `/app` | Task dashboard — realtime, multi-workspace |

**Features:**
- Instant task input — type and hit Enter
- AI routing — type "fix", "urgent", "asap" → auto-marked urgent
- Realtime sync — tasks update live across all team members
- Workspace isolation — full multi-tenant with RLS
- Optimistic updates — UI responds instantly, syncs in background
- PWA-ready — installable on mobile and desktop
- Auth middleware — all `/app` routes protected server-side

---

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free)
- A [Vercel](https://vercel.com) account (free)

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/adinosine2084/grind.git
cd grind
npm install
```

### 2. Set up Supabase

The database is already provisioned at `luvdaqvohvovcqtwutho.supabase.co` with the full schema applied.

If you want a fresh Supabase project instead:

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New Project**
2. Once created, go to **SQL Editor** and run the schema from `supabase/schema.sql` (see below)
3. Go to **Database → Replication** and enable realtime for `tasks` and `task_activity`
4. Go to **Authentication → Providers → Email** and make sure it's enabled

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://luvdaqvohvovcqtwutho.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1dmRhcXZvaHZvdmNxdHd1dGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxOTA0MjEsImV4cCI6MjA5Mjc2NjQyMX0.L7VJoe1fVlNUwPHoYbMuJx3qRI412mHNgt7FPAKxMeg
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel via GitHub

This is the recommended deployment method.

### Step 1 — Import the repo on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Find and select **`adinosine2084/grind`**
4. Click **Import**

### Step 2 — Add environment variables

In the Vercel project setup screen, add these under **Environment Variables**:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://luvdaqvohvovcqtwutho.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1dmRhcXZvaHZvdmNxdHd1dGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxOTA0MjEsImV4cCI6MjA5Mjc2NjQyMX0.L7VJoe1fVlNUwPHoYbMuJx3qRI412mHNgt7FPAKxMeg` |
| `NEXT_PUBLIC_APP_URL` | *(leave blank for now — fill in after deploy with your Vercel URL)* |

### Step 3 — Deploy

Click **Deploy**. Vercel will build and publish automatically.

Every future `git push` to `main` triggers a new deployment automatically.

### Step 4 — Update Supabase Auth redirect URL

Once deployed, copy your Vercel URL (e.g. `https://grind-xyz.vercel.app`) and:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/luvdaqvohvovcqtwutho) → **Authentication → URL Configuration**
2. Set **Site URL** to your Vercel URL
3. Add to **Redirect URLs**: `https://your-vercel-url.vercel.app/auth/callback`
4. Go back to Vercel → **Settings → Environment Variables** → update `NEXT_PUBLIC_APP_URL` with your Vercel URL
5. Trigger a redeploy: **Deployments → Redeploy**

---

## Supabase Schema (for fresh projects)

If setting up a new Supabase project, run this in the SQL editor:

```sql
create extension if not exists "uuid-ossp";

create table public.workspaces (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create table public.workspace_members (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz default now(),
  unique(workspace_id, user_id)
);

create table public.tasks (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  assigned_to uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'urgent', 'later', 'done')),
  priority_score integer not null default 0,
  due_date date,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.task_activity (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  old_value text,
  new_value text,
  created_at timestamptz default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  updated_at timestamptz default now()
);

-- Enable RLS on all tables
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.tasks enable row level security;
alter table public.task_activity enable row level security;
alter table public.profiles enable row level security;

-- Enable Realtime
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.task_activity;
```

Then apply RLS policies from the full migration (see `supabase/schema.sql` once added).

---

## Project Structure

```
grind/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── globals.css         # Design system (neo-brutalist tokens)
│   ├── page.tsx            # Marketing homepage
│   ├── app/
│   │   ├── layout.tsx      # Auth guard (server component)
│   │   ├── page.tsx        # Task dashboard (main app)
│   │   └── onboarding/
│   │       └── page.tsx    # First workspace creation
│   └── auth/
│       ├── callback/
│       │   └── route.ts    # OAuth/magic link handler
│       ├── login/
│       │   └── page.tsx
│       └── signup/
│           └── page.tsx
├── components/
│   └── Cursor.tsx          # Custom cursor
├── lib/
│   ├── routing.ts          # AI task routing (rule-based)
│   ├── types.ts            # TypeScript interfaces
│   └── supabase/
│       ├── client.ts       # Browser Supabase client
│       └── server.ts       # Server Supabase client (SSR)
├── middleware.ts            # Route protection
└── public/
    ├── manifest.json        # PWA manifest
    └── favicon.svg
```

---

## AI Task Routing

Tasks are auto-classified based on keywords in the title. No external AI required.

| Input contains | Routed to |
|---|---|
| `urgent`, `asap`, `fix`, `bug`, `crash`, `blocking`, `hotfix`, `prod`, `!!`, `🔥` | **Urgent** |
| `later`, `someday`, `maybe`, `backlog`, `idea`, `eventually` | **Later** |
| Anything else | **Todo** |

To swap in real AI routing, replace the `routeTask()` function in `lib/routing.ts` with an API call to any LLM.

---

## Install as PWA

On mobile (iOS/Android):
1. Open the site in Safari/Chrome
2. Tap **Share → Add to Home Screen**

On desktop (Chrome/Edge):
1. Look for the install icon in the address bar
2. Click **Install**

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `NEXT_PUBLIC_APP_URL` | ✅ | Your production URL (for auth redirects) |

---

## Test Report

All tests passing before initial commit:

```
✓ Build: compiled successfully (9 static pages, 3 dynamic routes)
✓ Middleware: /app redirects unauthenticated users
✓ Middleware: /auth redirects authenticated users
✓ SSR cookies: getAll / setAll properly handled
✓ Static assets excluded from middleware matcher

AI Routing (10/10):
✓ "fix auth bug on mobile" → urgent
✓ "urgent: deploy to prod" → urgent
✓ "asap patch the crash" → urgent
✓ "write blog post" → todo
✓ "maybe add dark mode someday" → later
✓ "backlog: refactor billing" → later
✓ "review PR #42" → todo
✓ "🔥 server is down" → urgent
✓ "update readme" → todo
✓ "blocking release!!" → urgent

Component checks:
✓ All server components have no 'use client'
✓ All interactive components have 'use client'
✓ Optimistic updates in dashboard
✓ Realtime subscription on workspace tasks
✓ Workspace switching
✓ Status cycling (todo → urgent → later → done)
✓ Task deletion
✓ Auth guard + onboarding redirect
```

---

## License

MIT
