"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/components/ui/Card";
import type { BiomarkerEntry } from "@/types";

type BiomarkerChartProps = {
  entries: BiomarkerEntry[];
  metric: string;
};

export function BiomarkerChart({ entries, metric }: BiomarkerChartProps) {
  const data = entries
    .filter((entry) => entry.metric === metric)
    .slice(0, 8)
    .map((entry) => ({ date: entry.recorded_at.slice(5, 10), value: entry.value }));

  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-950">{metric}</h3>
      <div className="mt-4 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
