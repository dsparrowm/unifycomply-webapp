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
import { BankAnalysisNetworkPanel } from "@/components/bank-analysis/detail/BankAnalysisNetworkPanel";
import { BankAnalysisSummaryPanel } from "@/components/bank-analysis/detail/BankAnalysisSummaryPanel";
import type {
  BankAnalysisDecisionHistoryEntry,
  BankAnalysisDetail,
} from "@/types/bank-analysis";

type BankAnalysisDetailPanelProps = {
  detail: BankAnalysisDetail;
};

export function BankAnalysisDetailPanel({
  detail,
}: BankAnalysisDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<BankAnalysisDetailTab>("Bank Summary");
  const [decisionHistory, setDecisionHistory] = useState(detail.decisionHistory);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const escalated = decisionHistory.some((entry) => entry.type === "escalated");

  const handleEscalation = (notes: string) => {
    const entry: BankAnalysisDecisionHistoryEntry = {
      id: `escalated-${Date.now()}`,
      type: "escalated",
      title: "Escalated to Senior Officer",
      description: notes,
      actor: "Current Compliance Officer",
      timestamp: "Just now",
    };

    setDecisionHistory((current) => [entry, ...current]);
    setEscalateModalOpen(false);
    setFeedback("Analysis escalated to the Senior Officer queue.");
    setActiveTab("Decision history");
  };

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
      <BankAnalysisDetailActions
        escalated={escalated}
        onEscalate={() => setEscalateModalOpen(true)}
      />
      <BankAnalysisEscalateModal
        open={escalateModalOpen}
        detail={detail}
        onClose={() => setEscalateModalOpen(false)}
        onConfirm={handleEscalation}
      />
    </div>
  );
}
