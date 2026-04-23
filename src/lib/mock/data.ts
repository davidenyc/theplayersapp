import { addDays, formatISO, set } from "date-fns";

import { DEFAULT_WELLNESS_QUESTIONS } from "@/constants/surveyQuestions";
import { computeFlags, computeReadinessScore } from "@/constants/flagThresholds";
import type {
  Announcement,
  Attendance,
  BiomarkerEntry,
  CoachNote,
  CoachProfile,
  Event,
  Goal,
  Highlight,
  Organization,
  PersonalRecord,
  PlayerProfile,
  Profile,
  StatRecord,
  SurveyAssignment,
  SurveyResponse,
  SurveyTemplate,
  Team,
} from "@/types";

const today = new Date();

export const organization: Organization = {
  id: "org_northgate",
  name: "Northgate FC Academy",
  created_at: formatISO(addDays(today, -180)),
};

export const team: Team = {
  id: "team_u19_men",
  org_id: organization.id,
  name: "U19 Men",
  sport: "Soccer",
  season: "2024-25",
  created_at: formatISO(addDays(today, -180)),
};

const coachProfilesSeed = [
  {
    id: "coach_user_1",
    full_name: "Marcus Webb",
    email: "marcus@northgatefc.demo",
    title: "Head Coach",
    specialization: "Tactical Periodisation",
  },
  {
    id: "coach_user_2",
    full_name: "Sofia Reyes",
    email: "sofia@northgatefc.demo",
    title: "Assistant Coach",
    specialization: "Player Development",
  },
] as const;

export const coachProfiles: Profile[] = coachProfilesSeed.map((coach) => ({
  id: coach.id,
  org_id: organization.id,
  role: "coach",
  full_name: coach.full_name,
  email: coach.email,
}));

export const coaches: CoachProfile[] = coachProfilesSeed.map((coach, index) => ({
  id: `coach_profile_${index + 1}`,
  user_id: coach.id,
  team_id: team.id,
  title: coach.title,
  specialization: coach.specialization,
}));

const playerSeed = [
  ["Liam Carter", "GK"],
  ["Noah Bennett", "GK"],
  ["Ethan Hughes", "GK"],
  ["Mason Patel", "GK"],
  ["Caleb Brooks", "DEF"],
  ["Julian Foster", "DEF"],
  ["Xavier Price", "DEF"],
  ["Dominic Woods", "DEF"],
  ["Mateo Alvarez", "DEF"],
  ["Elijah Turner", "DEF"],
  ["Owen Bailey", "MID"],
  ["Leo Ramirez", "MID"],
  ["Isaac Perry", "MID"],
  ["Jude Flores", "MID"],
  ["Adrian Cooper", "MID"],
  ["Nathan Kim", "MID"],
  ["Micah Ross", "FWD"],
  ["Diego Sanders", "FWD"],
  ["Roman Bell", "FWD"],
  ["Kai Griffin", "FWD"],
  ["Tristan Powell", "FWD"],
  ["Aiden Foster", "FWD"],
] as const;

export const playerProfiles: Profile[] = playerSeed.map(([name], index) => ({
  id: `player_user_${index + 1}`,
  org_id: organization.id,
  role: "player",
  full_name: name,
  email: `${name.toLowerCase().replaceAll(" ", ".")}@northgatefc.demo`,
}));

export const players: PlayerProfile[] = playerSeed.map(([name, position], index) => ({
  id: `player_profile_${index + 1}`,
  user_id: `player_user_${index + 1}`,
  team_id: team.id,
  position,
  dominant_foot: index % 5 === 0 ? "Left" : "Right",
  height_cm: 172 + (index % 8) * 3,
  weight_kg: 64 + (index % 7) * 3,
  date_of_birth: formatISO(addDays(today, -(17 * 365 + index * 20)), {
    representation: "date",
  }),
  graduation_year: 2026 + (index % 2),
  school: "Northgate Preparatory",
  bio: `${name} is a high-upside ${position} focused on consistency, speed of play, and leadership habits.`,
  jersey_number: index + 1,
  emergency_contact_name: "Parent Contact",
  emergency_contact_phone: "555-0101",
  medical_notes: index % 6 === 0 ? "Monitor previous ankle sprain loading." : undefined,
}));

