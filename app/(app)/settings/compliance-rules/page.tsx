"use client";

import { ComplianceRulesPanel } from "@/components/settings/ComplianceRulesPanel";
import { SettingsAppScopedGate } from "@/components/settings/SettingsAppScopedGate";
import { SettingsQueryGate } from "@/components/settings/SettingsQueryGate";
import {
  useSettingsCompliance,
  useUpdateSettingsCompliance,
} from "@/lib/hooks/use-settings";
import { useSettingsAppSelection } from "@/lib/hooks/use-tenant-apps";
import { runAction } from "@/lib/toast";

export default function ComplianceRulesPage() {
  const { selectedAppId } = useSettingsAppSelection();
  const complianceQuery = useSettingsCompliance();
  const updateCompliance = useUpdateSettingsCompliance();

  return (
    <SettingsAppScopedGate>
      <SettingsQueryGate
        isLoading={complianceQuery.isLoading}
        isError={complianceQuery.isError}
        error={complianceQuery.error}
        onRetry={() => void complianceQuery.refetch()}
      >
        {complianceQuery.data ? (
          <ComplianceRulesPanel
            key={selectedAppId}
            complianceRules={complianceQuery.data}
            onSave={async (input) => {
              await runAction(() => updateCompliance.mutateAsync(input), {
                success: "Compliance rules saved",
                error: "Could not save compliance rules",
              });
            }}
          />
        ) : null}
      </SettingsQueryGate>
    </SettingsAppScopedGate>
  );
}
