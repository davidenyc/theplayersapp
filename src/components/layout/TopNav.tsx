"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut, Repeat, Search } from "lucide-react";

import { useAuth } from "@/components/providers/AuthProvider";
import { useTeam } from "@/components/providers/TeamProvider";
import { Avatar } from "@/components/ui/Avatar";
import { demoUsers, getProfileByEmail, teamU19, teamYouth } from "@/lib/mock/data";

type TopNavProps = {
  title: string;
  subtitle?: string;
  userName?: string;
  roleLabel?: string;
};

export function TopNav({ title, subtitle, userName = "Marcus Webb", roleLabel = "Coach view" }: TopNavProps) {
  const router = useRouter();
  const { profile, isDemo, setAuthState, clearAuthState } = useAuth();
  const { setActiveTeam } = useTeam();

  function switchRole(role: "coach" | "player") {
    const selected = role === "coach" ? demoUsers.coach : demoUsers.player;
    const nextProfile = getProfileByEmail(selected.email);
    if (!nextProfile) return;
    const nextTeam = role === "coach" ? teamU19 : nextProfile.id.includes("youth") ? teamYouth : teamU19;
    setActiveTeam(nextTeam);
    setAuthState({ profile: nextProfile, teamId: nextTeam.id });
    document.cookie = "demo-session=1; path=/; SameSite=Lax";
    router.push("/dashboard");
  }

  async function logout() {
    clearAuthState();
    document.cookie = "demo-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-3 md:justify-end">
        {isDemo ? (
          <div className="flex flex-wrap items-center gap-2 rounded-[22px] bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
            <button type="button" onClick={() => switchRole("coach")} className="min-h-10 rounded-full bg-slate-950 px-4 text-xs font-semibold text-white">Coach</button>
            <button type="button" onClick={() => switchRole("player")} className="min-h-10 rounded-full bg-slate-100 px-4 text-xs font-semibold text-slate-700">Player</button>
            <button type="button" onClick={logout} className="flex min-h-10 items-center gap-2 rounded-full bg-rose-50 px-4 text-xs font-semibold text-rose-700"><LogOut className="h-4 w-4" />Log out</button>
          </div>
        ) : null}
        <div className="hidden min-h-11 min-w-[240px] items-center gap-2 rounded-full bg-white px-4 shadow-sm ring-1 ring-slate-200 lg:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-400">Search players, surveys, notes</span>
        </div>
        <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
          <Bell className="h-5 w-5 text-slate-600" />
        </button>
        <div className="flex min-h-11 items-center gap-3 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
          <Avatar name={userName} />
          <div className="hidden md:block">
            <div className="text-sm font-semibold text-slate-900">{profile?.full_name ?? userName}</div>
            <div className="flex items-center gap-1 text-xs text-slate-500"><Repeat className="h-3.5 w-3.5" />{roleLabel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
