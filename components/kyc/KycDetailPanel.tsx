"use client";

import { useState } from "react";
import { CustomerFlagsPanel } from "@/components/customers/CustomerFlagsPanel";
import { CustomerIntakeLinks } from "@/components/customers/CustomerIntakeLinks";
import { DocumentRequirementsChecklist } from "@/components/customers/DocumentRequirementsChecklist";
import { VerificationRunHistory } from "@/components/customers/VerificationRunHistory";
import { EmptyState } from "@/components/feedback/EmptyState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { KycAmlScreeningPanel } from "@/components/kyc/detail/KycAmlScreeningPanel";
import { KycApproveModal } from "@/components/kyc/detail/KycApproveModal";
import { KycDetailFooterActions } from "@/components/kyc/detail/KycDetailFooterActions";
import { KycEscalateModal } from "@/components/kyc/detail/KycEscalateModal";
import { KycIpDevicePanel } from "@/components/kyc/detail/KycIpDevicePanel";
import { KycLivenessPanel } from "@/components/kyc/detail/KycLivenessPanel";
import { KycRejectModal } from "@/components/kyc/detail/KycRejectModal";
import { KycRequestResubmissionModal } from "@/components/kyc/detail/KycRequestResubmissionModal";
import { KycRiskAnalysisPanel } from "@/components/kyc/detail/KycRiskAnalysisPanel";
import { KycBiometricVerification } from "@/components/kyc/KycBiometricVerification";
import { KycDocumentAlertCard } from "@/components/kyc/KycDocumentAlertCard";
import { KycDocumentRiskTierCard } from "@/components/kyc/KycDocumentRiskTierCard";
import { KycDetailHeader } from "@/components/kyc/KycDetailHeader";
import { KycDetailTabs } from "@/components/kyc/KycDetailTabs";
import { KycDocumentViewer } from "@/components/kyc/KycDocumentViewer";
import { KycExtractedInformation } from "@/components/kyc/KycExtractedInformation";
import { KycRiskAnalysisCard } from "@/components/kyc/KycRiskAnalysisCard";
import { KycVerificationTimeline } from "@/components/kyc/KycVerificationTimeline";
import { decisionErrorMessage } from "@/lib/api/errors";
import { recordHasResubmission } from "@/lib/api/mappers/review-state";
import { isLiveCustomerId } from "@/lib/customers/live-id";
import {
  applyFlagStatus,
  useDecideCustomer,
  useEscalateCustomer,
  useKycDocumentRequirements,
  usePatchCustomerFlag,
  useRequestCustomerResubmission,
} from "@/lib/hooks/use-customer-compliance";
import { useRbac } from "@/lib/hooks/use-rbac";
import { toastError, toastSuccess } from "@/lib/toast";
import {
  mergeKycDetailWithDocumentsTab,
  useKycAmlScreeningTab,
  useKycDeviceInformationTab,
  useKycLivenessTab,
  useKycVerificationDocumentsTab,
  useKycVerificationRiskScore,
  useVerificationDetail,
} from "@/lib/hooks/use-customers";
import type { CustomerFlag } from "@/types/customer-compliance";
import type { KycDetail, KycDetailTab, KycVerificationStatus } from "@/types/kyc";

type KycDetailPanelProps = {
  detail: KycDetail;
};

type KycDetailModal = "approve" | "reject" | "resubmission" | "escalate" | null;

