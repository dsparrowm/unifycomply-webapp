"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { KybDetail } from "@/types/kyb";

type KybEscalateModalProps = {
  open: boolean;
  detail: KybDetail;
  onClose: () => void;
  onConfirm: (notes: string) => void;
};

export function KybEscalateModal({ open, detail, onClose, onConfirm }: KybEscalateModalProps) {
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
        aria-labelledby="kyb-escalate-title"
        className="relative z-10 w-full max-w-[640px] overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[color:var(--border-default)] px-6 py-5">
          <h2 id="kyb-escalate-title" className="text-lg font-semibold text-[color:var(--text-primary)]">
            Escalate to senior reviewer?
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
            onConfirm(String(formData.get("notes") ?? ""));
          }}
        >
          <p className="text-sm text-[color:var(--text-primary)]">
            Escalate <span className="font-medium">{detail.businessName}</span> ({detail.kybId}) to a
            senior compliance reviewer for further assessment.
          </p>

          <div className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-4 py-4">
            <p className="text-sm leading-relaxed text-[color:var(--text-muted)]">
              Risk score: {detail.riskScore} • Priority: {detail.priority} • Current status:{" "}
              {detail.status}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="kyb-escalate-notes" className="text-sm font-medium text-[color:var(--text-primary)]">
              Escalation notes
            </label>
            <textarea
              id="kyb-escalate-notes"
              name="notes"
              rows={3}
              required
              placeholder="Describe why this case needs senior review"
              className="w-full rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3.5 py-3 text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)]"
            />
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
              className="h-11 rounded-lg bg-[color:var(--accent-primary)] px-5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary-hover)]"
            >
              Escalate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
