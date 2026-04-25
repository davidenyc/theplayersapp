import { addDays, formatISO, set } from "date-fns";

import {
  DEFAULT_WELLNESS_QUESTIONS,
  POST_TRAINING_RPE_QUESTIONS,
  PRE_MATCH_U19_QUESTIONS,
  RECOVERY_CHECKIN_QUESTIONS,
  WEEKLY_REFLECTION_QUESTIONS,
  YOUTH_DAILY_CHECKIN_QUESTIONS,
  YOUTH_POST_MATCH_QUESTIONS,
  YOUTH_POST_TRAINING_QUESTIONS,
  YOUTH_PRE_MATCH_QUESTIONS,
} from "@/constants/surveyQuestions";
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
  InjuryLog,
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
  id: "org_players_app",
  name: "My Club",
  created_at: formatISO(addDays(today, -180)),
};

export const teamU19: Team = {
  id: "team_u19",
  org_id: organization.id,
  name: "U19 Men",
  sport: "Soccer",
  season: "2024-25",
  age_group: "u19",
  created_at: formatISO(addDays(today, -180)),
};

export const teamYouth: Team = {
  id: "team_youth",
  org_id: organization.id,
  name: "U12 Youth",
  sport: "Soccer",
  season: "2024-25",
  age_group: "youth",
  created_at: formatISO(addDays(today, -180)),
};

export const team = teamU19;
export const teams = [teamU19, teamYouth];

const coachProfilesSeed = [
  {
    id: "coach_user_1",
    full_name: "Marcus Webb",
    email: "marcus.webb@club.demo",
    title: "Head Coach",
    specialization: "Match management",
  },
  {
    id: "coach_user_2",
    full_name: "Sofia Reyes",
    email: "sofia.reyes@club.demo",
    title: "Assistant Coach",
    specialization: "Player development",
  },
] as const;

export const coachProfiles: Profile[] = coachProfilesSeed.map((coach) => ({
  id: coach.id,
  org_id: organization.id,
  role: "coach",
  full_name: coach.full_name,
  email: coach.email,
}));

export const coaches: CoachProfile[] = [
  {
    id: "coach_profile_1",
    user_id: coachProfiles[0].id,
    team_id: teamU19.id,
    title: "Head Coach",
    specialization: "Match management",
  },
  {
    id: "coach_profile_2",
    user_id: coachProfiles[0].id,
    team_id: teamYouth.id,
    title: "Head Coach",
    specialization: "Club oversight",
  },
  {
    id: "coach_profile_3",
    user_id: coachProfiles[1].id,
    team_id: teamYouth.id,
    title: "Assistant Coach",
    specialization: "Youth development",
  },
  {
    id: "coach_profile_4",
    user_id: coachProfiles[1].id,
    team_id: teamU19.id,
    title: "Assistant Coach",
    specialization: "Session planning",
  },
];

const u19PlayerSeed = [
  ["Liam Carter", "GK", 1],
  ["Noah Bennett", "GK", 13],
  ["Caleb Brooks", "DEF", 4],
  ["Julian Foster", "DEF", 5],
  ["Mateo Alvarez", "DEF", 3],
  ["Elijah Turner", "DEF", 2],
  ["Owen Bailey", "MID", 8],
  ["Leo Ramirez", "MID", 6],
  ["Isaac Perry", "MID", 10],
  ["Jude Flores", "MID", 14],
  ["Micah Ross", "FWD", 9],
  ["Diego Sanders", "FWD", 11],
  ["Kai Griffin", "FWD", 7],
] as const;

const youthPlayerSeed = [
  ["Tyler Banks", "GK", 1],
  ["Sam Okafor", "DEF", 3],
  ["Finn Murphy", "DEF", 4],
  ["Cole Rivera", "DEF", 5],
  ["Jake Nguyen", "MID", 8],
  ["Eli Watson", "MID", 6],
  ["Marco Silva", "MID", 10],
  ["Nico Reyes", "MID", 7],
  ["Theo Grant", "FWD", 9],
  ["Jaylen Moore", "FWD", 11],
  ["Zion Harper", "FWD", 14],
  ["Cruz Delgado", "FWD", 16],
] as const;

function emailFromName(name: string) {
  return `${name.toLowerCase().replaceAll(" ", ".")}@club.demo`;
}

