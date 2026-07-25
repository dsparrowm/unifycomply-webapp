"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import { MfaQrCode } from "@/components/settings/MfaQrCode";
import { SettingsField } from "@/components/settings/SettingsField";
import { getErrorMessage } from "@/lib/api/errors";
import type { ApiMfaSetup } from "@/lib/api/types";

type EnableMfaModalProps = {
  open: boolean;
  onClose: () => void;
  onSetup: () => Promise<ApiMfaSetup>;
  onEnable: (token: string) => Promise<void>;
};

export function EnableMfaModal({ open, onClose, onSetup, onEnable }: EnableMfaModalProps) {
  const [setup, setSetup] = useState<ApiMfaSetup | null>(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingSetup, setIsLoadingSetup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const onSetupRef = useRef(onSetup);
  onSetupRef.current = onSetup;

  useEffect(() => {
    if (!open) {
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

  useEffect(() => {
    if (!open) {
      setSetup(null);
      setToken("");
      setError(null);
      setCopied(false);
      setIsLoadingSetup(false);
      setIsSubmitting(false);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setIsLoadingSetup(true);
      setError(null);
      try {
        const result = await onSetupRef.current();
        if (cancelled) return;
        setSetup(result);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, "Could not start MFA setup"));
      } finally {
        if (!cancelled) setIsLoadingSetup(false);
      }
    };
    void run();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleCopySecret = async () => {
    if (!setup?.secret) return;
    try {
      await navigator.clipboard.writeText(setup.secret);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Could not copy secret. Enter it manually in your authenticator app.");
    }
  };

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
      await onEnable(code);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Could not enable MFA"));
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
        aria-labelledby="enable-mfa-title"
        className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[color:var(--border-default)] px-5 py-5">
          <h2
            id="enable-mfa-title"
            className="text-xl font-medium text-[color:var(--text-primary)]"
          >
            Enable two-factor authentication
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
            Scan the QR code with your authenticator app, then enter the 6-digit code to confirm.
          </p>

          {isLoadingSetup ? (
            <p className="text-sm text-[color:var(--text-muted)]">Preparing authenticator setup…</p>
          ) : null}

          {setup ? (
            <div className="flex flex-col items-center gap-4 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] p-4">
              <MfaQrCode value={setup.keyUri} size={200} />
              <div className="w-full space-y-2 text-center">
                <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-light)]">
                  Or enter this secret key
                </p>
                <p className="break-all font-mono text-sm text-[color:var(--text-primary)]">
                  {setup.secret}
                </p>
                <button
                  type="button"
                  onClick={() => void handleCopySecret()}
                  className="text-xs font-medium text-[color:var(--accent-primary-hover)] hover:underline"
                >
                  {copied ? "Copied" : "Copy secret"}
                </button>
              </div>
            </div>
          ) : null}

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
              disabled={isSubmitting || isLoadingSetup || !setup}
              className="flex-1 rounded-lg bg-[color:var(--accent-primary-hover)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Enabling…" : "Enable 2FA"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
