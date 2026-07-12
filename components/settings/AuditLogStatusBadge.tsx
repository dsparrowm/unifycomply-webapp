import type { SettingsAuditLogStatus } from "@/types/settings";
import { cn } from "@/lib/utils";

const statusStyles: Record<SettingsAuditLogStatus, { label: string; className: string }> = {
  completed: {
    label: "Completed",
    className:
      "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]",
  },
  failed: {
    label: "Failed",
    className: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  },
  pending: {
    label: "Pending",
    className:
      "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  },
};

type AuditLogStatusBadgeProps = {
  status: SettingsAuditLogStatus;
};

export function AuditLogStatusBadge({ status }: AuditLogStatusBadgeProps) {
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
