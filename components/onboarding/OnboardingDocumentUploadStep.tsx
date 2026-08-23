"use client";

import { useState } from "react";
import { OnboardingDocumentUploadField } from "@/components/onboarding/OnboardingDocumentUploadField";
import type { OnboardingDocuments } from "@/types/onboarding";

type OnboardingDocumentUploadStepProps = {
  defaultValues: OnboardingDocuments;
  onSubmit: (values: OnboardingDocuments) => void;
};

export function OnboardingDocumentUploadStep({
  defaultValues,
  onSubmit,
}: OnboardingDocumentUploadStepProps) {
  const [documents, setDocuments] = useState<OnboardingDocuments>(defaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof OnboardingDocuments, string>>>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof OnboardingDocuments, string>> = {};

    if (!documents.idFront) {
      nextErrors.idFront = "Upload the front of the ID document.";
    }
    if (!documents.idBack) {
      nextErrors.idBack = "Upload the back of the ID document.";
    }
    if (!documents.selfie) {
      nextErrors.selfie = "Upload a selfie for biometric verification.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit(documents);
  };

  return (
    <form id="onboarding-step-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">
          Document upload
        </h2>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          Upload identity documents for automated verification and review.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <OnboardingDocumentUploadField
          label="ID front"
          hint="National ID or passport — front side"
          accept="image/*,.pdf"
          file={documents.idFront}
          onFileChange={(file) => setDocuments((current) => ({ ...current, idFront: file }))}
          error={errors.idFront}
        />
        <OnboardingDocumentUploadField
          label="ID back"
          hint="National ID or passport — back side"
          accept="image/*,.pdf"
          file={documents.idBack}
          onFileChange={(file) => setDocuments((current) => ({ ...current, idBack: file }))}
          error={errors.idBack}
        />
        <OnboardingDocumentUploadField
          label="Selfie"
          hint="Clear selfie for liveness and biometric match"
          accept="image/*"
          file={documents.selfie}
          onFileChange={(file) => setDocuments((current) => ({ ...current, selfie: file }))}
          error={errors.selfie}
        />
      </div>
    </form>
  );
}
