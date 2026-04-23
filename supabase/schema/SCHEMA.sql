-- ============================================================
-- ATHLETE PLATFORM — SUPABASE SCHEMA
-- Merged from the project scaffold and /Users/davideclarkson/Downloads/SCHEMA.sql
-- ============================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create table if not exists organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo_url text,
  created_at timestamptz not null default now()
);

create table if not exists teams (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  sport text not null default 'soccer',
  season text not null,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  role text not null check (role in ('admin', 'coach', 'player')),
  full_name text not null,
  avatar_url text,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists player_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  jersey_number int,
  position text not null,
  dominant_foot text check (dominant_foot in ('left', 'right', 'both')),
  height_cm numeric(5,1),
  weight_kg numeric(5,1),
  date_of_birth date,
  graduation_year int,
  school text,
  bio text,
  emergency_contact_name text,
  emergency_contact_phone text,
  medical_notes text,
  created_at timestamptz not null default now(),
  unique(user_id, team_id)
);

create table if not exists coach_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  title text,
  specialization text,
  created_at timestamptz not null default now(),
  unique(user_id, team_id)
);

create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id) on delete cascade,
  created_by uuid not null references profiles(id),
  title text not null,
  type text not null check (type in ('training', 'game', 'meeting', 'other')),
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists attendance (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'no_response'
    check (status in ('attending', 'not_attending', 'maybe', 'no_response')),
  updated_at timestamptz not null default now(),
  unique(event_id, user_id)
);

