"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { OnboardingConsent } from "@/types/onboarding";

const consentItems = [
  {
    id: "dataProcessing" as const,
    label: "I consent to personal data processing for identity verification purposes.",
  },
  {
    id: "termsOfService" as const,
    label: "I agree to the terms of service and privacy policy.",
  },
  {
    id: "accuracyDeclaration" as const,
    label: "I declare that the information and documents provided are accurate.",
  },
];

type OnboardingConsentStepProps = {
  defaultValues: OnboardingConsent;
  onSubmit: (values: OnboardingConsent) => void;
};

export function OnboardingConsentStep({ defaultValues, onSubmit }: OnboardingConsentStepProps) {
  const [consent, setConsent] = useState<OnboardingConsent>(defaultValues);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!consent.dataProcessing || !consent.termsOfService || !consent.accuracyDeclaration) {
      setError("Accept all consent items to submit the onboarding request.");
      return;
    }

    setError(null);
    onSubmit(consent);
  };

  return (
    <form id="onboarding-step-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">Consent</h2>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          Confirm the customer has agreed to verification and data processing.
        </p>
      </div>

      <div className="space-y-3">
        {consentItems.map((item) => (
          <label
            key={item.id}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-4"
          >
            <input
              type="checkbox"
              checked={consent[item.id]}
              onChange={(event) =>
                setConsent((current) => ({ ...current, [item.id]: event.target.checked }))
              }
              className="mt-0.5 rounded border-[color:var(--border-default)]"
            />
            <span className="text-sm text-[color:var(--text-primary)]">{item.label}</span>
          </label>
        ))}
      </div>

      {error ? <p className={cn("text-sm text-[color:var(--state-error)]")}>{error}</p> : null}
    </form>
  );
}
