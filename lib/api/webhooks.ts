import { apiFetch, apiFetchEnvelope } from "@/lib/api/client";
import { unwrapCollection } from "@/lib/api/mappers/customers";

export type ApiWebhookDelivery = {
  id?: string;
  event?: string;
  workflowId?: string;
  status?: string;
  createdAt?: string;
  deliveredAt?: string | null;
  lastError?: string | null;
};

export async function listWebhookDeliveries(appId: string): Promise<ApiWebhookDelivery[]> {
  const response = await apiFetchEnvelope<unknown>(
    `/api/v1/tenants/apps/${encodeURIComponent(appId)}/webhook/deliveries`,
    { query: { page: "1", limit: "10" } },
  );
  return unwrapCollection(response.data) as ApiWebhookDelivery[];
}

export function redeliverWebhook(appId: string, deliveryId: string) {
  return apiFetch<unknown>(
    `/api/v1/tenants/apps/${encodeURIComponent(appId)}/webhook/deliveries/${encodeURIComponent(deliveryId)}/redeliver`,
    { method: "POST" },
  );
}