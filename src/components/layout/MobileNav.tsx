"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bluetooth, Calendar, ClipboardList, Flag, Heart, LayoutDashboard, Trophy, UserRound } from "lucide-react";

import { useAppMode } from "@/components/providers/AppModeProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTeam } from "@/components/providers/TeamProvider";

const standardItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/roster", label: "Roster", icon: UserRound },
  { href: "/surveys", label: "Surveys", icon: ClipboardList },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/profile", label: "Profile", icon: Trophy },
];

const gamedayItems = [
  { href: "/gameday/lineup", label: "Lineup", icon: Flag },
  { href: "/gameday/match", label: "Match", icon: LayoutDashboard },
  { href: "/gameday/postmatch", label: "Review", icon: ClipboardList },
  { href: "/health", label: "Health", icon: Heart },
  { href: "/profile", label: "Profile", icon: Trophy },
];

export function MobileNav() {
  const pathname = usePathname();
  const { mode } = useAppMode();
  const { profile } = useAuth();
  const { teams, activeTeam, setActiveTeam } = useTeam();
  const isCoach = profile?.role !== "player";
  const items = isCoach && mode === "gameday" ? gamedayItems : standardItems;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-2 backdrop-blur md:hidden">
      {isCoach ? (
        <div className="mb-2 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
          <div className="text-sm font-semibold text-slate-900">Players App</div>
          <div className="flex gap-2">
            {teams.map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => setActiveTeam(team)}
                className={team.id === activeTeam.id ? "rounded-xl bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-700" : "rounded-xl px-3 py-1 text-xs text-slate-500"}
              >
                {team.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href as any}
              className={`flex min-h-11 flex-col items-center justify-center rounded-2xl text-[11px] font-medium ${active ? "bg-slate-950 text-white" : "text-slate-600"}`}
            >
              <Icon className="mb-1 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
      <Link href={"/settings/devices" as any} className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-slate-50 text-xs font-semibold text-slate-600">
        <Bluetooth className="h-4 w-4" />
        Devices
      </Link>
    </nav>
  );
}
