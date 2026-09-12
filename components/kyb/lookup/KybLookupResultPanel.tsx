"use client";

import { useState } from "react";
import { KybLookupBackHeader } from "@/components/kyb/lookup/KybLookupBackHeader";
import { KybLookupFooterActions } from "@/components/kyb/lookup/KybLookupFooterActions";
import { KybLookupPlaceholderTab } from "@/components/kyb/lookup/KybLookupPlaceholderTab";
import { KybLookupRegistryCard } from "@/components/kyb/lookup/KybLookupRegistryCard";
import { KybLookupSummaryPanel } from "@/components/kyb/lookup/KybLookupSummaryPanel";
import { KybLookupTabs } from "@/components/kyb/lookup/KybLookupTabs";
import { getKybLookupTypeLabel } from "@/lib/data/kyb-lookup";
import type { KybLookupTab, KybRegistryLookupResult } from "@/types/kyb";

type KybLookupResultPanelProps = {
  result: KybRegistryLookupResult;
};

export function KybLookupResultPanel({ result }: KybLookupResultPanelProps) {
  const [activeTab, setActiveTab] = useState<KybLookupTab>("registry");
  const breadcrumb = `KYB/ Perform Lookup / ${getKybLookupTypeLabel(result.lookupType)}`;

  return (
    <div className="flex flex-col gap-6">
      <KybLookupBackHeader
        backHref="/kyb/lookup"
        breadcrumb={breadcrumb}
        breadcrumbClassName="text-sm font-medium text-[color:var(--text-muted)]"
        action={
          <span className="inline-flex items-center rounded-full bg-[color:var(--state-success-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--state-success)]">
            Risk Score: {result.riskScore}
          </span>
        }
      />

      <KybLookupTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "registry" ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,730px)_minmax(320px,1fr)]">
          <KybLookupRegistryCard result={result} />
          <KybLookupSummaryPanel result={result} />
        </div>
      ) : null}

      {activeTab === "validation" ? (
        <KybLookupPlaceholderTab
          title="Validation Information"
          description="Registry validation checks and match confidence details will appear here."
        />
      ) : null}

      {activeTab === "risk-analysis" ? (
        <KybLookupPlaceholderTab
          title="Risk Score Analysis"
          description="Automated risk scoring for this business lookup will appear here once the analysis module is connected."
        />
      ) : null}

      {activeTab === "aml-screening" ? (
        <KybLookupPlaceholderTab
          title="AML Screening"
          description="Sanctions, PEP, and watchlist screening results for this business will appear here."
        />
      ) : null}

      {activeTab === "directors" ? (
        <KybLookupPlaceholderTab
          title="Directors & Officers"
          description="Director identity screening and officer verification results will appear here."
        />
      ) : null}

      <KybLookupFooterActions />
    </div>
  );
}
