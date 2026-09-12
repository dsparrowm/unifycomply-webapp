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
    <div className="inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] p-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              isActive
                ? "bg-[color:var(--bg-surface)] font-medium text-[color:var(--accent-primary-hover)] shadow-sm"
                : "text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
