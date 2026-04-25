"use client";

import { useMemo, useState } from "react";

import { TopNav } from "@/components/layout/TopNav";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTeam } from "@/components/providers/TeamProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { StatCard } from "@/components/ui/StatCard";
import { TrendChart } from "@/components/ui/TrendChart";
import { biomarkerEntries, injuries, playerProfiles, players } from "@/lib/mock/data";
import { getPlayerReadinessTrend } from "@/lib/mock/selectors";
import { formatDate } from "@/lib/utils/formatters";

const hydrationPlan = [
  { label: "Now", detail: "Drink 500 mL water with electrolytes." },
  { label: "2 hrs pre", detail: "Aim for another 400 mL before warm-up." },
  { label: "Post", detail: "Replace fluids and eat protein within 45 min." },
];

const coachTips = [
  "Low sleep plus high soreness usually drives readiness down the fastest.",
  "If HRV dips for two days, lighten the next field load.",
  "Use hydration reminders on the day before game day as well.",
];

export default function HealthPage() {
  const { profile } = useAuth();
  const { activeTeam } = useTeam();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const teamRoster = useMemo(() => players.filter((player) => player.team_id === activeTeam.id), [activeTeam.id]);

  if (profile?.role === "player") {
    const playerHistory = injuries.filter((entry) => entry.player_user_id === profile.id);
    const playerBiomarkers = biomarkerEntries.filter((entry) => entry.player_id === profile.id);
    const latestHrv = [...playerBiomarkers].filter((entry) => entry.metric === "hrv").sort((a, b) => b.recorded_at.localeCompare(a.recorded_at))[0];
    const latestHr = [...playerBiomarkers].filter((entry) => entry.metric === "resting_hr").sort((a, b) => b.recorded_at.localeCompare(a.recorded_at))[0];
    const readinessTrend = getPlayerReadinessTrend(profile.id);
    const latestReadiness = readinessTrend.at(-1)?.value ?? 78;
    const recoveryScore = Math.round(((latestHrv?.value ?? 66) / 80) * 100);
    const trueScore = Math.round(latestReadiness * 0.55 + recoveryScore * 0.45);
    const hydrationTarget = activeTeam.age_group === "youth" ? "1.8L" : "2.7L";

    return (
      <div className="space-y-6">
        <TopNav title="My health" subtitle="Recovery, readiness, and injury view." userName={profile.full_name} roleLabel="Player view" />
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Readiness" value={`${latestReadiness}`} delta="From your latest check-in" />
          <StatCard label="Recovery score" value={`${recoveryScore}`} delta={`HRV ${latestHrv?.value ?? 66} ms today`} />
          <StatCard label="True score" value={`${trueScore}`} delta="Blends sleep, HRV, and readiness" />
          <StatCard label="Hydration goal" value={hydrationTarget} delta="Target before training" />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <TrendChart data={readinessTrend} metric="Readiness vs recovery" flagThreshold={60} />
          <Card>
            <h2 className="text-xl font-semibold text-slate-950">What your score means</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-3xl bg-slate-50 p-4">
                Readiness is based on how you report sleep, energy, soreness, and mood.
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                Recovery score leans on wearable markers like HRV and resting heart rate.
              </div>
              <div className="rounded-3xl bg-teal-50 p-4 text-teal-800">
                Your true score combines both, so low sleep can still drag the full picture down even if you feel okay.
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h2 className="text-xl font-semibold text-slate-950">Today&apos;s health data</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">HRV</div>
                <div className="mt-2 text-3xl font-semibold text-slate-950">{latestHrv?.value ?? 66} ms</div>
                <div className="mt-1 text-sm text-slate-500">Higher usually means better recovery.</div>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Resting HR</div>
                <div className="mt-2 text-3xl font-semibold text-slate-950">{latestHr?.value ?? 52} bpm</div>
                <div className="mt-1 text-sm text-slate-500">Watch for spikes after heavy days.</div>
              </div>
              <div className="rounded-3xl bg-sky-50 p-4 md:col-span-2">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Training tip</div>
                <div className="mt-2 text-sm text-sky-900">If your readiness falls under 60, prioritize water, food, and early sleep before adding extra work.</div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-slate-950">Before training</h2>
            <div className="mt-4 space-y-3">
              {hydrationPlan.map((item) => (
                <div key={item.label} className="rounded-3xl bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</div>
                  <div className="mt-2 text-sm text-slate-700">{item.detail}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          {playerHistory.some((entry) => entry.status !== "cleared") ? <Badge tone="warning" label="Recovery in progress" /> : <Badge tone="success" label="Healthy — No active injuries" />}
          <div className="mt-4 space-y-4">{playerHistory.map((injury) => <div key={injury.id} className="rounded-3xl bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-semibold text-slate-950">{injury.body_area}</h2><div className="mt-1 text-sm text-slate-500">{injury.injury_type}</div></div><Badge tone={injury.status === "cleared" ? "neutral" : "warning"} label={injury.status.replaceAll("_", " ")} /></div><div className="mt-3 text-sm text-slate-600">{injury.notes}</div></div>)}</div>
        </Card>

        <button type="button" onClick={() => setReportOpen(true)} className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm">Report injury</button>
        <Modal open={reportOpen} title="Report injury" onClose={() => setReportOpen(false)}><div className="space-y-3"><input placeholder="Body area" className="min-h-11 w-full rounded-2xl border border-slate-200 px-4" /><input placeholder="Injury type" className="min-h-11 w-full rounded-2xl border border-slate-200 px-4" /><textarea placeholder="Notes" className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3" /><button type="button" onClick={() => setReportOpen(false)} className="min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Save</button></div></Modal>
      </div>
    );
  }

  const selectedHistory = injuries.filter((entry) => entry.player_user_id === selectedPlayer);
  const healthyCount = teamRoster.filter((player) => !injuries.some((entry) => entry.player_user_id === player.user_id && entry.status !== "cleared")).length;
  const recoveryCount = teamRoster.filter((player) => injuries.some((entry) => entry.player_user_id === player.user_id && entry.status === "in_recovery")).length;
  const clearedCount = injuries.filter((entry) => entry.status === "cleared").length;
  const currentInjuries = teamRoster.map((player) => ({ player, injury: injuries.find((entry) => entry.player_user_id === player.user_id && entry.status !== "cleared") })).filter((entry) => entry.injury);

  return (
    <div className="space-y-6">
      <TopNav title="Health Log" subtitle="Player injuries and return status." userName={profile?.full_name ?? "Coach"} roleLabel="Coach view" />
      <div className="grid gap-4 md:grid-cols-4">
        <Card><div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Healthy</div><div className="mt-2 text-4xl font-semibold text-emerald-600">{healthyCount}</div></Card>
        <Card><div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">In recovery</div><div className="mt-2 text-4xl font-semibold text-amber-600">{recoveryCount}</div></Card>
        <Card><div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Cleared</div><div className="mt-2 text-4xl font-semibold text-slate-700">{clearedCount}</div></Card>
        <Card><div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Active cases</div><div className="mt-2 text-4xl font-semibold text-rose-600">{currentInjuries.length}</div></Card>
      </div>
      <Card>
        <h2 className="text-xl font-semibold text-slate-950">Current injury dashboard</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {currentInjuries.length ? currentInjuries.map(({ player, injury }) => {
            const person = playerProfiles.find((entry) => entry.id === player.user_id);
            return (
              <button key={player.id} type="button" onClick={() => setSelectedPlayer(player.user_id)} className="rounded-3xl bg-rose-50 p-5 text-left transition hover:-translate-y-0.5">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500">Active injury</div>
                <div className="mt-2 text-lg font-semibold text-slate-950">{person?.full_name}</div>
                <div className="mt-1 text-sm text-slate-600">{injury?.body_area} · {injury?.injury_type}</div>
                <div className="mt-3 text-sm text-slate-500">Return target: {injury?.return_to_play_date ? formatDate(injury.return_to_play_date) : "TBD"}</div>
              </button>
            );
          }) : <div className="rounded-3xl bg-emerald-50 p-5 text-sm text-emerald-700">No active injuries on the current team.</div>}
        </div>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold text-slate-950">Coach tips</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {coachTips.map((tip) => <div key={tip} className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">{tip}</div>)}
        </div>
      </Card>
      <div className="space-y-3">{teamRoster.map((player) => { const playerProfile = playerProfiles.find((entry) => entry.id === player.user_id); const injury = injuries.find((entry) => entry.player_user_id === player.user_id); const tone = injury?.status === "in_recovery" ? "bg-amber-400" : injury?.status === "cleared" ? "bg-slate-300" : "bg-emerald-400"; return <button key={player.id} type="button" onClick={() => setSelectedPlayer(player.user_id)} className="flex w-full items-center justify-between rounded-[28px] bg-white px-5 py-4 text-left shadow-sm ring-1 ring-slate-100"><div className="flex items-center gap-3"><span className={`h-3 w-3 rounded-full ${tone}`} /><div><div className="font-semibold text-slate-900">{playerProfile?.full_name}</div><div className="text-sm text-slate-500">{player.position}</div></div></div><div className="text-sm text-slate-500">{injury ? injury.status.replaceAll("_", " ") : "healthy"}</div></button>; })}</div>
      <button type="button" onClick={() => setReportOpen(true)} className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm">Report injury</button>
      <Modal open={Boolean(selectedPlayer)} title="Injury history" onClose={() => setSelectedPlayer(null)}>{selectedHistory.length ? <div className="space-y-3">{selectedHistory.map((injury) => <div key={injury.id} className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><div className="font-semibold text-slate-900">{injury.body_area}</div><Badge tone={injury.status === "cleared" ? "neutral" : injury.status === "in_recovery" ? "warning" : "danger"} label={injury.status.replaceAll("_", " ")} /></div><div className="mt-1 text-sm text-slate-500">{injury.injury_type} · {formatDate(injury.date_of_injury)}</div><div className="mt-2 text-sm text-slate-600">{injury.notes}</div><div className="mt-2 text-sm text-slate-500">Return to play: {injury.return_to_play_date ? formatDate(injury.return_to_play_date) : "TBD"}</div></div>)}</div> : <div className="text-sm text-slate-500">No injury history.</div>}</Modal>
      <Modal open={reportOpen} title="Report injury" onClose={() => setReportOpen(false)}><div className="space-y-3"><input placeholder="Body area" className="min-h-11 w-full rounded-2xl border border-slate-200 px-4" /><input placeholder="Injury type" className="min-h-11 w-full rounded-2xl border border-slate-200 px-4" /><input placeholder="Date" className="min-h-11 w-full rounded-2xl border border-slate-200 px-4" /><textarea placeholder="Notes" className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3" /><button type="button" onClick={() => setReportOpen(false)} className="min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Save</button></div></Modal>
    </div>
  );
}
