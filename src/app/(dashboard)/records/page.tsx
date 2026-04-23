import { TopNav } from "@/components/layout/TopNav";
import { Card } from "@/components/ui/Card";
import { physicalRecordSpotlights, soccerRecordSpotlights } from "@/lib/mock/data";

export default function RecordsPage() {
  return (
    <div className="space-y-6">
      <TopNav
        title="Records"
        subtitle="Physical benchmarks and soccer skill records for the squad."
      />

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Physical Records</h2>
          <p className="text-sm text-slate-500">Strength, engine, and explosiveness benchmarks.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {physicalRecordSpotlights.map((record) => (
            <Card key={record.label}>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Physical</div>
              <div className="mt-2 text-lg font-semibold text-slate-950">{record.label}</div>
              <div className="mt-4 text-3xl font-semibold text-teal-700">
                {record.value} {record.unit}
              </div>
              <div className="mt-2 text-sm text-slate-500">{record.athlete}</div>
              <div className="mt-1 text-sm text-emerald-600">{record.delta}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Soccer Records</h2>
          <p className="text-sm text-slate-500">Technical skill and game-specific standards.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {soccerRecordSpotlights.map((record) => (
            <Card key={record.label}>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Soccer</div>
              <div className="mt-2 text-lg font-semibold text-slate-950">{record.label}</div>
              <div className="mt-4 text-3xl font-semibold text-sky-700">
                {record.value} {record.unit}
              </div>
              <div className="mt-2 text-sm text-slate-500">{record.athlete}</div>
              <div className="mt-1 text-sm text-amber-600">{record.delta}</div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