export const surveyTemplate: SurveyTemplate = {
  id: "survey_template_wellness",
  team_id: team.id,
  created_by: coachProfiles[0].id,
  name: "Daily Wellness Check-In",
  description: "Standard pre-training wellness and readiness survey.",
  questions: DEFAULT_WELLNESS_QUESTIONS,
  is_active: true,
  created_at: formatISO(addDays(today, -30)),
};

export const surveyAssignment: SurveyAssignment = {
  id: "assignment_daily_wellness",
  template_id: surveyTemplate.id,
  team_id: team.id,
  assigned_by: coachProfiles[0].id,
  deadline_time: "09:30",
  recurrence: "daily",
  active_from: formatISO(addDays(today, -30), { representation: "date" }),
  is_active: true,
};

function buildAnswerSet(playerIndex: number, dayOffset: number) {
  const fatigueWave = (playerIndex + dayOffset) % 10;
  const missed = (playerIndex * 7 + dayOffset) % 17 === 0;
  if (missed) return null;

  const answers: Record<string, number | boolean | string> = {
    sleep_hours: 5 + ((playerIndex + dayOffset) % 5),
    sleep_quality: Math.max(2, 8 - (fatigueWave % 5)),
    energy: Math.max(2, 8 - (fatigueWave % 6)),
    soreness: 3 + (fatigueWave % 7),
    stress: 2 + ((playerIndex + dayOffset * 2) % 7),
    mood: Math.max(2, 8 - ((playerIndex + dayOffset) % 6)),
    confidence: 5 + ((playerIndex + 2 * dayOffset) % 5),
    pain_reported: (playerIndex + dayOffset) % 19 === 0,
    readiness: Math.max(2, 8 - ((playerIndex + dayOffset) % 5)),
  };

  return answers;
}

export const surveyResponses: SurveyResponse[] = Array.from({ length: 30 }).flatMap(
  (_, dayIndex) => {
    const date = addDays(today, -dayIndex);

    return players.flatMap((player, playerIndex) => {
      const answers = buildAnswerSet(playerIndex, dayIndex);
      if (!answers) return [];

      const flagReasons = computeFlags(answers);
      return {
        id: `response_${player.user_id}_${dayIndex}`,
        assignment_id: surveyAssignment.id,
        template_id: surveyTemplate.id,
        player_id: player.user_id,
        submitted_at: formatISO(
          set(date, {
            hours: 7 + (playerIndex % 3),
            minutes: (playerIndex * 7) % 60,
            seconds: 0,
            milliseconds: 0,
          }),
        ),
        answers,
        readiness_score: computeReadinessScore(answers),
        flagged: flagReasons.length > 0,
        flag_reasons: flagReasons,
      };
    });
  },
);

export const events: Event[] = [
  {
    id: "event_training_tuesday",
    team_id: team.id,
    title: "Tuesday Training",
    type: "training",
    location: "Northgate Performance Center",
    starts_at: formatISO(set(addDays(today, 2), { hours: 17, minutes: 30, seconds: 0, milliseconds: 0 })),
    ends_at: formatISO(set(addDays(today, 2), { hours: 19, minutes: 15, seconds: 0, milliseconds: 0 })),
    notes: "Tactical block + finishing circuits.",
    created_by: coachProfiles[0].id,
  },
  {
    id: "event_game_saturday",
    team_id: team.id,
    title: "League Match vs Westhaven",
    type: "game",
    location: "Westhaven Stadium",
    starts_at: formatISO(set(addDays(today, 5), { hours: 13, minutes: 0, seconds: 0, milliseconds: 0 })),
    ends_at: formatISO(set(addDays(today, 5), { hours: 15, minutes: 0, seconds: 0, milliseconds: 0 })),
    notes: "Arrive in travel polo by 11:30.",
    created_by: coachProfiles[0].id,
  },
];

