"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicOptionSet } from "@/lib/api/options";
import type { TmTxStatus } from "@/types/transaction-monitoring";

/** Figma Status pills. Used until `transaction-statuses` loads, and for any value it omits. */
export const tmStatusPillLabels: Record<TmTxStatus, string> = {
  pending: "Pending",
  cleared: "Cleared",
  "in-review": "In Review",
  blocked: "Blocked",
};

const STATUS_VALUES = new Set<string>(Object.keys(tmStatusPillLabels));

export function useTransactionStatusLabels(): Record<TmTxStatus, string> {
  const query = useQuery({
    queryKey: ["public-options", "transaction-statuses"],
    queryFn: () => getPublicOptionSet("transaction-statuses"),
    staleTime: 60 * 60 * 1000,
  });

  const labels = { ...tmStatusPillLabels };
  for (const option of query.data?.options ?? []) {
    if (STATUS_VALUES.has(option.value) && option.label.trim()) {
      labels[option.value as TmTxStatus] = option.label.trim();
    }
  }
  return labels;
}
