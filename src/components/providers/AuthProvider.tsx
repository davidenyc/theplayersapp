"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Profile, Role } from "@/types";

type AuthState = {
  profile: Profile | null;
  teamId: string | null;
  isDemo: boolean;
  loading: boolean;
  setAuthState: (next: { profile: Profile | null; teamId: string | null }) => void;
  clearAuthState: () => void;
};

const STORAGE_KEY = "athlete-platform-auth";
const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { profile: Profile | null; teamId: string | null; isDemo?: boolean };
        setProfile(parsed.profile);
        setTeamId(parsed.teamId);
        setIsDemo(Boolean(parsed.isDemo));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) return;

      const { data: nextProfileData } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      const nextProfile = (nextProfileData ?? null) as Profile | null;
      if (!nextProfile) return;

      let nextTeamId: string | null = null;
      if (nextProfile.role === "coach") {
        const { data: coachData } = await supabase.from("coach_profiles").select("team_id").eq("user_id", nextProfile.id).single();
        nextTeamId = ((coachData ?? null) as { team_id: string } | null)?.team_id ?? null;
      } else if (nextProfile.role === "player") {
        const { data: playerData } = await supabase.from("player_profiles").select("team_id").eq("user_id", nextProfile.id).single();
        nextTeamId = ((playerData ?? null) as { team_id: string } | null)?.team_id ?? null;
      }

      setProfile(nextProfile);
      setTeamId(nextTeamId);
      setIsDemo(false);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile: nextProfile, teamId: nextTeamId, isDemo: false }));
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      profile,
      teamId,
      isDemo,
      loading,
      setAuthState: (next) => {
        setProfile(next.profile);
        setTeamId(next.teamId);
        const nextIsDemo = Boolean(next.profile?.email.includes("@club.demo"));
        setIsDemo(nextIsDemo);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...next, isDemo: nextIsDemo }));
      },
      clearAuthState: () => {
        setProfile(null);
        setTeamId(null);
        setIsDemo(false);
        window.localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [isDemo, loading, profile, teamId],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export function getDashboardRoute(role: Role, hasTodayResponse: boolean) {
  if (role === "coach" || role === "admin") return "/dashboard";
  return hasTodayResponse ? "/dashboard" : "/checkin";
}
