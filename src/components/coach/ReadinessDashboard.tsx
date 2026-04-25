"use client";

import { useMemo, useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import type { ReadinessCardData } from "@/types";

type ReadinessDashboardProps = {
  players: ReadinessCardData[];
  detailsById?: Record<
    string,
    {
      readinessScore: number;
      flags: string[];
      answers: Record<string, string | number | boolean>;
      position: string;
    }
  >;
};

function scoreTone(score: number) {
  if (score < 55) return "text-rose-600";
  if (score < 75) return "text-amber-600";
  return "text-emerald-600";
}

function labelize(key: string) {
  return key.replaceAll("_", " ");
}

export function ReadinessDashboard({ players, detailsById }: ReadinessDashboardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => (selectedId && detailsById ? detailsById[selectedId] : null), [detailsById, selectedId]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {players.map((player) => (
          <button key={player.id} type="button" onClick={() => (detailsById ? setSelectedId(player.id) : undefined)} className="text-left">
            <Card className="transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar name={player.name} src={player.avatarUrl} />
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{player.position}</div>
                    <div className="font-semibold uppercase tracking-[0.08em] text-slate-900">{player.name}</div>
                  </div>
                </div>
                <Badge tone={player.completed ? "success" : "warning"} label={player.completed ? "Complete" : "Pending"} />
              </div>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <div className={`text-4xl font-semibold ${scoreTone(player.readinessScore)}`}>{player.readinessScore}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Readiness</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-slate-900">{player.flagCount}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Flags</div>
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>
      <Modal open={Boolean(selected)} title="Player readiness" onClose={() => setSelectedId(null)}>
        {selected && selectedId ? (
          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{selected.position}</div>
              <div className="mt-2 text-3xl font-semibold text-slate-950">{players.find((entry) => entry.id === selectedId)?.name}</div>
              <div className="mt-3 text-sm text-slate-600">Readiness score: <span className="font-semibold text-slate-900">{selected.readinessScore}</span></div>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">What&apos;s wrong</div>
              <div className="mt-3 space-y-2">
                {selected.flags.length ? selected.flags.map((flag) => <div key={flag} className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{flag}</div>) : <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">No flag triggers in the latest response.</div>}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Latest answers</div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {Object.entries(selected.answers).map(([key, value]) => (
                  <div key={key} className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{labelize(key)}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
