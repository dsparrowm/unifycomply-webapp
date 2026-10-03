import { apiFetch } from "@/lib/api/client";
import type { ApiPublicOptionSet } from "@/lib/api/types";

export function getPublicOptionSet(key: string) {
  return apiFetch<ApiPublicOptionSet | null>(
    `/api/v1/public/misc/options/${encodeURIComponent(key)}`,
  );
}
