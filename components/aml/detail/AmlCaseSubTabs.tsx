"use client";

import { AmlToggle } from "@/components/aml/lookup/AmlToggle";
import { cn } from "@/lib/utils";
import type { AmlCaseSummaryTab } from "@/types/aml";

const tabs: { id: AmlCaseSummaryTab; label: string }[] = [
  { id: "key-summary", label: "Key Summary" },
  { id: "linked-entities", label: "Linked Entities" },
  { id: "additional-information", label: "Additional Information" },
];

type AmlCaseSubTabsProps = {
  activeTab: AmlCaseSummaryTab;
  onTabChange: (tab: AmlCaseSummaryTab) => void;
  title?: string;
  activeMonitoring: boolean;
  onActiveMonitoringChange: (checked: boolean) => void;
};

export function AmlCaseSubTabs({
  activeTab,
  onTabChange,
  title,
  activeMonitoring,
  onActiveMonitoringChange,
}: AmlCaseSubTabsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {title ? (
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          {title}
        </h2>
      ) : (
        <div className="inline-flex flex-wrap gap-1 rounded-lg bg-[color:var(--bg-muted)] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                activeTab === tab.id
                  ? "bg-[color:var(--bg-surface)] font-medium text-[color:var(--text-primary)] shadow-sm"
                  : "text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      <AmlToggle
        id="aml-case-monitoring"
        label="Active Monitoring"
        checked={activeMonitoring}
        onChange={onActiveMonitoringChange}
      />
    </div>
  );
}
