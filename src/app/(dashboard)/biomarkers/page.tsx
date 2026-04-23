import { TopNav } from "@/components/layout/TopNav";
import { BiomarkerChart } from "@/components/player/BiomarkerChart";
import { biomarkerEntries } from "@/lib/mock/data";

export default function BiomarkersPage() {
  return (
    <div className="space-y-6">
      <TopNav title="Biomarkers" subtitle="Monitor wearable and manual metrics over time." />
      <div className="grid gap-4 md:grid-cols-2">
        <BiomarkerChart entries={biomarkerEntries} metric="hrv" />
        <BiomarkerChart entries={biomarkerEntries} metric="resting_hr" />
      </div>
    </div>
  );
}
