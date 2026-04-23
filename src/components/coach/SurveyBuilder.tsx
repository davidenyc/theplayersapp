"use client";

import { useState } from "react";

import { useAuth } from "@/components/providers/AuthProvider";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import type { Database, SurveyQuestion, SurveyTemplate } from "@/types";

type SurveyBuilderProps = {
  questions: SurveyQuestion[];
};

export function SurveyBuilder({ questions }: SurveyBuilderProps) {
  const supabase = createClient();
  const { profile, teamId } = useAuth();
  const [draft, setDraft] = useState(questions);
  const [name, setName] = useState("Daily Wellness Check-In");
  const [deadline, setDeadline] = useState("09:30");
  const [recurrence, setRecurrence] = useState("daily");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function saveSurvey() {
    if (!profile || !teamId) {
      setStatus("You need a valid coach session to save a survey.");
      return;
    }

    setSaving(true);
    setStatus(null);

    const templatePayload: Database["public"]["Tables"]["survey_templates"]["Insert"] = {
      id: crypto.randomUUID(),
      team_id: teamId,
      created_by: profile.id,
      name,
      description: null as never,
      questions: draft,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const { data: templateRaw, error: templateError } = await (supabase
      .from("survey_templates") as any)
      .insert(templatePayload)
      .select()
      .single();
    const template = (templateRaw ?? null) as SurveyTemplate | null;

    if (templateError || !template) {
      setStatus(templateError?.message ?? "Failed to save survey template.");
      setSaving(false);
      return;
    }

    const assignmentPayload: Database["public"]["Tables"]["survey_assignments"]["Insert"] = {
      id: crypto.randomUUID(),
      template_id: template.id,
      team_id: teamId,
      assigned_by: profile.id,
      deadline_time: deadline,
      recurrence: recurrence as "daily" | "weekdays" | "weekly",
      active_from: new Date().toISOString().slice(0, 10),
      is_active: true,
    };

    const { error: assignmentError } = await (supabase.from("survey_assignments") as any).insert(
      assignmentPayload,
    );

    if (assignmentError) {
      setStatus(assignmentError.message);
      setSaving(false);
      return;
    }

    setStatus("Survey template and assignment saved.");
    setSaving(false);
  }

  return (
    <Card>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Template name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="min-h-11 w-full rounded-2xl border border-slate-200 px-4 outline-none"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Deadline time</span>
          <input
            type="time"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
            className="min-h-11 w-full rounded-2xl border border-slate-200 px-4 outline-none"
          />
        </label>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_180px]">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Recurrence</span>
          <select
            value={recurrence}
            onChange={(event) => setRecurrence(event.target.value)}
            className="min-h-11 w-full rounded-2xl border border-slate-200 px-4 outline-none"
          >
            <option value="daily">Daily</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>
        <button
          type="button"
          onClick={() =>
            setDraft((current) => [
              ...current,
              {
                id: `custom_${current.length + 1}`,
                label: "Custom note",
                type: "text",
                required: false,
              },
            ])
          }
          className="min-h-11 self-end rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white"
        >
          Add Question
        </button>
      </div>
      <div className="mt-6 space-y-3">
        {draft.map((question) => (
          <div
            key={question.id}
            className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_110px_110px]"
          >
            <div>
              <div className="font-medium text-slate-900">{question.label}</div>
              <div className="text-sm text-slate-500">
                {question.type} {question.required ? "• required" : "• optional"}
              </div>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
              Low: {question.flag_below ?? "-"}
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
              High: {question.flag_above ?? "-"}
            </div>
          </div>
        ))}
      </div>
      {status ? <div className="mt-4 text-sm text-slate-600">{status}</div> : null}
      <button
        type="button"
        onClick={saveSurvey}
        disabled={saving}
        className="mt-6 min-h-11 rounded-2xl bg-teal-600 px-5 text-sm font-semibold text-white"
      >
        {saving ? "Saving..." : "Save Template & Assignment"}
      </button>
    </Card>
  );
}
