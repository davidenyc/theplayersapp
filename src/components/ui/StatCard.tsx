import { Card } from "@/components/ui/Card";

type StatCardProps = {
  value: string;
  label: string;
  delta?: string;
};

export function StatCard({ value, label, delta }: StatCardProps) {
  return (
    <Card className="min-h-[148px]">
      <div className="flex h-full flex-col justify-between">
        <div className="text-3xl font-semibold tracking-tight text-slate-950">{value}</div>
        <div className="space-y-1">
          <div className="text-sm font-medium text-slate-500">{label}</div>
          {delta ? <div className="text-sm text-emerald-600">{delta}</div> : null}
        </div>
      </div>
    </Card>
  );
}
