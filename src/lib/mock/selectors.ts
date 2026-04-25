import { formatISO, isToday, parseISO } from "date-fns";

import {
  announcements,
  attendance,
  biomarkerEntries,
  coachNotes,
  coachProfiles,
  events,
  goals,
  highlights,
  matchDayPlan,
  playerProfiles,
  players,
  records,
  stats,
  surveyAssignment,
  surveyAssignments,
  surveyResponses,
  surveyTemplate,
  surveyTemplates,
  team,
  teamU19,
} from "@/lib/mock/data";
import { getDemoResponses } from "@/lib/demo/state";
import type { PlayerListItem, Profile, ReadinessCardData, SurveyResponse, Team } from "@/types";

function rosterProfiles(teamId = teamU19.id) {
  return playerProfiles.filter((profile) => players.some((player) => player.user_id === profile.id && player.team_id === teamId));
}

function rosterPlayers(teamId = teamU19.id) {
  return players.filter((player) => player.team_id === teamId);
}

function teamResponses(teamId = teamU19.id) {
  const rosterIds = new Set(rosterProfiles(teamId).map((profile) => profile.id));
  return [...getDemoResponses(), ...surveyResponses].filter((response) => rosterIds.has(response.player_id));
}

export function getCurrentProfile(role: "coach" | "player" = "coach"): Profile {
  return role === "coach" ? coachProfiles[0] : rosterProfiles(teamU19.id)[0];
}

export function getLatestResponsesMap(teamId = teamU19.id) {
  const latest = new Map<string, SurveyResponse>();
  const combined = teamResponses(teamId);

  for (const response of combined.sort((a, b) => b.submitted_at.localeCompare(a.submitted_at))) {
    if (!latest.has(response.player_id)) latest.set(response.player_id, response);
  }

  return latest;
}

export function getRoster(teamId = teamU19.id): PlayerListItem[] {
  const latest = getLatestResponsesMap(teamId);
  return rosterProfiles(teamId).map((profile) => ({
    profile,
    playerProfile: rosterPlayers(teamId).find((player) => player.user_id === profile.id)!,
    latestResponse: latest.get(profile.id),
  }));
}

export function getUpcomingEvent(teamId = teamU19.id) {
  return events.filter((event) => event.team_id === teamId).sort((a, b) => a.starts_at.localeCompare(b.starts_at))[0];
}

export function getCoachDashboardData(teamId = teamU19.id) {
  const roster = getRoster(teamId);
  const todayResponses = teamResponses(teamId).filter((response) => isToday(parseISO(response.submitted_at)));
  const submittedIds = new Set(todayResponses.map((response) => response.player_id));
  const flagged = todayResponses.filter((response) => response.flagged);
  const nextEvent = getUpcomingEvent(teamId);
  const noResponseAttendance = attendance.filter((entry) => entry.event_id === nextEvent?.id && entry.status === "no_response").length;

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
      { label: "Check-in compliance", value: `${Math.round((todayResponses.length / Math.max(roster.length, 1)) * 100)}%`, delta: "Based on today&apos;s responses." },
      { label: "Flagged players", value: `${flagged.length}`, delta: flagged.length > 0 ? "Needs review today." : "No major flags." },
      { label: "No RSVP yet", value: `${noResponseAttendance}`, delta: "Before the next event." },
      { label: "Next event", value: nextEvent?.type === "game" ? "Match day" : "Training", delta: nextEvent?.title ?? "Nothing scheduled." },
    ],
  };
}

export function getPlayerDashboardData(profileId = rosterProfiles(teamU19.id)[0].id, teamId?: string) {
  const player = players.find((entry) => entry.user_id === profileId);
  const resolvedTeamId = teamId ?? player?.team_id ?? teamU19.id;
  const latestResponse = teamResponses(resolvedTeamId)
    .filter((response) => response.player_id === profileId)
    .sort((a, b) => b.submitted_at.localeCompare(a.submitted_at))[0];
  const nextEvent = getUpcomingEvent(resolvedTeamId);
  const note = coachNotes.filter((entry) => entry.player_id === profileId && entry.is_shared).sort((a, b) => b.created_at.localeCompare(a.created_at))[0];

  return {
    latestResponse,
    nextEvent,
    note,
    goals: goals.filter((goal) => goal.player_id === profileId),
    profile: playerProfiles.find((entry) => entry.id === profileId)!,
    playerProfile: player ?? rosterPlayers(resolvedTeamId)[0],
  };
}

