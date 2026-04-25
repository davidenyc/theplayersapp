"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { TopNav } from "@/components/layout/TopNav";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTeam } from "@/components/providers/TeamProvider";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { playerProfiles, players } from "@/lib/mock/data";

const statuses = ["Present", "Late", "Absent"] as const;

export default function PracticeAttendancePage() {
  const { profile } = useAuth();
  const { activeTeam } = useTeam();
  const roster = useMemo(() => players.filter((player) => player.team_id === activeTeam.id), [activeTeam.id]);
  const [state, setState] = useState<Record<string, typeof statuses[number]>>(Object.fromEntries(roster.map((player) => [player.user_id, "Present"])));
  const presentCount = Object.values(state).filter((value) => value === "Present").length;
  if (profile?.role === "player") return <div className="p-6 text-sm text-slate-500">This page is coach-only.</div>;
  return (
    <div className="space-y-6">
      <TopNav title="Attendance" subtitle="Mark players present or absent." />
      <Card><div className="text-sm text-slate-600">{presentCount} / {roster.length} present</div></Card>
      <div className="space-y-3">{roster.map((player) => { const person = playerProfiles.find((entry) => entry.id === player.user_id); return <Card key={player.id}><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><Avatar name={person?.full_name ?? player.user_id} /><div><div className="font-semibold text-slate-900">{person?.full_name}</div><div className="text-sm text-slate-500">{player.position}</div></div></div><div className="flex gap-2">{statuses.map((status) => <button key={status} type="button" onClick={() => setState((current) => ({ ...current, [player.user_id]: status }))} className={state[player.user_id] === status ? "min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white" : "min-h-11 rounded-2xl bg-slate-100 px-4 text-sm font-semibold text-slate-600"}>{status}</button>)}</div></div></Card>; })}</div>
      <Link href={"/practice/load" as any} className="inline-flex min-h-11 items-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Send load survey</Link>
    </div>
  );
}
