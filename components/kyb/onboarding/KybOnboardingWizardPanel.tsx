"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { KycLookupBackHeader } from "@/components/kyc/lookup/KycLookupBackHeader";
import { OnboardingConsentStep } from "@/components/onboarding/OnboardingConsentStep";
import { OnboardingDocumentUploadField } from "@/components/onboarding/OnboardingDocumentUploadField";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { SettingsField } from "@/components/settings/SettingsField";
import { SettingsSelect } from "@/components/settings/SettingsSelect";
import { createKybCustomer, createKybDocument, extractCustomerId } from "@/lib/api/customers";
import { customerKeys } from "@/lib/hooks/use-customers";
import { mapKybDocumentsToDtos, mapKybFormToCreateDto } from "@/lib/api/mappers/onboarding";
import {
  kybOnboardingCountryOptions,
  kybOnboardingDefaultData,
  kybOnboardingSteps,
} from "@/lib/data/kyb-onboarding";
import { toastError, toastSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type {
  KybOnboardingAddress,
  KybOnboardingBusinessInfo,
  KybOnboardingDocuments,
  KybOnboardingFormData,
  KybOnboardingStepId,
} from "@/types/kyb-onboarding";

const businessSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  registrationDate: z.string().min(1, "Registration date is required"),
  contactEmail: z.string().email("Enter a valid email address"),
  contactPhone: z.string().min(1, "Contact phone is required"),
  country: z.string().min(1, "Country is required"),
  industry: z.string(),
  website: z.string(),
});

const addressSchema = z.object({
  houseNo: z.string().min(1, "House / building number is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Postal / ZIP code is required"),
});

type KybOnboardingWizardPanelProps = {
  backHref?: string;
  successHref?: string;
};

