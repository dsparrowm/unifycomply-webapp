"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ChevronRight } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/AuthLayout";
import { getErrorMessage } from "@/lib/api/errors";
import { getTenantRoleLabel, normalizeTenantRole } from "@/lib/rbac/permissions";
import { useAuthStore, type Tenant } from "@/store/auth.store";
import { useUiStore } from "@/store/ui.store";

export default function TenantSelectionPage() {
  const router = useRouter();
  const userAccess = useAuthStore((state) => state.userAccess);
  const selectAccess = useAuthStore((state) => state.selectAccess);
  const setEnvironment = useUiStore((state) => state.setEnvironment);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const tenants: Tenant[] = userAccess.map((access) => ({
    id: access.tenantId,
    accessId: access.id,
    name: access.tenantName,
    role: normalizeTenantRole(null) ?? "compliance-officer",
    roleId: access.roleId,
    tenantId: access.tenantId,
  }));

  const handleSelect = async (accessId: string) => {
    setError(null);
    setPendingId(accessId);
    try {
      await selectAccess(accessId);
      setEnvironment(useAuthStore.getState().domain);
      router.push("/overview");
    } catch (err) {
      setError(getErrorMessage(err, "Could not switch workspace"));
    } finally {
      setPendingId(null);
    }
  };

  return (
    <AuthSplitLayout>
      <div className="w-full max-w-[461px]">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold text-[color:var(--text-primary)]">
            Choose a workspace
          </h1>
          <p className="text-sm text-[color:var(--text-muted)]">
            Select the organization you want to access.
          </p>
        </div>

        {error ? (
          <p className="mb-4 text-sm text-[color:var(--state-error)]" role="alert">
            {error}
          </p>
        ) : null}

        <div className="space-y-3">
          {tenants.length === 0 ? (
            <p className="text-sm text-[color:var(--text-muted)]">
              No workspaces are available for this account.
            </p>
          ) : (
            tenants.map((tenant) => (
              <button
                key={tenant.accessId}
                type="button"
                disabled={pendingId !== null}
                onClick={() => handleSelect(tenant.accessId)}
                className="flex w-full items-center justify-between rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-4 text-left transition-colors hover:border-[color:var(--accent-primary)] hover:bg-[color:var(--accent-primary-soft)] disabled:opacity-60"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary)]">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[color:var(--text-primary)]">
                      {tenant.name}
                    </p>
                    <p className="text-xs text-[color:var(--text-light)]">
                      {pendingId === tenant.accessId
                        ? "Switching…"
                        : getTenantRoleLabel(tenant.role)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[color:var(--text-light)]" />
              </button>
            ))
          )}
        </div>
      </div>
    </AuthSplitLayout>
  );
}
