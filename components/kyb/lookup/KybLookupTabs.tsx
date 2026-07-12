"use client";

import type { KybLookupTab } from "@/types/kyb";
import { cn } from "@/lib/utils";

const tabs: { id: KybLookupTab; label: string }[] = [
  { id: "registry", label: "Business Registry" },
  { id: "risk-analysis", label: "Risk Score Analysis" },
  { id: "validation", label: "Validation Information" },
  { id: "aml-screening", label: "AML Screening" },
  { id: "directors", label: "Directors & Officers" },
];

type KybLookupTabsProps = {
  activeTab: KybLookupTab;
  onTabChange: (tab: KybLookupTab) => void;
};

export function KybLookupTabs({ activeTab, onTabChange }: KybLookupTabsProps) {
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
