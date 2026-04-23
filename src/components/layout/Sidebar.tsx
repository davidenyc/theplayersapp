import Link from "next/link";
import { Activity, Calendar, ClipboardList, LayoutDashboard, Trophy, UserRound } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/roster", label: "Roster", icon: UserRound },
  { href: "/surveys", label: "Survey", icon: ClipboardList },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/profile", label: "Profile", icon: Trophy },
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 rounded-[32px] bg-slate-950 p-6 text-white md:flex md:flex-col">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20">
          <Activity className="h-6 w-6 text-teal-300" />
        </div>
        <div>
          <div className="text-sm uppercase tracking-[0.24em] text-slate-400">Northgate FC</div>
          <div className="text-lg font-semibold">Performance Hub</div>
        </div>
      </div>
      <nav className="mt-10 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href as any}
              className="flex min-h-11 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-[24px] bg-white/10 p-4 text-sm text-slate-300">
        Daily wellness forms close at 9:30 AM. Flagged athletes surface at the top of coach dashboards.
      </div>
    </aside>
  );
}