function ageDate(yearsOld: number, offset = 0) {
  return formatISO(addDays(today, -(yearsOld * 365 + offset)), { representation: "date" });
}

export const u19PlayerProfiles: Profile[] = u19PlayerSeed.map(([name], index) => ({
  id: `player_user_u19_${index + 1}`,
  org_id: organization.id,
  role: "player",
  full_name: name,
  email: emailFromName(name),
}));

export const youthPlayerProfiles: Profile[] = youthPlayerSeed.map(([name], index) => ({
  id: `player_user_youth_${index + 1}`,
  org_id: organization.id,
  role: "player",
  full_name: name,
  email: emailFromName(name),
}));

export const playerProfiles = [...u19PlayerProfiles, ...youthPlayerProfiles];

export const u19Players: PlayerProfile[] = u19PlayerSeed.map(([name, position, jersey], index) => ({
  id: `player_profile_u19_${index + 1}`,
  user_id: `player_user_u19_${index + 1}`,
  team_id: teamU19.id,
  position,
  dominant_foot: index % 4 === 0 ? "Left" : "Right",
  height_cm: 173 + (index % 6) * 3,
  weight_kg: 64 + (index % 7) * 3,
  date_of_birth: ageDate(17 + (index % 3), index * 20),
  graduation_year: 2026 + (index % 2),
  school: "Academy High",
  bio: `${name} is an athletic ${position} focused on consistency and decision making.`,
  jersey_number: jersey,
  emergency_contact_name: "Parent Contact",
  emergency_contact_phone: "555-0101",
  medical_notes: index % 7 === 0 ? "Monitor training volume after recent tightness." : undefined,
}));

export const youthPlayers: PlayerProfile[] = youthPlayerSeed.map(([name, position, jersey], index) => ({
  id: `player_profile_youth_${index + 1}`,
  user_id: `player_user_youth_${index + 1}`,
  team_id: teamYouth.id,
  position,
  dominant_foot: index % 3 === 0 ? "Left" : "Right",
  height_cm: 132 + (index % 8) * 3,
  weight_kg: 31 + (index % 7) * 3,
  date_of_birth: ageDate(10 + (index % 3), index * 18),
  graduation_year: index % 2 === 0 ? 2030 : 2031,
  school: "Lincoln Middle School",
  bio: `${name} is a developing ${position} building strong habits and confidence.`,
  jersey_number: jersey,
  emergency_contact_name: "Parent Contact",
  emergency_contact_phone: "555-0102",
}));

export const players = [...u19Players, ...youthPlayers];

function template(id: string, teamId: string, name: string, description: string, questions: SurveyTemplate["questions"]): SurveyTemplate {
  return {
    id,
    team_id: teamId,
    created_by: coachProfiles[0].id,
    name,
    description,
    questions,
    is_active: true,
    created_at: formatISO(addDays(today, -30)),
  };
}

export const u19WellnessTemplate = template(
  "survey_template_u19_wellness",
  teamU19.id,
  "Daily wellness",
  "Daily readiness before training.",
  DEFAULT_WELLNESS_QUESTIONS,
);
export const u19PreMatchTemplate = template(
  "survey_template_u19_prematch",
  teamU19.id,
  "Pre-Match Readiness",
  "Complete on matchday morning.",
  PRE_MATCH_U19_QUESTIONS,
);
export const u19PostTrainingTemplate = template(
  "survey_template_u19_posttraining",
  teamU19.id,
  "Post-Training Load",
  "Rate your effort after each session.",
  POST_TRAINING_RPE_QUESTIONS,
);
export const u19WeeklyReflectionTemplate = template(
  "survey_template_u19_weekly",
  teamU19.id,
  "Weekly Reflection",
  "Sent every Friday.",
  WEEKLY_REFLECTION_QUESTIONS,
);
export const u19RecoveryTemplate = template(
  "survey_template_u19_recovery",
  teamU19.id,
  "Recovery Check-In",
  "For rest days.",
  RECOVERY_CHECKIN_QUESTIONS,
);

