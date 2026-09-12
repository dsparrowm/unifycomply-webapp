"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Crosshair,
  FileText,
  FolderCheck,
  UserCheck,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ResolutionType =
  | "cleared"
  | "false-positive"
  | "escalated"
  | "customer-contact"
  | "documentation";

const RESOLUTION_OPTIONS: {
  id: ResolutionType;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "cleared", label: "Cleared - No Issues Found", icon: CheckCircle2 },
  { id: "false-positive", label: "False Positive", icon: Crosshair },
  { id: "escalated", label: "Escalated to Authorities", icon: FileText },
  {
    id: "customer-contact",
    label: "Resolved After Customer Contact",
    icon: UserCheck,
  },
  {
    id: "documentation",
    label: "Documentation Provided - Cleared",
    icon: FolderCheck,
  },
];

const ACTION_OPTIONS = [
  "Customer verification completed",
  "Source of funds verified",
  "PEP screening cleared",
  "Enhanced due diligence performed",
  "Transaction pattern analyzed",
  "Adverse media check completed",
  "Business relationship reviewed",
  "Sanctions screening passed",
] as const;

type ResolveCaseModalProps = {
  open: boolean;
  transactionId: string;
  onClose: () => void;
  onSubmit?: (payload: {
    resolutionType: ResolutionType;
    outcomeSummary: string;
    actionsTaken: string[];
    notes: string;
  }) => void;
};

export function ResolveCaseModal({
  open,
  transactionId,
  onClose,
  onSubmit,
}: ResolveCaseModalProps) {
  const [resolutionType, setResolutionType] =
    useState<ResolutionType>("documentation");
  const [outcomeSummary, setOutcomeSummary] = useState("");
  const [actionsTaken, setActionsTaken] = useState<string[]>([
    "Customer verification completed",
  ]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const toggleAction = (action: string) => {
    setActionsTaken((current) =>
      current.includes(action)
        ? current.filter((item) => item !== action)
        : [...current, action],
    );
  };

  const handleSubmit = () => {
    onSubmit?.({
      resolutionType,
      outcomeSummary,
      actionsTaken,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close resolve case dialog"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="resolve-case-title"
        className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-[color:var(--border-subtle)] px-6 py-4">
          <div>
            <h2
              id="resolve-case-title"
              className="text-lg font-semibold text-[color:var(--text-primary)]"
            >
              Resolve Case
            </h2>
            <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">
              Transaction ID: {transactionId}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto px-6 py-5">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">
              Resolution Type
            </h3>
            <div className="space-y-2">
              {RESOLUTION_OPTIONS.map((option) => {
                const selected = resolutionType === option.id;
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setResolutionType(option.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors",
                      selected
                        ? "border-[color:var(--accent-primary-hover)] bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary-hover)]"
                        : "border-[color:var(--border-default)] text-[color:var(--text-primary)] hover:bg-[color:var(--bg-muted)]",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-2">
            <label
              htmlFor="outcome-summary"
              className="text-sm font-semibold text-[color:var(--text-primary)]"
            >
              Outcome Summary
            </label>
            <input
              id="outcome-summary"
              type="text"
              value={outcomeSummary}
              onChange={(event) => setOutcomeSummary(event.target.value)}
              placeholder="e.g., Legitimate business transaction verified"
              className="w-full rounded-lg border border-[color:var(--border-default)] px-3 py-2.5 text-sm outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]"
            />
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">
              Actions Taken
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {ACTION_OPTIONS.map((action) => {
                const checked = actionsTaken.includes(action);
                return (
                  <label
                    key={action}
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                      checked
                        ? "border-[color:var(--accent-primary-hover)] bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary-hover)]"
                        : "border-[color:var(--border-default)] text-[color:var(--text-primary)]",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAction(action)}
                      className="mt-0.5 rounded border-[color:var(--border-default)]"
                    />
                    <span>{action}</span>
                  </label>
                );
              })}
            </div>
          </section>

          <section className="space-y-2">
            <label
              htmlFor="resolution-notes"
              className="text-sm font-semibold text-[color:var(--text-primary)]"
            >
              Detailed Resolution Notes
            </label>
            <textarea
              id="resolution-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Enter"
              rows={4}
              className="w-full resize-none rounded-lg border border-[color:var(--border-default)] px-3 py-2.5 text-sm outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]"
            />
            <p className="text-xs text-[color:var(--text-muted)]">
              This will be recorded in the audit trail
            </p>
          </section>

          <div className="rounded-lg border border-[color:var(--state-warning)]/30 bg-[color:var(--state-warning-soft)] px-4 py-3">
            <p className="text-sm font-semibold text-[color:var(--state-warning)]">
              Compliance Notice
            </p>
            <p className="mt-1 text-sm text-[color:var(--text-muted)]">
              This resolution will be recorded in the audit trail and may be
              subject to regulatory review. Ensure all information is accurate
              and complete before submitting.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 border-t border-[color:var(--border-subtle)] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[color:var(--border-default)] px-5 py-2.5 text-sm font-medium text-[color:var(--text-muted)] hover:bg-[color:var(--bg-muted)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-[color:var(--accent-primary-hover)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[color:var(--accent-primary)]"
          >
            Submit Resolution
          </button>
        </div>
      </div>
    </div>
  );
}
