"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SettingsField } from "@/components/settings/SettingsField";
import { SettingsSelect } from "@/components/settings/SettingsSelect";
import { getErrorMessage } from "@/lib/api/errors";
import type { SettingsSelectOption } from "@/types/settings";

const inviteSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  roleId: z.string().min(1, "Role is required"),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

type InviteTeamMemberModalProps = {
  open: boolean;
  onClose: () => void;
  roleOptions: SettingsSelectOption[];
  onInvite: (values: InviteFormValues) => Promise<void>;
};

export function InviteTeamMemberModal({
  open,
  onClose,
  roleOptions,
  onInvite,
}: InviteTeamMemberModalProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      fullName: "",
      email: "",
      roleId: roleOptions[0]?.value ?? "",
    },
  });

  useEffect(() => {
    if (!open) return;

    reset({
      fullName: "",
      email: "",
      roleId: roleOptions[0]?.value ?? "",
    });
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
  }, [open, onClose, reset, roleOptions]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await onInvite(values);
      reset();
      onClose();
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not send invite"));
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
        aria-labelledby="invite-team-member-title"
        className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[color:var(--border-default)] px-5 py-5">
          <h2
            id="invite-team-member-title"
            className="text-xl font-medium text-[color:var(--text-primary)]"
          >
            Invite Team Member
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

        <form onSubmit={onSubmit} className="space-y-5 px-5 py-6">
          <SettingsField
            label="Full name"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
          <SettingsField
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <SettingsSelect
            label="Role"
            options={roleOptions}
            error={errors.roleId?.message}
            {...register("roleId")}
          />

          {formError ? (
            <p className="text-sm text-[color:var(--state-error)]" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[color:var(--border-default)] px-4 py-2.5 text-sm font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || roleOptions.length === 0}
              className="rounded-lg bg-[color:var(--accent-primary-hover)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[color:var(--accent-primary)] disabled:opacity-60"
            >
              {isSubmitting ? "Sending…" : "Send invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
