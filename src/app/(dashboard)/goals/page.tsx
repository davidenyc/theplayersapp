"use client";

import Link from "next/link";

import { TopNav } from "@/components/layout/TopNav";
import { useAuth } from "@/components/providers/AuthProvider";
import { GoalCard } from "@/components/player/GoalCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  getRoster,
  getProfilePageData,
} from "@/lib/mock/selectors";
import { goals, playerProgressMetrics } from "@/lib/mock/data";

export default function GoalsPage() {
  const { profile } = useAuth();

  if (profile?.role === "coach") {
    const roster = getRoster();
    return (
      <div className="space-y-6">
        <TopNav
          title="Player Development"
          subtitle="Coach overview of squad goals, records, and progress markers."
          roleLabel="Coach overview"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roster.slice(0, 9).map((player) => {
            const playerGoals = goals.filter((goal) => goal.player_id === player.profile.id);
            const avgProgress = playerGoals.length
              ? Math.round(playerGoals.reduce((sum, goal) => sum + goal.progress_pct, 0) / playerGoals.length)
              : 0;
            return (
              <Link key={player.profile.id} href={`/roster/${player.profile.id}`}>
                <Card className="transition hover:-translate-y-0.5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold text-slate-950">{player.profile.full_name}</div>
                      <div className="text-sm text-slate-500">
                        {player.playerProfile.position} · #{player.playerProfile.jersey_number}
                      </div>
                    </div>
                    <Badge tone={avgProgress > 65 ? "success" : "warning"}>{avgProgress}% progress</Badge>
                  </div>
                  <div className="mt-4 text-sm text-slate-600">
                    {playerGoals.length} active development targets
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    Latest readiness: {player.latestResponse?.readiness_score ?? "-"}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  const data = getProfilePageData(profile?.id);
  const metrics = playerProgressMetrics[profile?.id ?? "player_user_1"] ?? playerProgressMetrics.player_user_1;

  return (
    <div className="space-y-6">
      <TopNav
        title="Goals & Progress"
        subtitle="Your goals, physical targets, and soccer-skill progression."
        userName={data.profile.full_name}
        roleLabel="Player view"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {data.goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Tracked Progress</h2>
          <p className="text-sm text-slate-500">Strength, athletic, and technical habits over time.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{metric.category}</div>
              <div className="mt-2 text-lg font-semibold text-slate-950">{metric.label}</div>
              <div className="mt-4 text-3xl font-semibold text-teal-700">
                {metric.value} {metric.unit}
              </div>
              <div className="mt-2 text-sm text-emerald-600">{metric.trend}</div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
