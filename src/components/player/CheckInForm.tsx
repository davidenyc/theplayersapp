"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useTeam } from "@/components/providers/TeamProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { RatingInput } from "@/components/ui/RatingInput";
import {
  DEFAULT_WELLNESS_QUESTIONS,
  PRE_MATCH_U19_QUESTIONS,
  YOUTH_DAILY_CHECKIN_QUESTIONS,
  YOUTH_PRE_MATCH_QUESTIONS,
} from "@/constants/surveyQuestions";
import { computeFlags, computeReadinessScore } from "@/constants/flagThresholds";
import { createClient } from "@/lib/supabase/client";
import { saveDemoResponse } from "@/lib/demo/state";
import { getActiveSurveyForTeam } from "@/lib/supabase/queries";
import type { Database } from "@/types";

export function CheckInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { profile, teamId, isDemo } = useAuth();
  const { activeTeam } = useTeam();
  const isYouth = activeTeam.age_group === "youth";
  const isPrematch = searchParams.get("context") === "prematch";
  const questions = isPrematch ? (isYouth ? YOUTH_PRE_MATCH_QUESTIONS : PRE_MATCH_U19_QUESTIONS) : (isYouth ? YOUTH_DAILY_CHECKIN_QUESTIONS : DEFAULT_WELLNESS_QUESTIONS);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | boolean | string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const question = questions[step];
  const progress = useMemo(() => Math.round(((step + 1) / questions.length) * 100), [step, questions.length]);

  async function submit() {
    if (!profile || !teamId) {
      setError("You need to be signed in as a player to submit a check-in.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const readiness = computeReadinessScore(answers);
    const flags = computeFlags(answers);
    const templateId = isPrematch ? (isYouth ? "survey_template_youth_prematch" : "survey_template_u19_prematch") : (isYouth ? "survey_template_youth_daily" : "survey_template_u19_wellness");
    const assignmentId = isPrematch ? (isYouth ? "assignment_youth_prematch" : "assignment_u19_prematch") : (isYouth ? "assignment_youth_daily" : "assignment_daily_wellness");

    if (isDemo) {
      saveDemoResponse({
        id: `demo-response-${profile.id}-${new Date().toISOString().slice(0, 10)}-${isPrematch ? "prematch" : "daily"}`,
        assignment_id: assignmentId,
        template_id: templateId,
        player_id: profile.id,
        submitted_at: new Date().toISOString(),
        answers,
        readiness_score: readiness,
        flagged: flags.length > 0,
        flag_reasons: flags,
      });
      router.push("/dashboard");
      return;
    }

    const { assignment, template } = await getActiveSurveyForTeam(teamId);
    if (!assignment || !template) {
      setError("No active survey assignment was found for your team.");
      setSubmitting(false);
      return;
    }

    const payload: Database["public"]["Tables"]["survey_responses"]["Insert"] = {
      id: crypto.randomUUID(),
      assignment_id: assignment.id,
      template_id: template.id,
      player_id: profile.id,
      submitted_at: new Date().toISOString(),
      answers,
      readiness_score: readiness,
      flagged: flags.length > 0,
      flag_reasons: flags,
    };

    const { error: insertError } = await (supabase.from("survey_responses") as any).insert(payload);
    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-[100dvh] flex-col rounded-[32px] bg-white p-6 shadow-lg">
      <div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-teal-600" style={{ width: `${progress}%` }} /></div>
        <div className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Step {step + 1} of {questions.length}</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{question.label}</h2>
      </div>

      <div className="flex-1 py-8">
        {error ? <div className="mb-4 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        {question.type === "scale" ? (
          <RatingInput value={typeof answers[question.id] === "number" ? (answers[question.id] as number) : Math.max(question.min ?? 1, 5)} onChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))} min={question.min} max={question.max} flagAbove={question.flag_above} flagBelow={question.flag_below} />
        ) : null}
        {question.type === "boolean" ? (
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map((value) => (
              <button key={String(value)} type="button" onClick={() => setAnswers((current) => ({ ...current, [question.id]: value }))} className={`min-h-16 rounded-3xl text-lg font-semibold transition ${answers[question.id] === value ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}>{value ? "Yes" : "No"}</button>
            ))}
          </div>
        ) : null}
        {question.type === "text" ? <textarea value={typeof answers[question.id] === "string" ? (answers[question.id] as string) : ""} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} className="min-h-40 w-full rounded-3xl border border-slate-200 px-5 py-4 outline-none" placeholder="Add details" /> : null}
      </div>

      <div className="sticky bottom-0 mt-4 grid grid-cols-2 gap-3 bg-white/95 pb-2 pt-4 backdrop-blur">
        <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} className="min-h-12 rounded-2xl bg-slate-100 font-semibold text-slate-700">Back</button>
        {step < questions.length - 1 ? <button type="button" onClick={() => setStep((current) => Math.min(questions.length - 1, current + 1))} className="min-h-12 rounded-2xl bg-teal-600 font-semibold text-white">Next</button> : <button type="button" onClick={submit} disabled={submitting} className="min-h-12 rounded-2xl bg-slate-950 font-semibold text-white">{submitting ? "Submitting..." : "Submit check-in"}</button>}
      </div>
    </div>
  );
}
