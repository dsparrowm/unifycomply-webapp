"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { KycRequestResubmissionModal } from "@/components/kyc/detail/KycRequestResubmissionModal";
import { isApprovalBlocked } from "@/lib/kyc/risk-score";

type KycLookupFooterActionsProps = {
  riskScore?: number;
};

export function KycLookupFooterActions({ riskScore = 0 }: KycLookupFooterActionsProps) {
  const router = useRouter();
  const [resubmissionOpen, setResubmissionOpen] = useState(false);
  const approvalBlocked = isApprovalBlocked(riskScore);

  if (approvalBlocked) {
    return (
      <>
        <div className="flex flex-col gap-4 border-t border-[color:var(--border-default)] pt-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--state-warning)]" />
            <p className="text-sm text-[color:var(--text-muted)]">
              Approval is disabled for high-risk entities. Open the customer record to escalate.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/kyc")}
              className="h-11 min-w-[135px] rounded-lg border border-[color:var(--border-default)] bg-white px-5 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
            >
              Back to KYC
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
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => setResubmissionOpen(true)}
          className="h-11 min-w-[190px] rounded-lg border border-[color:var(--border-default)] bg-white px-5 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
        >
          Request Resubmission
        </button>
        <button
          type="button"
          onClick={() => router.push("/kyc")}
          className="h-11 min-w-[135px] rounded-lg border border-[color:var(--state-error)] bg-white px-5 text-sm font-medium text-[color:var(--state-error)] transition-colors hover:bg-[color:var(--state-error-soft)]"
        >
          Cancel
        </button>
        <button
          type="button"
          className="h-11 min-w-[135px] rounded-lg bg-[color:var(--accent-primary-hover)] px-5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
        >
          Approve
        </button>
      </div>

      <KycRequestResubmissionModal
        open={resubmissionOpen}
        onClose={() => setResubmissionOpen(false)}
        onConfirm={() => setResubmissionOpen(false)}
      />
    </>
  );
}