export const attendance: Attendance[] = events.flatMap((event, eventIndex) =>
  playerProfiles.map((profile, index) => ({
    id: `attendance_${event.id}_${profile.id}`,
    event_id: event.id,
    user_id: profile.id,
    status:
      eventIndex === 0
        ? index % 9 === 0
          ? "maybe"
          : "attending"
        : index % 11 === 0
          ? "no_response"
          : "attending",
    updated_at: formatISO(addDays(today, -1)),
  })),
);

export const announcements: Announcement[] = [
  {
    id: "announcement_1",
    team_id: team.id,
    author_id: coachProfiles[0].id,
    title: "Saturday travel itinerary posted",
    body: "Check the schedule tab for departure time, rooming list, and nutrition notes.",
    pinned: true,
    created_at: formatISO(addDays(today, -1)),
  },
  {
    id: "announcement_2",
    team_id: team.id,
    author_id: coachProfiles[1].id,
    title: "Recovery lift moved to Thursday",
    body: "Players in the red readiness zone will have modified loading and treatment follow-up.",
    pinned: false,
    created_at: formatISO(addDays(today, -2)),
  },
  {
    id: "announcement_3",
    team_id: team.id,
    author_id: coachProfiles[0].id,
    title: "Academic checkpoint",
    body: "Bring updated grade snapshots to Friday meetings. We will review support plans where needed.",
    pinned: false,
    created_at: formatISO(addDays(today, -4)),
  },
];

export const goals: Goal[] = players.slice(0, 5).flatMap((player, index) => [
  {
    id: `goal_${player.id}_1`,
    player_id: player.user_id,
    title: "Increase repeat sprint output",
    category: "fitness",
    description: "Sustain high-speed repeat efforts through the final 20 minutes.",
    kpi: "High speed actions per match",
    target_value: 18,
    current_value: 11 + index,
    progress_pct: 55 + index * 5,
    start_date: formatISO(addDays(today, -40), { representation: "date" }),
    target_date: formatISO(addDays(today, 35), { representation: "date" }),
    status: "active",
    coach_comment: "Good trend over the last two weeks. Keep building consistency.",
    created_at: formatISO(addDays(today, -40)),
  },
  {
    id: `goal_${player.id}_2`,
    player_id: player.user_id,
    title: "Own communication on set pieces",
    category: "tactical",
    description: "Lead the unit with earlier cues and stronger body language.",
    progress_pct: 42 + index * 6,
    start_date: formatISO(addDays(today, -21), { representation: "date" }),
    target_date: formatISO(addDays(today, 45), { representation: "date" }),
    status: "active",
    coach_comment: "Video clips are showing better leadership presence.",
    created_at: formatISO(addDays(today, -21)),
  },
]);

export const biomarkerEntries: BiomarkerEntry[] = players.slice(0, 8).flatMap((player, index) => {
  const dates = Array.from({ length: 8 }).map((_, offset) => addDays(today, -offset));
  return dates.flatMap((date, offset) => [
    {
      id: `bio_hrv_${player.id}_${offset}`,
      player_id: player.user_id,
      recorded_at: formatISO(date),
      metric: "hrv",
      value: 62 + ((index * 3 + offset) % 12),
      unit: "ms",
      source: "wearable",
    },
    {
      id: `bio_hr_${player.id}_${offset}`,
      player_id: player.user_id,
      recorded_at: formatISO(date),
      metric: "resting_hr",
      value: 49 + ((index + offset) % 7),
      unit: "bpm",
      source: "wearable",
    },
  ]);
});

