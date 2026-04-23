"use client";

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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span>Low</span>
        <span>High</span>
      </div>
      <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
        {values.map((item) => {
          const flagged =
            (flagAbove !== undefined && item > flagAbove) ||
            (flagBelow !== undefined && item < flagBelow);

          return (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              className={`min-h-11 rounded-2xl text-sm font-semibold transition ${
                value === item
                  ? flagged
                    ? "bg-rose-500 text-white"
                    : "bg-teal-600 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
