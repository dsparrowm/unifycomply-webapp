"use client";

import { cn } from "@/lib/utils";
import type { AmlDetailTab, AmlSummaryTab } from "@/types/aml-screening";

const primaryTabs: { id: AmlDetailTab; label: string }[] = [
  { id: "data-summary", label: "Data Summary" },
  { id: "verifications", label: "Verifications" },
  { id: "sources", label: "Sources" },
  { id: "warning-regulatory", label: "Warning and regulatory enforcement" },
  { id: "risk-analysis", label: "Risk Analysis" },
  { id: "decision-history", label: "Decision history" },
];

const summaryTabs: { id: AmlSummaryTab; label: string }[] = [
  { id: "key-summary", label: "Key Summary" },
  { id: "linked-entities", label: "Linked Entities" },
  { id: "additional-information", label: "Additional information" },
];

type AmlDetailPrimaryTabsProps = {
  activeTab: AmlDetailTab;
  onTabChange: (tab: AmlDetailTab) => void;
};

export function AmlDetailPrimaryTabs({ activeTab, onTabChange }: AmlDetailPrimaryTabsProps) {
  return (
    <div
      className="flex max-w-full gap-1 overflow-x-auto border-b border-[color:var(--border-default)]"
      role="tablist"
      aria-label="AML screening sections"
    >
      {primaryTabs.map((tab) => {
        const isActive = tab.id === activeTab;
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

type AmlDetailSummaryTabsProps = {
  activeTab: AmlSummaryTab;
  onTabChange: (tab: AmlSummaryTab) => void;
};

export function AmlDetailSummaryTabs({ activeTab, onTabChange }: AmlDetailSummaryTabsProps) {
  return (
    <div
      className="flex max-w-full gap-1 overflow-x-auto rounded-lg bg-[color:var(--bg-muted)] p-1"
      role="tablist"
      aria-label="Data summary sections"
    >
      {summaryTabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "shrink-0 rounded-md px-3 py-2 text-xs transition-colors",
              isActive
                ? "bg-[color:var(--accent-primary-soft)] font-medium text-[color:var(--accent-primary-hover)]"
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
