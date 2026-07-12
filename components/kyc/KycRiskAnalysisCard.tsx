import type { KycDetail } from "@/types/kyc";
import { getRiskScoreShortLabel } from "@/lib/kyc/risk-score";

type KycRiskAnalysisCardProps = {
  detail: KycDetail;
};

export function KycRiskAnalysisCard({ detail }: KycRiskAnalysisCardProps) {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
        Risk Analysis
      </h2>

      <div className="mt-4 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-muted)] p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-[color:var(--accent-primary)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Risk Score: {detail.riskScore}
          </span>
          <span className="rounded-full bg-[color:var(--state-success-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--state-success)]">
            {getRiskScoreShortLabel(detail.riskScore)}
          </span>
        </div>
        <p className="mt-3 text-sm leading-5 text-[color:var(--text-muted)]">{detail.riskSummary}</p>
      </div>
    </div>
  );
}
