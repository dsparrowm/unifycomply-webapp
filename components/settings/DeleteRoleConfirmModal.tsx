"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type DeleteRoleConfirmModalProps = {
  open: boolean;
  roleName: string;
  isDeleting: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteRoleConfirmModal({
  open,
  roleName,
  isDeleting,
  error,
  onClose,
  onConfirm,
}: DeleteRoleConfirmModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

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
        aria-labelledby="delete-role-title"
        className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[color:var(--border-default)] px-5 py-5">
          <h2
            id="delete-role-title"
            className="text-xl font-medium text-[color:var(--text-primary)]"
          >
            Delete role
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-[color:var(--text-light)] hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-6">
          <p className="text-sm text-[color:var(--text-muted)]">
            Are you sure you want to delete{" "}
            <span className="font-medium text-[color:var(--text-primary)]">{roleName}</span>? This
            action cannot be undone.
          </p>
          {error ? (
            <p className="text-sm text-[color:var(--state-error)]" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-[color:var(--border-default)] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-[color:var(--border-default)] px-4 py-2.5 text-sm font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-muted)] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="rounded-lg bg-[color:var(--state-error)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {isDeleting ? "Deleting…" : "Delete role"}
          </button>
        </div>
      </div>
    </div>
  );
}
