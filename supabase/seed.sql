insert into organizations (id, name)
values ('11111111-1111-1111-1111-111111111111', 'Northgate FC Academy')
on conflict (id) do nothing;

insert into teams (id, org_id, name, sport, season)
values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'U19 Men',
  'Soccer',
  '2024-25'
)
on conflict (id) do nothing;

-- Seed starter coach profiles.
insert into profiles (id, role, org_id, full_name, email)
values
  ('33333333-3333-3333-3333-333333333331', 'coach', '11111111-1111-1111-1111-111111111111', 'Marcus Webb', 'marcus@northgatefc.demo'),
  ('33333333-3333-3333-3333-333333333332', 'coach', '11111111-1111-1111-1111-111111111111', 'Sofia Reyes', 'sofia@northgatefc.demo')
on conflict (id) do nothing;

insert into coach_profiles (user_id, team_id, title, specialization)
values
  ('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222222', 'Head Coach', 'Tactical Periodisation'),
  ('33333333-3333-3333-3333-333333333332', '22222222-2222-2222-2222-222222222222', 'Assistant Coach', 'Player Development')
on conflict (user_id) do nothing;

-- Add players, survey templates, responses, announcements, goals, highlights, and events here.
-- The app also ships with a rich mock data layer in src/lib/mock/data.ts so the UI renders immediately.
