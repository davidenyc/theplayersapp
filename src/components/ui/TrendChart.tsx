"use client";

import { useState } from "react";
import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/components/ui/Card";

type TrendPoint = {
  date: string;
  value: number;
  player?: string;
};

type TrendChartProps = {
  data: TrendPoint[];
  metric: string;
  flagThreshold?: number;
};

export function TrendChart({ data, metric, flagThreshold }: TrendChartProps) {
  const [window, setWindow] = useState<7 | 30>(7);
  const view = data.slice(0, window);

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{metric}</h3>
          <p className="text-sm text-slate-500">Rolling readiness trend</p>
        </div>
        <div className="flex gap-2">
          {[7, 30].map((option) => (
            <button key={option} type="button" onClick={() => setWindow(option as 7 | 30)} className={`rounded-full px-3 py-1 text-sm font-medium ${window === option ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"}`}>
              {option}d
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 h-[200px] min-h-[200px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
          <LineChart data={view}>
            <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} domain={[0, 100]} />
            <Tooltip />
            {flagThreshold !== undefined ? <ReferenceLine y={flagThreshold} stroke="#ef4444" strokeDasharray="5 5" /> : null}
            <Line type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={3} dot={{ fill: "#0f766e", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
