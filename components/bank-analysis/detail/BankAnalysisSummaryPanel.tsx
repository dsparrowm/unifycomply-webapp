"use client";

import { useState } from "react";
import { BankAnalysisAccountCard } from "@/components/bank-analysis/detail/BankAnalysisAccountCard";
import { BankAnalysisDateRangeMenu } from "@/components/bank-analysis/detail/BankAnalysisDateRangeMenu";
import {
  BankAnalysisDetailTabs,
  type BankAnalysisSummaryTab,
} from "@/components/bank-analysis/detail/BankAnalysisDetailTabs";
import { BankAnalysisFinancialReport } from "@/components/bank-analysis/detail/BankAnalysisFinancialReport";
import { BankAnalysisLinkedEntityCard } from "@/components/bank-analysis/detail/BankAnalysisLinkedEntityCard";
import type { BankAnalysisDetail } from "@/types/bank-analysis";

type BankAnalysisSummaryPanelProps = {
  detail: BankAnalysisDetail;
};

export function BankAnalysisSummaryPanel({
  detail,
}: BankAnalysisSummaryPanelProps) {
  const [activeTab, setActiveTab] = useState<BankAnalysisSummaryTab>("Key Summary");

  const accountPortfolio =
    activeTab === "Linked Entity" ? detail.linkedEntityAccounts : detail.accountPortfolio;

  return (
    <section className="overflow-hidden rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
      <div className="flex flex-col gap-4 border-b border-[color:var(--border-default)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <BankAnalysisDetailTabs
          level="summary"
          activeSummaryTab={activeTab}
          onSummaryTabChange={setActiveTab}
        />
        <BankAnalysisDateRangeMenu />
      </div>

      <div className="space-y-8 p-4 sm:p-6">
        {activeTab === "Account Analysis" ? (
          <BankAnalysisFinancialReport analysis={detail.accountAnalysis} />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-8">
              <div className="rounded-lg border border-[color:var(--accent-primary-hover)] p-5">
                <p className="text-sm font-medium text-[color:var(--text-muted)]">
                  Account Portfolio
                </p>
                <p className="mt-5 text-4xl font-semibold text-[color:var(--text-primary)]">
                  {accountPortfolio}
                </p>
              </div>
              <div className="rounded-lg border border-[color:var(--border-default)] p-5">
                <p className="text-sm font-medium text-[color:var(--text-muted)]">
                  Linked Entity
                </p>
                <p className="mt-5 text-4xl font-semibold text-[color:var(--text-primary)]">
                  {detail.linkedEntities}
                </p>
              </div>
            </div>

            {activeTab === "Key Summary" ? (
              <div className="grid gap-10 md:grid-cols-2">
                {detail.accounts.map((account) => (
                  <BankAnalysisAccountCard key={account.id} account={account} />
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {detail.linkedEntityRecords.map((entity) => (
                  <BankAnalysisLinkedEntityCard key={entity.id} entity={entity} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