export const postGameSurveyTemplate = template(
  "survey_template_u19_postmatch",
  teamU19.id,
  "Post-Match",
  "After each game.",
  [
    { id: "minutes_load", label: "How heavy did your minutes feel?", type: "scale", min: 1, max: 10, required: true, flag_above: 8 },
    { id: "match_energy", label: "Energy after the match", type: "scale", min: 1, max: 10, required: true, flag_below: 4 },
    { id: "execution", label: "How well did you execute your role?", type: "scale", min: 1, max: 10, required: true },
    { id: "coach_message", label: "One thing for staff to know", type: "text", required: false },
  ],
);

export const youthDailyTemplate = template(
  "survey_template_youth_daily",
  teamYouth.id,
  "Daily Check-In",
  "How are you doing today?",
  YOUTH_DAILY_CHECKIN_QUESTIONS,
);
export const youthPreMatchTemplate = template(
  "survey_template_youth_prematch",
  teamYouth.id,
  "Pre-Match",
  "Before kickoff.",
  YOUTH_PRE_MATCH_QUESTIONS,
);
export const youthPostMatchTemplate = template(
  "survey_template_youth_postmatch",
  teamYouth.id,
  "Post-Match",
  "After the game.",
  YOUTH_POST_MATCH_QUESTIONS,
);
export const youthPostTrainingTemplate = template(
  "survey_template_youth_posttraining",
  teamYouth.id,
  "After Training",
  "How was practice?",
  YOUTH_POST_TRAINING_QUESTIONS,
);

export const surveyTemplate = u19WellnessTemplate;
export const surveyTemplates = [
  u19WellnessTemplate,
  u19PreMatchTemplate,
  u19PostTrainingTemplate,
  u19WeeklyReflectionTemplate,
  u19RecoveryTemplate,
  postGameSurveyTemplate,
  youthDailyTemplate,
  youthPreMatchTemplate,
  youthPostMatchTemplate,
  youthPostTrainingTemplate,
];

function assignment(id: string, templateId: string, teamId: string, recurrence: SurveyAssignment["recurrence"], deadline = "09:30"): SurveyAssignment {
  return {
    id,
    template_id: templateId,
    team_id: teamId,
    assigned_by: coachProfiles[0].id,
    deadline_time: deadline,
    recurrence,
    active_from: formatISO(addDays(today, -30), { representation: "date" }),
    is_active: true,
  };
}

export const surveyAssignment = assignment("assignment_daily_wellness", u19WellnessTemplate.id, teamU19.id, "daily");
export const surveyAssignments: SurveyAssignment[] = [
  surveyAssignment,
  assignment("assignment_u19_prematch", u19PreMatchTemplate.id, teamU19.id, "once"),
  assignment("assignment_u19_posttraining", u19PostTrainingTemplate.id, teamU19.id, "weekdays"),
  assignment("assignment_u19_weekly", u19WeeklyReflectionTemplate.id, teamU19.id, "weekly"),
  assignment("assignment_u19_recovery", u19RecoveryTemplate.id, teamU19.id, "weekly"),
  assignment("assignment_u19_postmatch", postGameSurveyTemplate.id, teamU19.id, "once"),
  assignment("assignment_youth_daily", youthDailyTemplate.id, teamYouth.id, "daily"),
  assignment("assignment_youth_prematch", youthPreMatchTemplate.id, teamYouth.id, "once"),
  assignment("assignment_youth_postmatch", youthPostMatchTemplate.id, teamYouth.id, "once"),
  assignment("assignment_youth_posttraining", youthPostTrainingTemplate.id, teamYouth.id, "weekdays"),
];

