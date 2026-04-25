"use client";

import { useState } from "react";

import { AttendanceTable } from "@/components/coach/AttendanceTable";
import { TacticsBoard, type PresetKey, boardPresets } from "@/components/coach/TacticsBoard";
import { TopNav } from "@/components/layout/TopNav";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTeam } from "@/components/providers/TeamProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getDemoAttendance, saveDemoAttendance } from "@/lib/demo/state";
import { matchDayPlan, sessionPlans } from "@/lib/mock/data";
import { getSchedulePageData } from "@/lib/mock/selectors";
import { formatDateTime } from "@/lib/utils/formatters";

export default function SchedulePage() {
  const { profile } = useAuth();
  const { activeTeam } = useTeam();
  const { events } = getSchedulePageData(activeTeam.id);
  const [attendanceState, setAttendanceState] = useState(getDemoAttendance());
  const [activeSession, setActiveSession] = useState(sessionPlans[0].id);
  const [activePreset, setActivePreset] = useState<PresetKey>("buildout");
  const session = sessionPlans.find((item) => item.id === activeSession) ?? sessionPlans[0];
  const preset = boardPresets[activePreset];

  function respond(eventId: string, status: "attending" | "not_attending" | "maybe") {
    saveDemoAttendance(eventId, status);
    setAttendanceState(getDemoAttendance());
  }

  return (
    <div className="space-y-6">
      <TopNav title="Schedule" subtitle={profile?.role === "player" ? "Confirm availability and review plans." : "Upcoming events and match plan."} userName={profile?.full_name ?? "Marcus Webb"} />
      <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{event.type}</div>
                  <h2 className="mt-2 text-xl font-semibold text-slate-950">{event.title}</h2>
                  <div className="mt-2 text-sm text-slate-500">{formatDateTime(event.starts_at)}</div>
                  <div className="mt-1 text-sm text-slate-500">{event.location}</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600">{event.notes}</p>
              {profile?.role === "player" ? (
                <div className="mt-5">
                  <div className="mb-3 text-sm text-slate-500">Your response: <span className="font-semibold text-slate-900">{attendanceState[event.id] ?? "no response"}</span></div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => respond(event.id, "attending")} className="min-h-11 rounded-full bg-emerald-100 px-4 text-sm font-semibold text-emerald-700">Yes</button>
                    <button type="button" onClick={() => respond(event.id, "maybe")} className="min-h-11 rounded-full bg-amber-100 px-4 text-sm font-semibold text-amber-700">Maybe</button>
                    <button type="button" onClick={() => respond(event.id, "not_attending")} className="min-h-11 rounded-full bg-rose-100 px-4 text-sm font-semibold text-rose-700">No</button>
                  </div>
                </div>
              ) : (
                <div className="mt-5"><Badge tone="info" label="Coach view" /></div>
              )}
            </Card>
          ))}
          <Card>
            <h2 className="text-xl font-semibold text-slate-950">Session plan</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {sessionPlans.map((plan) => (
                <button key={plan.id} type="button" onClick={() => setActiveSession(plan.id)} className={activeSession === plan.id ? "min-h-11 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white" : "min-h-11 rounded-full bg-slate-100 px-4 text-sm font-semibold text-slate-600"}>{plan.title}</button>
              ))}
            </div>
            <div className="mt-4 rounded-3xl bg-slate-50 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{session.focus}</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{session.title}</div>
              <p className="mt-2 text-sm text-slate-600">{session.explanation}</p>
              <div className="mt-4 grid gap-2 md:grid-cols-2">{session.blocks.map((block) => <div key={block} className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">{block}</div>)}</div>
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          {profile?.role === "coach" && events[0] ? <AttendanceTable event={events[0]} teamId={activeTeam.id} /> : null}
          <Card>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Match day</div>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Starting lineup and tactics</h2>
            <div className="mt-4 rounded-3xl bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-900">Formation {matchDayPlan.formation}</div>
                <Badge tone="warning" label={profile?.role === "coach" ? "Drag players" : "View only"} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">{(Object.keys(boardPresets) as PresetKey[]).map((key) => <button key={key} type="button" onClick={() => setActivePreset(key)} className={activePreset === key ? "rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white" : "rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600"}>{boardPresets[key].title}</button>)}</div>
              <div className="mt-4"><TacticsBoard preset={activePreset} draggable={profile?.role === "coach"} /></div>
              <div className="mt-4 space-y-2">{matchDayPlan.tacticalKeys.map((item) => <div key={item} className="text-sm text-slate-700">{item}</div>)}</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
