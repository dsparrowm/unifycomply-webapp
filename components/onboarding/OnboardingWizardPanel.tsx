"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KycLookupBackHeader } from "@/components/kyc/lookup/KycLookupBackHeader";
import { OnboardingBusinessInfoStep } from "@/components/onboarding/OnboardingBusinessInfoStep";
import { OnboardingConsentStep } from "@/components/onboarding/OnboardingConsentStep";
import { OnboardingDocumentUploadStep } from "@/components/onboarding/OnboardingDocumentUploadStep";
import { OnboardingIdentityReviewStep } from "@/components/onboarding/OnboardingIdentityReviewStep";
import { OnboardingPersonalInfoStep } from "@/components/onboarding/OnboardingPersonalInfoStep";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { onboardingDefaultData, onboardingSteps } from "@/lib/data/onboarding";
import { cn } from "@/lib/utils";
import type { OnboardingStepId, OnboardingWizardData } from "@/types/onboarding";

type OnboardingWizardPanelProps = {
  backHref?: string;
  successHref?: string;
};

export function OnboardingWizardPanel({
  backHref = "/kyc",
  successHref = "/kyc",
}: OnboardingWizardPanelProps) {
  const router = useRouter();
  const [currentStepId, setCurrentStepId] = useState<OnboardingStepId>("personal");
  const [data, setData] = useState<OnboardingWizardData>(onboardingDefaultData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentIndex = onboardingSteps.findIndex((step) => step.id === currentStepId);
  const isFirstStep = currentIndex === 0;
  const isReviewStep = currentStepId === "review";
  const isLastStep = currentStepId === "consent";

  const goToStep = (stepId: OnboardingStepId) => {
    setCurrentStepId(stepId);
  };

  const goNext = () => {
    const nextStep = onboardingSteps[currentIndex + 1];
    if (nextStep) {
      goToStep(nextStep.id);
    }
  };

  const goBack = () => {
    const previousStep = onboardingSteps[currentIndex - 1];
    if (previousStep) {
      goToStep(previousStep.id);
    }
  };

  const handleFinalSubmit = async (consent: OnboardingWizardData["consent"]) => {
    setIsSubmitting(true);
    setData((current) => ({ ...current, consent }));
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    router.push(successHref);
  };

  return (
    <div className="flex flex-col gap-8">
      <KycLookupBackHeader backHref={backHref} breadcrumb="KYC / Customer onboarding" />

      <OnboardingStepper steps={onboardingSteps} currentStepId={currentStepId} />

      <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm">
        {currentStepId === "personal" ? (
          <OnboardingPersonalInfoStep
            defaultValues={data.personal}
            onSubmit={(personal) => {
              setData((current) => ({ ...current, personal }));
              goNext();
            }}
          />
        ) : null}

        {currentStepId === "business" ? (
          <OnboardingBusinessInfoStep
            defaultValues={data.business}
            onSubmit={(business) => {
              setData((current) => ({ ...current, business }));
              goNext();
            }}
          />
        ) : null}

        {currentStepId === "documents" ? (
          <OnboardingDocumentUploadStep
            defaultValues={data.documents}
            onSubmit={(documents) => {
              setData((current) => ({ ...current, documents }));
              goNext();
            }}
          />
        ) : null}

        {currentStepId === "review" ? <OnboardingIdentityReviewStep data={data} /> : null}

        {currentStepId === "consent" ? (
          <OnboardingConsentStep defaultValues={data.consent} onSubmit={handleFinalSubmit} />
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={isFirstStep || isSubmitting}
          className={cn(
            "rounded-lg border border-[color:var(--border-default)] px-4 py-2 text-sm font-medium text-[color:var(--text-muted)]",
            isFirstStep || isSubmitting
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-[color:var(--bg-muted)]",
          )}
        >
          Back
        </button>

        {isReviewStep ? (
          <button
            type="button"
            onClick={goNext}
            className="rounded-lg bg-[color:var(--accent-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)]"
          >
            Continue
          </button>
        ) : isLastStep ? (
          <button
            type="submit"
            form="onboarding-step-form"
            disabled={isSubmitting}
            className="rounded-lg bg-[color:var(--accent-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)] disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit verification"}
          </button>
        ) : (
          <button
            type="submit"
            form="onboarding-step-form"
            className="rounded-lg bg-[color:var(--accent-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)]"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
