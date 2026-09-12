"use client";

import { useState } from "react";
import { AmlCaseAdditionalLinks } from "@/components/aml/detail/AmlCaseAdditionalLinks";
import { AmlCaseCorporateLinksTable } from "@/components/aml/detail/AmlCaseCorporateLinksTable";
import { AmlCaseDetailHeader } from "@/components/aml/detail/AmlCaseDetailHeader";
import { AmlCaseDetailTabs } from "@/components/aml/detail/AmlCaseDetailTabs";
import { AmlCaseEmptyState } from "@/components/aml/detail/AmlCaseEmptyState";
import { AmlCaseFieldList } from "@/components/aml/detail/AmlCaseFieldList";
import { AmlCaseLinkedList } from "@/components/aml/detail/AmlCaseLinkedList";
import { AmlCaseRiskAnalysis } from "@/components/aml/detail/AmlCaseRiskAnalysis";
import { AmlCaseSearchSidebar } from "@/components/aml/detail/AmlCaseSearchSidebar";
import { AmlCaseSourceBanner } from "@/components/aml/detail/AmlCaseSourceBanner";
import { AmlCaseSubTabs } from "@/components/aml/detail/AmlCaseSubTabs";
import { AmlCaseVerifications } from "@/components/aml/detail/AmlCaseVerifications";
import { AmlEscalateModal } from "@/components/aml/detail/AmlEscalateModal";
import { KycDetailFooterActions } from "@/components/kyc/detail/KycDetailFooterActions";
import type { AmlCaseDetail, AmlCaseDetailTab, AmlCaseSummaryTab } from "@/types/aml";

type AmlCaseDetailPanelProps = {
  detail: AmlCaseDetail;
};

const sectionTitles: Partial<Record<AmlCaseDetailTab, string>> = {
  verifications: "Verifications",
  sources: "Sources",
  warning: "Warning and regulatory enforcement",
  "risk-analysis": "Risk Analysis",
  "decision-history": "Decision history",
};

export function AmlCaseDetailPanel({ detail }: AmlCaseDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<AmlCaseDetailTab>("data-summary");
  const [summaryTab, setSummaryTab] = useState<AmlCaseSummaryTab>("key-summary");
  const [activeMonitoring, setActiveMonitoring] = useState(detail.activeMonitoring);
  const [escalateOpen, setEscalateOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 pb-4">
      <AmlCaseDetailHeader caseName={detail.caseName} />
      <AmlCaseDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <div className="min-w-0 flex-1 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
          <AmlCaseSubTabs
            activeTab={summaryTab}
            onTabChange={setSummaryTab}
            title={sectionTitles[activeTab]}
            activeMonitoring={activeMonitoring}
            onActiveMonitoringChange={setActiveMonitoring}
          />

          <div className="mt-6">
            {activeTab === "data-summary" && summaryTab === "key-summary" ? (
              <div className="space-y-4">
                <AmlCaseSourceBanner source={detail.sourceBanner} />
                <AmlCaseFieldList fields={detail.keyFields} />
              </div>
            ) : null}

            {activeTab === "data-summary" && summaryTab === "linked-entities" ? (
              detail.kind === "corporate" ? (
                <AmlCaseCorporateLinksTable rows={detail.corporateLinks} />
              ) : (
                <AmlCaseLinkedList rows={detail.linkedEntities} />
              )
            ) : null}

            {activeTab === "data-summary" && summaryTab === "additional-information" ? (
              <AmlCaseAdditionalLinks links={detail.additionalLinks} />
            ) : null}

            {activeTab === "verifications" ? (
              <AmlCaseVerifications groups={detail.verifications} />
            ) : null}

            {activeTab === "sources" ? (
              <div className="space-y-3">
                {detail.sources.map((source, index) => (
                  <AmlCaseSourceBanner key={`${source.title}-${index}`} source={source} />
                ))}
              </div>
            ) : null}

            {activeTab === "warning" ? (
              <AmlCaseEmptyState
                icon="check"
                title="No Warning and Regulatory Enforcement Found"
                description="This entity has no adverse media records in our database"
              />
            ) : null}

            {activeTab === "risk-analysis" ? <AmlCaseRiskAnalysis detail={detail} /> : null}

            {activeTab === "decision-history" ? (
              <AmlCaseEmptyState
                icon="archive"
                title="Decision history"
                description="This entity has no escalated review procedures or supplementary data."
              />
            ) : null}
          </div>
        </div>

        <AmlCaseSearchSidebar information={detail.searchInformation} />
      </div>

      <KycDetailFooterActions
        riskScore={detail.riskScore}
        onRequestResubmission={() => undefined}
        onReject={() => undefined}
        onApprove={() => undefined}
        onEscalate={() => setEscalateOpen(true)}
      />

      <AmlEscalateModal
        open={escalateOpen}
        summary={detail.escalateSummary}
        onClose={() => setEscalateOpen(false)}
        onConfirm={() => setEscalateOpen(false)}
      />
    </div>
  );
}
