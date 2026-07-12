"use client";

import { useEffect } from "react";
import { Check, X } from "lucide-react";
import type { KycDetail } from "@/types/kyc";
import { getRiskScoreShortLabel } from "@/lib/kyc/risk-score";

type KycApproveModalProps = {
  open: boolean;
  detail: KycDetail;
  onClose: () => void;
  onConfirm: () => void;
};

export function KycApproveModal({ open, detail, onClose, onConfirm }: KycApproveModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const riskLevelLabel = getRiskScoreShortLabel(detail.riskScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-[color:var(--text-primary)]/20 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="kyc-approve-title"
        className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between px-6 py-5">
          <h2 id="kyc-approve-title" className="text-lg font-semibold text-[color:var(--text-primary)]">
            Confirm Approval
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-[color:var(--text-light)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 pb-6">
          <p className="text-sm text-[color:var(--text-primary)]">
            Please confirm the approval of this verification?
          </p>

          <div className="rounded-xl border border-[color:var(--accent-primary-hover)]/20 bg-[color:var(--accent-primary-soft)] p-5">
            <div className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-primary-hover)] text-white">
                <Check className="h-5 w-5" />
              </span>
              <div className="min-w-0 space-y-2">
                <p className="text-base font-semibold text-[color:var(--text-primary)]">
                  {detail.customerName}
                </p>
                <p className="text-sm text-[color:var(--text-muted)]">
                  {detail.documentType} Verification
                </p>
                <span className="inline-flex items-center rounded-full bg-[color:var(--accent-primary)] px-3 py-1 text-xs font-medium text-white">
                  Risk Score: {detail.riskScore} ({riskLevelLabel})
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-[color:var(--text-muted)]">
            This will approve the customer&apos;s verification and grant them access to their account.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-5 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="h-11 rounded-lg bg-[color:var(--accent-primary-hover)] px-5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
            >
              Confirm Approval
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