export function KybOnboardingWizardPanel({
  backHref = "/kyb",
}: KybOnboardingWizardPanelProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentStepId, setCurrentStepId] = useState<KybOnboardingStepId>("business");
  const [data, setData] = useState<KybOnboardingFormData>(kybOnboardingDefaultData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentIndex = kybOnboardingSteps.findIndex((step) => step.id === currentStepId);
  const isFirstStep = currentIndex === 0;
  const isReviewStep = currentStepId === "review";
  const isLastStep = currentStepId === "consent";

  const goNext = () => {
    const next = kybOnboardingSteps[currentIndex + 1];
    if (next) {
      setCurrentStepId(next.id);
    }
  };

  const goBack = () => {
    const prev = kybOnboardingSteps[currentIndex - 1];
    if (prev) {
      setCurrentStepId(prev.id);
    }
  };

  const handleFinalSubmit = async (consent: KybOnboardingFormData["consent"]) => {
    const nextData = { ...data, consent };
    setData(nextData);
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const created = await createKybCustomer(mapKybFormToCreateDto(nextData));
      const customerId = extractCustomerId(created);
      if (!customerId) {
        throw new Error(
          "Business was created but no id was returned. Check Core Platform create response shape.",
        );
      }

      const documentDtos = await mapKybDocumentsToDtos(nextData.documents);
      for (const dto of documentDtos) {
        await createKybDocument(customerId, dto);
      }

      toastSuccess("Business submitted for verification");
      await queryClient.invalidateQueries({ queryKey: customerKeys.kybListRoot });
      router.push(`/kyb/${customerId}/account-purpose`);
    } catch (error) {
      toastError(error, "Failed to submit business onboarding");
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit business onboarding",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <KycLookupBackHeader backHref={backHref} breadcrumb="KYB / Business onboarding" />

      <OnboardingStepper steps={kybOnboardingSteps} currentStepId={currentStepId} />

      <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm">
        {currentStepId === "business" ? (
          <KybBusinessStep
            defaultValues={data.business}
            onSubmit={(business) => {
              setData((current) => ({ ...current, business }));
              goNext();
            }}
          />
        ) : null}

        {currentStepId === "address" ? (
          <KybAddressStep
            defaultValues={data.address}
            onSubmit={(address) => {
              setData((current) => ({ ...current, address }));
              goNext();
            }}
          />
        ) : null}

        {currentStepId === "documents" ? (
          <KybDocumentsStep
            defaultValues={data.documents}
            onSubmit={(documents) => {
              setData((current) => ({ ...current, documents }));
              goNext();
            }}
          />
        ) : null}

        {currentStepId === "review" ? <KybReviewStep data={data} /> : null}

        {currentStepId === "consent" ? (
          <OnboardingConsentStep defaultValues={data.consent} onSubmit={handleFinalSubmit} />
        ) : null}
      </div>

      {submitError ? (
        <p className="text-sm text-[color:var(--state-error)]" role="alert">
          {submitError}
        </p>
      ) : null}

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

function KybBusinessStep({
  defaultValues,
  onSubmit,
}: {
  defaultValues: KybOnboardingBusinessInfo;
  onSubmit: (values: KybOnboardingBusinessInfo) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<KybOnboardingBusinessInfo>({
    resolver: zodResolver(businessSchema),
    defaultValues,
  });

  return (
    <form id="onboarding-step-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">Business information</h2>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          Create a business customer record for KYB verification (API-derived intake).
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <SettingsField
          label="Business name"
          error={errors.businessName?.message}
          {...register("businessName")}
        />
        <SettingsField
          label="Registration date"
          type="date"
          error={errors.registrationDate?.message}
          {...register("registrationDate")}
        />
        <SettingsField
          label="Contact email"
          type="email"
          error={errors.contactEmail?.message}
          {...register("contactEmail")}
        />
        <SettingsField
          label="Contact phone"
          error={errors.contactPhone?.message}
          {...register("contactPhone")}
        />
        <SettingsSelect
          label="Country"
          options={kybOnboardingCountryOptions}
          error={errors.country?.message}
          {...register("country")}
        />
        <SettingsField label="Industry" error={errors.industry?.message} {...register("industry")} />
        <SettingsField label="Website" error={errors.website?.message} {...register("website")} />
      </div>
    </form>
  );
}

function KybAddressStep({
  defaultValues,
  onSubmit,
}: {
  defaultValues: KybOnboardingAddress;
  onSubmit: (values: KybOnboardingAddress) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<KybOnboardingAddress>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  return (
    <form id="onboarding-step-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">Business address</h2>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          Registered business address required by the Core Platform.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <SettingsField
          label="House / building no."
          error={errors.houseNo?.message}
          {...register("houseNo")}
        />
        <SettingsField label="Street" error={errors.street?.message} {...register("street")} />
        <SettingsField label="City" error={errors.city?.message} {...register("city")} />
        <SettingsField label="State" error={errors.state?.message} {...register("state")} />
        <SettingsField
          label="Postal / ZIP code"
          error={errors.zipCode?.message}
          {...register("zipCode")}
        />
      </div>
    </form>
  );
}

function KybDocumentsStep({
  defaultValues,
  onSubmit,
}: {
  defaultValues: KybOnboardingDocuments;
  onSubmit: (values: KybOnboardingDocuments) => void;
}) {
  const [documents, setDocuments] = useState(defaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof KybOnboardingDocuments, string>>>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof KybOnboardingDocuments, string>> = {};
    if (!documents.certificateOfIncorporation) {
      nextErrors.certificateOfIncorporation = "Upload the certificate of incorporation.";
    }
    if (!documents.proofOfAddress) {
      nextErrors.proofOfAddress = "Upload proof of business address.";
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
        <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">Documents</h2>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          Upload required business documents for KYB verification.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <OnboardingDocumentUploadField
          label="Certificate of incorporation"
          hint="PDF or image"
          accept="image/*,.pdf"
          file={documents.certificateOfIncorporation}
          onFileChange={(file) =>
            setDocuments((current) => ({ ...current, certificateOfIncorporation: file }))
          }
          error={errors.certificateOfIncorporation}
        />
        <OnboardingDocumentUploadField
          label="Proof of business address"
          hint="PDF or image"
          accept="image/*,.pdf"
          file={documents.proofOfAddress}
          onFileChange={(file) => setDocuments((current) => ({ ...current, proofOfAddress: file }))}
          error={errors.proofOfAddress}
        />
      </div>
    </form>
  );
}

function KybReviewStep({ data }: { data: KybOnboardingFormData }) {
  const { business, address, documents } = data;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">Review</h2>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          Confirm business details before consent and submit.
        </p>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        <ReviewItem label="Business name" value={business.businessName} />
        <ReviewItem label="Registration date" value={business.registrationDate} />
        <ReviewItem label="Contact email" value={business.contactEmail} />
        <ReviewItem label="Contact phone" value={business.contactPhone} />
        <ReviewItem label="Country" value={business.country} />
        <ReviewItem label="Industry" value={business.industry || "—"} />
        <ReviewItem label="Website" value={business.website || "—"} />
        <ReviewItem
          label="Address"
          value={`${address.houseNo} ${address.street}, ${address.city}, ${address.state} ${address.zipCode}`}
        />
        <ReviewItem
          label="Certificate"
          value={documents.certificateOfIncorporation?.name ?? "—"}
        />
        <ReviewItem label="Proof of address" value={documents.proofOfAddress?.name ?? "—"} />
      </dl>
    </div>
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
