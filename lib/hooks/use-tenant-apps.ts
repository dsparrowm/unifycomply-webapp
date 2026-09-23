"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenantApp, listTenantApps } from "@/lib/api/apps";
import type { CreateTenantAppDto } from "@/lib/api/types";
import { useAuthStore } from "@/store/auth.store";
import { useSettingsAppStore } from "@/store/settings-app.store";

export const appsKeys = {
  list: ["tenants", "apps"] as const,
};

export function useTenantApps() {
  return useQuery({
    queryKey: appsKeys.list,
    queryFn: listTenantApps,
  });
}

export function useSettingsAppSelection() {
  const tenantId = useAuthStore((state) => state.tenant?.tenantId);
  const selectedAppIdByTenant = useSettingsAppStore((state) => state.selectedAppIdByTenant);
  const persistSelectedAppId = useSettingsAppStore((state) => state.setSelectedAppId);
  const appsQuery = useTenantApps();
  const apps = appsQuery.data ?? [];
  const storedId = tenantId ? selectedAppIdByTenant[tenantId] : undefined;
  const selectedAppId = apps.some((app) => app.id === storedId) ? storedId : undefined;

  useEffect(() => {
    if (!tenantId || apps.length === 0) {
      return;
    }
    if (storedId && apps.some((app) => app.id === storedId)) {
      return;
    }
    persistSelectedAppId(tenantId, apps[0].id);
  }, [tenantId, apps, storedId, persistSelectedAppId]);

  const setSelectedAppId = (appId: string) => {
    if (!tenantId) {
      return;
    }
    persistSelectedAppId(tenantId, appId);
  };

  return {
    tenantId,
    apps,
    selectedAppId: selectedAppId ?? null,
    selectedApp: apps.find((app) => app.id === selectedAppId) ?? null,
    isLoading: appsQuery.isLoading,
    isError: appsQuery.isError,
    error: appsQuery.error,
    refetch: appsQuery.refetch,
    setSelectedAppId,
  };
}

export function useCreateTenantApp() {
  const queryClient = useQueryClient();
  const tenantId = useAuthStore((state) => state.tenant?.tenantId);
  const persistSelectedAppId = useSettingsAppStore((state) => state.setSelectedAppId);

  return useMutation({
    mutationFn: (body: CreateTenantAppDto) => createTenantApp(body),
    onSuccess: async (appId) => {
      await queryClient.invalidateQueries({ queryKey: appsKeys.list });
      if (tenantId && appId) {
        persistSelectedAppId(tenantId, appId);
      }
    },
  });
}

export function requireSettingsAppId(appId: string | null): string {
  if (!appId) {
    throw new Error("Select an app first");
  }
  return appId;
}
