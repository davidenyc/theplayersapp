"use client";

import Link from "next/link";
import { BellRing, Flag } from "lucide-react";

import { ReadinessDashboard } from "@/components/coach/ReadinessDashboard";
import { ResponseFlags } from "@/components/coach/ResponseFlags";
import { TopNav } from "@/components/layout/TopNav";
import { GoalCard } from "@/components/player/GoalCard";
import { useAppMode } from "@/components/providers/AppModeProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTeam } from "@/components/providers/TeamProvider";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { TrendChart } from "@/components/ui/TrendChart";
import { biomarkerEntries } from "@/lib/mock/data";
import { getCoachDashboardData, getPlayerDashboardData, getPlayerReadinessTrend, getTeamReadinessTrend } from "@/lib/mock/selectors";
import { formatDateTime } from "@/lib/utils/formatters";

const weeklyLoadData = [
  { date: "Mon", value: 6.2 },
  { date: "Tue", value: 5.8 },
  { date: "Wed", value: 7.1 },
  { date: "Thu", value: 4.5 },
  { date: "Fri", value: 6.8 },
  { date: "Sat", value: 5.2 },
  { date: "Sun", value: 6.5 },
];

export default function DashboardPage() {
  const { profile, loading } = useAuth();
  const { activeTeam } = useTeam();
  const { mode } = useAppMode();

  if (loading || !profile) return <div className="p-6 text-sm text-slate-500">Loading dashboard...</div>;

  if (profile.role === "player") {
    const playerData = getPlayerDashboardData(profile.id, activeTeam.id);
    const latestHrv = biomarkerEntries.filter((entry) => entry.player_id === profile.id && entry.metric === "hrv").sort((a, b) => b.recorded_at.localeCompare(a.recorded_at))[0];
    const recoveryScore = Math.round(((latestHrv?.value ?? 66) / 80) * 100);
    const readinessScore = playerData.latestResponse?.readiness_score ?? 78;
    return (
      <div className="space-y-6">
        {mode === "gameday" ? (
          <Card className="border border-amber-200 bg-amber-50">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-2xl font-semibold text-amber-950"><Flag className="h-6 w-6" />Match Day</div>
                <div className="mt-2 text-sm text-amber-900">vs Riverside FC · Today · 3:00 PM</div>
              </div>
              <Link href="/checkin?context=prematch" className="inline-flex min-h-11 items-center rounded-full bg-amber-500 px-4 text-sm font-semibold text-white shadow-sm">Pre-match survey</Link>
            </div>
          </Card>
        ) : null}
        <TopNav title="Home" subtitle="Your readiness and next steps." userName={profile.full_name} roleLabel="Player view" />
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="bg-[linear-gradient(135deg,#082f49,#0f766e)] text-white">
            <div className="text-sm uppercase tracking-[0.24em] text-teal-200">Today</div>
            <h2 className="mt-3 text-3xl font-semibold">Daily check-in</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-teal-50/90">Complete your form before 9:30 AM so staff can plan the day.</p>
            <Link href="/checkin" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-slate-950 shadow-sm">{playerData.latestResponse ? "Update check-in" : "Complete check-in"}</Link>
          </Card>
          <Card>
            <div className="text-sm text-slate-500">Today&apos;s readiness score</div>
            <div className="mt-4 text-6xl font-semibold text-teal-700">{readinessScore}</div>
            <div className="mt-2 text-sm text-slate-500">{playerData.latestResponse?.flagged ? `Flags: ${playerData.latestResponse.flag_reasons.join(", ")}` : "No flag triggers in your latest response."}</div>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Check-in streak" value="7 days" delta="Locked in this week" />
          <StatCard label="Recovery score" value={`${recoveryScore}`} delta={`HRV ${latestHrv?.value ?? 66} ms today`} />
          <StatCard label="Next event" value={playerData.nextEvent?.title ?? "Training"} delta={playerData.nextEvent ? formatDateTime(playerData.nextEvent.starts_at) : "No event yet"} />
          <StatCard label="Latest note" value={playerData.note ? "Coach note" : "No note"} delta={playerData.note?.body.slice(0, 40) ?? "Nothing new"} />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
          <TrendChart data={getPlayerReadinessTrend(profile.id)} metric="Readiness over time" flagThreshold={60} />
          <Card>
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-950"><BellRing className="h-5 w-5 text-teal-600" />Recovery tips</div>
            <div className="mt-4 space-y-3">
              <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">Drink 500 mL water 2 hours before training.</div>
              <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">If sleep is under 6 hours, prioritize extra recovery after session.</div>
              <div className="rounded-3xl bg-teal-50 p-4 text-sm text-teal-800">Open the Health page to see how readiness, recovery, and hydration fit together.</div>
            </div>
            <Link href="/health" className="mt-4 inline-flex min-h-11 items-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm">Open health view</Link>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">{playerData.goals.slice(0, 4).map((goal) => <GoalCard key={goal.id} goal={goal} />)}</div>
      </div>
    );
  }

  const coachData = getCoachDashboardData(activeTeam.id);
  const nextEvent = coachData.roster.length ? coachData.statCards[3] : null;
  const readinessDetails = Object.fromEntries(coachData.roster.map((entry) => [entry.profile.id, { readinessScore: entry.latestResponse?.readiness_score ?? 0, flags: entry.latestResponse?.flag_reasons ?? [], answers: entry.latestResponse?.answers ?? {}, position: entry.playerProfile.position }]));

  return (
    <div className="space-y-6">
      <TopNav title="Home" subtitle="Squad readiness and team overview." userName={profile.full_name} roleLabel="Coach view" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard value={`${Math.round((coachData.todayResponses.length / Math.max(coachData.roster.length, 1)) * 100)}%`} label="Check-in compliance" delta="Based on today&apos;s responses." />
        <StatCard value={`${coachData.flagged.length}`} label="Flagged players" delta="Need review today" />
        <StatCard value={`${coachData.roster.length - coachData.todayResponses.length}`} label="Missing responses" delta="Still outstanding" />
        <StatCard value={String(nextEvent?.value ?? "Training")} label="Upcoming event" delta={String(nextEvent?.delta ?? "No event")} />
      </div>
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Readiness dashboard</h2>
          <p className="text-sm text-slate-500">Tap a player to see what&apos;s driving the score.</p>
        </div>
        <ReadinessDashboard players={coachData.readinessCards} detailsById={readinessDetails} />
      </section>
      <TrendChart data={getTeamReadinessTrend(activeTeam.id)} metric="Readiness over time" flagThreshold={60} />
      <TrendChart data={weeklyLoadData} metric="Team load — last 7 days" />
      <ResponseFlags responses={coachData.flagged.slice(0, 6)} />
    </div>
  );
}
