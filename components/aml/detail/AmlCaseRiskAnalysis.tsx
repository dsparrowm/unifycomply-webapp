import { AmlCaseRiskRadar } from "@/components/aml/detail/AmlCaseRiskRadar";
import { cn } from "@/lib/utils";
import type { AmlCaseDetail } from "@/types/aml";

type AmlCaseRiskAnalysisProps = {
  detail: AmlCaseDetail;
};

export function AmlCaseRiskAnalysis({ detail }: AmlCaseRiskAnalysisProps) {
  return (
    <div className="space-y-8">
      <dl className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <dt className="text-[color:var(--text-muted)]">Risk Score</dt>
          <dd className="font-medium text-[color:var(--text-primary)]">{detail.riskScoreValue}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="text-[color:var(--text-muted)]">Overall analysis</dt>
          <dd className="font-medium text-[color:var(--text-primary)]">{detail.overallAnalysis}</dd>
        </div>
      </dl>

      <AmlCaseRiskRadar points={detail.radar} />

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
          RISK DETAILS
        </h3>
        <div className="mt-3 divide-y divide-[color:var(--border-subtle)] rounded-xl bg-[color:var(--bg-muted)] px-5">
          {detail.riskDetails.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-4 py-3">
              <p className="text-sm text-[color:var(--text-primary)]">{item.label}</p>
              <span
                className={cn(
                  "text-sm font-medium",
                  item.tone === "warning"
                    ? "text-[color:var(--state-warning)]"
                    : "rounded-full bg-[color:var(--state-success-soft)] px-2.5 py-0.5 text-xs text-[color:var(--state-success)]",
                )}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
