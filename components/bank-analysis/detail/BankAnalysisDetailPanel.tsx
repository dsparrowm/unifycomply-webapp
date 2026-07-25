"use client";

import { useState } from "react";
import { BankAnalysisAlertsPanel } from "@/components/bank-analysis/detail/BankAnalysisAlertsPanel";
import { BankAnalysisCompliancePanel } from "@/components/bank-analysis/detail/BankAnalysisCompliancePanel";
import { BankAnalysisDecisionHistoryPanel } from "@/components/bank-analysis/detail/BankAnalysisDecisionHistoryPanel";
import { BankAnalysisDetailHeader } from "@/components/bank-analysis/detail/BankAnalysisDetailHeader";
import { BankAnalysisDetailSidebar } from "@/components/bank-analysis/detail/BankAnalysisDetailSidebar";
import {
  BankAnalysisDetailTabs,
  type BankAnalysisDetailTab,
} from "@/components/bank-analysis/detail/BankAnalysisDetailTabs";
import { BankAnalysisNetworkPanel } from "@/components/bank-analysis/detail/BankAnalysisNetworkPanel";
import { BankAnalysisSummaryPanel } from "@/components/bank-analysis/detail/BankAnalysisSummaryPanel";
import type { BankAnalysisDetail } from "@/types/bank-analysis";

type BankAnalysisDetailPanelProps = {
  detail: BankAnalysisDetail;
};

export function BankAnalysisDetailPanel({
  detail,
}: BankAnalysisDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<BankAnalysisDetailTab>("Bank Summary");

  return (
    <div className="mx-auto flex max-w-[1327px] flex-col gap-6 pb-6">
      <BankAnalysisDetailHeader customerName={detail.customerName} />
      <BankAnalysisDetailTabs
        level="detail"
        activeDetailTab={activeTab}
        onDetailTabChange={setActiveTab}
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,801px)_minmax(320px,457px)]">
        {activeTab === "Bank Summary" ? <BankAnalysisSummaryPanel detail={detail} /> : null}
        {activeTab === "Network Intelligence" ? (
          <BankAnalysisNetworkPanel graph={detail.networkGraph} />
        ) : null}
        {activeTab === "Alerts" ? <BankAnalysisAlertsPanel /> : null}
        {activeTab === "Compliance" ? (
          <BankAnalysisCompliancePanel sections={detail.complianceSections} />
        ) : null}
        {activeTab === "Decision history" ? <BankAnalysisDecisionHistoryPanel /> : null}
        <BankAnalysisDetailSidebar detail={detail} />
      </div>
    </div>
  );
}
