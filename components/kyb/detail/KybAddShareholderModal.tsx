"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SettingsField } from "@/components/settings/SettingsField";
import { SettingsSelect } from "@/components/settings/SettingsSelect";
import { getErrorMessage } from "@/lib/api/errors";
import { buildAddressDto, countryCodeFromLabel } from "@/lib/api/mappers/onboarding";
import type { CreateTenantKybShareholderDto } from "@/lib/api/types";
import type { KybShareholder } from "@/types/kyb";

const shareholderSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(1, "Phone is required"),
  type: z.enum(["individual", "corporate"]),
  role: z.string().min(1, "Role is required"),
  sharePercentage: z.coerce.number().min(0).max(100),
  shareCountTotal: z.coerce.number().min(1, "Share count is required"),
  dateAppointed: z.string().min(1, "Appointment date is required"),
  countryLabel: z.string().min(1, "Country is required"),
  houseNo: z.string().optional(),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

type ShareholderFormValues = z.infer<typeof shareholderSchema>;

type KybAddShareholderModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmitShareholder: (body: CreateTenantKybShareholderDto) => Promise<void>;
  shareholder?: KybShareholder | null;
};

const typeOptions = [
  { value: "individual", label: "Individual" },
  { value: "corporate", label: "Corporate" },
];

const countryOptions = [
  { value: "Nigeria", label: "Nigeria" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "United States", label: "United States" },
  { value: "Ghana", label: "Ghana" },
  { value: "Kenya", label: "Kenya" },
];

export function KybAddShareholderModal({
  open,
  onClose,
  onSubmitShareholder,
  shareholder = null,
}: KybAddShareholderModalProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShareholderFormValues>({
    resolver: zodResolver(shareholderSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      type: "individual",
      role: "Shareholder",
      sharePercentage: 25,
      shareCountTotal: 1000,
      dateAppointed: "",
      countryLabel: "Nigeria",
      houseNo: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    const [firstName = "", ...lastNameParts] = shareholder?.name.split(" ") ?? [];
    reset(
      shareholder
        ? {
            firstName,
            lastName: lastNameParts.join(" "),
            email: shareholder.email ?? "",
            phone: shareholder.phone ?? "",
            type: shareholder.type,
            role: shareholder.role ?? "Shareholder",
            sharePercentage: shareholder.percentage,
            shareCountTotal: shareholder.shares,
            dateAppointed: shareholder.dateAppointed ?? "",
            countryLabel: shareholder.countryLabel ?? "Nigeria",
            houseNo: shareholder.address?.houseNo ?? "",
            street: shareholder.address?.street ?? "",
            city: shareholder.address?.city ?? "",
            state: shareholder.address?.state ?? "",
            zipCode: shareholder.address?.zipCode ?? "",
          }
        : undefined,
    );
    setFormError(null);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const body: CreateTenantKybShareholderDto = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        type: values.type,
        role: values.role.trim(),
        sharePercentage: values.sharePercentage,
        shareCountTotal: values.shareCountTotal,
        dateAppointed: values.dateAppointed,
        countryCode: countryCodeFromLabel(values.countryLabel),
        address: buildAddressDto({
          houseNo: values.houseNo ?? "",
          street: values.street,
          city: values.city,
          state: values.state ?? "",
          zipCode: values.zipCode ?? "",
          countryLabel: values.countryLabel,
        }),
      };
      await onSubmitShareholder(body);
      reset();
      onClose();
    } catch (error) {
      setFormError(getErrorMessage(error, shareholder ? "Could not update shareholder" : "Could not add shareholder"));
    }
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-[color:var(--text-primary)]/20 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-shareholder-title"
        className="relative z-10 max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-5 py-5">
          <h2
            id="add-shareholder-title"
            className="text-xl font-medium text-[color:var(--text-primary)]"
          >
            {shareholder ? "Edit shareholder" : "Add shareholder"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-[color:var(--text-light)] hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 px-5 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <SettingsField label="First name" error={errors.firstName?.message} {...register("firstName")} />
            <SettingsField label="Last name" error={errors.lastName?.message} {...register("lastName")} />
          </div>
          <SettingsField label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <SettingsField label="Phone" error={errors.phone?.message} {...register("phone")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <SettingsSelect label="Type" options={typeOptions} error={errors.type?.message} {...register("type")} />
            <SettingsField label="Role" error={errors.role?.message} {...register("role")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SettingsField
              label="Share %"
              type="number"
              error={errors.sharePercentage?.message}
              {...register("sharePercentage")}
            />
            <SettingsField
              label="Share count"
              type="number"
              error={errors.shareCountTotal?.message}
              {...register("shareCountTotal")}
            />
          </div>
          <SettingsField
            label="Date appointed"
            type="date"
            error={errors.dateAppointed?.message}
            {...register("dateAppointed")}
          />
          <SettingsSelect
            label="Country"
            options={countryOptions}
            error={errors.countryLabel?.message}
            {...register("countryLabel")}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <SettingsField label="House no." error={errors.houseNo?.message} {...register("houseNo")} />
            <SettingsField label="Street" error={errors.street?.message} {...register("street")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <SettingsField label="City" error={errors.city?.message} {...register("city")} />
            <SettingsField label="State" error={errors.state?.message} {...register("state")} />
            <SettingsField label="Zip" error={errors.zipCode?.message} {...register("zipCode")} />
          </div>

          {formError ? <p className="text-sm text-[color:var(--state-error)]">{formError}</p> : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[color:var(--border-default)] px-4 py-2 text-sm font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[color:var(--accent-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)] disabled:opacity-60"
            >
              {isSubmitting ? "Saving…" : shareholder ? "Save changes" : "Add shareholder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
