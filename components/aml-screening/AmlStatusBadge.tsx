import { cn } from "@/lib/utils";
import type {
  AmlBatchRecordStatus,
  AmlPriority,
  AmlScreeningStatus,
  AmlScreeningType,
} from "@/types/aml-screening";

const screeningStatusConfig: Record<AmlScreeningStatus, { label: string; className: string }> = {
  flagged: {
    label: "Flagged",
    className: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  },
  clear: {
    label: "Clear",
    className: "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]",
  },
  "in-review": {
    label: "In Review",
    className: "bg-[color:var(--state-info-soft)] text-[color:var(--state-info)]",
  },
  blocked: {
    label: "Blocked",
    className: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  },
  escalated: {
    label: "Escalated",
    className: "bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary)]",
  },
  "case-created": {
    label: "Case Created",
    className: "bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary)]",
  },
};

const batchStatusConfig: Record<AmlBatchRecordStatus, { label: string; className: string }> = {
  successful: {
    label: "Successful",
    className: "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]",
  },
  review: {
    label: "Review",
    className: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  },
  "high-risk": {
    label: "High Risk",
    className: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  },
};

const screeningTypeConfig: Record<AmlScreeningType, { label: string; className: string }> = {
  batch: {
    label: "Batch",
    className: "bg-[color:var(--state-info-soft)] text-[color:var(--state-info)]",
  },
  automatic: {
    label: "Automatic",
    className: "bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]",
  },
  manual: {
    label: "Manual",
    className: "bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary)]",
  },
};

const priorityConfig: Record<AmlPriority, string> = {
  low: "bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]",
  medium: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  high: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  critical: "bg-[color:var(--state-error)] text-white",
};

const badgeClassName = "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium";

export function AmlStatusBadge({ status }: { status: AmlScreeningStatus }) {
  const config = screeningStatusConfig[status];
  return <span className={cn(badgeClassName, config.className)}>{config.label}</span>;
}

export function AmlBatchStatusBadge({ status }: { status: AmlBatchRecordStatus }) {
  const config = batchStatusConfig[status];
  return <span className={cn(badgeClassName, config.className)}>{config.label}</span>;
}

export function AmlScreeningTypeBadge({ type }: { type: AmlScreeningType }) {
  const config = screeningTypeConfig[type];
  return <span className={cn(badgeClassName, config.className)}>{config.label}</span>;
}

export function AmlMonitoringBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        badgeClassName,
        active
          ? "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]"
          : "bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]",
      )}
    >
      {active ? "Yes" : "No"}
    </span>
  );
}

export function AmlPriorityBadge({ priority }: { priority: AmlPriority }) {
  return (
    <span className={cn(badgeClassName, priorityConfig[priority])}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}
