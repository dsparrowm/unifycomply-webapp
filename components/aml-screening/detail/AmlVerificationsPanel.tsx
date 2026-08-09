import { Check } from "lucide-react";
import { AmlActiveMonitoringToggle } from "@/components/aml-screening/detail/AmlActiveMonitoringToggle";
import type { AmlVerificationSection } from "@/types/aml-screening";

type AmlVerificationsPanelProps = {
  sections: AmlVerificationSection[];
  activeMonitoring: boolean;
  onActiveMonitoringChange: (checked: boolean) => void;
};

export function AmlVerificationsPanel({
  sections,
  activeMonitoring,
  onActiveMonitoringChange,
}: AmlVerificationsPanelProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[color:var(--border-default)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Verifications
        </h2>
        <AmlActiveMonitoringToggle
          checked={activeMonitoring}
          onChange={onActiveMonitoringChange}
        />
      </div>

      <div className="space-y-8 p-5">
        {sections.map((section) => (
          <div key={section.id}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
              {section.title}
            </h3>
            {section.subtitle ? (
              <p className="mt-1 text-sm text-[color:var(--text-light)]">{section.subtitle}</p>
            ) : null}
            <div className="mt-3 divide-y divide-[color:var(--border-subtle)] rounded-xl bg-[color:var(--bg-muted)] px-4">
              {section.rows.map((row) => (
                <div
                  key={row.id}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-primary-hover)] text-white">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[color:var(--text-primary)]">
                        {row.label}
                      </p>
                      <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">
                        {row.description}
                      </p>
                    </div>
                  </div>
                  <span
                    className={
                      row.outcome === "match"
                        ? "text-sm font-medium text-[color:var(--state-error)]"
                        : "text-sm font-medium text-[color:var(--state-success)]"
                    }
                  >
                    {row.outcome === "match" ? "Match" : "No Match"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
