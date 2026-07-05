"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SettingsField } from "@/components/settings/SettingsField";
import { SettingsSelect } from "@/components/settings/SettingsSelect";
import { languageOptions, timezoneOptions } from "@/lib/data/settings";
import { cn } from "@/lib/utils";
import type { SettingsProfile } from "@/types/settings";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  timezone: z.string().min(1, "Timezone is required"),
  language: z.string().min(1, "Language is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type ProfileManagementPanelProps = {
  profile: SettingsProfile;
};

export function ProfileManagementPanel({ profile }: ProfileManagementPanelProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      department: profile.department,
      timezone: profile.timezone,
      language: profile.language,
    },
  });

  const onSubmit = handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Profile Management
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-primary)] text-2xl font-semibold text-white"
          aria-hidden
        >
          {profile.initials}
        </div>
        <div className="flex flex-col gap-3 sm:flex-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-[color:var(--text-primary)]">
              {profile.displayName}
            </p>
            <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">
              Upload a professional photo. JPG or PNG, max 2MB
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[color:var(--border-default)] bg-white px-4 py-2.5 text-sm font-medium text-[color:var(--text-primary)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-colors hover:bg-[color:var(--bg-muted)]"
          >
            <Upload className="h-4 w-4" />
            Upload a new picture
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h3 className="text-base font-semibold text-[color:var(--text-primary)]">
          Personal Information
        </h3>
        <div className="grid gap-5 md:grid-cols-2">
          <SettingsField
            label="First Name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <SettingsField
            label="Last Name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
          <SettingsField
            label="Email address"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <SettingsField
            label="Phone Number"
            type="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <SettingsField label="Role" error={errors.role?.message} {...register("role")} />
          <SettingsField
            label="Department"
            error={errors.department?.message}
            {...register("department")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h3 className="text-base font-semibold text-[color:var(--text-primary)]">Preferences</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <SettingsSelect
            label="Timezone"
            options={timezoneOptions}
            error={errors.timezone?.message}
            {...register("timezone")}
          />
          <SettingsSelect
            label="Language"
            options={languageOptions}
            error={errors.language?.message}
            {...register("language")}
          />
        </div>
      </div>
    </form>
  );
}
