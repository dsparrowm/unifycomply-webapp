"use client";

import { cn } from "@/lib/utils";

const detailTabs = [
  "Bank Summary",
  "Network Intelligence",
  "Alerts",
  "Compliance",
  "Decision history",
] as const;

const summaryTabs = ["Key Summary", "Linked Entity", "Account Analysis"] as const;

export type BankAnalysisSummaryTab = "Key Summary" | "Linked Entity" | "Account Analysis";
export type BankAnalysisDetailTab =
  | "Bank Summary"
  | "Network Intelligence"
  | "Alerts"
  | "Compliance"
  | "Decision history";

function isEnabledSummaryTab(tab: string): tab is BankAnalysisSummaryTab {
  return tab === "Key Summary" || tab === "Linked Entity" || tab === "Account Analysis";
}

function isEnabledDetailTab(tab: string): tab is BankAnalysisDetailTab {
  return (
    tab === "Bank Summary" ||
    tab === "Network Intelligence" ||
    tab === "Alerts" ||
    tab === "Compliance" ||
    tab === "Decision history"
  );
}

type BankAnalysisDetailTabsProps = {
  level: "detail" | "summary";
  activeDetailTab?: BankAnalysisDetailTab;
  onDetailTabChange?: (tab: BankAnalysisDetailTab) => void;
  activeSummaryTab?: BankAnalysisSummaryTab;
  onSummaryTabChange?: (tab: BankAnalysisSummaryTab) => void;
};

export function BankAnalysisDetailTabs({
  level,
  activeDetailTab = "Bank Summary",
  onDetailTabChange,
  activeSummaryTab = "Key Summary",
  onSummaryTabChange,
}: BankAnalysisDetailTabsProps) {
  const tabs = level === "detail" ? detailTabs : summaryTabs;

  return (
    <div
      className={cn(
        "flex max-w-full overflow-x-auto rounded-lg bg-[color:var(--bg-muted)] p-1",
        level === "detail" ? "w-fit gap-1" : "gap-1",
      )}
      role="tablist"
      aria-label={level === "detail" ? "Bank analysis sections" : "Summary sections"}
    >
      {tabs.map((tab) => {
        const isSummaryTab = level === "summary";
        const isActive = isSummaryTab ? tab === activeSummaryTab : tab === activeDetailTab;
        const isDisabled = isSummaryTab ? false : !isEnabledDetailTab(tab);

        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            onClick={() => {
              if (isSummaryTab && isEnabledSummaryTab(tab)) {
                onSummaryTabChange?.(tab);
              } else if (!isSummaryTab && isEnabledDetailTab(tab)) {
                onDetailTabChange?.(tab);
              }
            }}
            className={cn(
              "shrink-0 rounded-md px-3 py-2 text-xs transition-colors",
              isActive
                ? "bg-[color:var(--bg-surface)] font-medium text-[color:var(--accent-primary-hover)] shadow-sm"
                : isDisabled
                  ? "cursor-default text-[color:var(--text-muted)]"
                  : "text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]",
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
