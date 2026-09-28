import { Clock3 } from "lucide-react";
import type { OverviewActivityItem, OverviewActivityTone } from "@/types/overview";
import { OverviewSectionHeader } from "@/components/overview/OverviewSectionHeader";

type OverviewRecentActivityCardProps = {
  activities: OverviewActivityItem[];
};

const toneBorderColors: Record<OverviewActivityTone, string> = {
  success: "border-l-[color:var(--state-success)]",
  warning: "border-l-[color:var(--state-warning)]",
  info: "border-l-[color:var(--state-info)]",
  neutral: "border-l-[color:var(--text-light)]",
};

function formatActivityTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (elapsedSeconds < 60) return "Just now";

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} minute${elapsedMinutes === 1 ? "" : "s"} ago`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    return `${elapsedHours} hour${elapsedHours === 1 ? "" : "s"} ago`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);
  if (elapsedDays < 7) {
    return `${elapsedDays} day${elapsedDays === 1 ? "" : "s"} ago`;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  }).format(date);
}

export function OverviewRecentActivityCard({ activities }: OverviewRecentActivityCardProps) {
  return (
    <section className="flex min-h-[394px] flex-col rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <OverviewSectionHeader
        icon={Clock3}
        iconTone="neutral"
        title="Recent Activity"
        action={
          <button
            type="button"
            className="text-sm text-[color:var(--accent-primary-hover)] hover:underline"
          >
            View Logs
          </button>
        }
      />

      {activities.length === 0 ? (
        <p className="mt-20 text-xs text-[color:var(--text-light)]">No recent activity</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className={`border-l-2 pl-3 ${toneBorderColors[activity.tone]}`}
            >
              <p className="text-sm font-medium text-[color:var(--text-primary)]">
                {activity.message}
              </p>
              <p className="mt-1 text-xs text-[color:var(--text-muted)]">{activity.user}</p>
              <p className="mt-0.5 text-xs text-[color:var(--text-light)]">
                {formatActivityTime(activity.timestamp)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
