import { CheckInForm } from "@/components/player/CheckInForm";
import { TopNav } from "@/components/layout/TopNav";

export default function CheckinPage() {
  return (
    <div className="space-y-6">
      <TopNav title="Daily Check-In" subtitle="Player-facing wellness flow optimized for mobile." userName="Liam Carter" />
      <CheckInForm />
    </div>
  );
}
