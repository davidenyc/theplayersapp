"use client";

import { useMemo } from "react";

import { coachProfiles, playerProfiles } from "@/lib/mock/data";

export function useUser(role: "coach" | "player" = "coach") {
  return useMemo(() => (role === "coach" ? coachProfiles[0] : playerProfiles[0]), [role]);
}
