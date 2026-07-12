"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Camera,
  Crop,
  FileText,
  Lightbulb,
  ScanSearch,
  Target,
  X,
  type LucideIcon,
} from "lucide-react";
import { kycDocumentIssues } from "@/lib/constants/kyc-document-issues";
import type { KycDocumentIssue, KycDocumentIssueId } from "@/types/kyc";
import { cn } from "@/lib/utils";

type KycRequestResubmissionModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (issueIds: string[]) => void;
};

const issueIcons: Record<KycDocumentIssueId, LucideIcon> = {
  blurred: ScanSearch,
  "poor-lighting": Lightbulb,
  incomplete: Crop,
  "wrong-document-type": Target,
  expired: AlertTriangle,
  "selfie-quality": Camera,
  "text-not-readable": FileText,
};

function IssueIcon({ issue }: { issue: KycDocumentIssue }) {
  const Icon = issueIcons[issue.id];

  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
        issue.tone === "error"
          ? "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]"
          : "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
      )}
    >
      <Icon className="h-4 w-4" />
    </span>
  );
}

export function KycRequestResubmissionModal({
  open,
  onClose,
  onConfirm,
}: KycRequestResubmissionModalProps) {
  const [selectedIssueIds, setSelectedIssueIds] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      setSelectedIssueIds([]);
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

  function toggleIssue(issueId: string) {
    setSelectedIssueIds((current) =>
      current.includes(issueId)
        ? current.filter((id) => id !== issueId)
        : [...current, issueId],
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-[color:var(--text-primary)]/20 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="kyc-resubmission-title"
        className="relative z-10 flex max-h-[min(720px,calc(100vh-4rem))] w-full max-w-[640px] flex-col overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border-default)] px-6 py-5">
          <div>
            <h2
              id="kyc-resubmission-title"
              className="text-lg font-semibold text-[color:var(--text-primary)]"
            >
              Request Document Re-submission
            </h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
              Select all issues that apply and provide specific instructions to help the customer
              submit better documents.
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
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            onConfirm(selectedIssueIds);
          }}
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
              Common Document Issues
            </h3>

            <div className="mt-4 divide-y divide-[color:var(--border-default)] rounded-xl border border-[color:var(--border-default)]">
              {kycDocumentIssues.map((issue) => {
                const checked = selectedIssueIds.includes(issue.id);
                const inputId = `resubmission-issue-${issue.id}`;

                return (
                  <label
                    key={issue.id}
                    htmlFor={inputId}
                    className="flex cursor-pointer items-start gap-4 px-4 py-4 transition-colors hover:bg-[color:var(--bg-muted)]/60"
                  >
                    <input
                      id={inputId}
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleIssue(issue.id)}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-[color:var(--border-default)] text-[color:var(--accent-primary-hover)] focus:ring-[color:var(--accent-primary-hover)]"
                    />
                    <IssueIcon issue={issue} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[color:var(--text-primary)]">
                        {issue.title}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-[color:var(--text-muted)]">
                        {issue.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[color:var(--border-default)] px-6 py-5 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={onClose}
              className="h-11 min-w-[135px] rounded-lg bg-[color:var(--bg-muted)] px-5 text-sm font-medium text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--border-default)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedIssueIds.length === 0}
              className="h-11 min-w-[190px] rounded-lg bg-[color:var(--accent-primary-hover)] px-5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Request Resubmission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
