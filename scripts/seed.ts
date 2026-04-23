import { readFileSync } from "node:fs";
import { join } from "node:path";

import { createClient } from "@supabase/supabase-js";

function loadEnvFile() {
  const envPath = join(process.cwd(), ".env.local");
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey || url === "your_url" || serviceRoleKey === "your_service_role_key") {
  throw new Error("Set real NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY values in .env.local before seeding.");
}

const supabase = createClient(url, serviceRoleKey);

const ORG_ID = "00000000-0000-0000-0000-000000000001";
const TEAM_ID = "00000000-0000-0000-0000-000000000002";
const SEASON = "2024-25";
const PASSWORD = "Athlete123!";

const coaches = [
  { email: "marcus.webb@northgatefc.com", full_name: "Marcus Webb", title: "Head Coach", specialization: "Tactics" },
  { email: "sofia.reyes@northgatefc.com", full_name: "Sofia Reyes", title: "Assistant Coach", specialization: "Fitness" },
];

const players = [
  { email: "j.hartley@northgatefc.com", full_name: "Jamie Hartley", position: "GK", jersey: 1, height: 190, weight: 83, dob: "2006-03-12", grad: 2024 },
  { email: "l.osei@northgatefc.com", full_name: "Luca Osei", position: "GK", jersey: 13, height: 188, weight: 81, dob: "2006-07-04", grad: 2024 },
  { email: "d.mirko@northgatefc.com", full_name: "Dmitri Mirko", position: "GK", jersey: 22, height: 185, weight: 78, dob: "2007-01-29", grad: 2025 },
  { email: "e.santos@northgatefc.com", full_name: "Esteban Santos", position: "GK", jersey: 30, height: 187, weight: 80, dob: "2007-05-15", grad: 2025 },
  { email: "n.hayes@northgatefc.com", full_name: "Noah Hayes", position: "CB", jersey: 5, height: 186, weight: 79, dob: "2006-02-08", grad: 2024 },
  { email: "f.diallo@northgatefc.com", full_name: "Femi Diallo", position: "CB", jersey: 6, height: 184, weight: 77, dob: "2006-09-21", grad: 2024 },
  { email: "r.castillo@northgatefc.com", full_name: "Rodrigo Castillo", position: "RB", jersey: 2, height: 178, weight: 73, dob: "2006-11-03", grad: 2024 },
  { email: "m.petrov@northgatefc.com", full_name: "Mikhail Petrov", position: "LB", jersey: 3, height: 177, weight: 72, dob: "2007-04-17", grad: 2025 },
  { email: "c.okoro@northgatefc.com", full_name: "Chidi Okoro", position: "CB", jersey: 4, height: 183, weight: 76, dob: "2007-06-30", grad: 2025 },
  { email: "a.fischer@northgatefc.com", full_name: "Axel Fischer", position: "RB", jersey: 15, height: 179, weight: 74, dob: "2006-08-14", grad: 2024 },
  { email: "k.brennan@northgatefc.com", full_name: "Kieran Brennan", position: "CM", jersey: 8, height: 176, weight: 70, dob: "2006-01-25", grad: 2024 },
  { email: "j.nakamura@northgatefc.com", full_name: "Jun Nakamura", position: "CM", jersey: 14, height: 174, weight: 68, dob: "2006-10-11", grad: 2024 },
  { email: "s.mensah@northgatefc.com", full_name: "Samuel Mensah", position: "CDM", jersey: 6, height: 181, weight: 75, dob: "2007-03-09", grad: 2025 },
  { email: "o.novak@northgatefc.com", full_name: "Oliver Novak", position: "AM", jersey: 10, height: 172, weight: 67, dob: "2006-12-02", grad: 2024 },
  { email: "p.adeyemi@northgatefc.com", full_name: "Praise Adeyemi", position: "LM", jersey: 7, height: 173, weight: 69, dob: "2007-07-19", grad: 2025 },
  { email: "z.lindqvist@northgatefc.com", full_name: "Zane Lindqvist", position: "RM", jersey: 16, height: 175, weight: 70, dob: "2007-02-28", grad: 2025 },
  { email: "t.okonkwo@northgatefc.com", full_name: "Tobenna Okonkwo", position: "ST", jersey: 9, height: 180, weight: 76, dob: "2006-04-06", grad: 2024 },
  { email: "h.wagner@northgatefc.com", full_name: "Henrik Wagner", position: "ST", jersey: 11, height: 182, weight: 77, dob: "2006-06-23", grad: 2024 },
  { email: "y.ibrahim@northgatefc.com", full_name: "Yusuf Ibrahim", position: "LW", jersey: 17, height: 171, weight: 66, dob: "2007-09-05", grad: 2025 },
  { email: "c.moreau@northgatefc.com", full_name: "Cedric Moreau", position: "RW", jersey: 18, height: 170, weight: 65, dob: "2007-11-14", grad: 2025 },
  { email: "b.silva@northgatefc.com", full_name: "Bruno Silva", position: "SS", jersey: 19, height: 176, weight: 71, dob: "2007-01-07", grad: 2025 },
  { email: "a.kowalski@northgatefc.com", full_name: "Adrian Kowalski", position: "ST", jersey: 20, height: 179, weight: 74, dob: "2006-05-30", grad: 2024 },
];

