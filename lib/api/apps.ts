import { apiFetch, apiFetchEnvelope } from "@/lib/api/client";
import { extractAppId, mapTenantApps } from "@/lib/api/mappers/apps";
import type { ApiTenantApp, CreateTenantAppDto } from "@/lib/api/types";

export async function listTenantApps(): Promise<ApiTenantApp[]> {
  const envelope = await apiFetchEnvelope<unknown>("/api/v1/tenants/apps");
  return mapTenantApps(envelope.data);
}

export async function createTenantApp(body: CreateTenantAppDto): Promise<string | null> {
  const result = await apiFetch<unknown>("/api/v1/tenants/apps", {
    method: "POST",
    body,
  });
  return extractAppId(result);
}
