"use client";

import { useState } from "react";
import { KycAmlScreeningPanel } from "@/components/kyc/detail/KycAmlScreeningPanel";
import { KycRiskAnalysisPanel } from "@/components/kyc/detail/KycRiskAnalysisPanel";
import { KycLookupBackHeader } from "@/components/kyc/lookup/KycLookupBackHeader";
import { KycLookupBvnCard } from "@/components/kyc/lookup/KycLookupBvnCard";
import { KycLookupFooterActions } from "@/components/kyc/lookup/KycLookupFooterActions";
import { KycLookupPlaceholderTab } from "@/components/kyc/lookup/KycLookupPlaceholderTab";
import { KycLookupSummaryPanel } from "@/components/kyc/lookup/KycLookupSummaryPanel";
import { KycLookupTabs } from "@/components/kyc/lookup/KycLookupTabs";
import { KycLookupValidationPanel } from "@/components/kyc/lookup/KycLookupValidationPanel";
import type { MappedVerificationView } from "@/lib/api/mappers/verification";
import { getKycLookupTypeLabel } from "@/lib/data/kyc-lookup";
import type { KycLookupTab } from "@/types/kyc";

type KycLookupResultPanelProps = {
  view: MappedVerificationView;
  backHref?: string;
  breadcrumb?: string;
};

export function KycLookupResultPanel({
  view,
  backHref = "/kyc/lookup",
  breadcrumb,
}: KycLookupResultPanelProps) {
  const [activeTab, setActiveTab] = useState<KycLookupTab>("bvn");
  const resolvedBreadcrumb =
    breadcrumb ?? `KYC/ Perform Lookup / ${getKycLookupTypeLabel(view.result.lookupType)}`;
  const riskTone =
    view.result.status === "failed"
      ? "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]"
      : "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]";

  return (
    <div className="flex flex-col gap-6">
      <KycLookupBackHeader
        backHref={backHref}
        breadcrumb={resolvedBreadcrumb}
        breadcrumbClassName="text-sm font-medium text-[color:var(--text-muted)]"
        action={
          <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${riskTone}`}>
            Risk Score: {view.result.riskScore}
          </span>
        }
      />

      {view.polling ? (
        <p className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-4 py-3 text-sm text-[color:var(--text-muted)]">
          Verification is still running. Identity, risk, and screening fill in as each check completes.
        </p>
      ) : null}

      <KycLookupTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        identityTabLabel={view.identityTitle}
      />

      {activeTab === "bvn" ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,730px)_minmax(320px,1fr)]">
          <KycLookupBvnCard
            result={view.result}
            identityTitle={view.identityTitle}
            identityNumberLabel={view.identityNumberLabel}
          />
          <KycLookupSummaryPanel result={view.result} />
        </div>
      ) : null}

      {activeTab === "validation" ? <KycLookupValidationPanel rows={view.validation} /> : null}

      {activeTab === "risk-analysis" ? (
        <KycRiskAnalysisPanel riskScore={view.result.riskScore} riskAnalysis={view.riskAnalysis} />
      ) : null}

      {activeTab === "aml-screening" ? <KycAmlScreeningPanel amlScreening={view.amlScreening} /> : null}

      {activeTab === "ip-device" ? (
        <KycLookupPlaceholderTab
          title="Ip & Device Information"
          description="Device fingerprint and IP geolocation are not returned by this verification run."
        />
      ) : null}

      <KycLookupFooterActions />
    </div>
  );
}
