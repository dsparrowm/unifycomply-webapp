import type { SettingsTeamMemberStatus } from "@/types/settings";
import { cn } from "@/lib/utils";

const statusStyles: Record<
  SettingsTeamMemberStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className:
      "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]",
  },
  removed: {
    label: "Removed",
    className: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  },
  pending: {
    label: "Pending",
    className:
      "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  },
};

type TeamMemberStatusBadgeProps = {
  status: SettingsTeamMemberStatus;
};

export function TeamMemberStatusBadge({ status }: TeamMemberStatusBadgeProps) {
  const { label, className } = statusStyles[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        className,
      )}
    >
      {label}
    </span>
  );
}
