"use client";

import { AlertTriangle } from "lucide-react";
import { isApprovalBlocked } from "@/lib/kyc/risk-score";
import { cn } from "@/lib/utils";

type KycDetailFooterActionsProps = {
  riskScore: number;
  onRequestResubmission: () => void;
  onReject: () => void;
  onApprove: () => void;
  onEscalate: () => void;
};

export function KycDetailFooterActions({
  riskScore,
  onRequestResubmission,
  onReject,
  onApprove,
  onEscalate,
}: KycDetailFooterActionsProps) {
  const approvalBlocked = isApprovalBlocked(riskScore);

  if (approvalBlocked) {
    return (
      <div className="sticky bottom-0 z-10 -mx-4 mt-2 border-t border-[color:var(--border-default)] bg-[color:var(--bg-base)] px-4 py-4 sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--state-warning)]" />
            <p className="text-sm text-[color:var(--text-muted)]">
              Approval is disabled for high-risk entities. You can only escalate this details
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onEscalate}
              className="h-11 min-w-[170px] rounded-lg border border-[color:var(--state-warning)] bg-[color:var(--bg-surface)] px-5 text-sm font-medium text-[color:var(--state-warning)] transition-colors hover:bg-[color:var(--state-warning-soft)]"
            >
              Escalate Submission
            </button>
            <button
              type="button"
              disabled
              className="h-11 min-w-[135px] cursor-not-allowed rounded-lg bg-[color:var(--border-subtle)] px-5 text-sm font-medium text-[color:var(--text-light)]"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-2 border-t border-[color:var(--border-default)] bg-[color:var(--bg-base)] px-4 py-4 sm:-mx-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onRequestResubmission}
          className="h-11 min-w-[190px] rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-5 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
        >
          Request Resubmission
        </button>
        <button
          type="button"
          onClick={onReject}
          className="h-11 min-w-[135px] rounded-lg border border-[color:var(--state-error)] bg-[color:var(--bg-surface)] px-5 text-sm font-medium text-[color:var(--state-error)] transition-colors hover:bg-[color:var(--state-error-soft)]"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={onApprove}
          className={cn(
            "h-11 min-w-[135px] rounded-lg bg-[color:var(--accent-primary-hover)] px-5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]",
          )}
        >
          Approve
        </button>
      </div>
    </div>
  );
}
