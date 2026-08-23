"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { getErrorMessage } from "@/lib/api/errors";
import { timezoneOptions } from "@/lib/data/settings";
import { cn } from "@/lib/utils";

const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name is required"),
  registrationNumber: z.string().min(2, "Registration number is required"),
  countryCode: z.string().min(2, "Country code is required").max(2),
  timezone: z.string().min(1, "Timezone is required"),
});

export type CreateWorkspaceValues = z.infer<typeof createWorkspaceSchema>;

type CreateWorkspaceFormProps = {
  onSubmit: (values: CreateWorkspaceValues) => Promise<void>;
};

export function CreateWorkspaceForm({ onSubmit }: CreateWorkspaceFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkspaceValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      registrationNumber: "",
      countryCode: "NG",
      timezone: "Africa/Lagos",
    },
  });

  const onSubmitForm = async (values: CreateWorkspaceValues) => {
    setFormError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not create workspace"));
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmitForm)}>
      <AuthField
        label="Workspace name"
        autoComplete="organization"
        placeholder="Acme Ltd"
        error={errors.name?.message}
        {...register("name")}
      />
      <AuthField
        label="Registration number"
        placeholder="RC123456789"
        error={errors.registrationNumber?.message}
        {...register("registrationNumber")}
      />
      <AuthField
        label="Country code"
        placeholder="NG"
        error={errors.countryCode?.message}
        {...register("countryCode")}
      />
      <div className="space-y-1.5">
        <label
          htmlFor="workspace-timezone"
          className="text-sm font-medium leading-5 text-[color:var(--auth-label)]"
        >
          Timezone
        </label>
        <select
          id="workspace-timezone"
          className={cn(
            "w-full rounded-lg border border-[color:var(--auth-input-border)] bg-white px-3.5 py-3 text-base leading-6 text-[color:var(--text-primary)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-colors focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]",
            errors.timezone?.message && "border-[color:var(--state-error)]",
          )}
          {...register("timezone")}
        >
          {timezoneOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.timezone?.message ? (
          <p className="text-xs text-[color:var(--state-error)]">{errors.timezone.message}</p>
        ) : null}
      </div>

      {formError ? (
        <p className="text-sm text-[color:var(--state-error)]" role="alert">
          {formError}
        </p>
      ) : null}

      <AuthButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating workspace…" : "Create workspace"}
      </AuthButton>
    </form>
  );
}
