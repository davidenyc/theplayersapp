import Image from "next/image";
import { Pin } from "lucide-react";

import { Card } from "@/components/ui/Card";
import type { Highlight } from "@/types";

type HighlightCardProps = {
  highlight: Highlight;
};

export function HighlightCard({ highlight }: HighlightCardProps) {
  return (
    <Card className="overflow-hidden p-0">
      {highlight.thumbnail_url ? (
        <Image
          src={highlight.thumbnail_url}
          alt={highlight.title}
          width={640}
          height={320}
          className="h-44 w-full object-cover"
        />
      ) : null}
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">{highlight.title}</h3>
          {highlight.is_pinned ? <Pin className="h-4 w-4 text-amber-500" /> : null}
        </div>
        <p className="mt-2 text-sm text-slate-600">{highlight.description}</p>
        <a href={highlight.url} className="mt-4 inline-flex text-sm font-semibold text-teal-700">
          Open clip
        </a>
      </div>
    </Card>
  );
}
