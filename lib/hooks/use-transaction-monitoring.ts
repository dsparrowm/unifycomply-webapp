"use client";

import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiErrorCode } from "@/lib/api/errors";
import { useSettingsAppSelection } from "@/lib/hooks/use-tenant-apps";
import {
  assignTransactionCase,
  escalateTransactionCase,
  generateTransactionSarRationale,
  getTransactionMonitoringOverview,
  getTransactionCase,
  listTransactionMonitoringQueue,
  placeTransactionPnd,
  resolveTransactionCase,
  sendSarDraftMessage,
  startSarDraft,
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
  const queryClient = useQueryClient();
  const appId = selectedAppId ?? undefined;
  return {
    resolve: useMutation({
      mutationFn: (body: Parameters<typeof resolveTransactionCase>[1]) => resolveTransactionCase(id, body, appId),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["transaction-monitoring", "case", id] });
      },
    }),
    escalate: useMutation({ mutationFn: (notes: string) => escalateTransactionCase(id, notes, appId) }),
    assignCase: useMutation({
      mutationFn: (userId: string | null) => assignTransactionCase(id, userId, appId),
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["transaction-monitoring", "case", id],
        });
      },
    }),
    placePnd: useMutation({ mutationFn: (body: Parameters<typeof placeTransactionPnd>[1]) => placeTransactionPnd(id, body, appId) }),
    sarRationale: useMutation({ mutationFn: (body: Parameters<typeof generateTransactionSarRationale>[1]) => generateTransactionSarRationale(id, body, appId) }),
  };
}

function draftReplyText(reply: Awaited<ReturnType<typeof sendSarDraftMessage>>): string {
  const messages = reply.conversation?.messages ?? [];
  const assistant = [...messages].reverse().find((message) => message.role === "assistant");
  if (assistant?.content?.trim()) {
    return assistant.content.trim();
  }
  const narrative = reply.draftNarrative?.narrative;
  const parts = [
    narrative?.openingStatement,
    narrative?.activityDescription,
    narrative?.whyItsSuspicious,
    narrative?.investigationStepsTaken,
    narrative?.summaryAndRecommendation,
  ].filter((part): part is string => Boolean(part && part.trim()));
  return parts.join("\n\n");
}

/** Existing SAR assistant step. A failed provider call stays in the message list. */
export function useSarDraft(transactionId: string) {
  const { selectedAppId } = useSettingsAppSelection();
  const conversationId = useRef<string | null>(null);

  return async (message: string): Promise<string> => {
    const appId = selectedAppId ?? undefined;
    try {
      if (!conversationId.current) {
        const started = await startSarDraft(transactionId, appId);
        conversationId.current = started.id;
      }
      const reply = await sendSarDraftMessage(
        transactionId,
        conversationId.current,
        message,
        appId,
      );
      return draftReplyText(reply) || "Drafting unavailable";
    } catch (error) {
      if (apiErrorCode(error) === "ai-not-configured") {
        return "Drafting unavailable";
      }
      return "Drafting unavailable";
    }
  };
}