function buildAnswerSet(teamRef: Team, playerIndex: number, dayOffset: number): Record<string, number | boolean | string> | null {
  const missed = (playerIndex * 7 + dayOffset + (teamRef.id === teamYouth.id ? 3 : 0)) % 19 === 0;
  if (missed) return null;

  if (teamRef.age_group === "youth") {
    return {
      y_sleep: 6 + ((playerIndex + dayOffset) % 4),
      y_sleep_qual: Math.max(3, 8 - ((playerIndex + dayOffset) % 4)),
      y_energy: Math.max(3, 8 - ((playerIndex + dayOffset) % 5)),
      y_soreness: 2 + ((playerIndex + dayOffset) % 6),
      y_mood: Math.max(3, 9 - ((playerIndex + dayOffset) % 4)),
      y_pain: (playerIndex + dayOffset) % 21 === 0,
    };
  }

  return {
    sleep_hours: 5 + ((playerIndex + dayOffset) % 5),
    sleep_quality: Math.max(2, 8 - ((playerIndex + dayOffset) % 5)),
    energy: Math.max(2, 8 - ((playerIndex + dayOffset) % 6)),
    soreness: 3 + ((playerIndex + dayOffset) % 7),
    stress: 2 + ((playerIndex + dayOffset * 2) % 7),
    mood: Math.max(2, 8 - ((playerIndex + dayOffset) % 6)),
    confidence: 5 + ((playerIndex + 2 * dayOffset) % 5),
    pain_reported: (playerIndex + dayOffset) % 17 === 0,
    readiness: Math.max(2, 8 - ((playerIndex + dayOffset) % 5)),
  };
}

function responsesForTeam(teamRef: Team, roster: PlayerProfile[], assignmentRef: SurveyAssignment, templateRef: SurveyTemplate): SurveyResponse[] {
  return Array.from({ length: 30 }).flatMap((_, dayIndex) => {
    const date = addDays(today, -dayIndex);
    return roster.flatMap((player, playerIndex) => {
      const answers = buildAnswerSet(teamRef, playerIndex, dayIndex);
      if (!answers) return [];
      const flagReasons = computeFlags(answers);
      return {
        id: `response_${player.user_id}_${dayIndex}`,
        assignment_id: assignmentRef.id,
        template_id: templateRef.id,
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
      } satisfies SurveyResponse;
    });
  });
}

export const surveyResponses: SurveyResponse[] = [
  ...responsesForTeam(teamU19, u19Players, surveyAssignment, u19WellnessTemplate),
  ...responsesForTeam(teamYouth, youthPlayers, surveyAssignments[6], youthDailyTemplate),
];

export const events: Event[] = [
  {
    id: "event_u19_training",
    team_id: teamU19.id,
    title: "Training",
    type: "training",
    location: "Training Center",
    starts_at: formatISO(set(addDays(today, 2), { hours: 17, minutes: 30, seconds: 0, milliseconds: 0 })),
    ends_at: formatISO(set(addDays(today, 2), { hours: 19, minutes: 0, seconds: 0, milliseconds: 0 })),
    notes: "Pressing and finishing focus.",
    created_by: coachProfiles[0].id,
  },
  {
    id: "event_u19_game",
    team_id: teamU19.id,
    title: "vs Riverside FC",
    type: "game",
    location: "Riverside Stadium",
    starts_at: formatISO(set(addDays(today, 3), { hours: 15, minutes: 0, seconds: 0, milliseconds: 0 })),
    ends_at: formatISO(set(addDays(today, 3), { hours: 17, minutes: 0, seconds: 0, milliseconds: 0 })),
    notes: "Arrive by 1:30 PM.",
    created_by: coachProfiles[0].id,
  },
  {
    id: "event_youth_training",
    team_id: teamYouth.id,
    title: "Training",
    type: "training",
    location: "Training Center",
    starts_at: formatISO(set(addDays(today, 1), { hours: 17, minutes: 0, seconds: 0, milliseconds: 0 })),
    ends_at: formatISO(set(addDays(today, 1), { hours: 18, minutes: 15, seconds: 0, milliseconds: 0 })),
    notes: "Ball mastery and shape work.",
    created_by: coachProfiles[1].id,
  },
  {
    id: "event_youth_game",
    team_id: teamYouth.id,
    title: "vs Riverside FC",
    type: "game",
    location: "Riverside Stadium",
    starts_at: formatISO(set(addDays(today, 4), { hours: 12, minutes: 0, seconds: 0, milliseconds: 0 })),
    ends_at: formatISO(set(addDays(today, 4), { hours: 13, minutes: 30, seconds: 0, milliseconds: 0 })),
    notes: "Meet at the field at 11:00 AM.",
    created_by: coachProfiles[1].id,
  },
  {
    id: "event_team_meeting",
    team_id: teamU19.id,
    title: "Team Meeting",
    type: "meeting",
    location: "Club room",
    starts_at: formatISO(set(addDays(today, 1), { hours: 8, minutes: 0, seconds: 0, milliseconds: 0 })),
    ends_at: formatISO(set(addDays(today, 1), { hours: 8, minutes: 30, seconds: 0, milliseconds: 0 })),
    notes: "Video and match focus.",
    created_by: coachProfiles[0].id,
  },
];

