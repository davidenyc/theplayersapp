import { format, formatDistanceToNowStrict, isToday, parseISO } from "date-fns";

export function formatDate(value?: string) {
  if (!value) return "N/A";
  return format(parseISO(value), "MMM d, yyyy");
}

export function formatDateTime(value?: string) {
  if (!value) return "N/A";
  return format(parseISO(value), "EEE, MMM d · h:mm a");
}

export function formatRelative(value?: string) {
  if (!value) return "N/A";
  const date = parseISO(value);
  if (isToday(date)) return `Today · ${format(date, "h:mm a")}`;
  return formatDistanceToNowStrict(date, { addSuffix: true });
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatMetric(value?: number, unit?: string) {
  if (value === undefined || value === null) return "N/A";
  return unit ? `${value} ${unit}` : `${value}`;
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
