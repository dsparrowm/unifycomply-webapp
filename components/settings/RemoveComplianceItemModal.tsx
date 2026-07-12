"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type RemoveComplianceItemModalProps = {
  open: boolean;
  itemLabel: string;
  itemType: "document" | "country";
  onClose: () => void;
  onConfirm: () => void;
};

export function RemoveComplianceItemModal({
  open,
  itemLabel,
  itemType,
  onClose,
  onConfirm,
}: RemoveComplianceItemModalProps) {
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
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const title =
    itemType === "document" ? "Remove Document Requirement?" : "Remove Flagged Country?";

  const description =
    itemType === "document"
      ? `Are you sure you want to remove "${itemLabel}" from the required documents list?`
      : `Are you sure you want to remove "${itemLabel}" from the flagged countries list?`;

  const warningText =
    itemType === "document"
      ? "Removing a required document may allow customers to complete verification without it. Existing verifications will not be affected until re-verification is required."
      : "Customers from this country will no longer receive enhanced scrutiny during onboarding and ongoing monitoring.";

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
        aria-labelledby="remove-compliance-item-title"
        className="relative z-10 w-full max-w-[790px] overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[color:var(--border-default)] px-7 py-5">
          <h2
            id="remove-compliance-item-title"
            className="text-xl font-medium text-[color:var(--text-primary)]"
          >
            {title}
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

        <div className="space-y-6 px-7 py-6">
          <p className="text-sm text-[color:var(--text-primary)]">{description}</p>

          <div className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-6 py-6">
            <p className="text-sm leading-relaxed text-[color:var(--text-light)]">{warningText}</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-6 py-2.5 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)] sm:min-w-[240px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="rounded-lg bg-[color:var(--state-error)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--state-error)]/90 sm:min-w-[240px]"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
