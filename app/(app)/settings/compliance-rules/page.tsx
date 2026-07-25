"use client";

import { ComplianceRulesPanel } from "@/components/settings/ComplianceRulesPanel";
import { SettingsQueryGate } from "@/components/settings/SettingsQueryGate";
import {
  useSettingsCompliance,
  useUpdateSettingsCompliance,
} from "@/lib/hooks/use-settings";
import { runAction } from "@/lib/toast";

export default function ComplianceRulesPage() {
  const complianceQuery = useSettingsCompliance();
  const updateCompliance = useUpdateSettingsCompliance();

  return (
    <SettingsQueryGate
      isLoading={complianceQuery.isLoading}
      isError={complianceQuery.isError}
      error={complianceQuery.error}
      onRetry={() => void complianceQuery.refetch()}
    >
      {complianceQuery.data ? (
        <ComplianceRulesPanel
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
  );
}
