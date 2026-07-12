"use client";

import type { KycDetailTab } from "@/types/kyc";
import { cn } from "@/lib/utils";

const tabs: { id: KycDetailTab; label: string }[] = [
  { id: "document", label: "National ID + Selfie" },
  { id: "risk-analysis", label: "Risk Score Analysis" },
  { id: "aml-screening", label: "AML Screening" },
  { id: "ip-device", label: "Ip & Device Information" },
  { id: "liveness", label: "Liveness detection" },
];

type KycDetailTabsProps = {
  activeTab: KycDetailTab;
  onTabChange: (tab: KycDetailTab) => void;
};

export function KycDetailTabs({ activeTab, onTabChange }: KycDetailTabsProps) {
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
              ? "bg-[color:var(--bg-surface)] font-medium text-[color:var(--accent-primary-hover)] shadow-sm"
              : "text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
