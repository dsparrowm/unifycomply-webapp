import type { KycDetail } from "@/types/kyc";

type KycBiometricVerificationProps = {
  detail: KycDetail;
};

export function KycBiometricVerification({ detail }: KycBiometricVerificationProps) {
  const progress = detail.matchScore;

  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
        Biometric Verification
      </h2>

      <div className="mt-6 flex flex-col items-center">
        <div
          className="relative flex h-[200px] w-[200px] items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(var(--accent-primary-hover) ${progress}%, var(--border-subtle) 0)`,
          }}
        >
          <div className="flex h-[168px] w-[168px] flex-col items-center justify-center rounded-full bg-[color:var(--bg-surface)]">
            <span className="text-3xl font-semibold text-[color:var(--text-primary)]">
              {progress}%
            </span>
            <span className="text-xs text-[color:var(--text-muted)]">Match</span>
          </div>
        </div>

        <div className="mt-6 w-full space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-[color:var(--border-default)] px-3 py-3">
            <span className="text-sm text-[color:var(--text-primary)]">Match Score</span>
            <span className="text-sm font-medium text-[color:var(--text-primary)]">
              {detail.matchScore}% Score
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-[color:var(--border-default)] px-3 py-3">
            <span className="text-sm text-[color:var(--text-primary)]">Liveness Detection</span>
            <span className="text-sm font-medium text-[color:var(--state-success)]">
              {detail.livenessStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
