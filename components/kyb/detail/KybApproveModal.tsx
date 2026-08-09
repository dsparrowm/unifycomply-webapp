"use client";

import { useEffect } from "react";
import { Check, X } from "lucide-react";

export type KybApprovalSubject = {
  businessName: string;
  reference: string;
  riskScore: number;
};

type KybApproveModalProps = {
  open: boolean;
  subject: KybApprovalSubject;
  variant?: "verification" | "lookup";
  onClose: () => void;
  onConfirm: () => void;
};

export function KybApproveModal({
  open,
  subject,
  variant = "verification",
  onClose,
  onConfirm,
}: KybApproveModalProps) {
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

  const isLookupApproval = variant === "lookup";

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
        aria-labelledby="kyb-approve-title"
        className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between px-6 py-5">
          <h2 id="kyb-approve-title" className="text-lg font-semibold text-[color:var(--text-primary)]">
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
            {isLookupApproval
              ? "Please confirm this registry lookup and create the business verification?"
              : "Please confirm the approval of this verification?"}
          </p>

          <div className="rounded-xl border border-[color:var(--accent-primary-hover)]/20 bg-[color:var(--accent-primary-soft)] p-5">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-primary-hover)] text-white">
                <Check className="h-5 w-5" />
              </span>
              <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <p className="text-base font-semibold text-[color:var(--accent-primary-hover)]">
                    {subject.businessName}
                  </p>
                  <p className="text-sm text-[color:var(--text-muted)]">{subject.reference}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[color:var(--text-muted)]">Risk Score:</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--accent-primary-hover)] text-sm font-semibold text-white">
                    {subject.riskScore}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-[color:var(--text-muted)]">
            {isLookupApproval
              ? "This will accept the lookup result and open the business verification record."
              : "This will approve the business verification and grant them access to their account."}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-5 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--border-subtle)]"
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
