"use client";

import { useState } from "react";

import { PlayerCard } from "@/components/coach/PlayerCard";
import { TopNav } from "@/components/layout/TopNav";
import { Modal } from "@/components/ui/Modal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TrendChart } from "@/components/ui/TrendChart";
import { getSurveyResponseDashboard } from "@/lib/mock/selectors";

export default function SurveyResponsesPage() {
  const data = getSurveyResponseDashboard();
  const [activeId, setActiveId] = useState<string | null>(null);
  const selected = data.cards.find((card) => card.id === activeId);

  return (
    <div className="space-y-6">
      <TopNav title="Survey Responses" subtitle="Track compliance, flags, and rolling readiness trends." />
      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Compliance rate</div>
          <div className="mt-2 text-4xl font-semibold text-slate-950">{data.compliance}%</div>
          <ProgressBar value={data.compliance} className="mt-4" />
        </div>
        <TrendChart data={data.trendData} metric="7-day readiness trend" flagThreshold={60} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.cards.map((card) => (
          <button key={card.id} type="button" onClick={() => setActiveId(card.id)} className="text-left">
            <PlayerCard
              id={card.id}
              name={card.name}
              position={card.position}
              status={card.status as "submitted" | "missed" | "flagged"}
            />
          </button>
        ))}
      </div>
      <Modal
        open={!!selected}
        title={selected?.name ?? "Player response"}
        onClose={() => setActiveId(null)}
      >
        {selected?.response ? (
          <div className="space-y-3">
            {Object.entries(selected.response.answers).map(([key, value]) => (
              <div key={key} className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-400">{key}</div>
                <div className="mt-1 font-medium text-slate-900">{String(value)}</div>
              </div>
            ))}
            <div className="rounded-2xl bg-amber-50 p-4 text-sm text-slate-700">
              Flags: {selected.response.flag_reasons.join(", ") || "None"}
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-600">No response submitted.</div>
        )}
      </Modal>
    </div>
  );
}
