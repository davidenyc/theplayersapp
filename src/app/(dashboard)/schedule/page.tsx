"use client";

import { useState } from "react";

import { AttendanceTable } from "@/components/coach/AttendanceTable";
import { TopNav } from "@/components/layout/TopNav";
import { useAuth } from "@/components/providers/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getDemoAttendance, saveDemoAttendance } from "@/lib/demo/state";
import { matchDayPlan, sessionPlans } from "@/lib/mock/data";
import { getSchedulePageData } from "@/lib/mock/selectors";
import { formatDateTime } from "@/lib/utils/formatters";

type PresetKey = "buildout" | "pressing" | "corner";
type Token = {
  id: string;
  label: string;
  top: number;
  left: number;
  tone: "sky" | "amber" | "white";
};

const boardPresets: Record<
  PresetKey,
  {
    title: string;
    description: string;
    tokens: Token[];
  }
> = {
  buildout: {
    title: "Build-out Shape",
    description: "Center backs split, 6 drops between lines, fullbacks pin wide to stretch the first press.",
    tokens: [
      { id: "gk", label: "GK", top: 84, left: 50, tone: "white" },
      { id: "rb", label: "RB", top: 68, left: 78, tone: "sky" },
      { id: "rcb", label: "RCB", top: 72, left: 60, tone: "sky" },
      { id: "lcb", label: "LCB", top: 72, left: 40, tone: "sky" },
      { id: "lb", label: "LB", top: 68, left: 22, tone: "sky" },
      { id: "six", label: "6", top: 58, left: 50, tone: "amber" },
      { id: "eight", label: "8", top: 44, left: 38, tone: "amber" },
      { id: "ten", label: "10", top: 44, left: 62, tone: "amber" },
      { id: "rw", label: "RW", top: 26, left: 78, tone: "sky" },
      { id: "nine", label: "9", top: 18, left: 50, tone: "sky" },
      { id: "lw", label: "LW", top: 26, left: 22, tone: "sky" },
    ],
  },
  pressing: {
    title: "Mid-block Pressing Triggers",
    description: "Wide forward jumps on back-pass, 8s squeeze inside lanes, fullback steps to lock touchline.",
    tokens: [
      { id: "rw", label: "RW", top: 30, left: 74, tone: "sky" },
      { id: "nine", label: "9", top: 24, left: 52, tone: "sky" },
      { id: "lw", label: "LW", top: 30, left: 28, tone: "sky" },
      { id: "eight", label: "8", top: 46, left: 40, tone: "amber" },
      { id: "ten", label: "10", top: 44, left: 60, tone: "amber" },
      { id: "six", label: "6", top: 58, left: 50, tone: "amber" },
      { id: "rb", label: "RB", top: 66, left: 78, tone: "sky" },
      { id: "rcb", label: "RCB", top: 74, left: 60, tone: "sky" },
      { id: "lcb", label: "LCB", top: 74, left: 40, tone: "sky" },
      { id: "lb", label: "LB", top: 66, left: 22, tone: "sky" },
      { id: "gk", label: "GK", top: 88, left: 50, tone: "white" },
    ],
  },
  corner: {
    title: "Attacking Corner Routine",
    description: "Near-post screen opens the back-post runner, with edge-of-box cover for second balls.",
    tokens: [
      { id: "ball", label: "Ball", top: 8, left: 93, tone: "white" },
      { id: "np", label: "NP", top: 18, left: 72, tone: "amber" },
      { id: "bp", label: "BP", top: 24, left: 42, tone: "sky" },
      { id: "scr", label: "SCR", top: 16, left: 60, tone: "amber" },
      { id: "edge", label: "EDGE", top: 34, left: 58, tone: "sky" },
      { id: "rest1", label: "R1", top: 54, left: 66, tone: "sky" },
      { id: "rest2", label: "R2", top: 60, left: 38, tone: "sky" },
    ],
  },
};

function tokenClass(tone: Token["tone"]) {
  if (tone === "amber") return "bg-amber-300 text-slate-950";
  if (tone === "white") return "bg-white text-slate-950";
  return "bg-sky-300 text-slate-950";
}