export const attendance: Attendance[] = events.flatMap((event, eventIndex) => {
  const roster = event.team_id === teamYouth.id ? youthPlayerProfiles : u19PlayerProfiles;
  return roster.map((profile, index) => ({
    id: `attendance_${event.id}_${profile.id}`,
    event_id: event.id,
    user_id: profile.id,
    status:
      eventIndex % 2 === 0
        ? index % 9 === 0
          ? "maybe"
          : "attending"
        : index % 11 === 0
          ? "no_response"
          : "attending",
    updated_at: formatISO(addDays(today, -1)),
  }));
});

export const announcements: Announcement[] = [
  {
    id: "announcement_1",
    team_id: teamU19.id,
    author_id: coachProfiles[0].id,
    title: "Travel plan posted",
    body: "Check schedule for departure and arrival details. Bring recovery kit.",
    pinned: true,
    created_at: formatISO(addDays(today, -1)),
  },
  {
    id: "announcement_2",
    team_id: teamYouth.id,
    author_id: coachProfiles[1].id,
    title: "Parents update",
    body: "Pick-up is from the east lot after training. Water bottles are required.",
    pinned: false,
    created_at: formatISO(addDays(today, -2)),
  },
  {
    id: "announcement_3",
    team_id: teamU19.id,
    author_id: coachProfiles[0].id,
    title: "Recovery block",
    body: "Thursday load is modified after the weekend match. Treatment slots open at noon.",
    pinned: false,
    created_at: formatISO(addDays(today, -4)),
  },
];

export const goals: Goal[] = players.slice(0, 12).flatMap((player, index) => [
  {
    id: `goal_${player.id}_1`,
    player_id: player.user_id,
    title: index % 2 === 0 ? "Improve sprint repeat" : "Sharpen weak foot",
    category: index % 2 === 0 ? "fitness" : "technical",
    description: index % 2 === 0 ? "Hold pace in late actions." : "Complete 50 clean reps weekly.",
    kpi: index % 2 === 0 ? "Repeat sprint score" : "Weak-foot reps",
    target_value: index % 2 === 0 ? 18 : 50,
    current_value: index % 2 === 0 ? 11 + index : 24 + index,
    progress_pct: 48 + index * 3,
    start_date: formatISO(addDays(today, -40), { representation: "date" }),
    target_date: formatISO(addDays(today, 35), { representation: "date" }),
    status: "active",
    coach_comment: "Good trend. Keep the standard high.",
    created_at: formatISO(addDays(today, -40)),
  },
  {
    id: `goal_${player.id}_2`,
    player_id: player.user_id,
    title: index % 2 === 0 ? "Lead set cues" : "Win more duels",
    category: "tactical",
    description: index % 2 === 0 ? "Communicate earlier in restarts." : "Attack first contact with intent.",
    progress_pct: 42 + index * 3,
    start_date: formatISO(addDays(today, -21), { representation: "date" }),
    target_date: formatISO(addDays(today, 45), { representation: "date" }),
    status: "active",
    coach_comment: "Video review shows progress.",
    created_at: formatISO(addDays(today, -21)),
  },
]);

export const biomarkerEntries: BiomarkerEntry[] = players.slice(0, 10).flatMap((player, index) =>
  Array.from({ length: 8 }).flatMap((_, offset) => {
    const date = addDays(today, -offset);
    return [
      {
        id: `bio_hrv_${player.id}_${offset}`,
        player_id: player.user_id,
        recorded_at: formatISO(date),
        metric: "hrv",
        value: 60 + ((index * 3 + offset) % 12),
        unit: "ms",
        source: "wearable",
      },
      {
        id: `bio_hr_${player.id}_${offset}`,
        player_id: player.user_id,
        recorded_at: formatISO(date),
        metric: "resting_hr",
        value: 50 + ((index + offset) % 7),
        unit: "bpm",
        source: "wearable",
      },
    ];
  }),
);

