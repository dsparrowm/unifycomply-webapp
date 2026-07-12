import type { KycPriority, KycVerificationStatus } from "@/types/kyc";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  KycVerificationStatus,
  { label: string; className: string }
> = {
  approved: {
    label: "Approved",
    className: "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]",
  },
  pending: {
    label: "Pending",
    className: "bg-[color:var(--state-info-soft)] text-[color:var(--state-info)]",
  },
  rejected: {
    label: "Rejected",
    className: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  },
  "in-review": {
    label: "In Review",
    className: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  },
  escalated: {
    label: "Escalated",
    className: "bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary)]",
  },
};

type KycStatusBadgeProps = {
  status: KycVerificationStatus;
  uppercase?: boolean;
};

export function KycStatusBadge({ status, uppercase = false }: KycStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        uppercase && "font-semibold uppercase tracking-wide",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}

const priorityConfig: Record<KycPriority, { label: string; className: string }> = {
  low: {
    label: "Low",
    className: "bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]",
  },
  medium: {
    label: "Medium",
    className: "bg-[color:var(--state-info-soft)] text-[color:var(--state-info)]",
  },
  high: {
    label: "High",
    className: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  },
  critical: {
    label: "Critical",
    className: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  },
};

type KycPriorityBadgeProps = {
  priority: KycPriority;
};

export function KycPriorityBadge({ priority }: KycPriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
