# Athlete Platform

Mobile-first team operations and athlete development platform built with Next.js, Supabase, Tailwind, and Recharts.

## What this app includes

- Role-based login for coaches and players
- Coach dashboard with daily survey compliance, readiness, and flags
- Player dashboard with check-in flow and development goals
- Team roster and player detail views
- Survey builder with `survey_templates` and `survey_assignments`
- Player check-in submission into `survey_responses`
- Highlights, stats, goals, schedule, and messaging views

## Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, Storage, Realtime
- Recharts

## Important project files

- Schema: [supabase/schema/SCHEMA.sql](/Users/davideclarkson/Documents/athlete-platform/supabase/schema/SCHEMA.sql)
- Seed script: [scripts/seed.ts](/Users/davideclarkson/Documents/athlete-platform/scripts/seed.ts)
- Environment example: [.env.example](/Users/davideclarkson/Documents/athlete-platform/.env.example)

## Local setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy the environment template and add your Supabase values:

```bash
cp .env.example .env.local
```

3. Run the merged schema in the Supabase SQL editor:

```text
supabase/schema/SCHEMA.sql
```

4. Seed the project:

```bash
npx tsx scripts/seed.ts
```

5. Start the app:

```bash
pnpm dev
```

## Vercel deploy

Create these environment variables in Vercel:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Recommended:

- keep Preview and Production values in sync unless you intentionally want separate Supabase projects
- deploy from the canonical repo root at `/Users/davideclarkson/Documents/athlete-platform`
- after the first deploy, test both the login screen and the demo entry flow

## Survey flow

The survey system is backed by:

- `survey_templates`
- `survey_assignments`
- `survey_responses`

Current app behavior:

- Coaches can create a template and assignment from the Surveys screen
- Players submit daily wellness check-ins
- Readiness score and flag reasons are computed before insert
- Coach dashboard reads today’s compliance and flagged responses from live data

## Seeded logins

After running the seed script, these accounts are available:

- `marcus.webb@northgatefc.com` / `Athlete123!` — Coach
- `sofia.reyes@northgatefc.com` / `Athlete123!` — Coach
- `t.okonkwo@northgatefc.com` / `Athlete123!` — Player
- `k.brennan@northgatefc.com` / `Athlete123!` — Player
- `j.hartley@northgatefc.com` / `Athlete123!` — Player

## Storage buckets to create in Supabase

- `avatars` — public
- `highlights` — private, signed URLs
- `thumbnails` — public

## Realtime tables to enable

Enable these in Supabase Realtime / replication:

- `survey_responses`
- `attendance`
- `announcements`

## Production notes

- `pnpm exec tsc --noEmit` passes
- `pnpm lint` passes
- If `pnpm build` fails inside Codex because of SWC, rerun it in your normal local terminal

## Current schema-backed areas

These screens are wired to real Supabase data paths now:

- Login
- Dashboard
- Roster
- Check-in
- Player detail: bio, goals, stats, highlights
- Survey builder

These areas still have room for deeper hardening:

- fully generated Supabase database types instead of pragmatic casts
- more complete profile/attendance/message CRUD
- full production-safe storage handling for highlight uploads