export const stats: StatRecord[] = players.map((player, index) => {
  const teamRef = player.team_id === teamYouth.id ? teamYouth : teamU19;
  return {
    id: `stats_${player.id}`,
    player_id: player.user_id,
    team_id: player.team_id,
    season: teamRef.season,
    recorded_at: formatISO(addDays(today, -1)),
    appearances: 10,
    starts: 7 + (index % 4),
    minutes_played: 420 + index * 12,
    goals: player.position === "FWD" ? 4 + (index % 4) : player.position === "MID" ? 1 + (index % 2) : 0,
    assists: player.position === "MID" ? 3 + (index % 3) : player.position === "FWD" ? 1 + (index % 2) : index % 2,
    tackles_won: player.position === "DEF" ? 16 + index : 5 + index,
    interceptions: player.position === "DEF" ? 11 + index : 3 + index,
    duels_won: 18 + index * 2,
    pass_completion_pct: 75 + (index % 12),
    yellow_cards: index % 5 === 0 ? 1 : 0,
    red_cards: 0,
    clean_sheets: player.position === "GK" || player.position === "DEF" ? 4 : 0,
  };
});

export const records: PersonalRecord[] = players.flatMap((player, index) => [
  {
    id: `record_${player.id}_1`,
    player_id: player.user_id,
    category: "fitness",
    label: "Push-ups",
    value: player.team_id === teamYouth.id ? 18 + index : 34 + index,
    unit: "reps",
    set_on: formatISO(addDays(today, -15), { representation: "date" }),
  },
  {
    id: `record_${player.id}_2`,
    player_id: player.user_id,
    category: "fitness",
    label: "Pull-ups",
    value: player.team_id === teamYouth.id ? 4 + (index % 5) : 8 + (index % 7),
    unit: "reps",
    set_on: formatISO(addDays(today, -20), { representation: "date" }),
  },
  {
    id: `record_${player.id}_3`,
    player_id: player.user_id,
    category: "season",
    label: "Juggles",
    value: player.team_id === teamYouth.id ? 72 + index * 8 : 160 + index * 12,
    unit: "touches",
    set_on: formatISO(addDays(today, -10), { representation: "date" }),
  },
]);

export const highlights: Highlight[] = players.slice(0, 10).map((player, index) => ({
  id: `highlight_${player.id}`,
  player_id: player.user_id,
  title: ["Goal vs Riverside FC", "Defensive header", "Long-range assist", "Recovery tackle", "Big save", "Cutback finish"][index % 6],
  description: ["Great timing in the box.", "Won the first contact cleanly.", "Picked the runner early."][index % 3],
  type: "link",
  url: `https://video.example.com/highlight/${index + 1}`,
  thumbnail_url: `https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=600&q=80&sig=${index + 1}`,
  category: index % 2 === 0 ? "passing" : "finishing",
  match_date: formatISO(addDays(today, -(index + 3)), { representation: "date" }),
  opponent: "Riverside FC",
  is_pinned: index < 2,
  coach_feedback: "Excellent timing and decision making.",
  created_at: formatISO(addDays(today, -(index + 2))),
}));

export const coachNotes: CoachNote[] = players.slice(0, 14).map((player, index) => ({
  id: `note_${player.id}`,
  player_id: player.user_id,
  author_id: coachProfiles[index % 2].id,
  body:
    index % 3 === 0
      ? "Strong week. Scan earlier before the first touch."
      : "Loading response improved after recovery work. Keep sleep habits steady.",
  is_shared: index % 4 !== 0,
  created_at: formatISO(addDays(today, -(index % 5))),
}));

export const injuries: InjuryLog[] = [
  {
    id: "inj_1",
    player_user_id: "player_user_u19_3",
    body_area: "Left hamstring",
    injury_type: "Strain",
    date_of_injury: formatISO(addDays(today, -14), { representation: "date" }),
    status: "in_recovery",
    return_to_play_date: formatISO(addDays(today, 7), { representation: "date" }),
    notes: "Grade 1 strain. Light training only.",
  },
  {
    id: "inj_2",
    player_user_id: "player_user_u19_8",
    body_area: "Right ankle",
    injury_type: "Sprain",
    date_of_injury: formatISO(addDays(today, -30), { representation: "date" }),
    status: "cleared",
    return_to_play_date: formatISO(addDays(today, -10), { representation: "date" }),
    notes: "Fully cleared.",
  },
];

