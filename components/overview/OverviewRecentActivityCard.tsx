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
                {activity.timestamp}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
