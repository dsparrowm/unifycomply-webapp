"use client";

import { useState } from "react";
import { KycLookupBackHeader } from "@/components/kyc/lookup/KycLookupBackHeader";
import { KycLookupBvnCard } from "@/components/kyc/lookup/KycLookupBvnCard";
import { KycLookupFooterActions } from "@/components/kyc/lookup/KycLookupFooterActions";
import { KycLookupPlaceholderTab } from "@/components/kyc/lookup/KycLookupPlaceholderTab";
import { KycLookupSummaryPanel } from "@/components/kyc/lookup/KycLookupSummaryPanel";
import { KycLookupTabs } from "@/components/kyc/lookup/KycLookupTabs";
import { getKycLookupTypeLabel } from "@/lib/data/kyc-lookup";
import type { KycBvnLookupResult, KycLookupTab } from "@/types/kyc";

type KycLookupResultPanelProps = {
  result: KycBvnLookupResult;
};

export function KycLookupResultPanel({ result }: KycLookupResultPanelProps) {
  const [activeTab, setActiveTab] = useState<KycLookupTab>("bvn");
  const breadcrumb = `KYC/ Perform Lookup / ${getKycLookupTypeLabel(result.lookupType)}`;

  return (
    <div className="flex flex-col gap-6">
      <KycLookupBackHeader
        backHref="/kyc/lookup"
        breadcrumb={breadcrumb}
        breadcrumbClassName="text-sm font-medium text-[color:var(--text-muted)]"
        action={
          <span className="inline-flex items-center rounded-full bg-[color:var(--state-success-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--state-success)]">
            Risk Score: {result.riskScore}
          </span>
        }
      />

      <KycLookupTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "bvn" ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,730px)_minmax(320px,1fr)]">
          <KycLookupBvnCard result={result} />
          <KycLookupSummaryPanel result={result} />
        </div>
      ) : null}

      {activeTab === "validation" ? (
        <KycLookupPlaceholderTab
          title="Validation Information"
          description="Registry validation checks and match confidence details will appear here."
        />
      ) : null}

      {activeTab === "risk-analysis" ? (
        <KycLookupPlaceholderTab
          title="Risk Score Analysis"
          description="Automated risk scoring for this lookup will appear here once the analysis module is connected."
        />
      ) : null}

      {activeTab === "aml-screening" ? (
        <KycLookupPlaceholderTab
          title="AML Screening"
          description="Sanctions, PEP, and watchlist screening results will appear here."
        />
      ) : null}

      {activeTab === "ip-device" ? (
        <KycLookupPlaceholderTab
          title="Ip & Device Information"
          description="Device fingerprint and IP geolocation signals will appear here."
        />
      ) : null}

      <KycLookupFooterActions />
    </div>
  );
}
