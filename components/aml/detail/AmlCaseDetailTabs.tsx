"use client";

import { cn } from "@/lib/utils";
import type { AmlCaseDetailTab } from "@/types/aml";

const tabs: { id: AmlCaseDetailTab; label: string }[] = [
  { id: "data-summary", label: "Data Summary" },
  { id: "verifications", label: "Verifications" },
  { id: "sources", label: "Sources" },
  { id: "warning", label: "Warning and regulatory enforcement" },
  { id: "risk-analysis", label: "Risk Analysis" },
  { id: "decision-history", label: "Decision history" },
];

type AmlCaseDetailTabsProps = {
  activeTab: AmlCaseDetailTab;
  onTabChange: (tab: AmlCaseDetailTab) => void;
};

export function AmlCaseDetailTabs({ activeTab, onTabChange }: AmlCaseDetailTabsProps) {
  return (
    <div className="inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] p-1">
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
  );
}
