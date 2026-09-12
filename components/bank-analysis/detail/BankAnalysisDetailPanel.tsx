"use client";

import { useState } from "react";
import { BankAnalysisAlertsPanel } from "@/components/bank-analysis/detail/BankAnalysisAlertsPanel";
import { BankAnalysisCompliancePanel } from "@/components/bank-analysis/detail/BankAnalysisCompliancePanel";
import { BankAnalysisDecisionHistoryPanel } from "@/components/bank-analysis/detail/BankAnalysisDecisionHistoryPanel";
import { BankAnalysisDetailActions } from "@/components/bank-analysis/detail/BankAnalysisDetailActions";
import { BankAnalysisDetailHeader } from "@/components/bank-analysis/detail/BankAnalysisDetailHeader";
import { BankAnalysisDetailSidebar } from "@/components/bank-analysis/detail/BankAnalysisDetailSidebar";
import { BankAnalysisEscalateModal } from "@/components/bank-analysis/detail/BankAnalysisEscalateModal";
import {
  BankAnalysisDetailTabs,
  type BankAnalysisDetailTab,
} from "@/components/bank-analysis/detail/BankAnalysisDetailTabs";
import { BankAnalysisEscalateModal } from "@/components/bank-analysis/detail/BankAnalysisEscalateModal";
import { BankAnalysisNetworkPanel } from "@/components/bank-analysis/detail/BankAnalysisNetworkPanel";
import { BankAnalysisSummaryPanel } from "@/components/bank-analysis/detail/BankAnalysisSummaryPanel";
import { KycDetailFooterActions } from "@/components/kyc/detail/KycDetailFooterActions";
import { isApprovalBlocked } from "@/lib/kyc/risk-score";
import type { BankAnalysisDetail } from "@/types/bank-analysis";

type BankAnalysisDetailPanelProps = {
  detail: BankAnalysisDetail;
};

export function BankAnalysisDetailPanel({
  detail,
}: BankAnalysisDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<BankAnalysisDetailTab>("Bank Summary");
  const [escalateOpen, setEscalateOpen] = useState(false);
  const showEscalateFooter = isApprovalBlocked(detail.riskScore);

  return (
    <div className="mx-auto flex max-w-[1327px] flex-col gap-6 pb-6">
      <BankAnalysisDetailHeader customerName={detail.customerName} />
      <BankAnalysisDetailTabs
        level="detail"
        activeDetailTab={activeTab}
        onDetailTabChange={setActiveTab}
      />
      {feedback ? (
        <div
          role="status"
          className="rounded-lg border border-[color:var(--state-success)]/30 bg-[color:var(--state-success-soft)] px-4 py-3 text-sm text-[color:var(--state-success)]"
        >
          {feedback}
        </div>
      ) : null}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,801px)_minmax(320px,457px)]">
        {activeTab === "Bank Summary" ? <BankAnalysisSummaryPanel detail={detail} /> : null}
        {activeTab === "Network Intelligence" ? (
          <BankAnalysisNetworkPanel graph={detail.networkGraph} />
        ) : null}
        {activeTab === "Alerts" ? <BankAnalysisAlertsPanel alerts={detail.alerts} /> : null}
        {activeTab === "Compliance" ? (
          <BankAnalysisCompliancePanel sections={detail.complianceSections} />
        ) : null}
        {activeTab === "Decision history" ? (
          <BankAnalysisDecisionHistoryPanel entries={decisionHistory} />
        ) : null}
        <BankAnalysisDetailSidebar detail={detail} />
      </div>

      {showEscalateFooter ? (
        <KycDetailFooterActions
          riskScore={detail.riskScore}
          onRequestResubmission={() => undefined}
          onReject={() => undefined}
          onApprove={() => undefined}
          onEscalate={() => setEscalateOpen(true)}
        />
      ) : null}

      <BankAnalysisEscalateModal
        open={escalateOpen}
        summary={detail.escalateSummary}
        onClose={() => setEscalateOpen(false)}
        onConfirm={() => setEscalateOpen(false)}
      />
    </div>
  );
}
