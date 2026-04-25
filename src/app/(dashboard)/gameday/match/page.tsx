"use client";

import { useEffect, useMemo, useState } from "react";

import { TopNav } from "@/components/layout/TopNav";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTeam } from "@/components/providers/TeamProvider";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { playerProfiles, players } from "@/lib/mock/data";

type MatchEvent =
  | { minute: number; type: "goal"; player: string; assist: string | null; team: "home" }
  | { minute: number; type: "yellow_card"; player: string; team: "home" }
  | { minute: number; type: "substitution"; playerOff: string; playerOn: string; team: "home" };

const starterEvents: MatchEvent[] = [
  { minute: 23, type: "goal", player: "Micah Ross", assist: "Isaac Perry", team: "home" },
  { minute: 41, type: "yellow_card", player: "Caleb Brooks", team: "home" },
  { minute: 67, type: "goal", player: "Kai Griffin", assist: null, team: "home" },
  { minute: 74, type: "substitution", playerOff: "Diego Sanders", playerOn: "Jude Flores", team: "home" },
];

export default function GameDayMatchPage() {
  const { profile } = useAuth();
  const { activeTeam } = useTeam();
  const teamRoster = players.filter((player) => player.team_id === activeTeam.id).map((player) => playerProfiles.find((entry) => entry.id === player.user_id)?.full_name ?? player.user_id);
  const [events, setEvents] = useState<MatchEvent[]>(starterEvents);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [open, setOpen] = useState(false);
  const [minute, setMinute] = useState("75");
  const [type, setType] = useState("goal");
  const [player, setPlayer] = useState(teamRoster[0] ?? "");
  const [secondary, setSecondary] = useState(teamRoster[1] ?? "");

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const score = useMemo(() => events.filter((event) => event.type === "goal").length, [events]);
  const clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  function addEvent() {
    const parsedMinute = Number(minute);
    if (type === "substitution") {
      setEvents((current) => [...current, { minute: parsedMinute, type: "substitution", playerOff: player, playerOn: secondary, team: "home" }]);
    } else if (type === "yellow_card") {
      setEvents((current) => [...current, { minute: parsedMinute, type: "yellow_card", player, team: "home" }]);
    } else {
      setEvents((current) => [...current, { minute: parsedMinute, type: "goal", player, assist: secondary || null, team: "home" }]);
    }
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <TopNav title="Match" subtitle="Live match timeline." userName={profile?.full_name ?? "Coach"} roleLabel={profile?.role === "player" ? "Player view" : "Coach view"} />
      <Card><div className="text-center text-4xl font-semibold text-slate-950">My Club {score} – 0 Riverside FC</div><div className="mt-4 flex items-center justify-center gap-3"><div className="text-2xl font-semibold text-slate-900">{clock}</div><button type="button" onClick={() => setRunning((current) => !current)} className="min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">{running ? "Pause" : "Start"}</button></div></Card>
      <Card><div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold text-slate-950">Match timeline</h2>{profile?.role !== "player" ? <button type="button" onClick={() => setOpen(true)} className="min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Add event</button> : null}</div><div className="mt-4 space-y-3">{events.sort((a, b) => a.minute - b.minute).map((event, index) => <div key={`${event.minute}-${index}`} className="flex items-center gap-4 rounded-2xl bg-slate-50 px-4 py-3"><div className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">{event.minute}&apos;</div><div className="text-sm text-slate-700">{event.type === "goal" ? `⚽ Goal — ${event.player}${event.assist ? ` (Assist: ${event.assist})` : ""}` : event.type === "yellow_card" ? `🟨 Yellow card — ${event.player}` : `🔄 Sub — ${event.playerOff} off, ${event.playerOn} on`}</div></div>)}</div></Card>
      <Modal open={open} title="Add event" onClose={() => setOpen(false)}><div className="space-y-3"><input value={minute} onChange={(event) => setMinute(event.target.value)} className="min-h-11 w-full rounded-2xl border border-slate-200 px-4" placeholder="Minute" /><select value={type} onChange={(event) => setType(event.target.value)} className="min-h-11 w-full rounded-2xl border border-slate-200 px-4"><option value="goal">Goal</option><option value="yellow_card">Yellow Card</option><option value="substitution">Substitution</option></select><select value={player} onChange={(event) => setPlayer(event.target.value)} className="min-h-11 w-full rounded-2xl border border-slate-200 px-4">{teamRoster.map((name) => <option key={name}>{name}</option>)}</select><select value={secondary} onChange={(event) => setSecondary(event.target.value)} className="min-h-11 w-full rounded-2xl border border-slate-200 px-4">{teamRoster.map((name) => <option key={name}>{name}</option>)}</select><button type="button" onClick={addEvent} className="min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Add event</button></div></Modal>
    </div>
  );
}