create table if not exists announcements (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id) on delete cascade,
  author_id uuid not null references profiles(id),
  title text not null,
  body text not null,
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists survey_templates (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id) on delete cascade,
  created_by uuid not null references profiles(id),
  name text not null,
  description text,
  questions jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists survey_assignments (
  id uuid primary key default uuid_generate_v4(),
  template_id uuid not null references survey_templates(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  assigned_by uuid not null references profiles(id),
  deadline_time time not null default '09:30:00',
  recurrence text not null default 'daily'
    check (recurrence in ('daily', 'weekdays', 'weekly', 'once')),
  active_from date not null default current_date,
  active_until date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists survey_responses (
  id uuid primary key default uuid_generate_v4(),
  assignment_id uuid not null references survey_assignments(id) on delete cascade,
  template_id uuid not null references survey_templates(id) on delete cascade,
  player_id uuid not null references profiles(id) on delete cascade,
  submitted_at timestamptz not null default now(),
  answers jsonb not null default '{}'::jsonb,
  readiness_score int check (readiness_score between 0 and 100),
  flagged boolean not null default false,
  flag_reasons text[] not null default '{}',
  response_date date not null default current_date,
  unique(assignment_id, player_id, response_date)
);

create table if not exists biomarker_entries (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references profiles(id) on delete cascade,
  recorded_at timestamptz not null default now(),
  metric text not null,
  value numeric not null,
  unit text not null,
  source text not null default 'manual'
    check (source in ('manual', 'survey', 'wearable')),
  notes text
);

create table if not exists goals (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  category text not null
    check (category in ('performance', 'fitness', 'technical', 'tactical', 'academic', 'recovery')),
  description text,
  kpi text,
  target_value numeric,
  current_value numeric,
  progress_pct int not null default 0 check (progress_pct between 0 and 100),
  start_date date not null default current_date,
  target_date date not null,
  status text not null default 'active' check (status in ('active', 'completed', 'paused')),
  coach_comment text,
  created_at timestamptz not null default now()
);

create table if not exists stat_records (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references profiles(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  season text not null,
  event_id uuid references events(id),
  recorded_at date not null,
  appearances int not null default 0,
  starts int not null default 0,
  minutes_played int not null default 0,
  goals int not null default 0,
  assists int not null default 0,
  tackles_won int not null default 0,
  interceptions int not null default 0,
  duels_won int not null default 0,
  pass_completion_pct numeric(4,1),
  yellow_cards int not null default 0,
  red_cards int not null default 0,
  clean_sheets int not null default 0
);

create table if not exists personal_records (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references profiles(id) on delete cascade,
  category text not null check (category in ('sprint', 'jump', 'fitness', 'season', 'career', 'combine')),
  label text not null,
  value numeric not null,
  unit text not null,
  set_on date not null,
  notes text
);

create table if not exists highlights (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  type text not null check (type in ('upload', 'link')),
  url text not null,
  thumbnail_url text,
  category text not null default 'general'
    check (category in ('defending', 'passing', 'finishing', 'goalkeeping', 'athletic', 'leadership', 'general')),
  match_date date,
  opponent text,
  is_pinned boolean not null default false,
  coach_feedback text,
  created_at timestamptz not null default now()
);

create table if not exists coach_notes (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references profiles(id) on delete cascade,
  author_id uuid not null references profiles(id),
  body text not null,
  is_shared boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists evaluations (
  id uuid primary key default uuid_generate_v4(),
  player_id uuid not null references profiles(id) on delete cascade,
  coach_id uuid not null references profiles(id),
  period text not null,
  ratings jsonb not null default '{}'::jsonb,
  summary text,
  created_at timestamptz not null default now()
);

create index if not exists survey_responses_player_date_idx on survey_responses (player_id, response_date desc);
create index if not exists survey_responses_assignment_date_idx on survey_responses (assignment_id, response_date desc);
create index if not exists survey_responses_flagged_idx on survey_responses (flagged) where flagged = true;
create index if not exists biomarker_entries_player_metric_recorded_idx on biomarker_entries (player_id, metric, recorded_at desc);
create index if not exists stat_records_player_season_idx on stat_records (player_id, season);
create index if not exists highlights_player_created_idx on highlights (player_id, created_at desc);
create index if not exists coach_notes_player_created_idx on coach_notes (player_id, created_at desc);
create index if not exists events_team_starts_idx on events (team_id, starts_at);
create index if not exists attendance_event_idx on attendance (event_id);

alter table organizations enable row level security;
alter table teams enable row level security;
alter table profiles enable row level security;
alter table player_profiles enable row level security;
alter table coach_profiles enable row level security;
alter table events enable row level security;
alter table attendance enable row level security;
alter table announcements enable row level security;
alter table survey_templates enable row level security;
alter table survey_assignments enable row level security;
alter table survey_responses enable row level security;
alter table biomarker_entries enable row level security;
alter table goals enable row level security;
alter table stat_records enable row level security;
alter table personal_records enable row level security;
alter table highlights enable row level security;
alter table coach_notes enable row level security;
alter table evaluations enable row level security;

create or replace function my_org_id()
returns uuid
language sql
stable
as $$
  select org_id from profiles where id = auth.uid();
$$;

create or replace function my_role()
returns text
language sql
stable
as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function my_team_ids()
returns setof uuid
language sql
stable
as $$
  select team_id from player_profiles where user_id = auth.uid()
  union
  select team_id from coach_profiles where user_id = auth.uid();
$$;

drop policy if exists "read own org" on organizations;
create policy "read own org" on organizations for select
  using (id = my_org_id());

drop policy if exists "read org teams" on teams;
create policy "read org teams" on teams for select
  using (org_id = my_org_id());

drop policy if exists "coaches manage teams" on teams;
create policy "coaches manage teams" on teams for all
  using (org_id = my_org_id() and my_role() in ('admin', 'coach'));

drop policy if exists "read org profiles" on profiles;
create policy "read org profiles" on profiles for select
  using (org_id = my_org_id());

drop policy if exists "update own profile" on profiles;
create policy "update own profile" on profiles for update
  using (id = auth.uid());

drop policy if exists "player reads own profile" on player_profiles;
create policy "player reads own profile" on player_profiles for select
  using (user_id = auth.uid());

drop policy if exists "coach reads team player profiles" on player_profiles;
create policy "coach reads team player profiles" on player_profiles for select
  using (my_role() in ('admin', 'coach') and team_id in (select my_team_ids()));

drop policy if exists "coach manages player profiles" on player_profiles;
create policy "coach manages player profiles" on player_profiles for all
  using (my_role() in ('admin', 'coach') and team_id in (select my_team_ids()));

drop policy if exists "read team events" on events;
create policy "read team events" on events for select
  using (team_id in (select my_team_ids()));

drop policy if exists "coaches manage events" on events;
create policy "coaches manage events" on events for all
  using (my_role() in ('admin', 'coach') and team_id in (select my_team_ids()));

drop policy if exists "manage own attendance" on attendance;
create policy "manage own attendance" on attendance for all
  using (user_id = auth.uid());

drop policy if exists "coaches read attendance" on attendance;
create policy "coaches read attendance" on attendance for select
  using (my_role() in ('admin', 'coach'));

drop policy if exists "read announcements" on announcements;
create policy "read announcements" on announcements for select
  using (team_id in (select my_team_ids()));

drop policy if exists "coaches write announcements" on announcements;
create policy "coaches write announcements" on announcements for all
  using (my_role() in ('admin', 'coach') and team_id in (select my_team_ids()));

drop policy if exists "read survey templates" on survey_templates;
create policy "read survey templates" on survey_templates for select
  using (team_id in (select my_team_ids()));

drop policy if exists "coaches manage templates" on survey_templates;
create policy "coaches manage templates" on survey_templates for all
  using (my_role() in ('admin', 'coach') and team_id in (select my_team_ids()));

drop policy if exists "read survey assignments" on survey_assignments;
create policy "read survey assignments" on survey_assignments for select
  using (team_id in (select my_team_ids()));

drop policy if exists "coaches manage assignments" on survey_assignments;
create policy "coaches manage assignments" on survey_assignments for all
  using (my_role() in ('admin', 'coach') and team_id in (select my_team_ids()));

drop policy if exists "player manages own responses" on survey_responses;
create policy "player manages own responses" on survey_responses for all
  using (player_id = auth.uid());

drop policy if exists "coaches read all responses" on survey_responses;
create policy "coaches read all responses" on survey_responses for select
  using (
    my_role() in ('admin', 'coach')
    and player_id in (
      select user_id from player_profiles where team_id in (select my_team_ids())
    )
  );

drop policy if exists "player biomarkers" on biomarker_entries;
create policy "player biomarkers" on biomarker_entries for all
  using (player_id = auth.uid());

drop policy if exists "coaches read biomarkers" on biomarker_entries;
create policy "coaches read biomarkers" on biomarker_entries for select
  using (
    my_role() in ('admin', 'coach')
    and player_id in (
      select user_id from player_profiles where team_id in (select my_team_ids())
    )
  );

drop policy if exists "player reads goals" on goals;
create policy "player reads goals" on goals for select
  using (player_id = auth.uid());

drop policy if exists "player manages own goals" on goals;
create policy "player manages own goals" on goals for insert
  with check (player_id = auth.uid());

drop policy if exists "coaches manage goals" on goals;
create policy "coaches manage goals" on goals for all
  using (
    my_role() in ('admin', 'coach')
    and player_id in (
      select user_id from player_profiles where team_id in (select my_team_ids())
    )
  );

drop policy if exists "player reads stats" on stat_records;
create policy "player reads stats" on stat_records for select
  using (player_id = auth.uid());

drop policy if exists "coaches manage stats" on stat_records;
create policy "coaches manage stats" on stat_records for all
  using (my_role() in ('admin', 'coach') and team_id in (select my_team_ids()));

drop policy if exists "player reads records" on personal_records;
create policy "player reads records" on personal_records for select
  using (player_id = auth.uid());

drop policy if exists "coaches manage records" on personal_records;
create policy "coaches manage records" on personal_records for all
  using (
    my_role() in ('admin', 'coach')
    and player_id in (
      select user_id from player_profiles where team_id in (select my_team_ids())
    )
  );

drop policy if exists "player manages highlights" on highlights;
create policy "player manages highlights" on highlights for all
  using (player_id = auth.uid());

drop policy if exists "coaches read highlights" on highlights;
create policy "coaches read highlights" on highlights for select
  using (
    my_role() in ('admin', 'coach')
    and player_id in (
      select user_id from player_profiles where team_id in (select my_team_ids())
    )
  );

drop policy if exists "coaches write highlight feedback" on highlights;
create policy "coaches write highlight feedback" on highlights for update
  using (
    my_role() in ('admin', 'coach')
    and player_id in (
      select user_id from player_profiles where team_id in (select my_team_ids())
    )
  );

drop policy if exists "coaches manage notes" on coach_notes;
create policy "coaches manage notes" on coach_notes for all
  using (my_role() in ('admin', 'coach'));

drop policy if exists "player reads shared notes" on coach_notes;
create policy "player reads shared notes" on coach_notes for select
  using (player_id = auth.uid() and is_shared = true);

drop policy if exists "coaches manage evaluations" on evaluations;
create policy "coaches manage evaluations" on evaluations for all
  using (my_role() in ('admin', 'coach'));

drop policy if exists "player reads own evaluation" on evaluations;
create policy "player reads own evaluation" on evaluations for select
  using (player_id = auth.uid());

-- Realtime tables to enable in Supabase if desired:
-- alter publication supabase_realtime add table survey_responses;
-- alter publication supabase_realtime add table attendance;
-- alter publication supabase_realtime add table announcements;
