"use client";

import { useState } from "react";

import { TopNav } from "@/components/layout/TopNav";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTeam } from "@/components/providers/TeamProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { playerProfiles, players, u19PostTrainingTemplate, youthPostTrainingTemplate } from "@/lib/mock/data";

function scoreTone(score: number) {
  if (score <= 4) return "text-emerald-600";
  if (score <= 7) return "text-amber-600";
  return "text-rose-600";
}

export default function PracticeLoadPage() {
  const { profile } = useAuth();
  const { activeTeam } = useTeam();
  const [sent, setSent] = useState(false);
  const roster = players.filter((player) => player.team_id === activeTeam.id);
  const template = activeTeam.age_group === "youth" ? youthPostTrainingTemplate : u19PostTrainingTemplate;
  if (profile?.role === "player") return <div className="p-6 text-sm text-slate-500">This page is coach-only.</div>;
  return (
    <div className="space-y-6">
      <TopNav title="Load Check" subtitle="Review post-training responses." />
      <Card><h2 className="text-xl font-semibold text-slate-950">{template.name}</h2><div className="mt-2 text-sm text-slate-500">{template.description}</div><div className="mt-4 text-sm text-slate-600">{template.questions.length} questions in this form.</div></Card>
      <div className="space-y-3">{roster.map((player, index) => { const person = playerProfiles.find((entry) => entry.id === player.user_id); const score = 4 + (index % 6); return <Card key={player.id}><div className="flex items-center justify-between gap-4"><div><div className="font-semibold text-slate-900">{person?.full_name}</div><div className="mt-1 text-sm text-slate-500">Soreness {3 + (index % 4)} / 10</div></div><div className="text-right"><div className={`text-2xl font-semibold ${scoreTone(score)}`}>RPE {score}</div>{index % 7 === 0 ? <Badge tone="warning" label="Pain flag" /> : null}</div></div></Card>; })}</div>
      <button type="button" onClick={() => setSent(true)} className="min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Send to team</button>
      {sent ? <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">Post-Training survey sent to {roster.length} players.</div> : null}
    </div>
  );
}
