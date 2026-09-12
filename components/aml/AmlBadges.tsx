import type { AmlBatchEntityType, AmlScreeningStatus, AmlScreeningType } from "@/types/aml";
import { cn } from "@/lib/utils";

const typeConfig: Record<AmlScreeningType, { label: string; className: string }> = {
  batch: {
    label: "Batch",
    className: "bg-[color:var(--state-purple-soft)] text-[color:var(--state-purple)]",
  },
  automatic: {
    label: "Automatic",
    className: "bg-[color:var(--state-info-soft)] text-[color:var(--state-info)]",
  },
  manual: {
    label: "Manual",
    className: "bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]",
  },
};

const statusConfig: Record<AmlScreeningStatus, { label: string; className: string }> = {
  clear: {
    label: "Clear",
    className: "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]",
  },
  flagged: {
    label: "Flagged",
    className: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  },
  "in-review": {
    label: "In Review",
    className: "bg-[color:var(--state-info-soft)] text-[color:var(--state-info)]",
  },
  blocked: {
    label: "Blocked",
    className: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  },
};

type AmlTypeBadgeProps = {
  type: AmlScreeningType;
};

export function AmlTypeBadge({ type }: AmlTypeBadgeProps) {
  const config = typeConfig[type];

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

type AmlStatusBadgeProps = {
  status: AmlScreeningStatus;
};

export function AmlStatusBadge({ status }: AmlStatusBadgeProps) {
  const config = statusConfig[status];

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

const entityTypeConfig: Record<AmlBatchEntityType, { label: string; className: string }> = {
  corporate: {
    label: "Corporate",
    className: "bg-[color:var(--state-purple-soft)] text-[color:var(--state-purple)]",
  },
  individual: {
    label: "Individual",
    className: "bg-[color:var(--state-info-soft)] text-[color:var(--state-info)]",
  },
};

type AmlEntityTypeBadgeProps = {
  entityType: AmlBatchEntityType;
};

export function AmlEntityTypeBadge({ entityType }: AmlEntityTypeBadgeProps) {
  const config = entityTypeConfig[entityType];

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

type AmlMonitoringBadgeProps = {
  active: boolean;
};

export function AmlMonitoringBadge({ active }: AmlMonitoringBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        active
          ? "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]"
          : "bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]",
      )}
    >
      {active ? "Yes" : "No"}
    </span>
  );
}
