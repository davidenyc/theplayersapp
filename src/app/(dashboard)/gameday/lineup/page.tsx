"use client";

import { useState } from "react";

import { TacticsBoard } from "@/components/coach/TacticsBoard";
import { TopNav } from "@/components/layout/TopNav";
import { useAuth } from "@/components/providers/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { matchDayPlan } from "@/lib/mock/data";

const formations = ["4-3-3", "4-2-3-1", "3-5-2"] as const;

export default function GameDayLineupPage() {
  const { profile } = useAuth();
  const [formationIndex, setFormationIndex] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const formation = formations[formationIndex];
  return (
    <div className="space-y-6">
      <TopNav title="Lineup" subtitle="Set your starting XI and bench." userName={profile?.full_name ?? "Coach"} roleLabel={profile?.role === "player" ? "Player view" : "Coach view"} />
      <Card><div className="flex items-center justify-between gap-4"><div><button type="button" onClick={() => setFormationIndex((current) => (current + 1) % formations.length)} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Formation {formation}</button></div>{confirmed ? <Badge tone="success" label="Lineup confirmed" /> : null}</div><div className="mt-4"><TacticsBoard preset="buildout" draggable={profile?.role !== "player"} /></div></Card>
      <div className="grid gap-4 md:grid-cols-2"><Card><h2 className="text-xl font-semibold text-slate-950">Starting XI</h2><div className="mt-4 space-y-2">{matchDayPlan.startingLineup.map((player) => <div key={player} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{player}</div>)}</div></Card><Card><h2 className="text-xl font-semibold text-slate-950">Bench</h2><div className="mt-4 space-y-2">{matchDayPlan.bench.map((player) => <div key={player} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{player}</div>)}</div></Card></div>
      {profile?.role !== "player" ? <button type="button" onClick={() => setConfirmed(true)} className="min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Confirm lineup</button> : null}
    </div>
  );
}
