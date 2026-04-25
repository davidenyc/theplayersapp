import type { SurveyQuestion } from "@/types";

export const DEFAULT_WELLNESS_QUESTIONS: SurveyQuestion[] = [
  { id: "sleep_hours", label: "Hours of sleep last night", type: "scale", min: 4, max: 10, required: true, flag_below: 6 },
  { id: "sleep_quality", label: "Sleep quality", type: "scale", min: 1, max: 10, required: true, flag_below: 4 },
  { id: "energy", label: "Energy level", type: "scale", min: 1, max: 10, required: true, flag_below: 3 },
  { id: "soreness", label: "Muscle soreness", type: "scale", min: 1, max: 10, required: true, flag_above: 8 },
  { id: "stress", label: "Stress level", type: "scale", min: 1, max: 10, required: true, flag_above: 8 },
  { id: "mood", label: "Mood", type: "scale", min: 1, max: 10, required: true, flag_below: 3 },
  { id: "confidence", label: "Confidence", type: "scale", min: 1, max: 10, required: false },
  { id: "pain_reported", label: "Any pain or injury?", type: "boolean", required: true, flag_above: 0 },
  { id: "readiness", label: "Readiness to train", type: "scale", min: 1, max: 10, required: true, flag_below: 4 },
];

export const PRE_MATCH_U19_QUESTIONS: SurveyQuestion[] = [
  { id: "pm_sleep", label: "Sleep last night", type: "scale", min: 1, max: 10, required: true, flag_below: 5 },
  { id: "pm_energy", label: "Energy right now", type: "scale", min: 1, max: 10, required: true, flag_below: 4 },
  { id: "pm_motivation", label: "Motivation to compete", type: "scale", min: 1, max: 10, required: true, flag_below: 3 },
  { id: "pm_anxiety", label: "Nerves / anxiety", type: "scale", min: 1, max: 10, required: false },
  { id: "pm_pain", label: "Any pain or tightness?", type: "boolean", required: true, flag_above: 0 },
  { id: "pm_ready", label: "Ready to play?", type: "scale", min: 1, max: 10, required: true, flag_below: 5 },
];

export const POST_TRAINING_RPE_QUESTIONS: SurveyQuestion[] = [
  { id: "rpe", label: "Session effort (RPE)", type: "scale", min: 1, max: 10, required: true },
  { id: "pt_soreness", label: "Muscle soreness", type: "scale", min: 1, max: 10, required: true, flag_above: 8 },
  { id: "pt_energy", label: "Energy after session", type: "scale", min: 1, max: 10, required: true, flag_below: 3 },
  { id: "pt_focus", label: "Focus during training", type: "scale", min: 1, max: 10, required: false },
  { id: "pt_pain", label: "Any new pain?", type: "boolean", required: true, flag_above: 0 },
];

export const WEEKLY_REFLECTION_QUESTIONS: SurveyQuestion[] = [
  { id: "wk_effort", label: "Effort this week", type: "scale", min: 1, max: 10, required: true },
  { id: "wk_progress", label: "Progress toward goals", type: "scale", min: 1, max: 10, required: true },
  { id: "wk_coachability", label: "Open to feedback this week", type: "scale", min: 1, max: 10, required: false },
  { id: "wk_highlight", label: "Best moment this week", type: "text", required: false },
  { id: "wk_improve", label: "One thing to improve", type: "text", required: false },
];

export const RECOVERY_CHECKIN_QUESTIONS: SurveyQuestion[] = [
  { id: "rec_sleep", label: "Sleep quality", type: "scale", min: 1, max: 10, required: true, flag_below: 4 },
  { id: "rec_soreness", label: "Body soreness", type: "scale", min: 1, max: 10, required: true, flag_above: 8 },
  { id: "rec_nutrition", label: "Nutrition today", type: "scale", min: 1, max: 10, required: false },
  { id: "rec_hydration", label: "Hydration", type: "scale", min: 1, max: 10, required: false },
  { id: "rec_mood", label: "Mood", type: "scale", min: 1, max: 10, required: true, flag_below: 3 },
];

export const YOUTH_DAILY_CHECKIN_QUESTIONS: SurveyQuestion[] = [
  { id: "y_sleep", label: "Hours of sleep last night", type: "scale", min: 4, max: 10, required: true, flag_below: 6 },
  { id: "y_sleep_qual", label: "Sleep quality", type: "scale", min: 1, max: 10, required: true, flag_below: 4 },
  { id: "y_energy", label: "Energy level", type: "scale", min: 1, max: 10, required: true, flag_below: 3 },
  { id: "y_soreness", label: "Muscle soreness", type: "scale", min: 1, max: 10, required: true, flag_above: 8 },
  { id: "y_mood", label: "Mood", type: "scale", min: 1, max: 10, required: true, flag_below: 3 },
  { id: "y_pain", label: "Any pain or injury?", type: "boolean", required: true, flag_above: 0 },
];

export const YOUTH_PRE_MATCH_QUESTIONS: SurveyQuestion[] = [
  { id: "ypm_sleep", label: "Sleep last night", type: "scale", min: 1, max: 10, required: true, flag_below: 5 },
  { id: "ypm_energy", label: "Energy level", type: "scale", min: 1, max: 10, required: true, flag_below: 4 },
  { id: "ypm_excitement", label: "Excitement to play", type: "scale", min: 1, max: 10, required: true },
  { id: "ypm_nerves", label: "Nerves", type: "scale", min: 1, max: 10, required: false },
  { id: "ypm_pain", label: "Any pain or injury?", type: "boolean", required: true, flag_above: 0 },
];

export const YOUTH_POST_MATCH_QUESTIONS: SurveyQuestion[] = [
  { id: "ypom_effort", label: "Effort during the match", type: "scale", min: 1, max: 10, required: true },
  { id: "ypom_tiredness", label: "How tired are you now?", type: "scale", min: 1, max: 10, required: true, flag_above: 8 },
  { id: "ypom_execution", label: "How well did you play?", type: "scale", min: 1, max: 10, required: true },
  { id: "ypom_enjoyment", label: "Enjoyment", type: "scale", min: 1, max: 10, required: false },
  { id: "ypom_pain", label: "Any pain or injury?", type: "boolean", required: true, flag_above: 0 },
];

export const YOUTH_POST_TRAINING_QUESTIONS: SurveyQuestion[] = [
  { id: "ypt_effort", label: "Training effort", type: "scale", min: 1, max: 10, required: true },
  { id: "ypt_soreness", label: "Muscle soreness", type: "scale", min: 1, max: 10, required: true, flag_above: 8 },
  { id: "ypt_energy", label: "Energy after training", type: "scale", min: 1, max: 10, required: true, flag_below: 3 },
  { id: "ypt_focus", label: "Focus during training", type: "scale", min: 1, max: 10, required: false },
  { id: "ypt_pain", label: "Any pain or injury?", type: "boolean", required: true, flag_above: 0 },
];
