"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicOptionSet } from "@/lib/api/options";
import type { ApiPublicOption } from "@/lib/api/types";

const KEYS = [
  "case-resolution-types",
  "case-actions-taken",
  "investigation-entity-types",
  "investigation-risk-levels",
] as const;

export type InvestigationOptionKey = (typeof KEYS)[number];

async function loadInvestigationOptions(): Promise<Record<InvestigationOptionKey, ApiPublicOption[]>> {
  const entries = await Promise.all(
    KEYS.map(async (key) => {
      const set = await getPublicOptionSet(key).catch(() => null);
      return [key, set?.options ?? []] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<InvestigationOptionKey, ApiPublicOption[]>;
}

export function useInvestigationOptions() {
  return useQuery({
    queryKey: ["options", "investigation"],
    queryFn: loadInvestigationOptions,
    staleTime: 5 * 60 * 1000,
  });
}
