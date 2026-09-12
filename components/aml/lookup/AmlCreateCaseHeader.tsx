"use client";

import { AmlToggle } from "@/components/aml/lookup/AmlToggle";
import { KybLookupBackHeader } from "@/components/kyb/lookup/KybLookupBackHeader";

type AmlCreateCaseHeaderProps = {
  activeMonitoring: boolean;
  onActiveMonitoringChange: (checked: boolean) => void;
};

export function AmlCreateCaseHeader({
  activeMonitoring,
  onActiveMonitoringChange,
}: AmlCreateCaseHeaderProps) {
  return (
    <KybLookupBackHeader
      backHref="/aml-screening"
      breadcrumb="Create a New Case"
      action={
        <AmlToggle
          id="aml-header-monitoring"
          label="Active Monitoring"
          checked={activeMonitoring}
          onChange={onActiveMonitoringChange}
        />
      }
    />
  );
}
