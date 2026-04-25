import type { ReactNode } from "react";

import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-4 py-4 md:px-6">
      <Sidebar />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <MobileNav />
    </div>
  );
}
