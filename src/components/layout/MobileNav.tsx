import Link from "next/link";
import { Calendar, ClipboardList, LayoutDashboard, Shield, UserRound } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/roster", label: "Roster", icon: UserRound },
  { href: "/surveys", label: "Survey", icon: ClipboardList },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/profile", label: "Profile", icon: Shield },
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-2 backdrop-blur md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href as any}
              className="flex min-h-11 flex-col items-center justify-center rounded-2xl text-[11px] font-medium text-slate-600"
            >
              <Icon className="mb-1 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
