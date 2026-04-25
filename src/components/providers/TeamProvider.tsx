"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { teamU19, teamYouth } from "@/lib/mock/data";
import type { Team } from "@/types";

interface TeamContextValue {
  activeTeam: Team;
  setActiveTeam: (team: Team) => void;
  teams: Team[];
}

const STORAGE_KEY = "players-app-team";
const TeamContext = createContext<TeamContextValue | null>(null);

export function TeamProvider({ children }: { children: ReactNode }) {
  const teams = useMemo(() => [teamU19, teamYouth], []);
  const [activeTeam, setActiveTeamState] = useState<Team>(teamU19);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    const nextTeam = teams.find((team) => team.id === saved);
    if (nextTeam) setActiveTeamState(nextTeam);
  }, [teams]);

  function setActiveTeam(team: Team) {
    setActiveTeamState(team);
    window.localStorage.setItem(STORAGE_KEY, team.id);
  }

  return (
    <TeamContext.Provider value={{ activeTeam, setActiveTeam, teams }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used within TeamProvider");
  return ctx;
}
