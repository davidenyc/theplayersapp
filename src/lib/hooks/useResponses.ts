"use client";

import { useMemo } from "react";

import { surveyResponses } from "@/lib/mock/data";

export function useResponses() {
  return useMemo(() => surveyResponses, []);
}
