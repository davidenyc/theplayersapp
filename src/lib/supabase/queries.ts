import { endOfDay, startOfDay } from "date-fns";

import { createClient } from "@/lib/supabase/client";
import type {
  Goal,
  Highlight,
  PlayerProfile,
  Profile,
  StatRecord,
  SurveyAssignment,
  SurveyResponse,
  SurveyTemplate,
} from "@/types";

type TeamIdRow = { team_id: string };
type EventRow = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  location?: string;
  team_id: string;
  type: "training" | "game" | "meeting" | "other";
  notes?: string;
  created_by: string;
};

export async function getCurrentUserBundle() {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { profile: null, teamId: null };
  }

  const { data: profileRaw } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const profile = (profileRaw ?? null) as Profile | null;
  if (!profile) {
    return { profile: null, teamId: null };
  }

  if (profile.role === "coach" || profile.role === "admin") {
    const { data: coachRaw } = await supabase
      .from("coach_profiles")
      .select("team_id")
      .eq("user_id", profile.id)
      .single();
    const coach = (coachRaw ?? null) as TeamIdRow | null;
    return { profile, teamId: coach?.team_id ?? null };
  }

  const { data: playerRaw } = await supabase
    .from("player_profiles")
    .select("team_id")
    .eq("user_id", profile.id)
    .single();
  const player = (playerRaw ?? null) as TeamIdRow | null;

  return { profile, teamId: player?.team_id ?? null };
}

export async function getTodayResponseForPlayer(playerId: string): Promise<SurveyResponse | null> {
  const supabase = createClient();
  const from = startOfDay(new Date()).toISOString();
  const to = endOfDay(new Date()).toISOString();

  const { data } = await supabase
    .from("survey_responses")
    .select("*")
    .eq("player_id", playerId)
    .gte("submitted_at", from)
    .lte("submitted_at", to)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data ?? null) as SurveyResponse | null;
}

type RosterRow = PlayerProfile & {
  profiles: Profile | null;
};

export async function getRosterForTeam(teamId: string) {
  const supabase = createClient();
  const { data: players, error } = await supabase
    .from("player_profiles")
    .select("*, profiles!inner(*)")
    .eq("team_id", teamId)
    .order("jersey_number", { ascending: true });

  if (error) throw error;

  const normalized = (players ?? []) as unknown as RosterRow[];
  const playerIds = normalized.map((entry) => entry.user_id);
  const latestMap = await getLatestResponsesForPlayers(playerIds);

  return normalized.map((entry) => ({
    profile: entry.profiles as Profile,
    playerProfile: {
      id: entry.id,
      user_id: entry.user_id,
      team_id: entry.team_id,
      position: entry.position,
      dominant_foot: entry.dominant_foot,
      height_cm: entry.height_cm,
      weight_kg: entry.weight_kg,
      date_of_birth: entry.date_of_birth,
      graduation_year: entry.graduation_year,
      school: entry.school,
      bio: entry.bio,
      jersey_number: entry.jersey_number,
      emergency_contact_name: entry.emergency_contact_name,
      emergency_contact_phone: entry.emergency_contact_phone,
      medical_notes: entry.medical_notes,
    },
    latestResponse: latestMap.get(entry.user_id),
  }));
}

export async function getLatestResponsesForPlayers(playerIds: string[]) {
  const supabase = createClient();
  if (playerIds.length === 0) return new Map<string, SurveyResponse>();

  const { data, error } = await supabase
    .from("survey_responses")
    .select("*")
    .in("player_id", playerIds)
    .order("submitted_at", { ascending: false });

  if (error) throw error;

  const map = new Map<string, SurveyResponse>();
  for (const response of (data ?? []) as SurveyResponse[]) {
    if (!map.has(response.player_id)) {
      map.set(response.player_id, response);
    }
  }
  return map;
}

