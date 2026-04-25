"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bluetooth,
  Calendar,
  CheckCircle,
  ClipboardList,
  Dumbbell,
  FileText,
  Flag,
  Heart,
  LayoutDashboard,
  Layers,
  PauseCircle,
  Timer,
  Trophy,
  UserCheck,
  UserRound,
  Zap,
} from "lucide-react";

import { useAppMode } from "@/components/providers/AppModeProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTeam } from "@/components/providers/TeamProvider";
import type { AppMode } from "@/types";

type NavItem = { href: string; label: string; icon: any };

const navItemsByMode: Record<AppMode, NavItem[]> = {
  standard: [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/roster", label: "Roster", icon: UserRound },
    { href: "/surveys", label: "Surveys", icon: ClipboardList },
    { href: "/health", label: "Health", icon: Heart },
    { href: "/schedule", label: "Schedule", icon: Calendar },
    { href: "/profile", label: "Profile", icon: Trophy },
  ],
  practice: [
    { href: "/practice/plan", label: "Session Plan", icon: Layers },
    { href: "/practice/attendance", label: "Attendance", icon: UserCheck },
    { href: "/practice/load", label: "Load Check", icon: Activity },
    { href: "/practice/notes", label: "Session Notes", icon: FileText },
    { href: "/roster", label: "Roster", icon: UserRound },
  ],
  gameday: [
    { href: "/gameday/lineup", label: "Lineup", icon: Flag },
    { href: "/gameday/prematch", label: "Pre-Match", icon: Zap },
    { href: "/gameday/match", label: "Match", icon: Timer },
    { href: "/gameday/halftime", label: "Half Time", icon: PauseCircle },
    { href: "/gameday/postmatch", label: "Post-Match", icon: CheckCircle },
  ],
};

const modeMeta = {
  standard: { bg: "bg-teal-500/20", text: "text-teal-300", active: "bg-white/15 text-white", icon: LayoutDashboard },
  practice: { bg: "bg-sky-500/20", text: "text-sky-300", active: "bg-sky-500/15 text-sky-200", icon: Dumbbell },
  gameday: { bg: "bg-amber-500/20", text: "text-amber-300", active: "bg-amber-500/15 text-amber-200", icon: Flag },
} as const;

export function Sidebar() {
  const pathname = usePathname();
  const { mode, setMode } = useAppMode();
  const { teams, activeTeam, setActiveTeam } = useTeam();
  const { profile } = useAuth();
  const isCoach = profile?.role !== "player";
  const items = isCoach ? navItemsByMode[mode] : navItemsByMode.standard;
  const meta = modeMeta[mode];
  const AccentIcon = meta.icon;

  return (
    <aside className="hidden w-72 rounded-[32px] bg-slate-950 p-6 text-white md:flex md:flex-col">
      <div className="space-y-5">
        {isCoach ? (
          <div>
            <div className="mb-2 text-xs uppercase tracking-widest text-slate-400">Mode</div>
            <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white/5 p-1">
              {([
                ["standard", "Standard", LayoutDashboard],
                ["practice", "Practice", Dumbbell],
                ["gameday", "Game Day", Flag],
              ] as const).map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-2 text-xs font-semibold ${mode === value ? meta.active : "text-slate-400 hover:text-white"}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${meta.bg}`}>
            <AccentIcon className={`h-6 w-6 ${meta.text}`} />
          </div>
          <div>
            <div className="text-lg font-semibold">Players App</div>
          </div>
        </div>

        {isCoach ? (
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-400">Team</div>
            <div className="mt-2 flex gap-2">
              {teams.map((team) => (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => setActiveTeam(team)}
                  className={team.id === activeTeam.id ? "rounded-xl bg-teal-500/20 px-3 py-1.5 text-sm font-semibold text-teal-300" : "rounded-xl px-3 py-1.5 text-sm text-slate-400 hover:text-white"}
                >
                  {team.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <nav className="mt-8 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href as any}
              className={`flex min-h-11 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? meta.active : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4">
        <Link href={"/settings/devices" as any} className="flex min-h-11 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/10 hover:text-white">
          <Bluetooth className="h-5 w-5" />
          Devices
        </Link>
      </div>

      <div className="mt-auto rounded-[24px] bg-white/10 p-4 text-sm text-slate-300">
        Wellness forms close at 9:30 AM.
      </div>
    </aside>
  );
}
