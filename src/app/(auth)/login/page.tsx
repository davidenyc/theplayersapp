"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { getDashboardRoute, useAuth } from "@/components/providers/AuthProvider";
import { Card } from "@/components/ui/Card";
import { demoUsers, getProfileByEmail } from "@/lib/mock/data";
import { createClient } from "@/lib/supabase/client";
import { getTodayResponseForPlayer } from "@/lib/supabase/queries";
import type { Profile } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const { setAuthState } = useAuth();
  const [email, setEmail] = useState(demoUsers.coach.email);
  const [password, setPassword] = useState(demoUsers.coach.password);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function enterDemo(role: "coach" | "player") {
    const selected = role === "coach" ? demoUsers.coach : demoUsers.player;
    const profile = getProfileByEmail(selected.email);

    if (!profile) {
      setError("Demo profile not found.");
      return;
    }

    setAuthState({
      profile,
      teamId: "team_u19_men",
    });
    document.cookie = "demo-session=1; path=/; SameSite=Lax";
    router.push(role === "coach" ? "/dashboard" : "/checkin");
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const hasEnv =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("demo.supabase.co");

    let teamId: string | null = null;
    let profile: Profile | null = null;

    if (hasEnv) {
      const { data: signInData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      const { data: profileRaw, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", signInData.user.id)
        .single();
      const profileData = (profileRaw ?? null) as Profile | null;

      if (profileError || !profileData) {
        setError(profileError?.message ?? "Profile not found.");
        setLoading(false);
        return;
      }

      profile = profileData;
      if (profile.role === "coach" || profile.role === "admin") {
        const { data: coachRaw } = await supabase
          .from("coach_profiles")
          .select("team_id")
          .eq("user_id", profile.id)
          .single();
        const coach = (coachRaw ?? null) as { team_id: string } | null;
        teamId = coach?.team_id ?? null;
      } else {
        const { data: playerRaw } = await supabase
          .from("player_profiles")
          .select("team_id")
          .eq("user_id", profile.id)
          .single();
        const player = (playerRaw ?? null) as { team_id: string } | null;
        teamId = player?.team_id ?? null;
      }
    } else if (password !== "demo12345") {
      setError("Use the demo password: demo12345");
      setLoading(false);
      return;
    }

    profile = profile ?? getProfileByEmail(email) ?? null;
    if (!profile) {
      setError("No profile found for that email.");
      setLoading(false);
      return;
    }

    if (!teamId && profile.role === "coach") {
      teamId = "team_u19_men";
    }

    let hasTodayResponse = false;
    if (hasEnv && profile.role === "player") {
      hasTodayResponse = !!(await getTodayResponseForPlayer(profile.id));
    }

    setAuthState({ profile, teamId });
    document.cookie = "demo-session=1; path=/; SameSite=Lax";
    router.push(getDashboardRoute(profile.role, hasTodayResponse));
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-6 md:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[36px] bg-slate-950 p-8 text-white">
          <div className="text-xs uppercase tracking-[0.28em] text-teal-300">Athlete Platform</div>
          <h1 className="mt-4 max-w-md text-5xl font-semibold leading-[1.05]">
            One place for team ops, readiness, and player growth.
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-7 text-slate-300">
            Coaches get daily visibility into attendance, flags, and performance trends. Players get
            a mobile-first flow for check-ins, goals, notes, and highlights.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => void enterDemo("coach")}
              className="rounded-[28px] bg-white/10 p-5 text-left transition hover:bg-white/15"
            >
              <div className="text-sm text-slate-400">Coach demo</div>
              <div className="mt-2 font-semibold">{demoUsers.coach.email}</div>
              <div className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
                Enter coach app
              </div>
            </button>
            <button
              type="button"
              onClick={() => void enterDemo("player")}
              className="rounded-[28px] bg-white/10 p-5 text-left transition hover:bg-white/15"
            >
              <div className="text-sm text-slate-400">Player demo</div>
              <div className="mt-2 font-semibold">{demoUsers.player.email}</div>
              <div className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
                Enter player app
              </div>
            </button>
          </div>
        </div>
        <Card className="self-center p-8">
          <h2 className="text-3xl font-semibold text-slate-950">Sign in</h2>
          <p className="mt-2 text-sm text-slate-500">Use direct demo entry above, or sign in with Supabase credentials below.</p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none"
              />
            </label>
            {error ? <div className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
            <button
              type="submit"
              disabled={loading}
              className="min-h-12 w-full rounded-2xl bg-slate-950 text-sm font-semibold text-white"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
