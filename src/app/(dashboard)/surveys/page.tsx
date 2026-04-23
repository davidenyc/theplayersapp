"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/components/providers/AuthProvider";
import { SurveyBuilder } from "@/components/coach/SurveyBuilder";
import { TopNav } from "@/components/layout/TopNav";
import { Card } from "@/components/ui/Card";
import { DEFAULT_WELLNESS_QUESTIONS } from "@/constants/surveyQuestions";
import { createClient } from "@/lib/supabase/client";
import { postGameSurveyTemplate } from "@/lib/mock/data";
import { getSurveyResponseDashboard, getTeamContext } from "@/lib/mock/selectors";
import type { SurveyTemplate } from "@/types";

export default function SurveysPage() {
  const supabase = createClient();
  const { teamId, profile, isDemo } = useAuth();
  const [templates, setTemplates] = useState<SurveyTemplate[]>([]);

  useEffect(() => {
    async function load() {
      if (isDemo) {
        setTemplates([getTeamContext().surveyTemplate]);
        return;
      }

      if (!teamId) return;
      const { data } = await supabase
        .from("survey_templates")
        .select("*")
        .eq("team_id", teamId)
        .order("created_at", { ascending: false });
      setTemplates((data ?? []) as SurveyTemplate[]);
    }

    void load();
  }, [isDemo, supabase, teamId]);

  const demoDashboard = getSurveyResponseDashboard();

  if (profile?.role === "player") {
    return (
      <div className="space-y-6">
        <TopNav
          title="My Surveys"
          subtitle="Players answer assigned surveys here. Survey creation is coach-only."
          userName={profile.full_name}
        />
        <Card>
          <h2 className="text-xl font-semibold text-slate-950">Today&apos;s assigned survey</h2>
          <div className="mt-4 rounded-3xl bg-slate-50 p-5">
            <div className="text-lg font-semibold text-slate-900">
              {templates[0]?.name ?? "Daily Wellness Check-In"}
            </div>
            <div className="mt-2 text-sm text-slate-500">
              Complete your wellness check-in before 9:30 AM.
            </div>
            <Link
              href="/checkin"
              className="mt-4 inline-flex min-h-11 items-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white"
            >
              Answer survey
            </Link>
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold text-slate-950">Post-game survey</h2>
          <div className="mt-4 rounded-3xl bg-slate-50 p-5">
            <div className="text-lg font-semibold text-slate-900">{postGameSurveyTemplate.name}</div>
            <div className="mt-2 text-sm text-slate-500">{postGameSurveyTemplate.description}</div>
            <div className="mt-4 text-sm text-slate-600">
              {postGameSurveyTemplate.questions.length} reflection prompts after matchday.
            </div>
            <Link
              href="/checkin"
              className="mt-4 inline-flex min-h-11 items-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white"
            >
              Open post-game survey
            </Link>
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold text-slate-950">Team snapshot</h2>
          <div className="mt-4 text-4xl font-semibold text-teal-700">{demoDashboard.compliance}%</div>
          <div className="mt-2 text-sm text-slate-500">
            Based on the current demo response set for today.
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TopNav
        title="Surveys"
        subtitle="Create wellness templates, review current assignments, and manage team check-ins."
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="text-xl font-semibold text-slate-950">Existing templates</h2>
          <div className="mt-4 rounded-3xl bg-slate-950 p-5 text-white">
            <div className="text-sm uppercase tracking-[0.18em] text-teal-300">Today</div>
            <div className="mt-2 text-3xl font-semibold">{demoDashboard.compliance}% compliance</div>
            <div className="mt-2 text-sm text-slate-300">
              {demoDashboard.cards.filter((card) => card.status === "flagged").length} flagged players
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {templates.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-500">
                No survey templates found for this team yet.
              </div>
            ) : (
              templates.map((template) => (
                <div key={template.id} className="rounded-3xl bg-slate-50 p-5">
                  <div className="text-lg font-semibold text-slate-900">{template.name}</div>
                  <div className="mt-2 text-sm text-slate-500">{template.description}</div>
                  <div className="mt-4 text-sm text-slate-600">
                    {template.questions.length} questions
                  </div>
                  <Link
                    href={`/surveys/${template.id}/responses`}
                    className="mt-4 inline-flex text-sm font-semibold text-teal-700"
                  >
                    View responses
                  </Link>
                </div>
              ))
            )}
            <div className="rounded-3xl bg-sky-50 p-5">
              <div className="text-lg font-semibold text-slate-900">{postGameSurveyTemplate.name}</div>
              <div className="mt-2 text-sm text-slate-500">{postGameSurveyTemplate.description}</div>
              <div className="mt-4 text-sm text-slate-600">
                Use after games to capture load, execution, and recovery notes.
              </div>
              <div className="mt-4 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                Featured after matchday
              </div>
            </div>
          </div>
        </Card>
        <div className="space-y-6">
          <SurveyBuilder questions={templates[0]?.questions ?? DEFAULT_WELLNESS_QUESTIONS} />
          <Card>
            <h2 className="text-xl font-semibold text-slate-950">Session plan explainer</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>
                Pair each survey assignment with a short explainer so players know how the session
                connects to the team game model.
              </p>
              <div className="rounded-3xl bg-slate-50 p-4">
                Tuesday training: build-out under pressure, winger timing on opposite-side runs,
                and rest-defense spacing after final-third entries.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
