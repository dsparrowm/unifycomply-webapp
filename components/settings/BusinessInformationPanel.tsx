"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SettingsField } from "@/components/settings/SettingsField";
import { SettingsSelect } from "@/components/settings/SettingsSelect";
import {
  countryOptions,
  employeeCountOptions,
  industryOptions,
} from "@/lib/data/settings";
import { cn } from "@/lib/utils";
import type { SettingsBusinessInformation } from "@/types/settings";

const businessInformationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  taxIdentificationNumber: z.string().min(1, "Tax identification number is required"),
  industry: z.string().min(1, "Industry is required"),
  website: z.string().url("Enter a valid website URL"),
  yearOfEstablishment: z
    .string()
    .min(4, "Enter a valid year")
    .max(4, "Enter a valid year")
    .regex(/^\d{4}$/, "Enter a valid year"),
  numberOfEmployees: z.string().min(1, "Number of employees is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  stateRegion: z.string().min(1, "State or region is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

type BusinessInformationFormValues = z.infer<typeof businessInformationSchema>;

type BusinessInformationPanelProps = {
  business: SettingsBusinessInformation;
};

export function BusinessInformationPanel({ business }: BusinessInformationPanelProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<BusinessInformationFormValues>({
    resolver: zodResolver(businessInformationSchema),
    defaultValues: {
      companyName: business.companyName,
      registrationNumber: business.registrationNumber,
      taxIdentificationNumber: business.taxIdentificationNumber,
      industry: business.industry,
      website: business.website,
      yearOfEstablishment: business.yearOfEstablishment,
      numberOfEmployees: business.numberOfEmployees,
      streetAddress: business.streetAddress,
      city: business.city,
      stateRegion: business.stateRegion,
      country: business.country,
      postalCode: business.postalCode,
    },
  });

  const onSubmit = handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Business information
        </h2>
        <button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            isDirty
              ? "bg-[color:var(--accent-primary)] text-white hover:bg-[color:var(--accent-primary-hover)]"
              : "cursor-not-allowed bg-[color:var(--border-subtle)] text-[color:var(--text-light)]",
          )}
        >
          Save Changes
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <h3 className="text-base font-semibold text-[color:var(--text-primary)]">
          Company Details
        </h3>
        <div className="flex flex-col gap-5">
          <SettingsField
            label="Company Name"
            error={errors.companyName?.message}
            {...register("companyName")}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <SettingsField
              label="Registration Number"
              error={errors.registrationNumber?.message}
              {...register("registrationNumber")}
            />
            <SettingsField
              label="Tax Identification Number"
              error={errors.taxIdentificationNumber?.message}
              {...register("taxIdentificationNumber")}
            />
            <SettingsSelect
              label="Industry"
              options={industryOptions}
              error={errors.industry?.message}
              {...register("industry")}
            />
            <SettingsField
              label="Website"
              type="url"
              error={errors.website?.message}
              {...register("website")}
            />
            <SettingsField
              label="Year of Establisment"
              error={errors.yearOfEstablishment?.message}
              {...register("yearOfEstablishment")}
            />
            <SettingsSelect
              label="Number of Employees"
              options={employeeCountOptions}
              error={errors.numberOfEmployees?.message}
              {...register("numberOfEmployees")}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 border-t border-[color:var(--border-default)] pt-8">
        <h3 className="text-base font-semibold text-[color:var(--text-primary)]">
          Business Address
        </h3>
        <div className="flex flex-col gap-5">
          <SettingsField
            label="Street Address"
            error={errors.streetAddress?.message}
            {...register("streetAddress")}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <SettingsField label="City" error={errors.city?.message} {...register("city")} />
            <SettingsField
              label="State/Region"
              error={errors.stateRegion?.message}
              {...register("stateRegion")}
            />
            <SettingsSelect
              label="Country"
              options={countryOptions}
              error={errors.country?.message}
              {...register("country")}
            />
            <SettingsField
              label="Postal Code"
              error={errors.postalCode?.message}
              {...register("postalCode")}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
