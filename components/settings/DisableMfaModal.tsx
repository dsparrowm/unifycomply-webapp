"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import { SettingsField } from "@/components/settings/SettingsField";
import { getErrorMessage } from "@/lib/api/errors";

type DisableMfaModalProps = {
  open: boolean;
  onClose: () => void;
  onDisable: (token: string) => Promise<void>;
};

export function DisableMfaModal({ open, onClose, onDisable }: DisableMfaModalProps) {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setToken("");
      setError(null);
      setIsSubmitting(false);
      return;
    }

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const code = token.trim();
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code from your authenticator app");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onDisable(code);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Could not disable MFA"));
    } finally {
      setIsSubmitting(false);
    }
  };

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
        aria-labelledby="disable-mfa-title"
        className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[color:var(--border-default)] px-5 py-5">
          <h2
            id="disable-mfa-title"
            className="text-xl font-medium text-[color:var(--text-primary)]"
          >
            Disable two-factor authentication
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

        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5 px-5 py-6">
          <p className="text-sm text-[color:var(--text-muted)]">
            Enter a current authenticator code to turn off 2FA for this account.
          </p>

          <SettingsField
            label="Authenticator code"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            maxLength={6}
            value={token}
            onChange={(event) => setToken(event.target.value.replace(/\D/g, "").slice(0, 6))}
          />

          {error ? (
            <p className="text-sm text-[color:var(--state-error)]" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex gap-5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-4 py-2.5 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-[color:var(--state-error)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Disabling…" : "Disable 2FA"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
