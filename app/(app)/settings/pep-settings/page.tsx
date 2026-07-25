"use client";

import { PepSettingsPanel } from "@/components/settings/PepSettingsPanel";
import { SettingsQueryGate } from "@/components/settings/SettingsQueryGate";
import { useSettingsPep, useUpdatePepTier } from "@/lib/hooks/use-settings";

export default function PepSettingsPage() {
  const pepQuery = useSettingsPep();
  const updatePep = useUpdatePepTier();

  return (
    <SettingsQueryGate
      isLoading={pepQuery.isLoading}
      isError={pepQuery.isError}
      error={pepQuery.error}
      onRetry={() => void pepQuery.refetch()}
    >
      {pepQuery.data ? (
        <PepSettingsPanel
          pepSettings={pepQuery.data}
          onSaveTier={async (tier) => {
            await updatePep.mutateAsync({
              tier: tier.id as "tier-1" | "tier-2" | "tier-3" | "tier-4",
              name: tier.title,
              description: tier.description,
              riskScoreImpact: tier.riskScoreImpact,
              requiresApproval: tier.requiresApproval,
              autoEscalation: tier.autoEscalation,
              examples: tier.examples,
            });
          }}
        />
      ) : null}
    </SettingsQueryGate>
  );
}
