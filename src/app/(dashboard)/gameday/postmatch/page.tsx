"use client";

import { useState } from "react";

import { TopNav } from "@/components/layout/TopNav";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { postGameSurveyTemplate } from "@/lib/mock/data";

export default function GameDayPostmatchPage() {
  const [sent, setSent] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <div className="space-y-6">
      <TopNav title="Post-Match" subtitle="Review performance and feedback." />
      <Card><div className="flex items-center justify-between gap-4"><div className="text-3xl font-semibold text-slate-950">My Club 2 – 0 Riverside FC · Full Time</div><Badge tone="success" label="Win" /></div></Card>
      <Card><h2 className="text-xl font-semibold text-slate-950">Post-match survey</h2><div className="mt-4 text-sm text-slate-600">{postGameSurveyTemplate.questions.length} questions collected after full time.</div></Card>
      <Card><h2 className="text-xl font-semibold text-slate-950">Match summary</h2><div className="mt-4 grid gap-3 md:grid-cols-5"><div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">Goals: 2</div><div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">Assists: 2</div><div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">Yellow cards: 1</div><div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">Subs made: 1</div><div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">Possession: 58%</div></div></Card>
      <Card className="border border-amber-200 bg-amber-50"><h2 className="text-xl font-semibold text-amber-950">Top performer</h2><div className="mt-2 text-sm text-amber-900">Micah Ross — Goal + assist. Dominated the left channel.</div></Card>
      <div className="flex flex-wrap gap-3"><button type="button" onClick={() => setSent(true)} className="min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Send post-match survey</button><button type="button" onClick={() => setSaved(true)} className="min-h-11 rounded-2xl border border-slate-300 px-4 text-sm font-semibold text-slate-700">Save match report</button></div>
      {sent ? <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">Post-match survey sent.</div> : null}
      {saved ? <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">Match report saved.</div> : null}
    </div>
  );
}
