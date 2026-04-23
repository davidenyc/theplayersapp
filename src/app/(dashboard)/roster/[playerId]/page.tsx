"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";

import { TopNav } from "@/components/layout/TopNav";
import { useAuth } from "@/components/providers/AuthProvider";
import { BiomarkerChart } from "@/components/player/BiomarkerChart";
import { GoalCard } from "@/components/player/GoalCard";
import { HighlightCard } from "@/components/player/HighlightCard";
import { StatRow } from "@/components/player/StatRow";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { biomarkerEntries, coachNotes, getPlayerBundle, records } from "@/lib/mock/data";
import { getPlayerDetailData } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils/formatters";
import type { Goal, Highlight, PlayerProfile, Profile, StatRecord } from "@/types";

const tabs = [
  { id: "bio", label: "Bio" },
  { id: "biomarkers", label: "Biomarkers" },
  { id: "goals", label: "Goals" },
  { id: "stats", label: "Stats" },
  { id: "records", label: "Records" },
  { id: "highlights", label: "Highlights" },
  { id: "notes", label: "Notes" },
];

export default function PlayerDetailPage({ params }: { params: { playerId: string } }) {
  const { profile: currentProfile, isDemo } = useAuth();
  const [active, setActive] = useState("bio");
  const [data, setData] = useState<{
    profile: Profile | null;
    player: PlayerProfile | null;
    goals: Goal[];
    stats: StatRecord | null;
    highlights: Highlight[];
  } | null>(null);

  useEffect(() => {
    if (isDemo) {
      const bundle = getPlayerBundle(params.playerId);
      setData(
        bundle
          ? {
              profile: bundle.profile,
              player: bundle.player,
              goals: bundle.goals,
              stats: bundle.stats ?? null,
              highlights: bundle.highlights,
            }
          : null,
      );
      return;
    }

    void getPlayerDetailData(params.playerId).then(setData);
  }, [isDemo, params.playerId]);

  const mockBiomarkers = biomarkerEntries.filter((entry) => entry.player_id === params.playerId);
  const mockRecords = records.filter((entry) => entry.player_id === params.playerId);
  const mockNotes = coachNotes.filter((entry) => entry.player_id === params.playerId);

  if (data && (!data.profile || !data.player)) notFound();
  if (!data) return <div className="p-6 text-sm text-slate-500">Loading player details...</div>;

  let panel: React.ReactNode = null;
  switch (active) {
    case "bio":
      panel = (
        <Card>
          <div className="grid gap-3 md:grid-cols-2">
            <StatRow label="Position" value={data.player?.position ?? "N/A"} />
            <StatRow label="School" value={data.player?.school ?? "N/A"} />
            <StatRow label="Height" value={data.player?.height_cm ? `${data.player.height_cm} cm` : "N/A"} />
            <StatRow label="Weight" value={data.player?.weight_kg ? `${data.player.weight_kg} kg` : "N/A"} />
            <StatRow label="Graduation Year" value={data.player?.graduation_year ?? "N/A"} />
            <StatRow label="DOB" value={formatDate(data.player?.date_of_birth)} />
          </div>
          <p className="mt-4 text-sm text-slate-600">{data.player?.bio}</p>
        </Card>
      );
      break;
    case "biomarkers":
      panel = (
        <div className="grid gap-4 md:grid-cols-2">
          <BiomarkerChart entries={mockBiomarkers} metric="hrv" />
          <BiomarkerChart entries={mockBiomarkers} metric="resting_hr" />
        </div>
      );
      break;
    case "goals":
      panel = <div className="grid gap-4 md:grid-cols-2">{data.goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}</div>;
      break;
    case "stats":
      panel = (
        <Card>
          <div className="grid gap-3 md:grid-cols-2">
            <StatRow label="Appearances" value={data.stats?.appearances ?? 0} />
            <StatRow label="Starts" value={data.stats?.starts ?? 0} />
            <StatRow label="Minutes" value={data.stats?.minutes_played ?? 0} />
            <StatRow label="Goals" value={data.stats?.goals ?? 0} />
            <StatRow label="Assists" value={data.stats?.assists ?? 0} />
            <StatRow label="Pass %" value={data.stats?.pass_completion_pct ?? 0} />
          </div>
        </Card>
      );
      break;
    case "records":
      panel = (
        <Card>
          <div className="space-y-3">
            {mockRecords.map((record) => (
              <StatRow key={record.id} label={`${record.label} (${record.category})`} value={`${record.value} ${record.unit}`} />
            ))}
          </div>
        </Card>
      );
      break;
    case "highlights":
      panel = (
        <div className="grid gap-4 md:grid-cols-2">
          {data.highlights.map((highlight) => (
            <HighlightCard key={highlight.id} highlight={highlight} />
          ))}
        </div>
      );
      break;
    case "notes":
      panel = (
        <div className="space-y-4">
          {mockNotes.map((note) => (
            <Card key={note.id}>
              <div className="text-sm text-slate-500">{formatDate(note.created_at)}</div>
              <p className="mt-2 text-sm text-slate-700">{note.body}</p>
            </Card>
          ))}
        </div>
      );
      break;
    default:
      panel = null;
  }

  return (
    <div className="space-y-6">
      <TopNav
        title={data.profile?.full_name ?? "Player Detail"}
        subtitle={`Player detail · #${data.player?.jersey_number ?? "-"} · ${data.player?.position ?? "N/A"}`}
        userName={currentProfile?.full_name ?? "Coach"}
      />
      <Tabs tabs={tabs} active={active} onChange={setActive} />
      {panel}
    </div>
  );
}