function TacticsBoard({
  preset,
  draggable,
}: {
  preset: PresetKey;
  draggable: boolean;
}) {
  const [tokens, setTokens] = useState(boardPresets[preset].tokens);

  function moveToken(id: string, event: React.PointerEvent<HTMLButtonElement>) {
    if (!draggable) return;

    const board = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!board) return;

    event.currentTarget.setPointerCapture(event.pointerId);

    const handleMove = (nextEvent: PointerEvent) => {
      const left = ((nextEvent.clientX - board.left) / board.width) * 100;
      const top = ((nextEvent.clientY - board.top) / board.height) * 100;
      setTokens((current) =>
        current.map((token) =>
          token.id === id
            ? {
                ...token,
                left: Math.max(6, Math.min(94, left)),
                top: Math.max(8, Math.min(92, top)),
              }
            : token,
        ),
      );
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }

  return (
    <div className="relative h-72 overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#14532d,#166534)] p-4">
      <div className="absolute inset-4 rounded-[24px] border border-white/40" />
      <div className="absolute left-1/2 top-4 h-[calc(100%-2rem)] w-px -translate-x-1/2 bg-white/30" />
      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
      {preset === "corner" ? (
        <>
          <div className="absolute right-4 top-4 h-16 w-16 rounded-bl-[18px] border-l border-b border-white/40" />
          <div className="absolute right-4 top-12 h-28 w-20 rounded-bl-[18px] border-l border-b border-white/30" />
        </>
      ) : null}
      {tokens.map((token) => (
        <button
          key={token.id}
          type="button"
          onPointerDown={(event) => moveToken(token.id, event)}
          className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs font-bold shadow-lg transition ${
            draggable ? "cursor-grab active:cursor-grabbing" : "cursor-default"
          } ${tokenClass(token.tone)}`}
          style={{ top: `${token.top}%`, left: `${token.left}%` }}
        >
          {token.label}
        </button>
      ))}
    </div>
  );
}

export default function SchedulePage() {
  const { events } = getSchedulePageData();
  const { profile } = useAuth();
  const [attendanceState, setAttendanceState] = useState(getDemoAttendance());
  const [activeSession, setActiveSession] = useState(sessionPlans[0].id);
  const [activePreset, setActivePreset] = useState<PresetKey>("buildout");

  function respond(eventId: string, status: "attending" | "not_attending" | "maybe") {
    saveDemoAttendance(eventId, status);
    setAttendanceState(getDemoAttendance());
  }

  const session = sessionPlans.find((item) => item.id === activeSession) ?? sessionPlans[0];
  const preset = boardPresets[activePreset];

  return (
    <div className="space-y-6">
      <TopNav
        title="Schedule"
        subtitle={
          profile?.role === "player"
            ? "Confirm availability, study the plan, and know your matchday role."
            : "Upcoming events, logistics, lineups, and tactical plan."
        }
        userName={profile?.full_name ?? "Marcus Webb"}
      />

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
                  <div className="mb-3 text-sm text-slate-500">
                    Your response:{" "}
                    <span className="font-semibold text-slate-900">
                      {attendanceState[event.id] ?? "no_response"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => respond(event.id, "attending")} className="min-h-11 rounded-full bg-emerald-100 px-4 text-sm font-semibold text-emerald-700">Yes</button>
                    <button type="button" onClick={() => respond(event.id, "maybe")} className="min-h-11 rounded-full bg-amber-100 px-4 text-sm font-semibold text-amber-700">Maybe</button>
                    <button type="button" onClick={() => respond(event.id, "not_attending")} className="min-h-11 rounded-full bg-rose-100 px-4 text-sm font-semibold text-rose-700">No</button>
                  </div>
                </div>
              ) : (
                <div className="mt-5">
                  <Badge tone="info">Coach view</Badge>
                </div>
              )}
            </Card>
          ))}

          <Card>
            <h2 className="text-xl font-semibold text-slate-950">Session plan explainer</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {sessionPlans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setActiveSession(plan.id)}
                  className={`min-h-11 rounded-full px-4 text-sm font-semibold ${
                    activeSession === plan.id
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {plan.title}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-3xl bg-slate-50 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{session.focus}</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{session.title}</div>
              <p className="mt-2 text-sm text-slate-600">{session.explanation}</p>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {session.blocks.map((block) => (
                  <div key={block} className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">
                    {block}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {profile?.role === "coach" ? <AttendanceTable event={events[0]} /> : null}
          <Card>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Matchday</div>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              Starting lineup and tactics vs {matchDayPlan.opponent}
            </h2>
            <div className="mt-4 rounded-3xl bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-900">Formation {matchDayPlan.formation}</div>
                <Badge tone="warning">{profile?.role === "coach" ? "Drag players" : "View only"}</Badge>
              </div>
              <div className="mt-4">
                <TacticsBoard preset={activePreset} draggable={profile?.role === "coach"} />
              </div>
              <div className="mt-4 grid gap-2">
                {matchDayPlan.startingLineup.map((player) => (
                  <div key={player} className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">
                    {player}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-slate-500">Bench: {matchDayPlan.bench.join(", ")}</div>
              <div className="mt-4 space-y-2">
                {matchDayPlan.tacticalKeys.map((item) => (
                  <div key={item} className="text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold text-slate-950">Drill and set-piece presets</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(boardPresets).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivePreset(key as PresetKey)}
                  className={`min-h-11 rounded-full px-4 text-sm font-semibold ${
                    activePreset === key
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {value.title}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-slate-500">{preset.description}</p>
            <div className="mt-4">
              <TacticsBoard preset={activePreset} draggable={false} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
