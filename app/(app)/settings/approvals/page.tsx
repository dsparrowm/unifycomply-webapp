"use client";

import { ApprovalsPanel } from "@/components/settings/ApprovalsPanel";
import { SettingsQueryGate } from "@/components/settings/SettingsQueryGate";
import {
  useSaveSettingsApprovals,
  useSettingsApprovals,
} from "@/lib/hooks/use-settings";
import { runAction } from "@/lib/toast";

export default function ApprovalsPage() {
  const approvalsQuery = useSettingsApprovals();
  const saveApprovals = useSaveSettingsApprovals();

  return (
    <SettingsQueryGate
      isLoading={approvalsQuery.isLoading}
      isError={approvalsQuery.isError}
      error={approvalsQuery.error}
      onRetry={() => void approvalsQuery.refetch()}
    >
      {approvalsQuery.data ? (
        <ApprovalsPanel
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
  );
}
