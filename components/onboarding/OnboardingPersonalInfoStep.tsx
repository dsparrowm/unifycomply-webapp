"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SettingsField } from "@/components/settings/SettingsField";
import { SettingsSelect } from "@/components/settings/SettingsSelect";
import {
  onboardingGenderOptions,
  onboardingNationalityOptions,
} from "@/lib/data/onboarding";
import type { OnboardingPersonalInfo } from "@/types/onboarding";

const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  gender: z
    .enum(["male", "female", ""])
    .refine((value) => value === "male" || value === "female", {
      message: "Gender is required",
    }),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
});

type OnboardingPersonalInfoStepProps = {
  defaultValues: OnboardingPersonalInfo;
  onSubmit: (values: OnboardingPersonalInfo) => void;
};

export function OnboardingPersonalInfoStep({
  defaultValues,
  onSubmit,
}: OnboardingPersonalInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingPersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
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
          Personal information
        </h2>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          Enter the customer&apos;s personal details to begin verification.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SettingsField label="First name" error={errors.firstName?.message} {...register("firstName")} />
        <SettingsField label="Last name" error={errors.lastName?.message} {...register("lastName")} />
        <SettingsField
          label="Email address"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <SettingsField label="Phone number" error={errors.phone?.message} {...register("phone")} />
        <SettingsField
          label="Date of birth"
          type="date"
          error={errors.dateOfBirth?.message}
          {...register("dateOfBirth")}
        />
        <SettingsSelect
          label="Nationality"
          options={onboardingNationalityOptions}
          error={errors.nationality?.message}
          {...register("nationality")}
        />
        <SettingsSelect
          label="Gender"
          options={onboardingGenderOptions}
          error={errors.gender?.message}
          {...register("gender")}
        />
        <SettingsField label="Street" error={errors.street?.message} {...register("street")} />
        <SettingsField label="City" error={errors.city?.message} {...register("city")} />
        <SettingsField label="State" error={errors.state?.message} {...register("state")} />
        <SettingsField label="Zip code" error={errors.zipCode?.message} {...register("zipCode")} />
      </div>
    </form>
  );
}
