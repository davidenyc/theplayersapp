"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { SurveyBuilder } from "@/components/coach/SurveyBuilder";
import { TopNav } from "@/components/layout/TopNav";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTeam } from "@/components/providers/TeamProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { TrendChart } from "@/components/ui/TrendChart";
import { surveyTemplates } from "@/lib/mock/data";
import { getSurveyResponseDashboard } from "@/lib/mock/selectors";

const recurrenceLabels: Record<string, { tone: "info" | "warning" | "success"; label: string }> = {
  "Daily wellness": { tone: "info", label: "Daily" },
  "Daily Check-In": { tone: "info", label: "Daily" },
  "Pre-Match Readiness": { tone: "warning", label: "Matchday" },
  "Pre-Match": { tone: "warning", label: "Matchday" },
  "Post-Training Load": { tone: "info", label: "Post-training" },
  "After Training": { tone: "info", label: "Post-training" },
  "Weekly Reflection": { tone: "success", label: "Weekly" },
  "Recovery Check-In": { tone: "success", label: "Rest days" },
  "Post-Match": { tone: "warning", label: "Post-match" },
};

export default function SurveysPage() {
  const { profile } = useAuth();
  const { activeTeam } = useTeam();
  const [assigning, setAssigning] = useState<string | null>(null);
  const [recurrence, setRecurrence] = useState("Daily");
  const [deadline, setDeadline] = useState("9:30 AM");
  const [activeCoachTab, setActiveCoachTab] = useState<"forms" | "strategy" | "learning">("forms");

  const templates = useMemo(() => surveyTemplates.filter((template) => template.team_id === activeTeam.id), [activeTeam.id]);
  const dashboard = getSurveyResponseDashboard(activeTeam.id);

  if (profile?.role === "player") {
    return (
      <div className="space-y-6">
        <TopNav title="Surveys" subtitle="Complete your assigned forms." userName={profile.full_name} roleLabel="Player view" />
        {templates.map((template) => (
          <Card key={template.id} className="transition duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">{template.name}</h2>
                <div className="mt-2 text-sm text-slate-500">{template.description}</div>
              </div>
              <Badge tone={recurrenceLabels[template.name]?.tone ?? "info"} label={recurrenceLabels[template.name]?.label ?? "Assigned"} />
            </div>
            <div className="mt-4 text-sm text-slate-600">{template.questions.length} questions.</div>
            <Link href={template.name.includes("Pre-Match") ? "/checkin?context=prematch" : "/checkin"} className="mt-4 inline-flex min-h-11 items-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Answer survey</Link>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TopNav title="Surveys" subtitle="Assign and review team forms." />
      <div className="flex flex-wrap gap-2">
        {[ ["forms", "Wellness forms"], ["strategy", "Strategy checks"], ["learning", activeTeam.age_group === "youth" ? "Flashcards" : "Scenario review"] ].map(([id, label]) => (
          <button key={id} type="button" onClick={() => setActiveCoachTab(id as "forms" | "strategy" | "learning")} className={`min-h-11 rounded-full px-4 text-sm font-semibold transition ${activeCoachTab === id ? "bg-slate-950 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}>{label}</button>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="text-xl font-semibold text-slate-950">Template library</h2>
          <div className="mt-4 rounded-3xl bg-slate-950 p-5 text-white">
            <div className="text-sm uppercase tracking-[0.18em] text-teal-300">Today</div>
            <div className="mt-2 text-3xl font-semibold">{dashboard.compliance}% compliance</div>
            <div className="mt-2 text-sm text-slate-300">{dashboard.cards.filter((card) => card.status === "flagged").length} flagged players</div>
          </div>
          <div className="mt-4 space-y-4">
            {templates.map((template) => (
              <div key={template.id} className="rounded-3xl bg-slate-50 p-5 transition duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-slate-900">{template.name}</div>
                    <div className="mt-2 text-sm text-slate-500">{template.description}</div>
                  </div>
                  <Badge tone={recurrenceLabels[template.name]?.tone ?? "info"} label={recurrenceLabels[template.name]?.label ?? "Assigned"} />
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href={`/surveys/${template.id}/responses`} className="inline-flex min-h-11 items-center text-sm font-semibold text-teal-700">View responses</Link>
                  <button type="button" onClick={() => setAssigning(template.id)} className="inline-flex min-h-11 items-center rounded-2xl border border-slate-300 px-4 text-sm font-semibold text-slate-700">Assign</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-6">
          <SurveyBuilder questions={templates[0]?.questions ?? []} />
          {activeCoachTab === "forms" ? (
            <TrendChart data={dashboard.trendData.slice(0, 7)} metric="Survey trend" flagThreshold={60} />
          ) : activeCoachTab === "strategy" ? (
            <Card>
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Game understanding</h2>
                <p className="mt-1 text-sm text-slate-500">Quick prompts to check whether players understand the plan.</p>
              </div>
              <div className="mt-4 grid gap-3">
                {["What is our first pressing trigger after a backward pass?", "Where should the weak-side winger be on a switch?", "What is the first option in our build-out shape?"].map((prompt, index) => (
                  <div key={prompt} className="rounded-3xl bg-[linear-gradient(135deg,#e0f2fe,#f8fafc)] p-5 transition duration-300 hover:-translate-y-1">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Scenario {index + 1}</div>
                    <div className="mt-2 text-base font-semibold text-slate-900">{prompt}</div>
                    <div className="mt-3 flex gap-2">{["A", "B", "C"].map((choice) => <button key={choice} type="button" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:scale-105">{choice}</button>)}</div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card>
              <div>
                <h2 className="text-xl font-semibold text-slate-950">{activeTeam.age_group === "youth" ? "Learning cards" : "Scenario review"}</h2>
                <p className="mt-1 text-sm text-slate-500">Use short cards to reinforce the session plan after training.</p>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {["Where do we press from first?", "What was today&apos;s main focus?", "What do we do after losing the ball?"].map((card, index) => (
                  <div key={card} className="group rounded-3xl bg-[linear-gradient(160deg,#0f172a,#1e293b)] p-5 text-white transition duration-300 hover:-translate-y-1 hover:rotate-[0.5deg]">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">Card {index + 1}</div>
                    <div className="mt-3 text-lg font-semibold">{card}</div>
                    <div className="mt-8 text-sm text-slate-300 group-hover:text-white">Tap to reveal the answer in the next version.</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
      <Modal open={Boolean(assigning)} title={`Assign ${templates.find((item) => item.id === assigning)?.name ?? "template"} to ${activeTeam.name}`} onClose={() => setAssigning(null)}>
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-sm font-medium text-slate-700">Recurrence</div>
            <div className="grid gap-2 md:grid-cols-4">{["Daily", "Weekdays only", "Weekly", "Once"].map((option) => <button key={option} type="button" onClick={() => setRecurrence(option)} className={`min-h-11 rounded-2xl border px-3 text-sm font-semibold ${recurrence === option ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 text-slate-700"}`}>{option}</button>)}</div>
          </div>
          <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Deadline time</span><input value={deadline} onChange={(event) => setDeadline(event.target.value)} className="min-h-11 w-full rounded-2xl border border-slate-200 px-4 outline-none" /></label>
          <button type="button" onClick={() => setAssigning(null)} className="min-h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Assign to team</button>
        </div>
      </Modal>
    </div>
  );
}
