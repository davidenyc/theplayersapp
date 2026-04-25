"use client";

import { useState } from "react";

import { format } from "date-fns";

import { TopNav } from "@/components/layout/TopNav";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card } from "@/components/ui/Card";

export default function PracticeNotesPage() {
  const { profile } = useAuth();
  const [notes, setNotes] = useState("Good intensity today. Pressing shape was sharp in the first half. Eli Watson struggled with recovery runs — monitor. Finish with positive finishing drill.");
  const [saved, setSaved] = useState(false);
  if (profile?.role === "player") return <div className="p-6 text-sm text-slate-500">This page is coach-only.</div>;
  return (
    <div className="space-y-6">
      <TopNav title="Session Notes" subtitle="Log what happened in training." />
      <Card><div className="text-sm text-slate-500">{format(new Date(), "PPP")}</div><textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-4 min-h-48 w-full rounded-3xl border border-slate-200 px-5 py-4 outline-none" /><button type="button" onClick={() => setSaved(true)} className="mt-4 min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Save note</button>{saved ? <div className="mt-3 text-sm text-emerald-700">Session note saved.</div> : null}</Card>
      <section className="space-y-3"><h2 className="text-xl font-semibold text-slate-950">Previous sessions</h2>{["Apr 20", "Apr 18", "Apr 16"].map((date, index) => <Card key={date}><div className="font-semibold text-slate-900">{date}</div><div className="mt-2 text-sm text-slate-500">{["Sharp first phase. Finishing dipped late.", "Strong tempo. Good reaction after turnovers.", "Recovery session landed well."][index]}</div></Card>)}</section>
    </div>
  );
}
