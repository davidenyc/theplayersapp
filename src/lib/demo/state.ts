"use client";

import type { Attendance, SurveyResponse } from "@/types";

const DEMO_RESPONSES_KEY = "athlete-platform-demo-responses";
const DEMO_ATTENDANCE_KEY = "athlete-platform-demo-attendance";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getDemoResponses(): SurveyResponse[] {
  return readJson<SurveyResponse[]>(DEMO_RESPONSES_KEY, []);
}

export function saveDemoResponse(response: SurveyResponse) {
  const current = getDemoResponses();
  const next = [response, ...current.filter((item) => item.id !== response.id)];
  writeJson(DEMO_RESPONSES_KEY, next);
}

export function getDemoAttendance(): Record<string, Attendance["status"]> {
  return readJson<Record<string, Attendance["status"]>>(DEMO_ATTENDANCE_KEY, {});
}

export function saveDemoAttendance(eventId: string, status: Attendance["status"]) {
  const current = getDemoAttendance();
  current[eventId] = status;
  writeJson(DEMO_ATTENDANCE_KEY, current);
}
