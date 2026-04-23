import Link from "next/link";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

type PlayerCardProps = {
  id: string;
  name: string;
  position: string;
  status: "submitted" | "missed" | "flagged";
};

export function PlayerCard({ id, name, position, status }: PlayerCardProps) {
  const tone = status === "submitted" ? "success" : status === "flagged" ? "warning" : "danger";

  return (
    <Link href={`/roster/${id}`}>
      <Card className="transition hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={name} />
            <div>
              <div className="font-semibold text-slate-900">{name}</div>
              <div className="text-sm text-slate-500">{position}</div>
            </div>
          </div>
          <Badge tone={tone}>{status}</Badge>
        </div>
      </Card>
    </Link>
  );
}
