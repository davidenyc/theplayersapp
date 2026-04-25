"use client";

import { TopNav } from "@/components/layout/TopNav";
import { BiomarkerChart } from "@/components/player/BiomarkerChart";
import { GoalCard } from "@/components/player/GoalCard";
import { HighlightCard } from "@/components/player/HighlightCard";
import { StatRow } from "@/components/player/StatRow";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getProfilePageData } from "@/lib/mock/selectors";

export default function ProfilePage() {
  const { profile } = useAuth();
  const data = getProfilePageData(profile?.id);

  return (
    <div className="space-y-6">
      <TopNav title="My profile" subtitle="Your goals and current profile." userName={data.profile.full_name} roleLabel="Player view" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold text-slate-950">{data.profile.full_name}</h2>
          <div className="mt-4 space-y-3">
            <StatRow label="Position" value={data.player.position} />
            <StatRow label="Jersey" value={`#${data.player.jersey_number}`} />
            <StatRow label="Height" value={`${data.player.height_cm} cm`} />
            <StatRow label="Weight" value={`${data.player.weight_kg} kg`} />
          </div>
        </Card>
        <BiomarkerChart entries={data.biomarkers} metric="hrv" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">{data.goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}</div>
      <div className="grid gap-4 md:grid-cols-2">{data.highlights.map((highlight) => <HighlightCard key={highlight.id} highlight={highlight} />)}</div>
      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Connected devices</h2>
            <p className="mt-2 text-sm text-slate-500">Wearable sync for automatic biomarker tracking.</p>
          </div>
          <div className="space-y-2 text-right">
            <Badge tone="success" label="Connected" />
            <div className="text-sm text-slate-500">Whoop · Last sync today, 6:42 AM</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
