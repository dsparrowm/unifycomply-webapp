"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { KycDetail } from "@/types/kyc";

const rejectReasons = [
  "Document quality insufficient",
  "Biometric mismatch",
  "Suspected fraud",
  "Information mismatch",
  "Other",
] as const;

type KycRejectModalProps = {
  open: boolean;
  detail: KycDetail;
  onClose: () => void;
  onConfirm: (reason: string, notes: string) => void;
};

export function KycRejectModal({ open, detail, onClose, onConfirm }: KycRejectModalProps) {
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
        aria-labelledby="kyc-reject-title"
        className="relative z-10 w-full max-w-[640px] overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[color:var(--border-default)] px-6 py-5">
          <h2 id="kyc-reject-title" className="text-lg font-semibold text-[color:var(--text-primary)]">
            Reject verification?
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

        <form
          className="space-y-6 px-6 py-6"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            onConfirm(
              String(formData.get("reason") ?? ""),
              String(formData.get("notes") ?? ""),
            );
          }}
        >
          <p className="text-sm text-[color:var(--text-primary)]">
            You are about to reject verification for{" "}
            <span className="font-medium">{detail.customerName}</span> ({detail.kycId}). The customer
            will be notified to resubmit.
          </p>

          <div className="space-y-2">
            <label htmlFor="reject-reason" className="text-sm font-medium text-[color:var(--text-primary)]">
              Rejection reason
            </label>
            <select
              id="reject-reason"
              name="reason"
              required
              defaultValue={rejectReasons[0]}
              className="h-11 w-full rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3.5 text-sm text-[color:var(--text-primary)] outline-none focus:border-[color:var(--accent-primary-hover)]"
            >
              {rejectReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="reject-notes" className="text-sm font-medium text-[color:var(--text-primary)]">
              Notes (optional)
            </label>
            <textarea
              id="reject-notes"
              name="notes"
              rows={3}
              placeholder="Add rejection notes for the audit trail"
              className="w-full rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3.5 py-3 text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)]"
            />
          </div>

          <div className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-4 py-4">
            <p className="text-sm leading-relaxed text-[color:var(--text-light)]">
              Rejecting a verification cannot be undone. The customer will need to complete the
              verification flow again.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-5 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 rounded-lg bg-[color:var(--state-error)] px-5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--state-error)]/90"
            >
              Reject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
