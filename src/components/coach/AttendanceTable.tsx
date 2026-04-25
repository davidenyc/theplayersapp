import { Card } from "@/components/ui/Card";
import { attendance, playerProfiles, players } from "@/lib/mock/data";
import type { Event } from "@/types";

export function AttendanceTable({ event, teamId }: { event: Event; teamId?: string }) {
  const rows = attendance.filter((entry) => entry.event_id === event.id).filter((entry) => {
    if (!teamId) return true;
    return players.some((player) => player.team_id === teamId && player.user_id === entry.user_id);
  });

  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-950">Attendance snapshot</h3>
      <div className="mt-4 space-y-3">
        {rows.map((entry) => {
          const player = playerProfiles.find((profile) => profile.id === entry.user_id);
          return (
            <div key={entry.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <div className="text-sm font-medium text-slate-900">{player?.full_name}</div>
              <div className="text-sm capitalize text-slate-500">{entry.status.replaceAll("_", " ")}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
