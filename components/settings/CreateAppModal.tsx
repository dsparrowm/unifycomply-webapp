"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SettingsField } from "@/components/settings/SettingsField";
import { getErrorMessage } from "@/lib/api/errors";

const createAppSchema = z.object({
  name: z.string().min(1, "App name is required"),
  description: z.string().optional(),
});

type CreateAppFormValues = z.infer<typeof createAppSchema>;

type CreateAppModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (values: { name: string; description?: string }) => Promise<void>;
};

export function CreateAppModal({ open, onClose, onCreate }: CreateAppModalProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAppFormValues>({
    resolver: zodResolver(createAppSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    reset({ name: "", description: "" });
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
      await onCreate({
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
      });
      reset();
      onClose();
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not create app"));
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
        aria-labelledby="create-app-title"
        className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[color:var(--border-default)] px-5 py-5">
          <h2 id="create-app-title" className="text-xl font-medium text-[color:var(--text-primary)]">
            Create App
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
          <SettingsField label="App name" error={errors.name?.message} {...register("name")} />
          <SettingsField
            label="Description"
            error={errors.description?.message}
            placeholder="Optional"
            {...register("description")}
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
              disabled={isSubmitting}
              className="rounded-lg bg-[color:var(--accent-primary-hover)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[color:var(--accent-primary)] disabled:opacity-60"
            >
              {isSubmitting ? "Creating…" : "Create App"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
