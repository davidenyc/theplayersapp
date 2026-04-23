import { addDays, formatISO, isToday, parseISO } from "date-fns";

import {
  announcements,
  attendance,
  biomarkerEntries,
  coachNotes,
  coachProfiles,
  events,
  goals,
  highlights,
  playerProfiles,
  players,
  records,
  stats,
  surveyAssignment,
  surveyResponses,
  surveyTemplate,
  team,
} from "@/lib/mock/data";
import { getDemoResponses } from "@/lib/demo/state";
import type { PlayerListItem, Profile, ReadinessCardData, SurveyResponse } from "@/types";

export function getCurrentProfile(role: "coach" | "player" = "coach"): Profile {
  return role === "coach" ? coachProfiles[0] : playerProfiles[0];
}

export function getLatestResponsesMap() {
  const latest = new Map<string, SurveyResponse>();
  const combined = [...getDemoResponses(), ...surveyResponses];

  for (const response of combined.sort((a, b) =>
    b.submitted_at.localeCompare(a.submitted_at),
  )) {
    if (!latest.has(response.player_id)) {
      latest.set(response.player_id, response);
    }
  }

  return latest;
}

export function getRoster(): PlayerListItem[] {
  const latest = getLatestResponsesMap();
  return playerProfiles.map((profile) => ({
    profile,
    playerProfile: players.find((player) => player.user_id === profile.id)!,
    latestResponse: latest.get(profile.id),
  }));
}

export function getUpcomingEvent() {
  return [...events].sort((a, b) => a.starts_at.localeCompare(b.starts_at))[0];
}

export function getCoachDashboardData() {
  const roster = getRoster();
  const todayResponses = [...getDemoResponses(), ...surveyResponses].filter((response) =>
    isToday(parseISO(response.submitted_at)),
  );
  const submittedIds = new Set(todayResponses.map((response) => response.player_id));
  const flagged = todayResponses.filter((response) => response.flagged);
  const noResponseCount = roster.length - todayResponses.length;
  const nextEvent = getUpcomingEvent();
  const noResponseAttendance = attendance.filter(
    (entry) => entry.event_id === nextEvent?.id && entry.status === "no_response",
  ).length;

  const readinessCards: ReadinessCardData[] = roster
    .map((entry) => ({
      id: entry.profile.id,
      name: entry.profile.full_name,
      avatarUrl: entry.profile.avatar_url,
      readinessScore: entry.latestResponse?.readiness_score ?? 0,
      flagCount: entry.latestResponse?.flag_reasons.length ?? 0,
      completed: submittedIds.has(entry.profile.id),
      position: entry.playerProfile.position,
    }))
    .sort((a, b) => {
      if (a.flagCount !== b.flagCount) return b.flagCount - a.flagCount;
      return a.readinessScore - b.readinessScore;
    });

  return {
    roster,
    readinessCards,
    todayResponses,
    flagged,
    statCards: [
      {
        label: "Check-in Compliance",
        value: `${Math.round((todayResponses.length / roster.length) * 100)}%`,
        delta: "+8% vs last week",
      },
      {
        label: "Flagged Players",
        value: `${flagged.length}`,
        delta: flagged.length > 5 ? "+2 today" : "-1 today",
      },
      {
        label: "No RSVP Yet",
        value: `${noResponseAttendance}`,
        delta: "Before Saturday match",
      },
      {
        label: "Next Event",
        value: nextEvent?.type === "game" ? "Match Day" : "Training",
        delta: nextEvent ? nextEvent.title : "No event",
      },
    ],
  };
}

export function getPlayerDashboardData(profileId = playerProfiles[0].id) {
  const latestResponse = [...getDemoResponses(), ...surveyResponses]
    .filter((response) => response.player_id === profileId)
    .sort((a, b) => b.submitted_at.localeCompare(a.submitted_at))[0];
  const nextEvent = getUpcomingEvent();
  const note = coachNotes
    .filter((entry) => entry.player_id === profileId && entry.is_shared)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];

  return {
    latestResponse,
    nextEvent,
    note,
    goals: goals.filter((goal) => goal.player_id === profileId),
    profile: playerProfiles.find((entry) => entry.id === profileId)!,
    playerProfile: players.find((entry) => entry.user_id === profileId)!,
  };
}

export function getSurveyResponseDashboard() {
  const roster = getRoster();
  const latest = getLatestResponsesMap();
  const compliance = Math.round((latest.size / roster.length) * 100);

  const cards = roster.map((entry) => {
    const response = latest.get(entry.profile.id);
    return {
      id: entry.profile.id,
      name: entry.profile.full_name,
      position: entry.playerProfile.position,
      status: !response ? "missed" : response.flagged ? "flagged" : "submitted",
      response,
    };
  });

  const trendData = playerProfiles.slice(0, 5).flatMap((profile) =>
    [...getDemoResponses(), ...surveyResponses]
      .filter((response) => response.player_id === profile.id)
      .slice(0, 7)
      .map((response) => ({
        date: formatISO(addDays(parseISO(response.submitted_at), 0), {
          representation: "date",
        }),
        value: response.readiness_score ?? 0,
        player: profile.full_name,
      })),
  );

  return { cards, compliance, trendData, template: surveyTemplate, assignment: surveyAssignment };
}

export function getProfilePageData(profileId = playerProfiles[0].id) {
  return {
    player: players.find((entry) => entry.user_id === profileId)!,
    profile: playerProfiles.find((entry) => entry.id === profileId)!,
    goals: goals.filter((entry) => entry.player_id === profileId),
    highlights: highlights.filter((entry) => entry.player_id === profileId),
    records: records.filter((entry) => entry.player_id === profileId),
    stats: stats.find((entry) => entry.player_id === profileId),
    biomarkers: biomarkerEntries.filter((entry) => entry.player_id === profileId),
    notes: coachNotes.filter((entry) => entry.player_id === profileId && entry.is_shared),
  };
}

export function getHighlightsPageData() {
  return [...highlights].sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned));
}

export function getSchedulePageData() {
  return {
    events,
    attendance,
  };
}

export function getMessagesPageData() {
  return announcements;
}

export function getTeamContext() {
  return { team, surveyTemplate, surveyAssignment };
}

export function getPlayerReadinessTrend(profileId = playerProfiles[0].id) {
  return [...getDemoResponses(), ...surveyResponses]
    .filter((response) => response.player_id === profileId)
    .sort((a, b) => a.submitted_at.localeCompare(b.submitted_at))
    .slice(-14)
    .map((response) => ({
      date: formatISO(parseISO(response.submitted_at), { representation: "date" }).slice(5),
      value: response.readiness_score ?? 0,
    }));
}

export function getTeamReadinessTrend() {
  const grouped = new Map<string, { total: number; count: number }>();

  for (const response of [...getDemoResponses(), ...surveyResponses]) {
    const key = formatISO(parseISO(response.submitted_at), { representation: "date" }).slice(5);
    const current = grouped.get(key) ?? { total: 0, count: 0 };
    current.total += response.readiness_score ?? 0;
    current.count += 1;
    grouped.set(key, current);
  }

  return [...grouped.entries()]
    .map(([date, value]) => ({
      date,
      value: Math.round(value.total / value.count),
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);
}
