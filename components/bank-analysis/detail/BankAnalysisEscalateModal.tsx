"use client";

import { ShieldAlert, X } from "lucide-react";
import { useEffect } from "react";
import type { BankAnalysisDetail } from "@/types/bank-analysis";

type BankAnalysisEscalateModalProps = {
  open: boolean;
  detail: BankAnalysisDetail;
  onClose: () => void;
  onConfirm: (notes: string) => void;
};

export function BankAnalysisEscalateModal({
  open,
  detail,
  onClose,
  onConfirm,
}: BankAnalysisEscalateModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close escalation dialog"
        onClick={onClose}
        className="absolute inset-0 bg-[color:var(--text-primary)]/30 backdrop-blur-[2px]"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="bank-analysis-escalate-title"
        aria-describedby="bank-analysis-escalate-description"
        className="relative w-full max-w-xl rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[color:var(--border-default)] px-6 py-5">
          <h2
            id="bank-analysis-escalate-title"
            className="text-lg font-semibold text-[color:var(--text-primary)]"
          >
            Escalate to Senior Officer
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-[color:var(--text-light)] hover:bg-[color:var(--bg-muted)]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form
          className="space-y-5 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            onConfirm(String(formData.get("notes") ?? "").trim());
          }}
        >
          <div className="flex gap-3 rounded-lg border border-[color:var(--state-warning)]/40 bg-[color:var(--state-warning-soft)] p-4">
            <ShieldAlert
              className="h-5 w-5 shrink-0 text-[color:var(--state-warning)]"
              aria-hidden="true"
            />
            <p
              id="bank-analysis-escalate-description"
              className="text-sm leading-relaxed text-[color:var(--text-primary)]"
            >
              Escalate {detail.customerName} for senior compliance review. The decision and
              reviewer notes will be added to this analysis history.
            </p>
          </div>

          <label
            htmlFor="bank-analysis-escalation-notes"
            className="block space-y-1.5 text-sm font-medium text-[color:var(--text-primary)]"
          >
            Escalation notes
            <textarea
              id="bank-analysis-escalation-notes"
              name="notes"
              rows={4}
              required
              minLength={10}
              autoFocus
              placeholder="Explain why senior review is required"
              className="w-full rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3.5 py-3 text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)]"
            />
          </label>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-lg border border-[color:var(--border-default)] px-5 text-sm font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 rounded-lg bg-[color:var(--accent-primary)] px-5 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)]"
            >
              Escalate Analysis
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
