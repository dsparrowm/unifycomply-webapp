"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { AmlCreateCaseInput, AmlScreeningDetail } from "@/types/aml-screening";

const createCaseSchema = z.object({
  title: z.string().min(4, "Enter a descriptive case title."),
  priority: z.enum(["medium", "high", "critical"]),
  assignee: z.string().min(1, "Select an assignee."),
  notes: z.string().min(10, "Add at least 10 characters of investigation notes."),
});

type AmlCreateCaseModalProps = {
  open: boolean;
  detail: AmlScreeningDetail;
  onClose: () => void;
  onConfirm: (input: AmlCreateCaseInput) => void;
};

const fieldClassName =
  "w-full rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3.5 py-2.5 text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)]";

export function AmlCreateCaseModal({
  open,
  detail,
  onClose,
  onConfirm,
}: AmlCreateCaseModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AmlCreateCaseInput>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      title: `AML review — ${detail.entityName}`,
      priority: detail.riskScore >= 4 ? "critical" : "high",
      assignee: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close create case dialog"
        onClick={onClose}
        className="absolute inset-0 bg-[color:var(--text-primary)]/30 backdrop-blur-[2px]"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="aml-create-case-title"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[color:var(--border-default)] px-6 py-5">
          <div>
            <h2
              id="aml-create-case-title"
              className="text-lg font-semibold text-[color:var(--text-primary)]"
            >
              Create compliance case
            </h2>
            <p className="mt-1 text-sm text-[color:var(--text-muted)]">
              {detail.entityName} · {detail.screeningId}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-[color:var(--text-light)] hover:bg-[color:var(--bg-muted)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit((values) => {
            onConfirm(values);
            reset();
          })}
          className="space-y-5 p-6"
        >
          <label className="block space-y-1.5 text-sm font-medium text-[color:var(--text-primary)]">
            Case title
            <input {...register("title")} autoFocus className={fieldClassName} />
            {errors.title ? (
              <span className="block text-xs text-[color:var(--state-error)]">
                {errors.title.message}
              </span>
            ) : null}
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium text-[color:var(--text-primary)]">
              Priority
              <select {...register("priority")} className={fieldClassName}>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium text-[color:var(--text-primary)]">
              Assign to
              <select {...register("assignee")} className={fieldClassName}>
                <option value="">Select Senior Officer</option>
                <option value="Ada Okafor">Ada Okafor</option>
                <option value="David Mensah">David Mensah</option>
                <option value="MLRO Queue">MLRO Queue</option>
              </select>
              {errors.assignee ? (
                <span className="block text-xs text-[color:var(--state-error)]">
                  {errors.assignee.message}
                </span>
              ) : null}
            </label>
          </div>
          <label className="block space-y-1.5 text-sm font-medium text-[color:var(--text-primary)]">
            Investigation notes
            <textarea
              {...register("notes")}
              rows={4}
              placeholder="Summarise the matches and required next steps"
              className={fieldClassName}
            />
            {errors.notes ? (
              <span className="block text-xs text-[color:var(--state-error)]">
                {errors.notes.message}
              </span>
            ) : null}
          </label>
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-lg border border-[color:var(--border-default)] px-5 text-sm font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 rounded-lg bg-[color:var(--accent-primary)] px-5 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)]"
            >
              Create Case
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
