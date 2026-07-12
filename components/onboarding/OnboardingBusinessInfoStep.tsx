"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SettingsField } from "@/components/settings/SettingsField";
import { SettingsSelect } from "@/components/settings/SettingsSelect";
import {
  onboardingBusinessTypeOptions,
  onboardingCountryOptions,
} from "@/lib/data/onboarding";
import type { OnboardingBusinessInfo } from "@/types/onboarding";

const businessInfoSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  businessType: z.string().min(1, "Business type is required"),
  country: z.string().min(1, "Country is required"),
});

type OnboardingBusinessInfoStepProps = {
  defaultValues: OnboardingBusinessInfo;
  onSubmit: (values: OnboardingBusinessInfo) => void;
};

export function OnboardingBusinessInfoStep({
  defaultValues,
  onSubmit,
}: OnboardingBusinessInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingBusinessInfo>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues,
  });

  return (
    <form
      id="onboarding-step-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">
          Business information
        </h2>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          Provide business details linked to this customer verification.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SettingsField
          label="Company name"
          error={errors.companyName?.message}
          {...register("companyName")}
        />
        <SettingsField
          label="Registration number"
          error={errors.registrationNumber?.message}
          {...register("registrationNumber")}
        />
        <SettingsSelect
          label="Business type"
          options={onboardingBusinessTypeOptions}
          error={errors.businessType?.message}
          {...register("businessType")}
        />
        <SettingsSelect
          label="Country"
          options={onboardingCountryOptions}
          error={errors.country?.message}
          {...register("country")}
        />
      </div>
    </form>
  );
}
