"use client";

import type { KybDetailTab } from "@/types/kyb";
import { cn } from "@/lib/utils";

const tabs: { id: KybDetailTab; label: string }[] = [
  { id: "business-overview", label: "Business Overview" },
  { id: "risk-analysis", label: "Risk Score Analysis" },
  { id: "directors", label: "Directors & Officers" },
  { id: "shareholders", label: "Shareholders" },
  { id: "document", label: "Document" },
  { id: "compliance-checks", label: "Compliance Checks" },
];

type KybDetailTabsProps = {
  activeTab: KybDetailTab;
  onTabChange: (tab: KybDetailTab) => void;
};

export function KybDetailTabs({ activeTab, onTabChange }: KybDetailTabsProps) {
  return (
    <div
      className="flex max-w-full gap-1 overflow-x-auto border-b border-[color:var(--border-default)]"
      role="tablist"
      aria-label="KYB detail sections"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2.5 text-sm transition-colors",
              isActive
                ? "border-[color:var(--accent-primary-hover)] font-medium text-[color:var(--accent-primary-hover)]"
                : "border-transparent text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
