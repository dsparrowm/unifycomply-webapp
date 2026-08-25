"use client";

import { useState } from "react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { KycAmlScreeningPanel } from "@/components/kyc/detail/KycAmlScreeningPanel";
import { KycApproveModal } from "@/components/kyc/detail/KycApproveModal";
import { KycDetailFooterActions } from "@/components/kyc/detail/KycDetailFooterActions";
import { KycEscalateModal } from "@/components/kyc/detail/KycEscalateModal";
import { KycIpDevicePanel } from "@/components/kyc/detail/KycIpDevicePanel";
import { KycLivenessPanel } from "@/components/kyc/detail/KycLivenessPanel";
import { KycRejectModal } from "@/components/kyc/detail/KycRejectModal";
import { KycRequestResubmissionModal } from "@/components/kyc/detail/KycRequestResubmissionModal";
import { KycRiskAnalysisPanel } from "@/components/kyc/detail/KycRiskAnalysisPanel";
import { KycDocumentAlertCard } from "@/components/kyc/KycDocumentAlertCard";
import { KycDocumentRiskTierCard } from "@/components/kyc/KycDocumentRiskTierCard";
import { KycDetailHeader } from "@/components/kyc/KycDetailHeader";
import { KycDetailTabs } from "@/components/kyc/KycDetailTabs";
import { KycExtractedInformation } from "@/components/kyc/KycExtractedInformation";
import { KycRiskAnalysisCard } from "@/components/kyc/KycRiskAnalysisCard";
import { KycVerificationTimeline } from "@/components/kyc/KycVerificationTimeline";
import type { KycDetail, KycDetailTab, KycVerificationStatus } from "@/types/kyc";

type KycDetailPanelProps = {
  detail: KycDetail;
};

type KycDetailModal = "approve" | "reject" | "resubmission" | "escalate" | null;

const unavailableCopy = "This panel is not returned by the current Core Platform API.";

export function KycDetailPanel({ detail: initialDetail }: KycDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<KycDetailTab>("document");
  const [status, setStatus] = useState<KycVerificationStatus>(initialDetail.status);
  const [activeModal, setActiveModal] = useState<KycDetailModal>(null);

  const detail = { ...initialDetail, status };
  const { availability } = detail;

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
            {availability.documentPreview ? null : (
              <EmptyState
                title="Document images unavailable"
                description="Uploaded files are stored by the API, but preview URLs are not exposed on this customer record yet."
              />
            )}
            <KycExtractedInformation
              fields={detail.extractedFields}
              statusLabel={detail.extractionStatus}
            />
          </div>

          <div className="space-y-6">
            {detail.documentRiskTier ? (
              <KycDocumentRiskTierCard tier={detail.documentRiskTier} />
            ) : (
              <KycRiskAnalysisCard detail={detail} />
            )}
            {detail.documentAlert ? <KycDocumentAlertCard alert={detail.documentAlert} /> : null}
            {availability.biometric ? null : (
              <EmptyState title="Biometric match unavailable" description={unavailableCopy} />
            )}
            <KycVerificationTimeline events={detail.timeline} />
          </div>
        </div>
      ) : null}

      {activeTab === "risk-analysis" ? (
        availability.riskAnalysis && detail.riskAnalysis ? (
          <KycRiskAnalysisPanel riskScore={detail.riskScore} riskAnalysis={detail.riskAnalysis} />
        ) : (
          <EmptyState title="Risk analysis unavailable" description={unavailableCopy} />
        )
      ) : null}

      {activeTab === "aml-screening" ? (
        availability.amlScreening && detail.amlScreening ? (
          <KycAmlScreeningPanel amlScreening={detail.amlScreening} />
        ) : (
          <EmptyState
            title="AML screening unavailable"
            description="No verification screening payload is linked to this customer yet."
          />
        )
      ) : null}

      {activeTab === "ip-device" ? (
        availability.ipDevice && detail.ipDevice ? (
          <KycIpDevicePanel ipDevice={detail.ipDevice} />
        ) : (
          <EmptyState title="IP and device data unavailable" description={unavailableCopy} />
        )
      ) : null}

      {activeTab === "liveness" ? (
        availability.liveness && detail.liveness ? (
          <KycLivenessPanel liveness={detail.liveness} />
        ) : (
          <EmptyState title="Liveness data unavailable" description={unavailableCopy} />
        )
      ) : null}

      <KycDetailFooterActions
        riskScore={detail.riskScore}
        canApprove={detail.canApprove}
        requiresEscalation={detail.requiresEscalation}
        onRequestResubmission={() => setActiveModal("resubmission")}
        onReject={() => setActiveModal("reject")}
        onApprove={() => setActiveModal("approve")}
        onEscalate={() => setActiveModal("escalate")}
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

      <KycEscalateModal
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
