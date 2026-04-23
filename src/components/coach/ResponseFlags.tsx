import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { playerProfiles } from "@/lib/mock/data";
import type { SurveyResponse } from "@/types";

type ResponseFlagsProps = {
  responses: SurveyResponse[];
};

export function ResponseFlags({ responses }: ResponseFlagsProps) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-950">Flagged responses</h3>
        <Badge tone="warning">{responses.length} today</Badge>
      </div>
      <div className="mt-4 space-y-3">
        {responses.map((response) => {
          const player = playerProfiles.find((entry) => entry.id === response.player_id);
          return (
            <div key={response.id} className="rounded-2xl bg-amber-50 p-4">
              <div className="font-semibold text-slate-900">{player?.full_name ?? "Unknown Player"}</div>
              <div className="mt-1 text-sm text-slate-600">{response.flag_reasons.join(" • ")}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
