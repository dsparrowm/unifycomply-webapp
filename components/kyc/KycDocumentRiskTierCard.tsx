import type { KycDocumentRiskTier } from "@/types/kyc";

type KycDocumentRiskTierCardProps = {
  tier: KycDocumentRiskTier;
};

export function KycDocumentRiskTierCard({ tier }: KycDocumentRiskTierCardProps) {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
        Risk Analysis
      </h2>

      <div className="mt-4 rounded-xl border border-[color:var(--state-warning)]/25 bg-[color:var(--state-warning-soft)]/40 p-5">
        <span className="inline-flex rounded-md bg-[color:var(--bg-surface)] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          {tier.tierLabel}
        </span>

        <p className="mt-4 text-sm font-semibold text-[color:var(--text-primary)]">{tier.title}</p>
        <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">{tier.description}</p>

        <div className="mt-4 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-4 py-3">
          <p className="text-sm font-medium text-[color:var(--text-primary)]">{tier.detail}</p>
        </div>

        <p className="mt-4 text-sm font-semibold text-[color:var(--state-warning)]">
          ⚠ {tier.recommendation}
        </p>
      </div>
    </div>
  );
}