async function createUser(email: string, fullName: string) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (error) throw new Error(`Failed to create ${email}: ${error.message}`);
  return data.user!.id;
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

async function main() {
  await supabase.from("organizations").upsert({ id: ORG_ID, name: "Northgate FC Academy" });
  await supabase.from("teams").upsert({
    id: TEAM_ID,
    org_id: ORG_ID,
    name: "U19 Men",
    sport: "soccer",
    season: SEASON,
  });

  const coachIds: string[] = [];
  for (const c of coaches) {
    const uid = await createUser(c.email, c.full_name);
    coachIds.push(uid);
    await supabase.from("profiles").upsert({
      id: uid,
      org_id: ORG_ID,
      role: "coach",
      full_name: c.full_name,
      email: c.email,
    });
    await supabase.from("coach_profiles").upsert({
      user_id: uid,
      team_id: TEAM_ID,
      title: c.title,
      specialization: c.specialization,
    });
  }

  const playerIds: string[] = [];
  for (const p of players) {
    const uid = await createUser(p.email, p.full_name);
    playerIds.push(uid);
    await supabase.from("profiles").upsert({
      id: uid,
      org_id: ORG_ID,
      role: "player",
      full_name: p.full_name,
      email: p.email,
    });
    await supabase.from("player_profiles").upsert({
      user_id: uid,
      team_id: TEAM_ID,
      jersey_number: p.jersey,
      position: p.position,
      dominant_foot: Math.random() > 0.2 ? "right" : "left",
      height_cm: p.height,
      weight_kg: p.weight,
      date_of_birth: p.dob,
      graduation_year: p.grad,
      school: "Northgate High School",
      bio: `${p.position} for Northgate FC Academy U19s.`,
    });
  }

  const { data: tmpl } = await supabase
    .from("survey_templates")
    .insert({
      team_id: TEAM_ID,
      created_by: coachIds[0],
      name: "Daily Wellness Check-In",
      description: "Complete every morning before 9:30 AM",
      questions: [
        { id: "sleep_hours", label: "Hours of sleep last night", type: "number", min: 0, max: 24, required: true, flag_below: 6 },
        { id: "sleep_quality", label: "Sleep quality", type: "scale", min: 1, max: 10, required: true, flag_below: 4 },
        { id: "energy", label: "Energy level", type: "scale", min: 1, max: 10, required: true, flag_below: 3 },
        { id: "soreness", label: "Muscle soreness", type: "scale", min: 1, max: 10, required: true, flag_above: 8 },
        { id: "stress", label: "Stress level", type: "scale", min: 1, max: 10, required: true, flag_above: 8 },
        { id: "mood", label: "Mood", type: "scale", min: 1, max: 10, required: true, flag_below: 3 },
        { id: "confidence", label: "Confidence", type: "scale", min: 1, max: 10, required: false },
        { id: "pain_reported", label: "Any pain or injury?", type: "boolean", required: true },
        { id: "readiness", label: "Readiness to train", type: "scale", min: 1, max: 10, required: true, flag_below: 4 },
      ],
      is_active: true,
    })
    .select()
    .single();

  const { data: assignment } = await supabase
    .from("survey_assignments")
    .insert({
      template_id: tmpl!.id,
      team_id: TEAM_ID,
      assigned_by: coachIds[0],
      deadline_time: "09:30:00",
      recurrence: "daily",
      active_from: new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0],
      is_active: true,
    })
    .select()
    .single();

  const responses = [];
  for (let daysAgo = 30; daysAgo >= 0; daysAgo--) {
    const date = new Date(Date.now() - daysAgo * 86400000);
    const dateStr = date.toISOString().split("T")[0];
    for (const playerId of playerIds) {
      if (Math.random() >= 0.85) continue;

      const sleepHours = clamp(randomBetween(5.5, 9), 0, 12);
      const sleepQuality = Math.round(clamp(randomBetween(4, 10), 1, 10));
      const energy = Math.round(clamp(randomBetween(4, 10), 1, 10));
      const soreness = Math.round(clamp(randomBetween(1, 9), 1, 10));
      const stress = Math.round(clamp(randomBetween(1, 8), 1, 10));
      const mood = Math.round(clamp(randomBetween(5, 10), 1, 10));
      const confidence = Math.round(clamp(randomBetween(5, 10), 1, 10));
      const painReported = Math.random() < 0.08;
      const readiness = Math.round(clamp(randomBetween(5, 10), 1, 10));

      const flagReasons: string[] = [];
      if (sleepHours < 6) flagReasons.push("sleep_hours below 6");
      if (sleepQuality < 4) flagReasons.push("sleep_quality below 4");
      if (energy < 3) flagReasons.push("energy below 3");
      if (soreness > 8) flagReasons.push("soreness above 8");
      if (stress > 8) flagReasons.push("stress above 8");
      if (mood < 3) flagReasons.push("mood below 3");
      if (painReported) flagReasons.push("pain_reported");
      if (readiness < 4) flagReasons.push("readiness below 4");

      const rs = Math.round(
        (
          Math.min(sleepHours / 9, 1) * 0.2 +
          (sleepQuality / 10) * 0.15 +
          (energy / 10) * 0.2 +
          (1 - soreness / 10) * 0.15 +
          (1 - stress / 10) * 0.1 +
          (mood / 10) * 0.1 +
          (readiness / 10) * 0.1
        ) * 100,
      );

      responses.push({
        assignment_id: assignment!.id,
        template_id: tmpl!.id,
        player_id: playerId,
        submitted_at: new Date(date.getTime() + randomBetween(7, 9.5) * 3600000).toISOString(),
        answers: {
          sleep_hours: parseFloat(sleepHours.toFixed(1)),
          sleep_quality: sleepQuality,
          energy,
          soreness,
          stress,
          mood,
          confidence,
          pain_reported: painReported,
          readiness,
        },
        readiness_score: rs,
        flagged: flagReasons.length > 0,
        flag_reasons: flagReasons,
        response_date: dateStr,
      });
    }
  }

  for (let i = 0; i < responses.length; i += 100) {
    await supabase.from("survey_responses").insert(responses.slice(i, i + 100));
  }

  await supabase.from("events").insert([
    {
      team_id: TEAM_ID,
      created_by: coachIds[0],
      title: "Tuesday Training",
      type: "training",
      location: "Northgate Training Ground",
      starts_at: (() => {
        const d = new Date();
        d.setHours(16, 0, 0, 0);
        d.setDate(d.getDate() + (((2 - d.getDay() + 7) % 7) || 7));
        return d.toISOString();
      })(),
      ends_at: (() => {
        const d = new Date();
        d.setHours(18, 0, 0, 0);
        d.setDate(d.getDate() + (((2 - d.getDay() + 7) % 7) || 7));
        return d.toISOString();
      })(),
    },
    {
      team_id: TEAM_ID,
      created_by: coachIds[0],
      title: "vs Riverside Academy",
      type: "game",
      location: "Northgate Stadium",
      starts_at: (() => {
        const d = new Date();
        d.setHours(11, 0, 0, 0);
        d.setDate(d.getDate() + (((6 - d.getDay() + 7) % 7) || 7));
        return d.toISOString();
      })(),
      ends_at: (() => {
        const d = new Date();
        d.setHours(13, 0, 0, 0);
        d.setDate(d.getDate() + (((6 - d.getDay() + 7) % 7) || 7));
        return d.toISOString();
      })(),
    },
  ]);

  await supabase.from("announcements").insert([
    {
      team_id: TEAM_ID,
      author_id: coachIds[0],
      pinned: true,
      title: "Season schedule published",
      body: "Full fixture list for the 2024-25 season is now live. Please check all dates and mark your availability.",
    },
    {
      team_id: TEAM_ID,
      author_id: coachIds[0],
      pinned: false,
      title: "Kit collection — Thursday 4pm",
      body: "New match kits are ready. All players must collect before Saturday.",
    },
    {
      team_id: TEAM_ID,
      author_id: coachIds[1],
      pinned: false,
      title: "Fitness benchmarks this Friday",
      body: "We will be running 30m sprints and vertical jump tests this Friday after training. Come ready.",
    },
  ]);

  const sampleGoals = playerIds.slice(0, 5).flatMap((pid) => [
    {
      player_id: pid,
      title: "Improve left-foot passing accuracy",
      category: "technical",
      kpi: "Pass completion %",
      target_value: 85,
      current_value: 72,
      progress_pct: 40,
      start_date: "2024-09-01",
      target_date: "2025-01-31",
      status: "active",
    },
    {
      player_id: pid,
      title: "Average 8h sleep 5 nights/week",
      category: "recovery",
      kpi: "Nights per week",
      target_value: 5,
      current_value: 3,
      progress_pct: 60,
      start_date: "2024-09-01",
      target_date: "2025-03-31",
      status: "active",
    },
  ]);
  await supabase.from("goals").insert(sampleGoals);

  const statsRows = playerIds.map((pid, i) => ({
    player_id: pid,
    team_id: TEAM_ID,
    season: SEASON,
    recorded_at: new Date().toISOString().split("T")[0],
    appearances: Math.floor(randomBetween(6, 12)),
    starts: Math.floor(randomBetween(4, 10)),
    minutes_played: Math.floor(randomBetween(400, 900)),
    goals: i < 6 ? Math.floor(randomBetween(0, 8)) : 0,
    assists: Math.floor(randomBetween(0, 6)),
    tackles_won: Math.floor(randomBetween(5, 30)),
    interceptions: Math.floor(randomBetween(5, 25)),
    duels_won: Math.floor(randomBetween(20, 80)),
    pass_completion_pct: parseFloat(randomBetween(68, 89).toFixed(1)),
    yellow_cards: Math.floor(randomBetween(0, 3)),
    red_cards: 0,
    clean_sheets: i < 4 ? Math.floor(randomBetween(1, 6)) : 0,
  }));
  await supabase.from("stat_records").insert(statsRows);

  console.log("Seed complete.");
  console.log(`Coach logins: marcus.webb@northgatefc.com / ${PASSWORD} and sofia.reyes@northgatefc.com / ${PASSWORD}`);
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
