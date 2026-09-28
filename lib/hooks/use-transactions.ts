"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/api/errors";
import {
  mapApiTransactionDetailPayload,
  mapApiTransactionToDetail,
  mapApiTransactionsToListData,
  type TmCustomerNameMap,
} from "@/lib/api/mappers/transactions";
import {
  getTransaction,
  getTransactionDetail,
  listTransactions,
} from "@/lib/api/transactions";
import type { ApiTransaction } from "@/lib/api/types";
import {
  getTmTransactionDetail,
  tmTransactionsListPopulated,
} from "@/lib/data/transactions";
import { useSettingsAppSelection } from "@/lib/hooks/use-tenant-apps";

export const transactionKeys = {
  listRoot: ["transactions", "list"] as const,
  list: (appId: string | null, mock: boolean) =>
    [...transactionKeys.listRoot, appId ?? "default", mock ? "mock" : "live"] as const,
  detail: (id: string, appId: string | null, mock: boolean) =>
    ["transactions", "detail", id, appId ?? "default", mock ? "mock" : "live"] as const,
};

/**
 * The list payload carries only `customerId`; the customer name is exposed on
 * `/transactions/{id}/detail`, so resolve one transaction per distinct customer.
 */
async function resolveCustomerNames(
  items: ApiTransaction[],
  appId?: string,
): Promise<TmCustomerNameMap> {
  const firstTxByCustomer = new Map<string, string>();
  for (const tx of items) {
    if (tx.customerId && tx.id && !tx.customerName && !firstTxByCustomer.has(tx.customerId)) {
      firstTxByCustomer.set(tx.customerId, tx.id);
    }
  }

  const entries = await Promise.allSettled(
    [...firstTxByCustomer].map(async ([customerId, txId]) => {
      const detail = await getTransactionDetail(txId, appId);
      return [customerId, detail.customer?.name ?? ""] as const;
    }),
  );

  const names: TmCustomerNameMap = {};
  for (const entry of entries) {
    if (entry.status === "fulfilled" && entry.value[1]) {
      names[entry.value[0]] = entry.value[1];
    }
  }
  return names;
}

export function useTransactionsList() {
  const { selectedAppId } = useSettingsAppSelection();
  const searchParams = useSearchParams();
  const mock = searchParams.get("mock") === "1";

  return useQuery({
    queryKey: transactionKeys.list(selectedAppId, mock),
    queryFn: async () => {
      if (mock) {
        return tmTransactionsListPopulated;
      }
      const appId = selectedAppId ?? undefined;
      const { items } = await listTransactions({ page: "1", limit: "100" }, appId);
      const names = await resolveCustomerNames(items, appId);
      return mapApiTransactionsToListData(items, names);
    },
  });
}

export function useTransactionDetail(id: string) {
  const { selectedAppId } = useSettingsAppSelection();
  const searchParams = useSearchParams();
  const mock = searchParams.get("mock") === "1";

  return useQuery({
    queryKey: transactionKeys.detail(id, selectedAppId, mock),
    enabled: Boolean(id),
    queryFn: async () => {
      const fixture = getTmTransactionDetail(id);
      if (mock && fixture) {
        return fixture;
      }

      // Keep Figma fixture details for mock row ids when live payload is unavailable.
      if (fixture && id.startsWith("txn-")) {
        return fixture;
      }

      const appId = selectedAppId ?? undefined;
      try {
        const payload = await getTransactionDetail(id, appId);
        const mapped = payload?.transaction ? mapApiTransactionDetailPayload(payload) : null;
        if (mapped) {
          return mapped;
        }
      } catch (error) {
        if (error instanceof ApiError && error.status === 403) {
          throw error;
        }
      }

      try {
        const tx = await getTransaction(id, appId);
        const mapped = mapApiTransactionToDetail(tx);
        if (!mapped) {
          throw new ApiError("Transaction not found", 404);
        }
        return mapped;
      } catch (error) {
        if (fixture) {
          return fixture;
        }
        throw error;
      }
    },
    retry: (failureCount, error) => {
      if (error instanceof ApiError && (error.status === 404 || error.status === 403)) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