export const stats: StatRecord[] = players.map((player, index) => ({
  id: `stats_${player.id}`,
  player_id: player.user_id,
  team_id: team.id,
  season: team.season,
  recorded_at: formatISO(addDays(today, -1)),
  appearances: 10,
  starts: 7 + (index % 4),
  minutes_played: 540 + index * 12,
  goals: player.position === "FWD" ? 4 + (index % 5) : player.position === "MID" ? 1 + (index % 3) : 0,
  assists: player.position === "MID" ? 3 + (index % 4) : player.position === "FWD" ? 1 + (index % 2) : index % 2,
  tackles_won: player.position === "DEF" ? 18 + index : 5 + index,
  interceptions: player.position === "DEF" ? 12 + index : 3 + index,
  duels_won: 20 + index * 2,
  pass_completion_pct: 76 + (index % 12),
  yellow_cards: index % 5 === 0 ? 1 : 0,
  red_cards: 0,
  clean_sheets: player.position === "GK" || player.position === "DEF" ? 4 : 0,
}));

export const records: PersonalRecord[] = players.slice(0, 8).flatMap((player, index) => [
  {
    id: `record_${player.id}_1`,
    player_id: player.user_id,
    category: "sprint",
    label: "10m sprint",
    value: Number((1.72 + index * 0.03).toFixed(2)),
    unit: "s",
    set_on: formatISO(addDays(today, -15), { representation: "date" }),
  },
  {
    id: `record_${player.id}_2`,
    player_id: player.user_id,
    category: "jump",
    label: "Countermovement jump",
    value: 38 + index,
    unit: "cm",
    set_on: formatISO(addDays(today, -28), { representation: "date" }),
  },
]);

export const highlights: Highlight[] = players.slice(0, 6).map((player, index) => ({
  id: `highlight_${player.id}`,
  player_id: player.user_id,
  title: `${playerProfiles[index].full_name} chance creation sequence`,
  description: "Three-touch combination play leading to a high-value shot.",
  type: "link",
  url: `https://video.example.com/highlight/${index + 1}`,
  thumbnail_url: `https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=600&q=80&sig=${index + 1}`,
  category: index % 2 === 0 ? "passing" : "finishing",
  match_date: formatISO(addDays(today, -(index + 3)), { representation: "date" }),
  opponent: "Westhaven",
  is_pinned: index < 2,
  coach_feedback: "Excellent timing and decision making in the final third.",
  created_at: formatISO(addDays(today, -(index + 2))),
}));

export const coachNotes: CoachNote[] = players.slice(0, 10).map((player, index) => ({
  id: `note_${player.id}`,
  player_id: player.user_id,
  author_id: coachProfiles[index % 2].id,
  body:
    index % 3 === 0
      ? "Strong week. Keep demanding the ball earlier and scan before the first touch."
      : "Loading response was better after the recovery block. Keep sleep consistency tight before match day.",
  is_shared: index % 4 !== 0,
  created_at: formatISO(addDays(today, -(index % 5))),
}));

export const demoUsers = {
  coach: { email: coachProfiles[0].email, password: "demo12345" },
  player: { email: playerProfiles[0].email, password: "demo12345" },
};

export function getProfileByEmail(email: string) {
  return [...coachProfiles, ...playerProfiles].find(
    (profile) => profile.email.toLowerCase() === email.toLowerCase(),
  );
}

export function getPlayerBundle(playerId: string) {
  const profile = playerProfiles.find((entry) => entry.id === playerId || entry.email === playerId);
  if (!profile) return null;
  const player = players.find((entry) => entry.user_id === profile.id);
  if (!player) return null;

  return {
    profile,
    player,
    goals: goals.filter((entry) => entry.player_id === profile.id),
    highlights: highlights.filter((entry) => entry.player_id === profile.id),
    records: records.filter((entry) => entry.player_id === profile.id),
    notes: coachNotes.filter((entry) => entry.player_id === profile.id),
    stats: stats.find((entry) => entry.player_id === profile.id),
    biomarkers: biomarkerEntries.filter((entry) => entry.player_id === profile.id),
    responses: surveyResponses
      .filter((entry) => entry.player_id === profile.id)
      .sort((a, b) => b.submitted_at.localeCompare(a.submitted_at)),
  };
}

