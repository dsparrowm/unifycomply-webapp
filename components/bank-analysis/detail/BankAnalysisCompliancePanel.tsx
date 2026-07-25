import { CheckCircle2 } from "lucide-react";
import { BankAnalysisDateRangeMenu } from "@/components/bank-analysis/detail/BankAnalysisDateRangeMenu";
import type { BankAnalysisComplianceSection } from "@/types/bank-analysis";

type BankAnalysisCompliancePanelProps = {
  sections: BankAnalysisComplianceSection[];
};

export function BankAnalysisCompliancePanel({
  sections,
}: BankAnalysisCompliancePanelProps) {
  return (
    <section className="min-h-[1380px] overflow-hidden rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
      <div className="flex flex-col gap-4 border-b border-[color:var(--border-default)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Compliance
        </h2>
        <BankAnalysisDateRangeMenu />
      </div>

      <div className="space-y-8 p-4 sm:p-6">
        {sections.map((section) => (
          <section key={section.id}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
              {section.title}
            </h3>
            <div className="mt-4 divide-y divide-[color:var(--border-subtle)] rounded-lg bg-[color:var(--bg-muted)] px-5">
              {section.checks.map((check) => (
                <div
                  key={check.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-2">
                    {check.verified ? (
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 fill-[color:var(--accent-primary-hover)] text-white"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[color:var(--text-primary)]">
                        {check.label}
                      </p>
                      {check.description ? (
                        <p className="mt-1 text-[10px] leading-4 text-[color:var(--text-light)]">
                          {check.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <span className="w-fit shrink-0 rounded-full bg-[color:var(--state-success-soft)] px-3 py-1 text-[10px] font-medium text-[color:var(--state-success)]">
                    {check.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
