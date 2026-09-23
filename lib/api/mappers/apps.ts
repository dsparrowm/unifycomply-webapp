import { unwrapCollection } from "@/lib/api/mappers/customers";
import type { ApiTenantApp } from "@/lib/api/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function isDisabled(value: Record<string, unknown>): boolean {
  if (value.disabled === true) return true;
  const status = asString(value.status)?.toLowerCase();
  return status === "disabled" || status === "inactive" || status === "deleted";
}

function mapTenantApp(value: unknown): ApiTenantApp | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = asString(value.id) ?? asString(value.appId);
  if (!id) {
    return null;
  }

  return {
    id,
    name: asString(value.name) ?? "Untitled app",
    description: asString(value.description) ?? null,
    disabled: isDisabled(value),
  };
}

export function mapTenantApps(data: unknown): ApiTenantApp[] {
  let rows = unwrapCollection(data);
  if (rows.length === 0 && isRecord(data) && Array.isArray(data.apps)) {
    rows = data.apps;
  }

  const apps: ApiTenantApp[] = [];
  for (const row of rows) {
    const app = mapTenantApp(row);
    if (app && !app.disabled) {
      apps.push(app);
    }
  }

  if (apps.length === 0) {
    const single = mapTenantApp(data);
    if (single && !single.disabled) {
      return [single];
    }
  }

  return apps;
}

export function extractAppId(result: unknown): string | null {
  if (typeof result === "string" && result.trim()) {
    return result.trim();
  }
  if (!isRecord(result)) {
    return null;
  }

  const direct = asString(result.id) ?? asString(result.appId) ?? mapTenantApp(result)?.id;
  if (direct) {
    return direct;
  }

  for (const key of ["app", "tenantApp", "created"]) {
    const nested = mapTenantApp(result[key]);
    if (nested) {
      return nested.id;
    }
  }

  return null;
}
