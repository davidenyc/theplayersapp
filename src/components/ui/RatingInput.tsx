"use client";

import { useMemo } from "react";

type RatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  flagAbove?: number;
  flagBelow?: number;
};

export function RatingInput({
  value,
  onChange,
  min = 1,
  max = 10,
  flagAbove,
  flagBelow,
}: RatingInputProps) {
  const values = Array.from({ length: max - min + 1 }, (_, index) => min + index);
  const progress = useMemo(() => ((value - min) / Math.max(max - min, 1)) * 100, [max, min, value]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        <span>Low</span>
        <span>High</span>
      </div>
      <div className="rounded-[28px] bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-4xl font-semibold text-slate-950">{value}</div>
          <div className="text-sm font-medium text-slate-500">Current response</div>
        </div>
        <div className="mt-4 h-3 rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#14b8a6)] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-4 h-3 w-full accent-teal-600" />
      </div>
      <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
        {values.map((item) => {
          const flagged = (flagAbove !== undefined && item > flagAbove) || (flagBelow !== undefined && item < flagBelow);
          return (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              className={`min-h-11 rounded-2xl text-sm font-semibold transition ${value === item ? flagged ? "bg-rose-500 text-white" : "bg-teal-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:-translate-y-0.5"}`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
