"use client";

import { useState } from "react";
import { getErrorMessage } from "@/lib/api/errors";
import type { ApiCustomerFlagStatus } from "@/lib/api/types";
import type { CustomerFlag } from "@/types/customer-compliance";

type CustomerFlagsPanelProps = {
  flags: CustomerFlag[];
  kindLabel?: string;
  onUpdateStatus: (flagId: string, status: ApiCustomerFlagStatus) => Promise<void>;
};

const statusLabel: Record<ApiCustomerFlagStatus, string> = {
  warning: "Warning",
  investigating: "Investigating",
  revised: "Revised",
};

function nextStatus(status: ApiCustomerFlagStatus): ApiCustomerFlagStatus | null {
  if (status === "warning") return "investigating";
  if (status === "investigating") return "revised";
  return null;
}

function nextActionLabel(status: ApiCustomerFlagStatus): string | null {
  if (status === "warning") return "Start investigation";
  if (status === "investigating") return "Mark revised";
  return null;
}

export function CustomerFlagsPanel({
  flags,
  kindLabel = "KYC Alert",
  onUpdateStatus,
}: CustomerFlagsPanelProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (flags.length === 0) {
    return null;
  }

  async function handleAdvance(flag: CustomerFlag) {
    const next = nextStatus(flag.status);
    if (!next) return;
    setError(null);
    setPendingId(flag.id);
    try {
      await onUpdateStatus(flag.id, next);
    } catch (err) {
      setError(getErrorMessage(err, "Could not update alert status."));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-3">
      {flags.map((flag) => {
        const action = nextActionLabel(flag.status);
        return (
          <div
            key={flag.id}
            className="rounded-xl border border-[color:var(--state-error)]/30 bg-[color:var(--state-error-soft)]/30 p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--state-error)]">
                {kindLabel}
              </h3>
              <span className="rounded-full bg-[color:var(--bg-surface)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--text-muted)]">
                {statusLabel[flag.status]}
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold text-[color:var(--text-primary)]">{flag.title}</p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">{flag.description}</p>
            {action ? (
              <button
                type="button"
                disabled={pendingId === flag.id}
                onClick={() => {
                  void handleAdvance(flag);
                }}
                className="mt-4 rounded-lg bg-[color:var(--accent-primary)] px-3 py-2 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)] disabled:opacity-60"
              >
                {pendingId === flag.id ? "Updating…" : action}
              </button>
            ) : null}
          </div>
        );
      })}
      {error ? <p className="text-sm text-[color:var(--state-error)]">{error}</p> : null}
    </div>
  );
}
