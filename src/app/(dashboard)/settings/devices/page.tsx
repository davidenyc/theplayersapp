"use client";

import Link from "next/link";
import { useState } from "react";
import { Activity, Heart, Navigation, Zap } from "lucide-react";

import { TopNav } from "@/components/layout/TopNav";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

const devices = [
  { name: "Whoop", description: "Recovery, strain & HRV", icon: Activity, connected: true },
  { name: "Garmin", description: "GPS performance & heart rate", icon: Navigation, connected: false },
  { name: "Apple Health", description: "iPhone & Apple Watch", icon: Heart, connected: false },
  { name: "Polar", description: "Heart rate & training load", icon: Zap, connected: false },
] as const;

export default function DevicesPage() {
  const [pending, setPending] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <TopNav title="Connected Devices" subtitle="Sync a wearable for biomarker tracking." />
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Health sync overview</h2>
            <p className="mt-2 text-sm text-slate-500">Connected device data flows into the Health page so players and coaches can compare readiness, recovery, and training load.</p>
          </div>
          <Link href="/health" className="inline-flex min-h-11 items-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm">Open health dashboard</Link>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {devices.map((device) => {
          const Icon = device.icon;
          return (
            <Card key={device.name}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100"><Icon className="h-6 w-6 text-slate-700" /></div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{device.name}</h2>
                    <p className="mt-2 text-sm text-slate-500">{device.description}</p>
                  </div>
                </div>
                {device.connected ? <Badge tone="success" label="Connected" /> : null}
              </div>
              {device.connected ? (
                <div className="mt-4 flex items-center justify-between gap-3"><div className="text-sm text-slate-500">Last sync Today, 6:42 AM</div><button type="button" className="min-h-11 rounded-2xl border border-rose-200 px-4 text-sm font-semibold text-rose-700">Disconnect</button></div>
              ) : (
                <button type="button" onClick={() => setPending(device.name)} className="mt-4 min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm">Connect</button>
              )}
            </Card>
          );
        })}
      </div>
      <Modal open={Boolean(pending)} title={`${pending} sync`} onClose={() => setPending(null)}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">{pending} sync is coming soon. We&apos;ll let you know when it&apos;s ready.</p>
          <button type="button" onClick={() => setPending(null)} className="min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Got it</button>
        </div>
      </Modal>
    </div>
  );
}
