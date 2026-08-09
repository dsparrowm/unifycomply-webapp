"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, FileSpreadsheet, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import type { AmlLookupMode } from "@/types/aml-screening";

const lookupSchema = z
  .object({
    mode: z.enum(["single", "batch"]),
    entityType: z.enum(["individual", "business"]),
    entityName: z.string(),
    country: z.string(),
    dateOfBirth: z.string(),
    batchName: z.string(),
    fileName: z.string(),
  })
  .superRefine((values, context) => {
    if (values.mode === "single") {
      if (!values.entityName.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["entityName"],
          message: "Enter the entity name.",
        });
      }
      if (!values.country) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["country"],
          message: "Select a country.",
        });
      }
    } else {
      if (!values.batchName.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["batchName"],
          message: "Enter a batch name.",
        });
      }
      if (!values.fileName) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fileName"],
          message: "Select a CSV or Excel file.",
        });
      }
    }
  });

type AmlLookupValues = z.infer<typeof lookupSchema>;

type AmlScreeningLookupPanelProps = {
  initialMode: AmlLookupMode;
};

const fieldClassName =
  "h-11 w-full rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3.5 text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]";

export function AmlScreeningLookupPanel({ initialMode }: AmlScreeningLookupPanelProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AmlLookupMode>(initialMode);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AmlLookupValues>({
    resolver: zodResolver(lookupSchema),
    defaultValues: {
      mode: initialMode,
      entityType: "individual",
      entityName: "",
      country: "",
      dateOfBirth: "",
      batchName: "",
      fileName: "",
    },
  });
  const selectedFileName = watch("fileName");

  const changeMode = (nextMode: AmlLookupMode) => {
    setMode(nextMode);
    setValue("mode", nextMode);
    router.replace(`/aml-screening/lookup?mode=${nextMode}`, { scroll: false });
  };

  const onSubmit = handleSubmit((values) => {
    router.push(values.mode === "batch" ? "/aml-screening/batch" : "/aml-screening/aml-1");
  });

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/aml-screening"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[color:var(--text-muted)] hover:text-[color:var(--accent-primary-hover)]"
      >
        <ArrowLeft className="h-4 w-4" />
        AML Screening
      </Link>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-7">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-[color:var(--text-primary)]">
            AML Verification
          </h1>
          <p className="mt-2 text-sm text-[color:var(--text-muted)]">
            Screen individuals and businesses against global compliance data
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Screening mode"
          className="mx-auto grid w-full max-w-md grid-cols-2 gap-3"
        >
          {(["single", "batch"] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={mode === option}
              onClick={() => changeMode(option)}
              className={cn(
                "h-11 rounded-full border px-4 text-sm font-medium transition-colors",
                mode === option
                  ? "border-[color:var(--accent-primary-hover)] bg-[color:var(--accent-primary-hover)] text-white"
                  : "border-[color:var(--accent-primary-hover)] bg-[color:var(--bg-surface)] text-[color:var(--accent-primary-hover)] hover:bg-[color:var(--accent-primary-soft)]",
              )}
            >
              {option === "single" ? "Single Screening" : "Batch Screening"}
            </button>
          ))}
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm sm:p-8"
        >
          <input type="hidden" {...register("mode")} />
          {mode === "single" ? (
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm font-medium text-[color:var(--text-primary)]">
                  Entity type
                  <select {...register("entityType")} className={fieldClassName}>
                    <option value="individual">Individual</option>
                    <option value="business">Business</option>
                  </select>
                </label>
                <label className="space-y-1.5 text-sm font-medium text-[color:var(--text-primary)]">
                  Country
                  <select {...register("country")} className={fieldClassName}>
                    <option value="">Select country</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="South Africa">South Africa</option>
                  </select>
                  {errors.country ? (
                    <span className="block text-xs text-[color:var(--state-error)]">
                      {errors.country.message}
                    </span>
                  ) : null}
                </label>
              </div>
              <label className="block space-y-1.5 text-sm font-medium text-[color:var(--text-primary)]">
                Full legal name
                <input
                  {...register("entityName")}
                  placeholder="Enter an individual or business name"
                  className={fieldClassName}
                />
                {errors.entityName ? (
                  <span className="block text-xs text-[color:var(--state-error)]">
                    {errors.entityName.message}
                  </span>
                ) : null}
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-[color:var(--text-primary)]">
                Date of birth or incorporation
                <input type="date" {...register("dateOfBirth")} className={fieldClassName} />
              </label>
            </div>
          ) : (
            <div className="space-y-5">
              <label className="block space-y-1.5 text-sm font-medium text-[color:var(--text-primary)]">
                Batch name
                <input
                  {...register("batchName")}
                  placeholder="e.g. August customer review"
                  className={fieldClassName}
                />
                {errors.batchName ? (
                  <span className="block text-xs text-[color:var(--state-error)]">
                    {errors.batchName.message}
                  </span>
                ) : null}
              </label>
              <label className="block cursor-pointer rounded-xl border border-dashed border-[color:var(--accent-primary-hover)] bg-[color:var(--accent-primary-subtle)] p-8 text-center">
                <FileSpreadsheet className="mx-auto h-10 w-10 text-[color:var(--accent-primary-hover)]" />
                <span className="mt-3 block text-sm font-medium text-[color:var(--text-primary)]">
                  Upload screening file
                </span>
                <span className="mt-1 block text-xs text-[color:var(--text-muted)]">
                  {selectedFileName ||
                    "CSV, XLS, or XLSX with name, entity type, country, and date of birth"}
                </span>
                <span className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-4 py-2 text-sm font-medium text-[color:var(--text-primary)]">
                  <Upload className="h-4 w-4" />
                  Select file
                </span>
                <input
                  type="file"
                  accept=".csv,.xls,.xlsx"
                  className="sr-only"
                  onChange={(event) =>
                    setValue("fileName", event.target.files?.[0]?.name ?? "", {
                      shouldValidate: true,
                    })
                  }
                />
              </label>
              {errors.fileName ? (
                <p className="text-xs text-[color:var(--state-error)]">
                  {errors.fileName.message}
                </p>
              ) : null}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.push("/aml-screening")}
              className="h-11 rounded-lg border border-[color:var(--border-default)] px-6 text-sm font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 rounded-lg bg-[color:var(--accent-primary-hover)] px-6 text-sm font-medium text-white hover:bg-[color:var(--accent-primary)]"
            >
              {mode === "single" ? "Run Screening" : "Start Batch Screening"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
