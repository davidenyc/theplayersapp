"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";
import { RatingInput } from "@/components/ui/RatingInput";
import { DEFAULT_WELLNESS_QUESTIONS } from "@/constants/surveyQuestions";
import { computeFlags, computeReadinessScore } from "@/constants/flagThresholds";
import { createClient } from "@/lib/supabase/client";
import { saveDemoResponse } from "@/lib/demo/state";
import { getActiveSurveyForTeam } from "@/lib/supabase/queries";
import type { Database } from "@/types";

export function CheckInForm() {
  const router = useRouter();
  const supabase = createClient();
  const { profile, teamId, isDemo } = useAuth();
  const questions = DEFAULT_WELLNESS_QUESTIONS;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | boolean | string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const question = questions[step];

  const progress = useMemo(
    () => Math.round(((step + 1) / questions.length) * 100),
    [step, questions.length],
  );
  const sleepOptions = [4, 5, 6, 7, 8, 9, 10];

  async function submit() {
    if (!profile || !teamId) {
      setError("You need to be signed in as a player to submit a check-in.");
      return;
    }

    setSubmitting(true);
    setError(null);
    const readiness = computeReadinessScore(answers);
    const flags = computeFlags(answers);

    if (isDemo) {
      saveDemoResponse({
        id: `demo-response-${profile.id}-${new Date().toISOString().slice(0, 10)}`,
        assignment_id: "assignment_daily_wellness",
        template_id: "survey_template_wellness",
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
    <div className="flex min-h-[100dvh] flex-col justify-between rounded-[32px] bg-white p-6 shadow-lg">
      <div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-teal-600" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Step {step + 1} of {questions.length}
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{question.label}</h2>
      </div>

      <div className="py-10">
        {error ? <div className="mb-4 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        {question.type === "scale" ? (
          question.id === "sleep_hours" ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {sleepOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                  className={`min-h-14 rounded-3xl text-base font-semibold ${
                    answers[question.id] === option
                      ? option < 6
                        ? "bg-rose-500 text-white"
                        : "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {option} hrs
                </button>
              ))}
            </div>
          ) : (
            <RatingInput
              value={typeof answers[question.id] === "number" ? (answers[question.id] as number) : 5}
              onChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))}
              min={question.min}
              max={question.max}
              flagAbove={question.flag_above}
              flagBelow={question.flag_below}
            />
          )
        ) : null}

        {question.type === "number" ? (
          <input
            type="number"
            min={question.min}
            max={question.max}
            value={typeof answers[question.id] === "number" ? (answers[question.id] as number) : ""}
            onChange={(event) =>
              setAnswers((current) => ({ ...current, [question.id]: Number(event.target.value) }))
            }
            className="min-h-14 w-full rounded-3xl border border-slate-200 px-5 text-lg outline-none"
          />
        ) : null}

        {question.type === "boolean" ? (
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map((value) => (
              <button
                key={String(value)}
                type="button"
                onClick={() => setAnswers((current) => ({ ...current, [question.id]: value }))}
                className={`min-h-16 rounded-3xl text-lg font-semibold ${
                  answers[question.id] === value
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {value ? "Yes" : "No"}
              </button>
            ))}
          </div>
        ) : null}

        {question.type === "text" ? (
          <textarea
            value={typeof answers[question.id] === "string" ? (answers[question.id] as string) : ""}
            onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
            className="min-h-40 w-full rounded-3xl border border-slate-200 px-5 py-4 outline-none"
            placeholder="Add details"
          />
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setStep((current) => Math.max(0, current - 1))}
          className="min-h-12 rounded-2xl bg-slate-100 font-semibold text-slate-700"
        >
          Back
        </button>
        {step < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((current) => Math.min(questions.length - 1, current + 1))}
            className="min-h-12 rounded-2xl bg-teal-600 font-semibold text-white"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="min-h-12 rounded-2xl bg-slate-950 font-semibold text-white"
          >
            {submitting ? "Submitting..." : "Submit Check-In"}
          </button>
        )}
      </div>
    </div>
  );
}
