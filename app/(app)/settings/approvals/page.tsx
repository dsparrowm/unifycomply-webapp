"use client";

import { ApprovalsPanel } from "@/components/settings/ApprovalsPanel";
import { SettingsAppScopedGate } from "@/components/settings/SettingsAppScopedGate";
import { SettingsQueryGate } from "@/components/settings/SettingsQueryGate";
import {
  useSaveSettingsApprovals,
  useSettingsApprovals,
} from "@/lib/hooks/use-settings";
import { useSettingsAppSelection } from "@/lib/hooks/use-tenant-apps";
import { runAction } from "@/lib/toast";

export default function ApprovalsPage() {
  const { selectedAppId } = useSettingsAppSelection();
  const approvalsQuery = useSettingsApprovals();
  const saveApprovals = useSaveSettingsApprovals();

  return (
    <SettingsAppScopedGate>
      <SettingsQueryGate
        isLoading={approvalsQuery.isLoading}
        isError={approvalsQuery.isError}
        error={approvalsQuery.error}
        onRetry={() => void approvalsQuery.refetch()}
      >
        {approvalsQuery.data ? (
          <ApprovalsPanel
            key={selectedAppId}
            approvals={approvalsQuery.data}
            onSave={async (input) => {
              await runAction(() => saveApprovals.mutateAsync(input), {
                success: "Approval settings saved",
                error: "Could not save approval settings",
              });
            }}
          />
        ) : null}
      </SettingsQueryGate>
    </SettingsAppScopedGate>
  );
}
