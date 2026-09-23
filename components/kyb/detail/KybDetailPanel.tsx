"use client";

import { useEffect, useState } from "react";
import { CustomerIntakeLinks } from "@/components/customers/CustomerIntakeLinks";
import { EmptyState } from "@/components/feedback/EmptyState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
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
import {
  mergeKybDetailWithBusinessOverview,
  useKybBusinessOverviewTab,
  useKybComplianceChecksTab,
  useKybDirectorsOfficersTab,
  useKybShareholdersTabQuery,
  useKybVerificationDocumentsTab,
  useKybVerificationRiskScore,
} from "@/lib/hooks/use-customers";
import type { KybDetail, KybDetailTab, KybVerificationStatus } from "@/types/kyb";

type KybDetailPanelProps = {
  detail: KybDetail;
};

type KybDetailModal = "approve" | "reject" | "resubmission" | "escalate" | null;

export function KybDetailPanel({ detail: initialDetail }: KybDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<KybDetailTab>("business-overview");
  const [status, setStatus] = useState<KybVerificationStatus>(initialDetail.status);
  const [activeModal, setActiveModal] = useState<KybDetailModal>(null);
  const [overviewStatusSynced, setOverviewStatusSynced] = useState(false);

  const workflowId = initialDetail.workflowId;

  const overviewQuery = useKybBusinessOverviewTab(workflowId, activeTab === "business-overview");
  const riskQuery = useKybVerificationRiskScore(workflowId, activeTab === "risk-analysis");
  const directorsQuery = useKybDirectorsOfficersTab(workflowId, activeTab === "directors");
  const shareholdersQuery = useKybShareholdersTabQuery(workflowId, activeTab === "shareholders");
  const documentsQuery = useKybVerificationDocumentsTab(workflowId, activeTab === "document");
  const complianceQuery = useKybComplianceChecksTab(workflowId, activeTab === "compliance-checks");

  const liveRisk = riskQuery.data;
  const detailWithOverview = mergeKybDetailWithBusinessOverview(
    initialDetail,
    overviewQuery.data,
  );

  useEffect(() => {
    if (!overviewStatusSynced && overviewQuery.data) {
      setStatus(detailWithOverview.status);
      setOverviewStatusSynced(true);
    }
  }, [overviewQuery.data, detailWithOverview.status, overviewStatusSynced]);

  const detail = {
    ...detailWithOverview,
    status,
    riskScore: liveRisk?.available ? liveRisk.riskScore : detailWithOverview.riskScore,
    riskAnalysis:
      liveRisk?.available && liveRisk.riskAnalysis
        ? liveRisk.riskAnalysis
        : activeTab === "risk-analysis" && workflowId
          ? null
          : detailWithOverview.riskAnalysis,
    directors:
      activeTab === "directors" && workflowId
        ? (directorsQuery.data ?? null)
        : detailWithOverview.directors,
    shareholders:
      activeTab === "shareholders" && workflowId && shareholdersQuery.data
        ? shareholdersQuery.data
        : detailWithOverview.shareholders,
    documents:
      activeTab === "document" && workflowId && documentsQuery.data
        ? documentsQuery.data
        : detailWithOverview.documents,
    complianceChecks:
      activeTab === "compliance-checks" && workflowId
        ? (complianceQuery.data ?? null)
        : detailWithOverview.complianceChecks,
  };

  function closeModal() {
    setActiveModal(null);
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      <KybDetailHeader detail={detail} status={status} />
      <CustomerIntakeLinks kind="kyb" customerId={detail.id} />
      <KybDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "business-overview" ? (
        overviewQuery.isLoading && workflowId ? (
          <PageLoadingSkeleton variant="generic" />
        ) : (
          <KybBusinessOverviewTab detail={detail} status={status} />
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

      {activeTab === "directors" ? (
        directorsQuery.isLoading && workflowId ? (
          <PageLoadingSkeleton variant="generic" />
        ) : detail.directors ? (
          <KybDirectorsOfficersTab directors={detail.directors} />
        ) : (
          <KybLookupPlaceholderTab
            title="Directors & Officers"
            description="Director identity screening and officer verification results will appear here."
          />
        )
      ) : null}

      {activeTab === "shareholders" ? (
        shareholdersQuery.isLoading && workflowId ? (
          <PageLoadingSkeleton variant="generic" />
        ) : detail.shareholders.shareholders.length > 0 ? (
          <KybShareholdersTab shareholders={detail.shareholders} />
        ) : (
          <EmptyState
            title="No shareholders on file"
            description="Share capital structure will appear here once shareholders are linked to this verification."
          />
        )
      ) : null}

      {activeTab === "document" ? (
        documentsQuery.isLoading && workflowId ? (
          <PageLoadingSkeleton variant="generic" />
        ) : detail.documents.documents.length > 0 ? (
          <KybDocumentsTab documents={detail.documents} />
        ) : (
          <EmptyState
            title="No documents available"
            description="Signed document previews will appear here once files are uploaded on this verification."
          />
        )
      ) : null}

      {activeTab === "compliance-checks" ? (
        complianceQuery.isLoading && workflowId ? (
          <PageLoadingSkeleton variant="generic" />
        ) : detail.complianceChecks ? (
          <KybComplianceChecksTab complianceChecks={detail.complianceChecks} />
        ) : (
          <KybLookupPlaceholderTab
            title="Compliance checks"
            description="Sanctions and PEP results will appear here when the verification API exposes them on the customer."
          />
        )
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
