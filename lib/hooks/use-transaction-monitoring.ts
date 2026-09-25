"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useSettingsAppSelection } from "@/lib/hooks/use-tenant-apps";
import {
  escalateTransactionCase,
  generateTransactionSarRationale,
  getTransactionMonitoringOverview,
  getTransactionCase,
  listTransactionMonitoringQueue,
  placeTransactionPnd,
  resolveTransactionCase,
} from "@/lib/api/transaction-monitoring";
import { mapApiTmOverview, mapApiTmQueue } from "@/lib/api/mappers/transaction-monitoring";
import type { TmQueueId } from "@/types/transaction-monitoring";

export const transactionMonitoringKeys = {
  overview: (appId: string | null) => ["transaction-monitoring", "overview", appId ?? "default"] as const,
  queue: (queueId: TmQueueId, appId: string | null) =>
    ["transaction-monitoring", "queue", queueId, appId ?? "default"] as const,
};

export function useTransactionMonitoringOverview() {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: transactionMonitoringKeys.overview(selectedAppId),
    queryFn: async () =>
      mapApiTmOverview(await getTransactionMonitoringOverview(selectedAppId ?? undefined)),
  });
}

export function useTransactionMonitoringQueue(queueId: TmQueueId) {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: transactionMonitoringKeys.queue(queueId, selectedAppId),
    queryFn: async () =>
      mapApiTmQueue(
        queueId,
        await listTransactionMonitoringQueue(
          queueId,
          { page: "1", limit: "100" },
          selectedAppId ?? undefined,
        ),
      ),
  });
}

export function useTransactionCase(id: string, enabled: boolean) {
  const { selectedAppId } = useSettingsAppSelection();
  return useQuery({
    queryKey: ["transaction-monitoring", "case", id, selectedAppId ?? "default"],
    enabled: Boolean(id) && enabled,
    queryFn: () => getTransactionCase(id, selectedAppId ?? undefined),
  });
}

export function useTransactionActions(id: string) {
  const { selectedAppId } = useSettingsAppSelection();
  const appId = selectedAppId ?? undefined;
  return {
    resolve: useMutation({ mutationFn: (body: Parameters<typeof resolveTransactionCase>[1]) => resolveTransactionCase(id, body, appId) }),
    escalate: useMutation({ mutationFn: (notes: string) => escalateTransactionCase(id, notes, appId) }),
    placePnd: useMutation({ mutationFn: (body: Parameters<typeof placeTransactionPnd>[1]) => placeTransactionPnd(id, body, appId) }),
    sarRationale: useMutation({ mutationFn: (body: Parameters<typeof generateTransactionSarRationale>[1]) => generateTransactionSarRationale(id, body, appId) }),
  };
}