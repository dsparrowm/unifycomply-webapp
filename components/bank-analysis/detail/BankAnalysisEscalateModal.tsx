"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import type { BankAnalysisEscalateSummary } from "@/types/bank-analysis";

type BankAnalysisEscalateModalProps = {
  open: boolean;
  summary: BankAnalysisEscalateSummary;
  onClose: () => void;
  onConfirm: (notes: string) => void;
};

export function BankAnalysisEscalateModal({
  open,
  summary,
  onClose,
  onConfirm,
}: BankAnalysisEscalateModalProps) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) {
      setNotes("");
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

  const flags = [
    { label: "Risk Score", value: String(summary.riskScore) },
    { label: "Sanction", value: summary.sanction ? "Yes" : "No" },
    {
      label: "Warnings and regulatory enforcement",
      value: summary.warningEnforcement ? "Yes" : "No",
    },
  ];

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
        aria-labelledby="bank-analysis-escalate-title"
        className="relative z-10 w-full max-w-[640px] overflow-hidden rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h2
              id="bank-analysis-escalate-title"
              className="text-lg font-semibold text-[color:var(--text-primary)]"
            >
              Escalate to Senior Officer
            </h2>
            <p className="mt-1 text-sm text-[color:var(--text-muted)]">
              You are escalating this to a senior officer for further review
            </p>
          </div>
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
          className="space-y-5 px-6 pb-6 pt-5"
          onSubmit={(event) => {
            event.preventDefault();
            onConfirm(notes.trim());
          }}
        >
          <div>
            <p className="text-sm font-medium text-[color:var(--state-error)]">Risk Summary:</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
              {flags.map((flag) => (
                <p
                  key={flag.label}
                  className="inline-flex items-center gap-1.5 text-sm text-[color:var(--state-error)]"
                >
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {flag.label}: {flag.value}
                  </span>
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="bank-analysis-escalate-notes"
              className="text-sm font-medium text-[color:var(--text-primary)]"
            >
              Comments / Justification
            </label>
            <textarea
              id="bank-analysis-escalate-notes"
              name="notes"
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Enter"
              className="w-full rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3.5 py-3 text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)]"
            />
            <p className="text-xs text-[color:var(--text-light)]">
              Your comments will be recorded in the audit trail and visible to other compliance
              officers.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 min-w-[110px] rounded-lg bg-[color:var(--bg-muted)] px-5 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--border-subtle)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 min-w-[140px] rounded-lg bg-[color:var(--accent-primary)] px-5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary-hover)]"
            >
              Escalate Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}