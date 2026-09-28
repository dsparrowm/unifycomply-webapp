"use client";

import { RotateCcw } from "lucide-react";
import { useRedeliverWebhook, useWebhookDeliveries } from "@/lib/hooks/use-webhooks";
import { getErrorMessage } from "@/lib/api/errors";
import { toastError, toastSuccess } from "@/lib/toast";

function formatDate(value: string | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function statusClass(status: string | undefined): string {
  const value = status?.toLowerCase();
  if (value === "delivered") return "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]";
  if (value === "failed" || value === "dead") return "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]";
  return "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]";
}

export function WebhookDeliveryHistory() {
  const deliveriesQuery = useWebhookDeliveries();
  const redeliver = useRedeliverWebhook();

  async function handleRedeliver(id: string) {
    try {
      await redeliver.mutateAsync(id);
      toastSuccess("Webhook redelivery queued");
    } catch (error) {
      toastError(getErrorMessage(error, "Could not redeliver webhook"));
    }
  }

  const deliveries = deliveriesQuery.data ?? [];

  return (
    <section className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Webhook Delivery History
        </h2>
        <p className="mt-0.5 text-xs text-[color:var(--text-light)]">
          Review delivery attempts for the selected app and retry failed events.
        </p>
      </div>

      {deliveriesQuery.isLoading ? (
        <p className="mt-6 text-sm text-[color:var(--text-muted)]">Loading deliveries...</p>
      ) : deliveriesQuery.isError ? (
        <p className="mt-6 text-sm text-[color:var(--state-error)]">Webhook deliveries could not be loaded.</p>
      ) : deliveries.length === 0 ? (
        <p className="mt-6 text-sm text-[color:var(--text-muted)]">No webhook deliveries yet.</p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[color:var(--border-default)] text-xs text-[color:var(--text-muted)]">
              <tr>
                <th className="px-3 py-3 font-medium">Event</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Created</th>
                <th className="px-3 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery, index) => {
                const id = delivery.id ?? `delivery-${index}`;
                const canRedeliver = ["failed", "dead"].includes(delivery.status?.toLowerCase() ?? "");
                return (
                  <tr key={id} className="border-b border-[color:var(--border-default)] last:border-0">
                    <td className="px-3 py-3 text-[color:var(--text-primary)]">
                      {delivery.event ?? "Webhook event"}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(delivery.status)}`}>
                        {delivery.status ?? "Unknown"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-[color:var(--text-muted)]">
                      {formatDate(delivery.createdAt)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {canRedeliver ? (
                        <button
                          type="button"
                          onClick={() => void handleRedeliver(id)}
                          disabled={redeliver.isPending}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[color:var(--accent-primary-hover)] hover:underline disabled:opacity-60"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Redeliver
                        </button>
                      ) : (
                        <span className="text-xs text-[color:var(--text-light)]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}