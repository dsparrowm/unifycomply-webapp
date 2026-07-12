"use client";

import { useEffect } from "react";
import { ChevronRight, Layers, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type BankAnalysisChooseActionModalProps = {
  open: boolean;
  onClose: () => void;
};

export function BankAnalysisChooseActionModal({
  open,
  onClose,
}: BankAnalysisChooseActionModalProps) {
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

  const actions = [
    {
      id: "single",
      label: "Single Lookup",
      icon: Search,
      onClick: onClose,
    },
    {
      id: "batch",
      label: "Batch Lookup",
      icon: Layers,
      onClick: onClose,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close choose action dialog"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bank-analysis-choose-action-title"
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[color:var(--border-subtle)] px-6 py-4">
          <h2
            id="bank-analysis-choose-action-title"
            className="text-lg font-semibold text-[color:var(--text-primary)]"
          >
            Choose action
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 p-4">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border border-[color:var(--border-default)] px-6 py-5 text-left transition-colors hover:border-[color:var(--accent-primary-hover)] hover:bg-[color:var(--accent-primary-soft)]",
              )}
            >
              <span className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[color:var(--bg-muted)] text-[color:var(--accent-primary)]">
                  <action.icon className="h-6 w-6" />
                </span>
                <span className="text-lg font-medium text-[color:var(--text-primary)]">
                  {action.label}
                </span>
              </span>
              <ChevronRight className="h-6 w-6 text-[color:var(--text-light)]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
