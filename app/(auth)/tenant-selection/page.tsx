"use client";

import { useRouter } from "next/navigation";
import { Building2, ChevronRight } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/AuthLayout";
import { mockTenants, useAuthStore } from "@/store/auth.store";
import { getTenantRoleLabel } from "@/lib/rbac/permissions";
import type { Tenant } from "@/store/auth.store";

export default function TenantSelectionPage() {
  const router = useRouter();
  const selectTenant = useAuthStore((state) => state.selectTenant);

  const handleSelect = (tenant: Tenant) => {
    selectTenant(tenant);
    router.push("/overview");
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

        <div className="space-y-3">
          {mockTenants.map((tenant) => (
            <button
              key={tenant.id}
              type="button"
              onClick={() => handleSelect(tenant)}
              className="flex w-full items-center justify-between rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-4 text-left transition-colors hover:border-[color:var(--accent-primary)] hover:bg-[color:var(--accent-primary-soft)]"
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
                    {getTenantRoleLabel(tenant.role)}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[color:var(--text-light)]" />
            </button>
          ))}
        </div>
      </div>
    </AuthSplitLayout>
  );
}
