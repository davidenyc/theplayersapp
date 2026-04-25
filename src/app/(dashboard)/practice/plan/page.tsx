"use client";

import { useState } from "react";

import { TopNav } from "@/components/layout/TopNav";
import { useAuth } from "@/components/providers/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

const drills = [
  { name: "Rondo 4v2", duration: "15 min", focus: "Possession", players: "All" },
  { name: "Pressing triggers", duration: "20 min", focus: "Tactical", players: "Outfield" },
  { name: "Shooting circuit", duration: "25 min", focus: "Finishing", players: "FWD/MID" },
];

export default function PracticePlanPage() {
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("Focus on defensive transitions. Keep intensity high in second half of session.");
  if (profile?.role === "player") return <div className="p-6 text-sm text-slate-500">This page is coach-only.</div>;
  return (
    <div className="space-y-6">
      <TopNav title="Session Plan" subtitle="Today&apos;s training focus and structure." />
      <Card><div className="grid gap-4 md:grid-cols-4"><div><div className="text-sm text-slate-500">Session type</div><div className="mt-2 font-semibold text-slate-950">Technical</div></div><div><div className="text-sm text-slate-500">Duration</div><div className="mt-2 font-semibold text-slate-950">90 min</div></div><div><div className="text-sm text-slate-500">Focus area</div><div className="mt-2 font-semibold text-slate-950">Defensive transitions</div></div><div><div className="text-sm text-slate-500">Field zone</div><div className="mt-2 font-semibold text-slate-950">Full</div></div></div></Card>
      <Card><div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold text-slate-950">Drills</h2><button type="button" onClick={() => setOpen(true)} className="min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Add drill</button></div><div className="mt-4 space-y-3">{drills.map((drill) => <div key={drill.name} className="rounded-3xl bg-slate-50 p-5"><div className="flex items-center justify-between gap-3"><div className="text-lg font-semibold text-slate-950">{drill.name}</div><Badge tone="info" label={drill.duration} /></div><div className="mt-2 text-sm text-slate-500">{drill.focus} · {drill.players}</div></div>)}</div></Card>
      <Card><h2 className="text-xl font-semibold text-slate-950">Session notes</h2><textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-4 min-h-40 w-full rounded-3xl border border-slate-200 px-5 py-4 outline-none" /></Card>
      <Modal open={open} title="Add drill" onClose={() => setOpen(false)}><button type="button" onClick={() => setOpen(false)} className="min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Close</button></Modal>
    </div>
  );
}
