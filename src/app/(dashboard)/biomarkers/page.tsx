import Link from "next/link";

import { TopNav } from "@/components/layout/TopNav";
import { BiomarkerChart } from "@/components/player/BiomarkerChart";
import { Card } from "@/components/ui/Card";
import { biomarkerEntries } from "@/lib/mock/data";

export default function BiomarkersPage() {
  return (
    <div className="space-y-6">
      <TopNav title="Biomarkers" subtitle="Track wearable and manual data." />
      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Connected data</h2>
            <p className="mt-2 text-sm text-slate-500">Use a wearable for automatic tracking.</p>
          </div>
          <Link href={"/settings/devices" as any} className="inline-flex min-h-11 items-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Connect device</Link>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <BiomarkerChart entries={biomarkerEntries} metric="hrv" />
        <BiomarkerChart entries={biomarkerEntries} metric="resting_hr" />
      </div>
    </div>
  );
}
