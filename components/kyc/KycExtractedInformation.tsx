import type { KycExtractedField } from "@/types/kyc";

type KycExtractedInformationProps = {
  fields: KycExtractedField[];
  statusLabel: string;
};

export function KycExtractedInformation({ fields, statusLabel }: KycExtractedInformationProps) {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Extracted Information
        </h2>
        <span className="rounded-full bg-[color:var(--state-success-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--state-success)]">
          {statusLabel}
        </span>
      </div>

      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium text-[color:var(--text-primary)]">
                {field.label}
              </label>
              <span className="text-xs font-medium text-[color:var(--state-success)]">
                {field.confidence}% Confidence level
              </span>
            </div>
            <div className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3.5 py-3 text-base text-[color:var(--text-primary)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
              {field.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
