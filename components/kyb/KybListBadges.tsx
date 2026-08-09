import type { KybPriority, KybVerificationStatus } from "@/types/kyb";
import { cn } from "@/lib/utils";

const listStatusConfig: Record<
  KybVerificationStatus,
  { label: string; className: string }
> = {
  approved: {
    label: "Verified",
    className: "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]",
  },
  pending: {
    label: "Pending",
    className: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  },
  rejected: {
    label: "Failed",
    className: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  },
  "in-review": {
    label: "In Review",
    className: "bg-[color:var(--state-info-soft)] text-[color:var(--state-info)]",
  },
  escalated: {
    label: "Escalated",
    className: "bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary)]",
  },
};

const listPriorityConfig: Record<KybPriority, { label: string; className: string }> = {
  critical: {
    label: "Urgent",
    className: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  },
  high: {
    label: "High",
    className: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-error)]",
  },
  medium: {
    label: "Medium",
    className: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  },
  low: {
    label: "Standard",
    className: "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]",
  },
};

type KybListStatusBadgeProps = {
  status: KybVerificationStatus;
};

export function KybListStatusBadge({ status }: KybListStatusBadgeProps) {
  const config = listStatusConfig[status];

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

type KybListPriorityBadgeProps = {
  priority: KybPriority;
};

export function KybListPriorityBadge({ priority }: KybListPriorityBadgeProps) {
  const config = listPriorityConfig[priority];

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

export function kybRiskScoreClassName(score: number): string {
  if (score <= 0) {
    return "text-[color:var(--state-success)]";
  }

  if (score === 1) {
    return "text-[color:var(--state-info)]";
  }

  if (score <= 2) {
    return "text-[color:var(--state-warning)]";
  }

  return "text-[color:var(--state-error)]";
}
