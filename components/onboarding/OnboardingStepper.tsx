import type { OnboardingStep, OnboardingStepId } from "@/types/onboarding";
import { cn } from "@/lib/utils";

type OnboardingStepperProps = {
  steps: OnboardingStep[];
  currentStepId: OnboardingStepId;
};

export function OnboardingStepper({ steps, currentStepId }: OnboardingStepperProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStepId);

  return (
    <ol className="flex flex-wrap gap-2">
      {steps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = step.id === currentStepId;

        return (
          <li
            key={step.id}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              isCurrent
                ? "bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary)]"
                : isComplete
                  ? "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]"
                  : "bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]",
            )}
          >
            {index + 1}. {step.label}
          </li>
        );
      })}
    </ol>
  );
}
