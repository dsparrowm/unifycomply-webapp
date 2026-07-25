"use client";

import { SettingsQueryGate } from "@/components/settings/SettingsQueryGate";
import { useRotateApiKey, useSettingsApiKey } from "@/lib/hooks/use-settings";
import { runAction } from "@/lib/toast";
import { cn } from "@/lib/utils";

export default function ApiKeysPage() {
  const apiKeyQuery = useSettingsApiKey();
  const rotate = useRotateApiKey();

  return (
    <SettingsQueryGate
      isLoading={apiKeyQuery.isLoading}
      isError={apiKeyQuery.isError}
      error={apiKeyQuery.error}
      onRetry={() => void apiKeyQuery.refetch()}
    >
      {apiKeyQuery.data ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
                API Keys
              </h2>
              <p className="mt-0.5 text-xs text-[color:var(--text-light)]">
                Manage programmatic access keys for the {apiKeyQuery.data.domain} domain
              </p>
            </div>
            <button
              type="button"
              disabled={rotate.isPending}
              onClick={() => {
                void runAction(() => rotate.mutateAsync(), {
                  success: "API keys rotated",
                  error: "Could not rotate API keys",
                });
              }}
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-2.5 text-xs font-medium text-white transition-colors",
                "bg-[color:var(--accent-primary-hover)] hover:bg-[color:var(--accent-primary)] disabled:opacity-60",
              )}
            >
              {rotate.isPending ? "Rotating…" : "Rotate keys"}
            </button>
          </div>

          <section className="space-y-4 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-light)]">
                Public key
              </p>
              <p className="mt-2 break-all font-mono text-sm text-[color:var(--text-primary)]">
                {apiKeyQuery.data.publicKey}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-light)]">
                Secret key
              </p>
              <p className="mt-2 break-all font-mono text-sm text-[color:var(--text-primary)]">
                {apiKeyQuery.data.secretKey}
              </p>
            </div>
            <p className="text-xs text-[color:var(--text-light)]">
              Last used:{" "}
              {apiKeyQuery.data.lastUsedAt
                ? new Date(apiKeyQuery.data.lastUsedAt).toLocaleString()
                : "Never"}
            </p>
          </section>
        </div>
      ) : null}
    </SettingsQueryGate>
  );
}
