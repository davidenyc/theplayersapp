"use client";

import { useMemo, useState } from "react";

import { TopNav } from "@/components/layout/TopNav";
import { HighlightCard } from "@/components/player/HighlightCard";
import { Tabs } from "@/components/ui/Tabs";
import { Card } from "@/components/ui/Card";
import { getHighlightsPageData } from "@/lib/mock/selectors";

const categories = [
  { id: "all", label: "All" },
  { id: "passing", label: "Passing" },
  { id: "finishing", label: "Finishing" },
  { id: "athletic", label: "Athletic" },
  { id: "general", label: "General" },
];

export default function HighlightsPage() {
  const [active, setActive] = useState("all");
  const items = getHighlightsPageData();
  const filtered = useMemo(
    () => items.filter((item) => active === "all" || item.category === active),
    [active, items],
  );

  return (
    <div className="space-y-6">
      <TopNav title="Highlights" subtitle="Upload clips, add links, and pin your best work." />
      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Upload file</span>
            <input type="file" className="block min-h-11 w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Video link</span>
            <input
              type="url"
              placeholder="Paste YouTube, Hudl, or Vimeo URL"
              className="min-h-11 w-full rounded-2xl border border-slate-200 px-4 outline-none"
            />
          </label>
        </div>
      </Card>
      <Tabs tabs={categories} active={active} onChange={setActive} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((highlight) => (
          <HighlightCard key={highlight.id} highlight={highlight} />
        ))}
      </div>
    </div>
  );
}
