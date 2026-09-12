"use client";

import { useEffect } from "react";
import { ChevronRight, FileText, Target, X } from "lucide-react";
import { useRouter } from "next/navigation";

type AmlChooseActionModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AmlChooseActionModal({ open, onClose }: AmlChooseActionModalProps) {
  const router = useRouter();

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
      icon: Target,
      href: "/aml-screening/lookup",
    },
    {
      id: "batch",
      label: "Batch Lookup",
      icon: FileText,
      href: "/aml-screening/lookup?mode=batch",
    },
  ] as const;

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
        aria-labelledby="aml-choose-action-title"
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[color:var(--border-subtle)] px-6 py-4">
          <h2
            id="aml-choose-action-title"
            className="text-lg font-semibold text-[color:var(--text-primary)]"
          >
            Choose action
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-2 py-3">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => {
                onClose();
                router.push(action.href);
              }}
              className="flex w-full items-center justify-between rounded-xl px-4 py-5 text-left transition-colors hover:bg-[color:var(--bg-muted)]"
            >
              <span className="flex items-center gap-3">
                <action.icon className="h-5 w-5 text-[color:var(--text-muted)]" />
                <span className="text-base font-medium text-[color:var(--text-primary)]">
                  {action.label}
                </span>
              </span>
              <ChevronRight className="h-5 w-5 text-[color:var(--text-light)]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
