import type {
  BankAnalysisBatchEntityType,
  BankAnalysisBatchStatus,
  BankAnalysisRunType,
} from "@/types/bank-analysis";
import { cn } from "@/lib/utils";

const runTypeConfig: Record<BankAnalysisRunType, { label: string; className: string }> = {
  batch: {
    label: "Batch",
    className: "bg-[color:var(--state-purple-soft)] text-[color:var(--state-purple)]",
  },
  organization: {
    label: "Organization",
    className: "bg-[color:var(--state-info-soft)] text-[color:var(--state-info)]",
  },
  individual: {
    label: "Individual",
    className: "bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]",
  },
  manual: {
    label: "Manual",
    className: "bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]",
  },
};

const entityTypeConfig: Record<
  BankAnalysisBatchEntityType,
  { label: string; className: string }
> = {
  organization: runTypeConfig.organization,
  individual: {
    label: "Individual",
    className: "bg-[color:var(--state-info-soft)] text-[color:var(--state-info)]",
  },
};

const statusConfig: Record<BankAnalysisBatchStatus, { label: string; className: string }> = {
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

type BankAnalysisTypeBadgeProps = {
  type: BankAnalysisRunType;
};

export function BankAnalysisTypeBadge({ type }: BankAnalysisTypeBadgeProps) {
  const config = runTypeConfig[type];

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

type BankAnalysisBatchEntityTypeBadgeProps = {
  entityType: BankAnalysisBatchEntityType;
};

export function BankAnalysisBatchEntityTypeBadge({
  entityType,
}: BankAnalysisBatchEntityTypeBadgeProps) {
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

type BankAnalysisBatchStatusBadgeProps = {
  status: BankAnalysisBatchStatus;
};

export function BankAnalysisBatchStatusBadge({ status }: BankAnalysisBatchStatusBadgeProps) {
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