export function getSurveyResponseDashboard(teamId = teamU19.id) {
  const roster = getRoster(teamId);
  const latest = getLatestResponsesMap(teamId);
  const compliance = Math.round((latest.size / Math.max(roster.length, 1)) * 100);

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

  const trendData = roster.slice(0, 5).flatMap((profile) =>
    teamResponses(teamId)
      .filter((response) => response.player_id === profile.profile.id)
      .slice(0, 7)
      .map((response) => ({
        date: formatISO(parseISO(response.submitted_at), { representation: "date" }),
        value: response.readiness_score ?? 0,
        player: profile.profile.full_name,
      })),
  );

  return {
    cards,
    compliance,
    trendData,
    template: surveyTemplates.find((entry) => entry.team_id === teamId) ?? surveyTemplate,
    assignment: surveyAssignments.find((entry) => entry.team_id === teamId) ?? surveyAssignment,
  };
}

export function getProfilePageData(profileId = rosterProfiles(teamU19.id)[0].id) {
  const player = players.find((entry) => entry.user_id === profileId)!;
  return {
    player,
    profile: playerProfiles.find((entry) => entry.id === profileId)!,
    goals: goals.filter((entry) => entry.player_id === profileId),
    highlights: highlights.filter((entry) => entry.player_id === profileId),
    records: records.filter((entry) => entry.player_id === profileId),
    stats: stats.find((entry) => entry.player_id === profileId),
    biomarkers: biomarkerEntries.filter((entry) => entry.player_id === profileId),
    notes: coachNotes.filter((entry) => entry.player_id === profileId && entry.is_shared),
  };
}

export function getHighlightsPageData(teamId = teamU19.id) {
  const rosterIds = new Set(rosterPlayers(teamId).map((player) => player.user_id));
  return highlights.filter((entry) => rosterIds.has(entry.player_id)).sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned));
}

export function getSchedulePageData(teamId = teamU19.id) {
  return {
    events: events.filter((event) => event.team_id === teamId),
    attendance: attendance.filter((entry) => getUpcomingEvent(teamId)?.id === entry.event_id || events.some((event) => event.id === entry.event_id && event.team_id === teamId)),
    matchDayPlan,
  };
}

export function getMessagesPageData(teamId = teamU19.id) {
  return announcements.filter((item) => item.team_id === teamId);
}

export function getTeamContext(teamId = teamU19.id) {
  return {
    team: teamId === teamU19.id ? teamU19 : team,
    surveyTemplate: surveyTemplates.find((entry) => entry.team_id === teamId) ?? surveyTemplate,
    surveyAssignment: surveyAssignments.find((entry) => entry.team_id === teamId) ?? surveyAssignment,
  };
}

export function getPlayerReadinessTrend(profileId = rosterProfiles(teamU19.id)[0].id) {
  return [...getDemoResponses(), ...surveyResponses]
    .filter((response) => response.player_id === profileId)
    .sort((a, b) => a.submitted_at.localeCompare(b.submitted_at))
    .slice(-14)
    .map((response) => ({
      date: formatISO(parseISO(response.submitted_at), { representation: "date" }).slice(5),
      value: response.readiness_score ?? 0,
    }));
}

export function getTeamReadinessTrend(teamId = teamU19.id) {
  const grouped = new Map<string, { total: number; count: number }>();
  for (const response of teamResponses(teamId)) {
    const key = formatISO(parseISO(response.submitted_at), { representation: "date" }).slice(5);
    const current = grouped.get(key) ?? { total: 0, count: 0 };
    current.total += response.readiness_score ?? 0;
    current.count += 1;
    grouped.set(key, current);
  }

  return [...grouped.entries()]
    .map(([date, value]) => ({ date, value: Math.round(value.total / value.count) }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);
}
