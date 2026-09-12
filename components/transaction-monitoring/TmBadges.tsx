import type { TmTxCategory, TmTxStatus } from "@/types/transaction-monitoring";
import { cn } from "@/lib/utils";

const categoryConfig: Record<
  TmTxCategory,
  { label: string; className: string }
> = {
  "stop-payment": {
    label: "Stop Payment",
    className: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  },
  "tm-not-blocked": {
    label: "Non Blocked",
    className: "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]",
  },
  "cumulative-frequency": {
    label: "Cumul. Freq",
    className: "bg-[color:var(--state-purple-soft)] text-[color:var(--state-purple)]",
  },
  "tm-blocked": {
    label: "Blocked",
    className: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  },
};

const statusConfig: Record<TmTxStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "text-[color:var(--state-warning)]",
  },
  cleared: {
    label: "Cleared",
    className: "text-[color:var(--state-success)]",
  },
  "in-review": {
    label: "In Review",
    className: "text-[color:var(--state-info)]",
  },
  blocked: {
    label: "Blocked",
    className: "text-[color:var(--state-error)]",
  },
};

export function TmCategoryBadge({ category }: { category: TmTxCategory }) {
  const config = categoryConfig[category];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}

export function TmStatusText({ status }: { status: TmTxStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn("text-sm font-medium", config.className)}>{config.label}</span>
  );
}

export function TmRiskScoreBar({ score }: { score: number }) {
  const tone =
    score >= 80
      ? "bg-[color:var(--state-error)]"
      : score >= 40
        ? "bg-[color:var(--state-warning)]"
        : "bg-[color:var(--state-success)]";

  return (
    <div className="flex min-w-[110px] items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[color:var(--bg-muted)]">
        <div
          className={cn("h-full rounded-full", tone)}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
      <span className="w-8 text-xs font-medium text-[color:var(--text-primary)]">
        {score}%
      </span>
    </div>
  );
}
