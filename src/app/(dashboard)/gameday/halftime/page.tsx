"use client";

import { useState } from "react";

import { TopNav } from "@/components/layout/TopNav";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

export default function GameDayHalftimePage() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("Maintain high press in second half. Watch their #10 on the left. Push fullbacks higher in build-out.");
  return (
    <div className="space-y-6">
      <TopNav title="Half Time" subtitle="Notes and adjustments at the break." />
      <Card><div className="text-3xl font-semibold text-slate-950">My Club 2 – 0 Riverside FC · HT</div></Card>
      <Card><h2 className="text-xl font-semibold text-slate-950">Tactical notes</h2><textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-4 min-h-40 w-full rounded-3xl border border-slate-200 px-5 py-4 outline-none" /></Card>
      <Card><div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold text-slate-950">Substitution plan</h2><button type="button" onClick={() => setOpen(true)} className="min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Add sub plan</button></div><div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">75&apos; — Jude Flores on for Diego Sanders</div></Card>
      <Card><h2 className="text-xl font-semibold text-slate-950">Player messages</h2><div className="mt-4 space-y-2"><div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">Micah — great movement. Keep making that run.</div><div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">Caleb — stay disciplined. They&apos;ll look for you to step.</div></div></Card>
      <Modal open={open} title="Add sub plan" onClose={() => setOpen(false)}><button type="button" onClick={() => setOpen(false)} className="min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Close</button></Modal>
    </div>
  );
}