export const demoUsers = {
  coach: { email: coachProfiles[0].email, password: "demo12345" },
  player: { email: u19PlayerProfiles[0].email, password: "demo12345" },
};

export function getProfileByEmail(email: string) {
  return [...coachProfiles, ...playerProfiles].find((profile) => profile.email.toLowerCase() === email.toLowerCase());
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
    responses: surveyResponses.filter((entry) => entry.player_id === profile.id).sort((a, b) => b.submitted_at.localeCompare(a.submitted_at)),
  };
}

export const physicalRecordSpotlights = [
  { label: "Push-ups", value: 54, unit: "reps", athlete: "Micah Ross", delta: "+6 this month" },
  { label: "Pull-ups", value: 18, unit: "reps", athlete: "Kai Griffin", delta: "+3 this month" },
  { label: "Yo-Yo Test", value: 21.4, unit: "level", athlete: "Owen Bailey", delta: "Top squad mark" },
  { label: "Broad Jump", value: 2.68, unit: "m", athlete: "Caleb Brooks", delta: "+0.12m" },
];

export const soccerRecordSpotlights = [
  { label: "Juggles", value: 426, unit: "touches", athlete: "Leo Ramirez", delta: "Club best" },
  { label: "Weak-foot strikes", value: 37, unit: "goals", athlete: "Micah Ross", delta: "+9 this block" },
  { label: "Passing circuit", value: 92, unit: "%", athlete: "Isaac Perry", delta: "Best score" },
  { label: "1v1 defending", value: 15, unit: "wins", athlete: "Caleb Brooks", delta: "Last 5 sessions" },
];

export const playerProgressMetrics: Record<string, { label: string; value: number; unit: string; trend: string; category: "physical" | "soccer" }[]> = {
  player_user_u19_1: [
    { label: "Push-ups", value: 42, unit: "reps", trend: "+8 in 6 weeks", category: "physical" },
    { label: "Pull-ups", value: 11, unit: "reps", trend: "+3 in 6 weeks", category: "physical" },
    { label: "Juggles", value: 188, unit: "touches", trend: "+54 best streak", category: "soccer" },
    { label: "Wall passes", value: 94, unit: "%", trend: "+7% this month", category: "soccer" },
  ],
  player_user_youth_1: [
    { label: "Push-ups", value: 20, unit: "reps", trend: "+5 in 6 weeks", category: "physical" },
    { label: "Pull-ups", value: 4, unit: "reps", trend: "+2 in 6 weeks", category: "physical" },
    { label: "Juggles", value: 86, unit: "touches", trend: "+24 best streak", category: "soccer" },
    { label: "Wall passes", value: 78, unit: "%", trend: "+6% this month", category: "soccer" },
  ],
};

export const sessionPlans = [
  {
    id: "session_1",
    title: "Technical build",
    focus: "Build-out under pressure",
    blocks: [
      "Activation and scanning warm-up",
      "6v4 first-phase build pattern",
      "Final-third combination finishing",
      "11v11 rest-defense rehearsal",
    ],
    explanation: "Focus on defensive transitions. Keep intensity high in second half of session.",
  },
  {
    id: "session_2",
    title: "Set-piece prep",
    focus: "Corners and restarts",
    blocks: [
      "Corner timing walkthrough",
      "Near-post and back-post service reps",
      "Defensive free-kick triggers",
      "Short-corner contingency pattern",
    ],
    explanation: "Build clarity without adding extra fatigue before kickoff.",
  },
];

export const matchDayPlan = {
  opponent: "Riverside FC",
  formation: "4-3-3",
  startingLineup: [
    "1 Liam Carter",
    "2 Elijah Turner",
    "4 Caleb Brooks",
    "5 Julian Foster",
    "3 Mateo Alvarez",
    "6 Leo Ramirez",
    "8 Owen Bailey",
    "10 Isaac Perry",
    "7 Kai Griffin",
    "9 Micah Ross",
    "11 Diego Sanders",
  ],
  bench: ["13 Noah Bennett", "14 Jude Flores"],
  tacticalKeys: [
    "Press their pivot on the first backward pass.",
    "Attack the weak-side fullback with diagonal switches.",
    "Counterpress for five seconds after final-third losses.",
  ],
};