export function KycDetailPanel({ detail: initialDetail }: KycDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<KycDetailTab>("document");
  const [status, setStatus] = useState<KycVerificationStatus>(initialDetail.status);
  const [activeModal, setActiveModal] = useState<KycDetailModal>(null);
  const [flags, setFlags] = useState<CustomerFlag[]>(initialDetail.flags ?? []);
  const [resubmission, setResubmission] = useState(Boolean(initialDetail.resubmission));

  const workflowId = initialDetail.workflowId;
  const liveCustomer = isLiveCustomerId(initialDetail.id);

  const documentsQuery = useKycVerificationDocumentsTab(workflowId, activeTab === "document");
  const riskQuery = useKycVerificationRiskScore(workflowId, activeTab === "risk-analysis");
  const amlQuery = useKycAmlScreeningTab(workflowId, activeTab === "aml-screening");
  const deviceQuery = useKycDeviceInformationTab(workflowId, activeTab === "ip-device");
  const livenessQuery = useKycLivenessTab(workflowId, activeTab === "liveness");
  const verificationQuery = useVerificationDetail(workflowId, Boolean(workflowId));
  const requirementsQuery = useKycDocumentRequirements(
    initialDetail.id,
    activeTab === "document" && liveCustomer,
  );
  const patchFlag = usePatchCustomerFlag("kyc", initialDetail.id);
  const decide = useDecideCustomer("kyc", initialDetail.id);
  const requestResubmission = useRequestCustomerResubmission("kyc", initialDetail.id);
  const escalate = useEscalateCustomer("kyc", initialDetail.id);
  const { canPerform } = useRbac();

  const liveRisk = riskQuery.data;
  const detailWithDocuments = mergeKycDetailWithDocumentsTab(
    initialDetail,
    documentsQuery.data,
  );

  const detail = {
    ...detailWithDocuments,
    status,
    flags,
    riskScore: liveRisk?.available ? liveRisk.riskScore : detailWithDocuments.riskScore,
    riskAnalysis:
      liveRisk?.available && liveRisk.riskAnalysis
        ? liveRisk.riskAnalysis
        : activeTab === "risk-analysis" && workflowId
          ? null
          : detailWithDocuments.riskAnalysis,
    canApprove: liveRisk?.canApprove ?? detailWithDocuments.canApprove,
    requiresEscalation: liveRisk?.requiresEscalation ?? detailWithDocuments.requiresEscalation,
    amlScreening:
      activeTab === "aml-screening" && workflowId
        ? (amlQuery.data ?? null)
        : detailWithDocuments.amlScreening,
    ipDevice:
      activeTab === "ip-device" && workflowId
        ? (deviceQuery.data?.data ?? null)
        : detailWithDocuments.ipDevice,
    liveness:
      activeTab === "liveness" && workflowId
        ? (livenessQuery.data?.data ?? null)
        : detailWithDocuments.liveness,
    availability: {
      ...detailWithDocuments.availability,
      amlScreening: Boolean(amlQuery.data),
      ipDevice: Boolean(deviceQuery.data?.available && deviceQuery.data.data),
      liveness: Boolean(livenessQuery.data?.available && livenessQuery.data.data),
    },
  };

  function closeModal() {
    setActiveModal(null);
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      <KycDetailHeader
        detail={{
          ...detail,
          resubmission: resubmission || recordHasResubmission(verificationQuery.data?.workflow),
        }}
        status={status}
        canOffboard={liveCustomer}
      />
      <CustomerIntakeLinks kind="kyc" customerId={detail.id} />
      <KycDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "document" ? (
        documentsQuery.isLoading && workflowId ? (
          <PageLoadingSkeleton variant="generic" />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_457px]">
            <div className="space-y-6">
              {detail.availability.documentPreview || !detail.workflowId ? (
                <KycDocumentViewer
                  matchScore={detail.matchScore}
                  failedMatch={
                    status === "resubmission" || detail.livenessStatus === "Failed"
                  }
                  views={detail.documentViews}
                />
              ) : (
                <EmptyState
                  title="No documents available"
                  description="Signed document previews will appear here once files are uploaded on this verification."
                />
              )}
              <KycExtractedInformation
                fields={detail.extractedFields}
                statusLabel={detail.extractionStatus}
              />
            </div>

            <div className="space-y-6">
              {requirementsQuery.data ? (
                <DocumentRequirementsChecklist requirements={requirementsQuery.data} />
              ) : null}
              {detail.documentRiskTier ? (
                <KycDocumentRiskTierCard tier={detail.documentRiskTier} />
              ) : (
                <KycRiskAnalysisCard detail={detail} />
              )}
              {flags.length > 0 ? (
                <CustomerFlagsPanel
                  flags={flags}
                  kindLabel="KYC Alert"
                  onUpdateStatus={async (flagId, nextStatus) => {
                    await patchFlag.mutateAsync({ flagId, status: nextStatus });
                    setFlags((current) => applyFlagStatus(current, flagId, nextStatus));
                  }}
                />
              ) : detail.documentAlert ? (
                <KycDocumentAlertCard alert={detail.documentAlert} />
              ) : null}
              <KycBiometricVerification detail={detail} />
              <KycVerificationTimeline events={detail.timeline} />
              {verificationQuery.data ? (
                <VerificationRunHistory
                  detail={verificationQuery.data}
                  isLoading={verificationQuery.isLoading}
                  nextReviewLabel={detail.nextReviewLabel}
                />
              ) : null}
            </div>
          </div>
        )
      ) : null}

      {activeTab === "risk-analysis" ? (
        riskQuery.isLoading ? (
          <PageLoadingSkeleton variant="generic" />
        ) : detail.riskAnalysis ? (
          <KycRiskAnalysisPanel riskScore={detail.riskScore} riskAnalysis={detail.riskAnalysis} />
        ) : (
          <EmptyState
            title="Risk score not available yet"
            description="Risk decisioning has not scored this run. Open this tab again after the verification settles."
          />
        )
      ) : null}

      {activeTab === "aml-screening" ? (
        amlQuery.isLoading && workflowId ? (
          <PageLoadingSkeleton variant="generic" />
        ) : detail.amlScreening ? (
          <KycAmlScreeningPanel amlScreening={detail.amlScreening} />
        ) : (
          <EmptyState
            title="AML screening"
            description="No sanctions or PEP screening tasks are available for this verification yet."
          />
        )
      ) : null}

      {activeTab === "ip-device" ? (
        deviceQuery.isLoading && workflowId ? (
          <PageLoadingSkeleton variant="generic" />
        ) : detail.ipDevice && detail.availability.ipDevice ? (
          <KycIpDevicePanel ipDevice={detail.ipDevice} />
        ) : (
          <EmptyState
            title="IP & device not captured"
            description={
              deviceQuery.data?.reason ??
              "IP and device capture is not implemented on the platform yet."
            }
          />
        )
      ) : null}

      {activeTab === "liveness" ? (
        livenessQuery.isLoading && workflowId ? (
          <PageLoadingSkeleton variant="generic" />
        ) : detail.liveness && detail.availability.liveness ? (
          <KycLivenessPanel liveness={detail.liveness} />
        ) : (
          <EmptyState
            title="Liveness detail unavailable"
            description={
              livenessQuery.data?.reason ??
              "Dedicated liveness provider results are not returned yet. Selfie checks may show as skipped for this country."
            }
          />
        )
      ) : null}

      <KycDetailFooterActions
        riskScore={detail.riskScore}
        variant={status === "resubmission" ? "resubmission-primary" : "standard"}
        approveDisabled={!canPerform("verification:approve")}
        rejectDisabled={!canPerform("verification:reject")}
        onRequestResubmission={() => setActiveModal("resubmission")}
        onReject={() => setActiveModal("reject")}
        onApprove={() => setActiveModal("approve")}
        onEscalate={() => setActiveModal("escalate")}
      />

      <KycApproveModal
        open={activeModal === "approve"}
        detail={detail}
        onClose={closeModal}
        onConfirm={() => {
          if (!liveCustomer) {
            setStatus("approved");
            return;
          }
          void decide
            .mutateAsync({ decision: "approve", reason: "Approved on manual review." })
            .then(() => {
              setStatus("approved");
              toastSuccess("Customer onboarding approved");
            })
            .catch((error: unknown) => {
              toastError(
                new Error(decisionErrorMessage(error, "Could not approve this customer")),
                "Could not approve this customer",
              );
            });
        }}
      />

      <KycRejectModal
        open={activeModal === "reject"}
        detail={detail}
        onClose={closeModal}
        onConfirm={(reason, notes) => {
          const combined = [reason, notes].filter(Boolean).join(" — ");
          if (!liveCustomer) {
            setStatus("rejected");
            closeModal();
            return;
          }
          void decide
            .mutateAsync({ decision: "reject", reason: combined || reason })
            .then(() => {
              setStatus("rejected");
              closeModal();
              toastSuccess("Customer onboarding rejected");
            })
            .catch((error: unknown) => {
              toastError(error, "Could not reject this customer");
            });
        }}
      />

      <KycRequestResubmissionModal
        open={activeModal === "resubmission"}
        onClose={closeModal}
        onConfirm={(issueIds) => {
          if (!liveCustomer) {
            setStatus("resubmission");
            closeModal();
            return;
          }
          void requestResubmission
            .mutateAsync(issueIds)
            .then(() => {
              setResubmission(true);
              closeModal();
              toastSuccess("Resubmission requested");
            })
            .catch((error: unknown) => {
              toastError(error, "Could not request resubmission");
            });
        }}
      />

      <KycEscalateModal
        open={activeModal === "escalate"}
        detail={detail}
        onClose={closeModal}
        onConfirm={(notes) => {
          if (!liveCustomer) {
            setStatus("escalated");
            closeModal();
            return;
          }
          void escalate
            .mutateAsync(notes)
            .then(() => {
              closeModal();
              toastSuccess("Case escalated");
            })
            .catch((error: unknown) => {
              toastError(error, "Could not escalate this case");
            });
        }}
      />
    </div>
  );
}