export async function getCoachDashboardData(teamId: string) {
  const supabase = createClient();
  const from = startOfDay(new Date()).toISOString();
  const to = endOfDay(new Date()).toISOString();

  const { data: teamPlayers, error: playersError } = await supabase
    .from("player_profiles")
    .select("user_id, position, profiles!inner(id, full_name, avatar_url)")
    .eq("team_id", teamId);

  if (playersError) throw playersError;

  const players = (teamPlayers ?? []) as Array<{
    user_id: string;
    position: string;
    profiles: Pick<Profile, "id" | "full_name" | "avatar_url">;
  }>;

  const playerIds = players.map((entry) => entry.user_id);

  const [{ data: todayResponses }, { data: latestResponses }, { data: nextEventRaw }] = await Promise.all([
    supabase
      .from("survey_responses")
      .select("*")
      .in("player_id", playerIds)
      .gte("submitted_at", from)
      .lte("submitted_at", to),
    supabase
      .from("survey_responses")
      .select("*")
      .in("player_id", playerIds)
      .order("submitted_at", { ascending: false }),
    supabase
      .from("events")
      .select("*")
      .eq("team_id", teamId)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const nextEvent = (nextEventRaw ?? null) as EventRow | null;
  const latestMap = new Map<string, SurveyResponse>();
  for (const response of ((latestResponses ?? []) as SurveyResponse[])) {
    if (!latestMap.has(response.player_id)) {
      latestMap.set(response.player_id, response);
    }
  }

  const today = (todayResponses ?? []) as SurveyResponse[];
  const submittedToday = new Set(today.map((response) => response.player_id));
  const flagged = today.filter((response) => response.flagged);

  const readinessCards = players
    .map((entry) => {
      const latest = latestMap.get(entry.user_id);
      return {
        id: entry.profiles.id,
        name: entry.profiles.full_name,
        avatarUrl: entry.profiles.avatar_url,
        readinessScore: latest?.readiness_score ?? 0,
        flagCount: latest?.flag_reasons.length ?? 0,
        completed: submittedToday.has(entry.user_id),
        position: entry.position,
      };
    })
    .sort((a, b) => {
      if (a.flagCount !== b.flagCount) return b.flagCount - a.flagCount;
      return a.readinessScore - b.readinessScore;
    });

  return {
    readinessCards,
    flagged,
    nextEvent,
    compliancePct: players.length ? Math.round((today.length / players.length) * 100) : 0,
    flaggedCount: flagged.length,
    playersNotResponded: players.length - today.length,
  };
}

export async function getPlayerDetailData(playerId: string) {
  const supabase = createClient();
  const [{ data: profile }, { data: player }, { data: goals }, { data: stats }, { data: highlights }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", playerId).single(),
      supabase.from("player_profiles").select("*").eq("user_id", playerId).single(),
      supabase.from("goals").select("*").eq("player_id", playerId).order("created_at", { ascending: false }),
      supabase
        .from("stat_records")
        .select("*")
        .eq("player_id", playerId)
        .order("recorded_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("highlights")
        .select("*")
        .eq("player_id", playerId)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false }),
    ]);

  return {
    profile: (profile ?? null) as Profile | null,
    player: (player ?? null) as PlayerProfile | null,
    goals: (goals ?? []) as Goal[],
    stats: (stats ?? null) as StatRecord | null,
    highlights: (highlights ?? []) as Highlight[],
  };
}

export async function getActiveSurveyForTeam(teamId: string) {
  const supabase = createClient();
  const { data: assignmentRaw } = await supabase
    .from("survey_assignments")
    .select("*")
    .eq("team_id", teamId)
    .eq("is_active", true)
    .order("active_from", { ascending: false })
    .limit(1)
    .maybeSingle();

  const assignment = (assignmentRaw ?? null) as SurveyAssignment | null;
  if (!assignment) return { assignment: null, template: null };

  const { data: templateRaw } = await supabase
    .from("survey_templates")
    .select("*")
    .eq("id", assignment.template_id)
    .single();
  const template = (templateRaw ?? null) as SurveyTemplate | null;

  return {
    assignment: assignment as SurveyAssignment,
    template,
  };
}
