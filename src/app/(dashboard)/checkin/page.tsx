"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { TopNav } from "@/components/layout/TopNav";
import { CheckInForm } from "@/components/player/CheckInForm";
import { useAppMode } from "@/components/providers/AppModeProvider";

function CheckinContent() {
  const searchParams = useSearchParams();
  const { mode } = useAppMode();
  const isPrematch = searchParams.get("context") === "prematch";

  return (
    <div className="space-y-6">
      {mode === "gameday" ? (
        <div className="rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          Match day is active. Complete your pre-match check-in before kickoff.
        </div>
      ) : null}
      <TopNav
        title={isPrematch ? "Pre-Match Check-In" : "Daily Check-In"}
        subtitle={isPrematch ? "Get ready before kickoff." : "Complete today&apos;s player check-in."}
        userName="Liam Carter"
      />
      <CheckInForm />
    </div>
  );
}

export default function CheckinPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading check-in...</div>}>
      <CheckinContent />
    </Suspense>
  );
}
