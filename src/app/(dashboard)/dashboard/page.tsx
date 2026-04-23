"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/components/providers/AuthProvider";
import { TopNav } from "@/components/layout/TopNav";
import { ReadinessDashboard } from "@/components/coach/ReadinessDashboard";
import { ResponseFlags } from "@/components/coach/ResponseFlags";
import { GoalCard } from "@/components/player/GoalCard";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { TrendChart } from "@/components/ui/TrendChart";
import {
  getCoachDashboardData as getDemoCoachDashboardData,
  getPlayerDashboardData as getDemoPlayerDashboardData,
  getPlayerReadinessTrend,
  getTeamReadinessTrend,
} from "@/lib/mock/selectors";
import { getCoachDashboardData, getCurrentUserBundle, getPlayerDetailData, getTodayResponseForPlayer } from "@/lib/supabase/queries";
import { formatDateTime } from "@/lib/utils/formatters";
import type { Event, Goal, SurveyResponse } from "@/types";

type CoachDashboardState = {
  readinessCards: {
    id: string;
    name: string;
    avatarUrl?: string;
    readinessScore: number;
    flagCount: number;
    completed: boolean;
    position: string;
  }[];
  flagged: SurveyResponse[];
  nextEvent: Event | null;
  compliancePct: number;
  flaggedCount: number;
  playersNotResponded: number;
};

export default function DashboardPage() {
  const { profile, teamId, isDemo, loading } = useAuth();
  const [coachData, setCoachData] = useState<CoachDashboardState | null>(null);
  const [playerData, setPlayerData] = useState<{
    latestResponse: SurveyResponse | null;
    goals: Goal[];
  } | null>(null);

  useEffect(() => {
    async function load() {
      if (isDemo && profile) {
        if (profile.role === "player") {
          const demoPlayer = getDemoPlayerDashboardData(profile.id);
          setPlayerData({
            latestResponse: demoPlayer.latestResponse ?? null,
            goals: demoPlayer.goals,
          });
        } else {
          const demoCoach = getDemoCoachDashboardData();
          setCoachData({
            readinessCards: demoCoach.readinessCards,
            flagged: demoCoach.flagged,
            nextEvent: null,
            compliancePct: demoCoach.roster.length
              ? Math.round((demoCoach.todayResponses.length / demoCoach.roster.length) * 100)
              : 0,
            flaggedCount: demoCoach.flagged.length,
            playersNotResponded: demoCoach.roster.length - demoCoach.todayResponses.length,
          });
        }
        return;
      }

      const current = profile ? { profile, teamId } : await getCurrentUserBundle();
      if (!current.profile) return;

      if ((current.profile.role === "coach" || current.profile.role === "admin") && current.teamId) {
        const nextCoachData = await getCoachDashboardData(current.teamId);
        setCoachData(nextCoachData);
      } else {
        const [latestResponse, detail] = await Promise.all([
          getTodayResponseForPlayer(current.profile.id),
          getPlayerDetailData(current.profile.id),
        ]);
        setPlayerData({ latestResponse, goals: detail.goals });
      }
    }

    if (!loading) {
      void load();
    }
  }, [isDemo, loading, profile, teamId]);

  if (loading || (!coachData && !playerData)) {
    return <div className="p-6 text-sm text-slate-500">Loading dashboard...</div>;
  }

  if (profile?.role === "player" && playerData) {
    return (
      <div className="space-y-6">
        <TopNav title="Player Dashboard" subtitle="Today’s readiness, events, and development plan." userName={profile.full_name} />
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="bg-[linear-gradient(135deg,#082f49,#0f766e)] text-white">
            <div className="text-sm uppercase tracking-[0.24em] text-teal-200">Today</div>
            <h2 className="mt-3 text-3xl font-semibold">Daily check-in</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-teal-50/90">
              Keep the staff updated before 9:30 AM so your training load and treatment plan stay accurate.
            </p>
            <Link
              href="/checkin"
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-slate-950"
            >
              {playerData.latestResponse ? "Update check-in" : "Complete check-in"}
            </Link>
          </Card>
          <Card>
            <div className="text-sm text-slate-500">Today&apos;s readiness score</div>
            <div className="mt-4 text-6xl font-semibold text-teal-700">
              {playerData.latestResponse?.readiness_score ?? 0}
            </div>
            <div className="mt-2 text-sm text-slate-500">
              {playerData.latestResponse?.flagged
                ? `Flags: ${playerData.latestResponse.flag_reasons.join(", ")}`
                : "No flag triggers in your latest response."}
            </div>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {playerData.goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
        <TrendChart
          data={getPlayerReadinessTrend(profile.id)}
          metric="Readiness over time"
          flagThreshold={60}
        />
      </div>
    );
  }

  if (!coachData) return null;

  const nextEvent = (coachData.nextEvent ?? null) as Event | null;

  const statCards = [
    {
      value: `${coachData.compliancePct}%`,
      label: "Check-in Compliance",
      delta: "Based on today's responses",
    },
    {
      value: `${coachData.flaggedCount}`,
      label: "Flagged Players",
      delta: "Flag threshold triggers today",
    },
    {
      value: `${coachData.playersNotResponded}`,
      label: "Missing Responses",
      delta: "Still outstanding today",
    },
    {
      value: nextEvent?.title ?? "No event",
      label: "Upcoming Event",
      delta: nextEvent ? formatDateTime(nextEvent.starts_at) : "Nothing scheduled",
    },
  ];

  return (
    <div className="space-y-6">
      <TopNav title="Coach Dashboard" subtitle="Track team readiness, compliance, attendance, and player risk." userName={profile?.full_name ?? "Coach"} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Readiness dashboard</h2>
          <p className="text-sm text-slate-500">Live data from today&apos;s survey responses for your team.</p>
        </div>
        <ReadinessDashboard players={coachData.readinessCards.slice(0, 9)} />
      </section>
      <TrendChart data={getTeamReadinessTrend()} metric="Squad readiness score over time" flagThreshold={60} />
      <ResponseFlags responses={coachData.flagged.slice(0, 6)} />
    </div>
  );
}
