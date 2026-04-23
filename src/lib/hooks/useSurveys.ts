"use client";

import { useMemo } from "react";

import { surveyAssignment, surveyTemplate } from "@/lib/mock/data";

export function useSurveys() {
  return useMemo(() => ({ templates: [surveyTemplate], assignments: [surveyAssignment] }), []);
}