export const postGameSurveyTemplate: SurveyTemplate = {
  id: "survey_template_post_game",
  team_id: team.id,
  created_by: coachProfiles[0].id,
  name: "Post-Game Reflection",
  description: "Player self-review after matches with tactical and physical reflections.",
  questions: [
    { id: "minutes_load", label: "How heavy did your minutes feel?", type: "scale", min: 1, max: 10, required: true, flag_above: 8 },
    { id: "match_energy", label: "Energy after the match", type: "scale", min: 1, max: 10, required: true, flag_below: 4 },
    { id: "execution", label: "How well did you execute your role?", type: "scale", min: 1, max: 10, required: true },
    { id: "coach_message", label: "What should the staff know from your perspective?", type: "text", required: false },
  ],
  is_active: true,
  created_at: formatISO(addDays(today, -7)),
};

export const physicalRecordSpotlights = [
  { label: "Push-ups", value: 54, unit: "reps", athlete: "Micah Ross", delta: "+6 this month" },
  { label: "Pull-ups", value: 18, unit: "reps", athlete: "Kai Griffin", delta: "+3 this month" },
  { label: "Yo-Yo Test", value: 21.4, unit: "level", athlete: "Owen Bailey", delta: "Top squad mark" },
  { label: "Broad Jump", value: 2.68, unit: "m", athlete: "Caleb Brooks", delta: "+0.12m" },
];

export const soccerRecordSpotlights = [
  { label: "Juggles", value: 426, unit: "touches", athlete: "Leo Ramirez", delta: "Club best" },
  { label: "Weak-foot strikes", value: 37, unit: "goals", athlete: "Adrian Kowalski", delta: "+9 block" },
  { label: "Passing gate circuit", value: 92, unit: "%", athlete: "Jun Nakamura", delta: "Best midfield score" },
  { label: "1v1 defending wins", value: 15, unit: "wins", athlete: "Femi Diallo", delta: "Last 5 sessions" },
];

export const playerProgressMetrics: Record<
  string,
  { label: string; value: number; unit: string; trend: string; category: "physical" | "soccer" }[]
> = {
  player_user_1: [
    { label: "Push-ups", value: 42, unit: "reps", trend: "+8 in 6 weeks", category: "physical" },
    { label: "Pull-ups", value: 11, unit: "reps", trend: "+3 in 6 weeks", category: "physical" },
    { label: "Juggles", value: 188, unit: "touches", trend: "+54 best streak", category: "soccer" },
    { label: "Weak-foot wall passes", value: 94, unit: "%", trend: "+7%", category: "soccer" },
  ],
};

export const sessionPlans = [
  {
    id: "session_1",
    title: "Tuesday Tactical Session",
    focus: "Build-out under pressure",
    blocks: [
      "Activation and scanning warm-up",
      "6v4 first-phase build pattern",
      "Final-third combination finishing",
      "11v11 rest-defense rehearsal",
    ],
    explanation:
      "The session stacks the same tactical idea from unopposed spacing into live pressure so players understand the 'why' before the full-sided game.",
  },
  {
    id: "session_2",
    title: "Pre-match Set-Piece Tune-Up",
    focus: "Attacking corners and defensive restarts",
    blocks: [
      "Corner timing walkthrough",
      "Near-post and back-post service reps",
      "Defensive free-kick line height triggers",
      "Short-corner contingency pattern",
    ],
    explanation:
      "This is a low-volume, high-clarity session meant to sharpen assignments and communication without adding extra fatigue before kickoff.",
  },
];

export const matchDayPlan = {
  opponent: "Westhaven",
  formation: "4-3-3",
  startingLineup: [
    "GK Liam Carter",
    "RB Xavier Price",
    "RCB Caleb Brooks",
    "LCB Julian Foster",
    "LB Mateo Alvarez",
    "6 Owen Bailey",
    "8 Leo Ramirez",
    "10 Jude Flores",
    "RW Micah Ross",
    "9 Tristan Powell",
    "LW Kai Griffin",
  ],
  bench: ["Noah Bennett", "Dominic Woods", "Isaac Perry", "Adrian Cooper", "Diego Sanders"],
  tacticalKeys: [
    "Press their pivot on first backward pass",
    "Attack weak-side fullback with diagonal switches",
    "Counterpress for five seconds after final-third losses",
  ],
};
