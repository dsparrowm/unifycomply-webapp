"use client";

import { useEffect } from "react";
import { Wallet, X } from "lucide-react";

type WalletFundingModalProps = {
  open: boolean;
  onClose: () => void;
};

export function WalletFundingModal({ open, onClose }: WalletFundingModalProps) {
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
        aria-labelledby="wallet-funding-title"
        className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-2xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[color:var(--border-default)] px-5 py-4">
          <h2
            id="wallet-funding-title"
            className="text-base font-semibold text-[color:var(--text-primary)]"
          >
            Wallet Funding
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

        <div className="flex flex-col items-center px-6 py-10 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--accent-primary-soft)]">
            <Wallet className="h-9 w-9 text-[color:var(--accent-primary)]" />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-[color:var(--text-primary)]">
            Top Up Wallet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-[color:var(--text-muted)]">
            Add funds to your production wallet. Payment integration will be connected in a later
            release.
          </p>
        </div>

        <div className="flex gap-3 border-t border-[color:var(--border-default)] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-4 py-2.5 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg bg-[color:var(--accent-primary-hover)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
