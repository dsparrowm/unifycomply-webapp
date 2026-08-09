"use client";

import { useEffect } from "react";
import { ChevronRight, Layers, UserRoundSearch, X } from "lucide-react";
import { useRouter } from "next/navigation";

type AmlScreeningChooseActionModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AmlScreeningChooseActionModal({
  open,
  onClose,
}: AmlScreeningChooseActionModalProps) {
  const router = useRouter();

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

  const actions = [
    {
      id: "single",
      label: "Single Screening",
      description: "Screen one individual or business",
      icon: UserRoundSearch,
    },
    {
      id: "batch",
      label: "Batch Screening",
      description: "Upload and screen multiple entities",
      icon: Layers,
    },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close choose action dialog"
        className="absolute inset-0 bg-[color:var(--text-primary)]/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="aml-choose-action-title"
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[color:var(--border-subtle)] px-6 py-4">
          <div>
            <h2
              id="aml-choose-action-title"
              className="text-lg font-semibold text-[color:var(--text-primary)]"
            >
              Choose action
            </h2>
            <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">
              Select how you want to start screening
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-[color:var(--text-muted)] hover:bg-[color:var(--bg-muted)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3 p-4">
          {actions.map((action, index) => (
            <button
              key={action.id}
              type="button"
              autoFocus={index === 0}
              onClick={() => {
                onClose();
                router.push(`/aml-screening/lookup?mode=${action.id}`);
              }}
              className="flex w-full items-center justify-between gap-4 rounded-xl border border-[color:var(--border-default)] px-5 py-5 text-left transition-colors hover:border-[color:var(--accent-primary-hover)] hover:bg-[color:var(--accent-primary-soft)]"
            >
              <span className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[color:var(--bg-muted)] text-[color:var(--accent-primary)]">
                  <action.icon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-base font-medium text-[color:var(--text-primary)]">
                    {action.label}
                  </span>
                  <span className="mt-1 block text-sm text-[color:var(--text-muted)]">
                    {action.description}
                  </span>
                </span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-[color:var(--text-light)]" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
