"use client";

import { useQuery } from "@tanstack/react-query";
import { getCustomerStatement } from "@/lib/api/transaction-monitoring";
import { mapApiCustomerStatement } from "@/lib/api/mappers/transaction-monitoring";
import { useSettingsAppSelection } from "@/lib/hooks/use-tenant-apps";

export function useCustomerStatement(customerId: string | undefined) {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: ["transaction-monitoring", "statement", customerId, selectedAppId ?? "default"],
    enabled: Boolean(customerId),
    queryFn: async () =>
      mapApiCustomerStatement(
        await getCustomerStatement(customerId as string, selectedAppId ?? undefined),
      ),
  });
}