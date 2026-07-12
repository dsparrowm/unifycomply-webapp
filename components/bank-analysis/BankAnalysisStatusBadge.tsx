import type { BankAnalysisRunStatus } from "@/types/bank-analysis";
import { KycPriorityBadge } from "@/components/kyc/KycStatusBadge";
import { cn } from "@/lib/utils";

const statusConfig: Record<BankAnalysisRunStatus, { label: string; className: string }> = {
  completed: {
    label: "Completed",
    className: "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]",
  },
  pending: {
    label: "Pending",
    className: "bg-[color:var(--state-info-soft)] text-[color:var(--state-info)]",
  },
  "in-review": {
    label: "In Review",
    className: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  },
  failed: {
    label: "Failed",
    className: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  },
};

type BankAnalysisStatusBadgeProps = {
  status: BankAnalysisRunStatus;
};

export function BankAnalysisStatusBadge({ status }: BankAnalysisStatusBadgeProps) {
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

export { KycPriorityBadge as BankAnalysisPriorityBadge };
