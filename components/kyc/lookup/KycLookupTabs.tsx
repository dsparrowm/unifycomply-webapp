"use client";

import type { KycLookupTab } from "@/types/kyc";
import { cn } from "@/lib/utils";

const tabs: { id: KycLookupTab; label: string }[] = [
  { id: "bvn", label: "Bank Verification Number" },
  { id: "risk-analysis", label: "Risk Score Analysis" },
  { id: "validation", label: "Validation Information" },
  { id: "aml-screening", label: "AML Screening" },
  { id: "ip-device", label: "Ip & Device Information" },
];

type KycLookupTabsProps = {
  activeTab: KycLookupTab;
  onTabChange: (tab: KycLookupTab) => void;
};

export function KycLookupTabs({ activeTab, onTabChange }: KycLookupTabsProps) {
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
