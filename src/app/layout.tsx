import type { Metadata } from "next";

import { AppModeProvider } from "@/components/providers/AppModeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { TeamProvider } from "@/components/providers/TeamProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Players App",
  description: "Mobile-first team operations and player performance dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <TeamProvider>
            <AppModeProvider>{children}</AppModeProvider>
          </TeamProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
