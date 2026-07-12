import type { KycDocumentAlert } from "@/types/kyc";

type KycDocumentAlertCardProps = {
  alert: KycDocumentAlert;
};

export function KycDocumentAlertCard({ alert }: KycDocumentAlertCardProps) {
  return (
    <div className="rounded-xl border border-[color:var(--state-error)]/30 bg-[color:var(--state-error-soft)]/30 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--state-error)]">
        KYC Alert
      </h3>
      <p className="mt-3 text-sm font-semibold text-[color:var(--text-primary)]">{alert.title}</p>
      <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">{alert.description}</p>
    </div>
  );
}
