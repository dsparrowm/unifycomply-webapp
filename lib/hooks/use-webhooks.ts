"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listWebhookDeliveries, redeliverWebhook } from "@/lib/api/webhooks";
import { useSettingsAppSelection } from "@/lib/hooks/use-tenant-apps";

export function useWebhookDeliveries() {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: ["webhooks", "deliveries", selectedAppId ?? "none"],
    enabled: Boolean(selectedAppId),
    queryFn: () => listWebhookDeliveries(selectedAppId!),
  });
}

export function useRedeliverWebhook() {
  const { selectedAppId } = useSettingsAppSelection();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deliveryId: string) => {
      if (!selectedAppId) throw new Error("Select an app first");
      return redeliverWebhook(selectedAppId, deliveryId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["webhooks", "deliveries"] });
    },
  });
}