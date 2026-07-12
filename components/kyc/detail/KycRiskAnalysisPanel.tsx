import { Check, X } from "lucide-react";
import type { KycDetail, KycRiskAnalysisData } from "@/types/kyc";
import { cn } from "@/lib/utils";

type KycRiskAnalysisPanelProps = {
  detail: KycDetail;
  riskAnalysis: KycRiskAnalysisData;
};

function AnalysisStatusIcon({ status }: { status: "pass" | "fail" }) {
  if (status === "pass") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary-hover)]">
        <Check className="h-4 w-4" />
      </span>
    );
  }

  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]">
      <X className="h-4 w-4" />
    </span>
  );
}

export function KycRiskAnalysisPanel({ detail, riskAnalysis }: KycRiskAnalysisPanelProps) {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--border-default)] px-6 py-5">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Risk Score
          </h2>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            Risk score analysis and possible recommendation
          </p>
        </div>
        <span className="text-sm font-medium text-[color:var(--state-success)]">
          {riskAnalysis.clearanceStatus}
        </span>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5">
          <p className="text-sm font-medium text-[color:var(--text-primary)]">Risk Score Analysis</p>
          <p className="mt-6 text-5xl font-semibold leading-none text-[color:var(--state-error)]">
            {detail.riskScore}
          </p>
          <p className="mt-2 text-sm font-medium text-[color:var(--state-error)]">
            {riskAnalysis.scoreLevel}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
            Analysis
          </h3>
          <div className="mt-4 space-y-4">
            {riskAnalysis.analysisItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-[color:var(--text-primary)]">{item.label}</p>
                <AnalysisStatusIcon status={item.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[color:var(--border-default)] px-6 py-6">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
          Recommendation
        </h3>
        <div
          className={cn(
            "mt-4 rounded-lg border border-[color:var(--accent-primary-hover)]/30",
            "bg-[color:var(--accent-primary-soft)] px-5 py-4",
          )}
        >
          <p className="text-sm leading-6 text-[color:var(--text-primary)]">
            {riskAnalysis.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
}
