type ProgressBarProps = {
  value: number;
  className?: string;
};

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  return (
    <div className={`h-3 w-full overflow-hidden rounded-full bg-slate-200 ${className}`}>
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#14b8a6)] transition-all"
        style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
      />
    </div>
  );
}
