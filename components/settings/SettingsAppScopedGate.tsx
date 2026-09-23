"use client";

import { useState, type ReactNode } from "react";
import { AppWindow } from "lucide-react";
import { CreateAppModal } from "@/components/settings/CreateAppModal";
import { EmptyState } from "@/components/feedback/EmptyState";
import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { getErrorMessage } from "@/lib/api/errors";
import { useCreateTenantApp, useSettingsAppSelection } from "@/lib/hooks/use-tenant-apps";
import { runAction } from "@/lib/toast";

type SettingsAppScopedGateProps = {
  children: ReactNode;
};

export function SettingsAppScopedGate({ children }: SettingsAppScopedGateProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const { apps, selectedAppId, isLoading, isError, error, refetch } = useSettingsAppSelection();
  const createApp = useCreateTenantApp();

  if (isLoading) {
    return <PageLoadingSkeleton variant="generic" />;
  }

  if (isError) {
    return (
      <PageErrorState
        title="Could not load apps"
        description={getErrorMessage(error, "Please try again.")}
        onRetry={() => void refetch()}
      />
    );
  }

  if (apps.length === 0) {
    return (
      <>
        <EmptyState
          icon={AppWindow}
          title="No apps yet"
          description="Create an app to configure API keys, approvals, PEP, notifications, and compliance rules."
          action={
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="rounded-lg bg-[color:var(--accent-primary-hover)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[color:var(--accent-primary)]"
            >
              Create App
            </button>
          }
        />
        <CreateAppModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreate={async (values) => {
            await runAction(() => createApp.mutateAsync(values), {
              success: "App created",
              error: "Could not create app",
            });
          }}
        />
      </>
    );
  }

  if (!selectedAppId) {
    return <PageLoadingSkeleton variant="generic" />;
  }

  return children;
}
