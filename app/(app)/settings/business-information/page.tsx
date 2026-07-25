"use client";

import { BusinessInformationPanel } from "@/components/settings/BusinessInformationPanel";
import { SettingsQueryGate } from "@/components/settings/SettingsQueryGate";
import {
  useBusinessSelectOptions,
  useSettingsBusiness,
  useUpdateSettingsBusiness,
} from "@/lib/hooks/use-settings";
import { runAction } from "@/lib/toast";

export default function BusinessInformationPage() {
  const businessQuery = useSettingsBusiness();
  const { industries, employeeCounts } = useBusinessSelectOptions();
  const updateBusiness = useUpdateSettingsBusiness();

  const isLoading =
    businessQuery.isLoading || industries.isLoading || employeeCounts.isLoading;
  const isError = businessQuery.isError || industries.isError || employeeCounts.isError;
  const error = businessQuery.error ?? industries.error ?? employeeCounts.error;

  return (
    <SettingsQueryGate
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => {
        void businessQuery.refetch();
        void industries.refetch();
        void employeeCounts.refetch();
      }}
    >
      {businessQuery.data ? (
        <BusinessInformationPanel
          business={businessQuery.data}
          industryOptionsOverride={(industries.data ?? []).map((item: { label: string; value: string }) => ({
            label: item.label,
            value: item.value,
          }))}
          employeeCountOptionsOverride={(employeeCounts.data ?? []).map((item: { id: string; label: string }) => ({
            label: item.label,
            value: item.id,
          }))}
          onSave={async (values) => {
            await runAction(() => updateBusiness.mutateAsync(values), {
              success: "Business information saved",
              error: "Could not save business information",
            });
          }}
        />
      ) : null}
    </SettingsQueryGate>
  );
}
