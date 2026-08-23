"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { KycLookupBackHeader } from "@/components/kyc/lookup/KycLookupBackHeader";
import { SettingsField } from "@/components/settings/SettingsField";
import { SettingsSelect } from "@/components/settings/SettingsSelect";
import { getAvailableChecks } from "@/lib/api/compliance";
import { getErrorMessage } from "@/lib/api/errors";
import { buildCustomerAddress, toE164 } from "@/lib/compliance/format";
import {
  onboardingBusinessTypeOptions,
  onboardingCountryOptions,
} from "@/lib/data/onboarding";
import { useCreateKybCustomer } from "@/lib/hooks/use-compliance";
import { toastError, toastSuccess } from "@/lib/toast";

const createKybSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  country: z.string().length(2, "Country is required"),
  businessType: z.string().min(1, "Business type is required"),
  registrationDate: z.string().min(1, "Registration date is required"),
  contactEmail: z.string().email("Enter a valid email"),
  contactPhone: z.string().min(8, "Phone is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Postal code is required"),
  industry: z.string().optional(),
  website: z.string().optional(),
});

type CreateKybValues = z.infer<typeof createKybSchema>;

export function CreateKybForm() {
  const router = useRouter();
  const createCustomer = useCreateKybCustomer();
  const [formError, setFormError] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateKybValues>({
    resolver: zodResolver(createKybSchema),
    defaultValues: {
      companyName: "",
      country: "NG",
      businessType: "private-limited-company",
      registrationDate: "",
      contactEmail: "",
      contactPhone: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      industry: "",
      website: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      let verificationTypes = ["company-registration", "sanctions-screening"];
      try {
        const catalogue = await getAvailableChecks(values.country, "business");
        const types = catalogue.checks.map((check) => check.type);
        verificationTypes = types.includes("company-registration")
          ? [
              "company-registration",
              ...types.filter((type) => type === "sanctions-screening" || type === "pep-screening"),
            ]
          : types.slice(0, 2);
        if (verificationTypes.length === 0) {
          verificationTypes = ["company-registration", "sanctions-screening"];
        }
      } catch {
        verificationTypes = ["company-registration", "sanctions-screening"];
      }

      const created = await createCustomer.mutateAsync({
        customer: {
          businessName: values.companyName.trim(),
          countryCode: values.country.toUpperCase(),
          registrationDate: values.registrationDate,
          contactEmail: values.contactEmail.trim(),
          contactPhone: toE164(values.contactPhone, values.country),
          industry: values.industry || undefined,
          website: values.website || undefined,
          address: buildCustomerAddress({
            street: values.street,
            city: values.city,
            state: values.state,
            zipCode: values.zipCode,
            countryCode: values.country,
          }),
        },
        documents: documentFile
          ? [{ type: "certificate-of-incorporation", file: documentFile }]
          : undefined,
        verificationTypes,
      });

      toastSuccess("Business created");
      router.push(`/kyb/${created.id}`);
    } catch (error) {
      const message = getErrorMessage(error, "Could not create business");
      setFormError(message);
      toastError(error, "Could not create business");
    }
  });

  return (
    <div className="flex flex-col gap-8">
      <KycLookupBackHeader backHref="/kyb" breadcrumb="KYB / Create business" />

      <form
        className="max-w-3xl space-y-6 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm"
        onSubmit={onSubmit}
      >
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--text-primary)]">Create a business</h1>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            This posts to the live KYB customer API. Registry lookup remains a separate mock flow.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SettingsField
            label="Company name"
            error={errors.companyName?.message}
            {...register("companyName")}
          />
          <SettingsSelect
            label="Country"
            options={onboardingCountryOptions.filter((option) => option.value)}
            error={errors.country?.message}
            {...register("country")}
          />
          <SettingsSelect
            label="Business type"
            options={onboardingBusinessTypeOptions.filter((option) => option.value)}
            error={errors.businessType?.message}
            {...register("businessType")}
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
            placeholder="+2347012345678"
            error={errors.contactPhone?.message}
            {...register("contactPhone")}
          />
          <SettingsField label="Industry" error={errors.industry?.message} {...register("industry")} />
          <SettingsField label="Website" error={errors.website?.message} {...register("website")} />
          <SettingsField label="Street" error={errors.street?.message} {...register("street")} />
          <SettingsField label="City" error={errors.city?.message} {...register("city")} />
          <SettingsField label="State" error={errors.state?.message} {...register("state")} />
          <SettingsField label="Postal code" error={errors.zipCode?.message} {...register("zipCode")} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="kyb-document" className="text-sm font-medium text-[color:var(--text-primary)]">
            Registration document (optional)
          </label>
          <input
            id="kyb-document"
            type="file"
            accept="image/*,.pdf"
            onChange={(event) => setDocumentFile(event.target.files?.[0] ?? null)}
            className="block w-full text-sm text-[color:var(--text-muted)]"
          />
        </div>

        {formError ? (
          <p className="text-sm text-[color:var(--state-error)]" role="alert">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || createCustomer.isPending}
          className="rounded-lg bg-[color:var(--accent-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)] disabled:opacity-60"
        >
          {isSubmitting || createCustomer.isPending ? "Creating…" : "Create business"}
        </button>
      </form>
    </div>
  );
}
