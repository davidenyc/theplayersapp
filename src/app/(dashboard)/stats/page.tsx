import { TopNav } from "@/components/layout/TopNav";
import { Card } from "@/components/ui/Card";
import { stats } from "@/lib/mock/data";

export default function StatsPage() {
  return (
    <div className="space-y-6">
      <TopNav title="Stats" subtitle="Season production and per-player summary metrics." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.slice(0, 9).map((stat) => (
          <Card key={stat.id}>
            <div className="text-sm text-slate-500">Player ID</div>
            <div className="mt-2 text-lg font-semibold text-slate-950">{stat.player_id}</div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <div>Apps: {stat.appearances}</div>
              <div>Goals: {stat.goals}</div>
              <div>Assists: {stat.assists}</div>
              <div>Pass %: {stat.pass_completion_pct}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
