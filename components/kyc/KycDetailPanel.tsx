"use client";

import { useState } from "react";
import { KycAmlScreeningPanel } from "@/components/kyc/detail/KycAmlScreeningPanel";
import { KycApproveModal } from "@/components/kyc/detail/KycApproveModal";
import { KycDetailFooterActions } from "@/components/kyc/detail/KycDetailFooterActions";
import { KycIpDevicePanel } from "@/components/kyc/detail/KycIpDevicePanel";
import { KycLivenessPanel } from "@/components/kyc/detail/KycLivenessPanel";
import { KycRejectModal } from "@/components/kyc/detail/KycRejectModal";
import { KycRequestResubmissionModal } from "@/components/kyc/detail/KycRequestResubmissionModal";
import { KycRiskAnalysisPanel } from "@/components/kyc/detail/KycRiskAnalysisPanel";
import { KycBiometricVerification } from "@/components/kyc/KycBiometricVerification";
import { KycDetailHeader } from "@/components/kyc/KycDetailHeader";
import { KycDetailTabs } from "@/components/kyc/KycDetailTabs";
import { KycDocumentViewer } from "@/components/kyc/KycDocumentViewer";
import { KycExtractedInformation } from "@/components/kyc/KycExtractedInformation";
import { KycRiskAnalysisCard } from "@/components/kyc/KycRiskAnalysisCard";
import { KycVerificationTimeline } from "@/components/kyc/KycVerificationTimeline";
import type { KycDetail, KycDetailTab, KycVerificationStatus } from "@/types/kyc";

type KycDetailPanelProps = {
  detail: KycDetail;
};

type KycDetailModal = "approve" | "reject" | "resubmission" | null;

export function KycDetailPanel({ detail: initialDetail }: KycDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<KycDetailTab>("document");
  const [status, setStatus] = useState<KycVerificationStatus>(initialDetail.status);
  const [activeModal, setActiveModal] = useState<KycDetailModal>(null);

  const detail = { ...initialDetail, status };

  function closeModal() {
    setActiveModal(null);
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      <KycDetailHeader detail={detail} status={status} />
      <KycDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "document" ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_457px]">
          <div className="space-y-6">
            <KycDocumentViewer />
            <KycExtractedInformation
              fields={detail.extractedFields}
              statusLabel={detail.extractionStatus}
            />
          </div>

          <div className="space-y-6">
            <KycRiskAnalysisCard detail={detail} />
            <KycBiometricVerification detail={detail} />
            <KycVerificationTimeline events={detail.timeline} />
          </div>
        </div>
      ) : null}

      {activeTab === "risk-analysis" ? (
        <KycRiskAnalysisPanel detail={detail} riskAnalysis={detail.riskAnalysis} />
      ) : null}

      {activeTab === "aml-screening" ? (
        <KycAmlScreeningPanel amlScreening={detail.amlScreening} />
      ) : null}

      {activeTab === "ip-device" ? (
        <KycIpDevicePanel ipDevice={detail.ipDevice} />
      ) : null}

      {activeTab === "liveness" ? (
        <KycLivenessPanel liveness={detail.liveness} />
      ) : null}

      <KycDetailFooterActions
        onRequestResubmission={() => setActiveModal("resubmission")}
        onReject={() => setActiveModal("reject")}
        onApprove={() => setActiveModal("approve")}
      />

      <KycApproveModal
        open={activeModal === "approve"}
        detail={detail}
        onClose={closeModal}
        onConfirm={() => setStatus("approved")}
      />

      <KycRejectModal
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
    </div>
  );
}
