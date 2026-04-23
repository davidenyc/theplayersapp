import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Goal } from "@/types";

type GoalCardProps = {
  goal: Goal;
};

export function GoalCard({ goal }: GoalCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {goal.category}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{goal.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{goal.description}</p>
        </div>
        <div className="text-right text-2xl font-semibold text-teal-700">{goal.progress_pct}%</div>
      </div>
      <ProgressBar value={goal.progress_pct} className="mt-4" />
      {goal.coach_comment ? <p className="mt-3 text-sm text-slate-500">{goal.coach_comment}</p> : null}
    </Card>
  );
}
