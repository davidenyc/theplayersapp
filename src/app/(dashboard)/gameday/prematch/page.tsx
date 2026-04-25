"use client";

import { useState } from "react";

import { ReadinessDashboard } from "@/components/coach/ReadinessDashboard";
import { TopNav } from "@/components/layout/TopNav";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTeam } from "@/components/providers/TeamProvider";
import { Card } from "@/components/ui/Card";
import { getCoachDashboardData } from "@/lib/mock/selectors";

export default function GameDayPrematchPage() {
  const { profile } = useAuth();
  const { activeTeam } = useTeam();
  const [sent, setSent] = useState(false);
  const dashboard = getCoachDashboardData(activeTeam.id);
  const avg = dashboard.readinessCards.length ? Math.round(dashboard.readinessCards.reduce((sum, item) => sum + item.readinessScore, 0) / dashboard.readinessCards.length) : 0;
  const readinessDetails = Object.fromEntries(dashboard.roster.map((entry) => [entry.profile.id, { readinessScore: entry.latestResponse?.readiness_score ?? 0, flags: entry.latestResponse?.flag_reasons ?? [], answers: entry.latestResponse?.answers ?? {}, position: entry.playerProfile.position }]));

  return (
    <div className="space-y-6">
      <TopNav title="Pre-Match" subtitle="Player readiness before kickoff." userName={profile?.full_name ?? "Coach"} roleLabel={profile?.role === "player" ? "Player view" : "Coach view"} />
      <Card><div className="text-sm font-semibold text-slate-900">vs Riverside FC · Today · 3:00 PM · Riverside Stadium</div></Card>
      <Card><div className="text-sm text-slate-500">Average readiness</div><div className="mt-2 text-4xl font-semibold text-slate-950">{avg}</div><div className="mt-2 text-sm text-slate-500">{dashboard.flagged.length} flags across the squad</div></Card>
      <ReadinessDashboard players={dashboard.readinessCards} detailsById={readinessDetails} />
      {profile?.role !== "player" ? <button type="button" onClick={() => setSent(true)} className="min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Send pre-match survey</button> : null}
      {sent ? <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">Survey sent to {dashboard.roster.length} players.</div> : null}
    </div>
  );
}
