"use client";

import { useState } from "react";
import { KybApproveModal } from "@/components/kyb/detail/KybApproveModal";
import { KybBusinessOverviewTab } from "@/components/kyb/detail/KybBusinessOverviewTab";
import { KybDetailHeader } from "@/components/kyb/detail/KybDetailHeader";
import { KybDetailTabs } from "@/components/kyb/detail/KybDetailTabs";
import { KybDirectorsOfficersTab } from "@/components/kyb/detail/KybDirectorsOfficersTab";
import { KybComplianceChecksTab } from "@/components/kyb/detail/KybComplianceChecksTab";
import { KybDocumentsTab } from "@/components/kyb/detail/KybDocumentsTab";
import { KybEscalateModal } from "@/components/kyb/detail/KybEscalateModal";
import { KybRejectModal } from "@/components/kyb/detail/KybRejectModal";
import { KybShareholdersTab } from "@/components/kyb/detail/KybShareholdersTab";
import { KybLookupPlaceholderTab } from "@/components/kyb/lookup/KybLookupPlaceholderTab";
import { KycDetailFooterActions } from "@/components/kyc/detail/KycDetailFooterActions";
import { KycRiskAnalysisPanel } from "@/components/kyc/detail/KycRiskAnalysisPanel";
import { KycRequestResubmissionModal } from "@/components/kyc/detail/KycRequestResubmissionModal";
import type { KybDetail, KybDetailTab, KybVerificationStatus } from "@/types/kyb";

type KybDetailPanelProps = {
  detail: KybDetail;
};

type KybDetailModal = "approve" | "reject" | "resubmission" | "escalate" | null;

export function KybDetailPanel({ detail: initialDetail }: KybDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<KybDetailTab>("business-overview");
  const [status, setStatus] = useState<KybVerificationStatus>(initialDetail.status);
  const [activeModal, setActiveModal] = useState<KybDetailModal>(null);

  const detail = { ...initialDetail, status };

  function closeModal() {
    setActiveModal(null);
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      <KybDetailHeader detail={detail} status={status} />
      <KybDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "business-overview" ? (
        <KybBusinessOverviewTab detail={detail} status={status} />
      ) : null}

      {activeTab === "risk-analysis" ? (
        <KycRiskAnalysisPanel riskScore={detail.riskScore} riskAnalysis={detail.riskAnalysis} />
      ) : null}

      {activeTab === "directors" ? (
        detail.directors ? (
          <KybDirectorsOfficersTab directors={detail.directors} />
        ) : (
          <KybLookupPlaceholderTab
            title="Directors & Officers"
            description="Director identity screening and officer verification results will appear here."
          />
        )
      ) : null}

      {activeTab === "shareholders" ? (
        <KybShareholdersTab shareholders={detail.shareholders} />
      ) : null}

      {activeTab === "document" ? (
        <KybDocumentsTab documents={detail.documents} />
      ) : null}

      {activeTab === "compliance-checks" ? (
        <KybComplianceChecksTab complianceChecks={detail.complianceChecks} />
      ) : null}

      <KycDetailFooterActions
        riskScore={detail.riskScore}
        onRequestResubmission={() => setActiveModal("resubmission")}
        onReject={() => setActiveModal("reject")}
        onApprove={() => setActiveModal("approve")}
        onEscalate={() => setActiveModal("escalate")}
      />

      <KybApproveModal
        open={activeModal === "approve"}
        detail={detail}
        onClose={closeModal}
        onConfirm={() => setStatus("approved")}
      />

      <KybRejectModal
        open={activeModal === "reject"}
        detail={detail}
        onClose={closeModal}
        onConfirm={() => {
          setStatus("rejected");
          closeModal();
        }}
      />

      <KycRequestResubmissionModal
        open={activeModal === "resubmission"}
        onClose={closeModal}
        onConfirm={() => {
          setStatus("pending");
          closeModal();
        }}
      />

      <KybEscalateModal
        open={activeModal === "escalate"}
        detail={detail}
        onClose={closeModal}
        onConfirm={() => {
          setStatus("escalated");
          closeModal();
        }}
      />
    </div>
  );
}
