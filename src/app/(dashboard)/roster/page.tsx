"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { TopNav } from "@/components/layout/TopNav";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTeam } from "@/components/providers/TeamProvider";
import { usePlayers } from "@/lib/hooks/usePlayers";
import { formatRelative } from "@/lib/utils/formatters";

const positionTabs = ["All", "GK", "DEF", "MID", "FWD"];

export default function RosterPage() {
  const { isDemo } = useAuth();
  const { activeTeam } = useTeam();
  const { players, loading, error } = usePlayers(activeTeam.id, isDemo);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState("All");

  const filtered = useMemo(() => players.filter((entry) => {
    const matchesName = entry.profile.full_name.toLowerCase().includes(query.toLowerCase());
    const matchesPosition = position === "All" || entry.playerProfile.position === position;
    return matchesName && matchesPosition;
  }), [players, position, query]);

  return (
    <div className="space-y-6">
      <TopNav title="Roster" subtitle="Search and review player details." />
      <Card>
        {error ? <div className="mb-4 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search player" className="min-h-11 rounded-2xl border border-slate-200 px-4 outline-none" />
          <div className="flex flex-wrap gap-2">
            {positionTabs.map((tab) => (
              <button key={tab} type="button" onClick={() => setPosition(tab)} className={position === tab ? "min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white" : "min-h-11 rounded-2xl bg-slate-100 px-4 text-sm font-semibold text-slate-600"}>{tab}</button>
            ))}
          </div>
        </div>
        {loading ? <div className="mt-4 text-sm text-slate-500">Loading roster...</div> : null}
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="text-xs uppercase tracking-[0.16em] text-slate-400">
              <tr>
                <th className="pb-3">Player</th>
                <th className="pb-3">Position</th>
                <th className="pb-3">Jersey</th>
                <th className="pb-3">Readiness</th>
                <th className="pb-3">Last check-in</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.profile.id} className="border-t border-slate-100">
                  <td className="py-4"><Link href={`/roster/${entry.profile.id}`} className="flex items-center gap-3"><Avatar name={entry.profile.full_name} /><span className="font-medium text-slate-900">{entry.profile.full_name}</span></Link></td>
                  <td className="py-4 text-sm text-slate-600">{entry.playerProfile.position}</td>
                  <td className="py-4 text-sm text-slate-600">#{entry.playerProfile.jersey_number}</td>
                  <td className="py-4 text-sm font-semibold text-slate-900">{entry.latestResponse?.readiness_score ?? "-"}</td>
                  <td className="py-4 text-sm text-slate-600">{entry.latestResponse ? formatRelative(entry.latestResponse.submitted_at) : "Missed"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
