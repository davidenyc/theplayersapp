import { TopNav } from "@/components/layout/TopNav";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getMessagesPageData } from "@/lib/mock/selectors";
import { formatDate } from "@/lib/utils/formatters";

export default function MessagesPage() {
  const announcements = getMessagesPageData();

  return (
    <div className="space-y-6">
      <TopNav title="Messages" subtitle="Pinned announcements and team communication." />
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-950">{announcement.title}</h2>
              {announcement.pinned ? <Badge tone="info">Pinned</Badge> : null}
            </div>
            <div className="mt-2 text-sm text-slate-500">{formatDate(announcement.created_at)}</div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{announcement.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
