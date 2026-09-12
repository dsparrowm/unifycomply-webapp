import type { KycDetail } from "@/types/kyc";
import { cn } from "@/lib/utils";

type KycBiometricVerificationProps = {
  detail: KycDetail;
};

function isFailedLiveness(status: string) {
  return status.toLowerCase() === "failed";
}

export function KycBiometricVerification({ detail }: KycBiometricVerificationProps) {
  const progress = detail.matchScore;
  const failed = isFailedLiveness(detail.livenessStatus);
  const ringColor = failed ? "var(--state-error)" : "var(--accent-primary-hover)";

  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
        Biometric Verification
      </h2>

      <div className="mt-6 flex flex-col items-center">
        <div
          className="relative flex h-[200px] w-[200px] items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(${ringColor} ${progress}%, var(--border-subtle) 0)`,
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
            <span
              className={cn(
                "rounded-md border px-2.5 py-1 text-sm font-medium",
                failed
                  ? "border-[color:var(--state-error)]/30 bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]"
                  : "border-[color:var(--accent-primary-hover)]/30 bg-[color:var(--accent-primary-soft)] text-[color:var(--state-success)]",
              )}
            >
              {detail.livenessStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
