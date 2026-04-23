import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ReadinessCardData } from "@/types";

type ReadinessDashboardProps = {
  players: ReadinessCardData[];
};

function scoreTone(score: number) {
  if (score < 55) return "text-rose-600";
  if (score < 75) return "text-amber-600";
  return "text-emerald-600";
}

export function ReadinessDashboard({ players }: ReadinessDashboardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {players.map((player) => (
        <Card key={player.id}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar name={player.name} src={player.avatarUrl} />
              <div>
                <div className="font-semibold text-slate-900">{player.name}</div>
                <div className="text-sm text-slate-500">{player.position}</div>
              </div>
            </div>
            <Badge tone={player.completed ? "success" : "warning"}>
              {player.completed ? "Complete" : "Pending"}
            </Badge>
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <div className={`text-4xl font-semibold ${scoreTone(player.readinessScore)}`}>
                {player.readinessScore}
              </div>
              <div className="text-sm text-slate-500">Readiness</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-slate-900">{player.flagCount}</div>
              <div className="text-sm text-slate-500">Flags</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
