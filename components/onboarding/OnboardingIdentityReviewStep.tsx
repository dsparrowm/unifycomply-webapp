import type { ReactNode } from "react";
import type { OnboardingWizardData } from "@/types/onboarding";

type OnboardingIdentityReviewStepProps = {
  data: OnboardingWizardData;
};

function ReviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-4">
      <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">{title}</h3>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-[color:var(--text-muted)]">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-[color:var(--text-primary)]">{value}</dd>
    </div>
  );
}

export function OnboardingIdentityReviewStep({ data }: OnboardingIdentityReviewStepProps) {
  const { personal, business, documents } = data;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">
          Identity review
        </h2>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          Review the submitted information before continuing to consent.
        </p>
      </div>

      <ReviewSection title="Personal information">
        <ReviewItem label="Full name" value={`${personal.firstName} ${personal.lastName}`} />
        <ReviewItem label="Email" value={personal.email} />
        <ReviewItem label="Phone" value={personal.phone} />
        <ReviewItem label="Date of birth" value={personal.dateOfBirth} />
        <ReviewItem label="Nationality" value={personal.nationality} />
      </ReviewSection>

      <ReviewSection title="Business information">
        <ReviewItem label="Company name" value={business.companyName} />
        <ReviewItem label="Registration number" value={business.registrationNumber} />
        <ReviewItem label="Business type" value={business.businessType} />
        <ReviewItem label="Country" value={business.country} />
      </ReviewSection>

      <ReviewSection title="Uploaded documents">
        <ReviewItem label="ID front" value={documents.idFront?.name ?? "—"} />
        <ReviewItem label="ID back" value={documents.idBack?.name ?? "—"} />
        <ReviewItem label="Selfie" value={documents.selfie?.name ?? "—"} />
      </ReviewSection>
    </div>
  );
}
