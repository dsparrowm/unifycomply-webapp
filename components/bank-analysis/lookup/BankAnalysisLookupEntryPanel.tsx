"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { KybLookupBackHeader } from "@/components/kyb/lookup/KybLookupBackHeader";
import { KybLookupFileUpload } from "@/components/kyb/lookup/KybLookupFileUpload";
import { KybLookupTypeDropdown } from "@/components/kyb/lookup/KybLookupTypeDropdown";
import {
  bankAnalysisLookupAppOptions,
  bankAnalysisLookupBankOptions,
  bankAnalysisLookupCountryOptions,
} from "@/lib/data/bank-analysis-lookup";
import { cn } from "@/lib/utils";
import type {
  BankAnalysisLookupBank,
  BankAnalysisLookupMode,
} from "@/types/bank-analysis";

const bankAnalysisLookupSchema = z
  .object({
    mode: z.enum(["single", "batch"]),
    country: z.string().min(1, "Select a country to continue."),
    app: z.string().min(1, "Select an app to continue."),
    bank: z.string().min(1, "Select a bank to continue."),
    accountNumber: z.string(),
    batchName: z.string(),
    fileName: z.string(),
  })
  .superRefine((values, context) => {
    if (values.mode === "single" && !values.accountNumber.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["accountNumber"],
        message: "Enter an account number to continue.",
      });
    }

    if (values.mode === "batch") {
      if (!values.batchName.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["batchName"],
          message: "Enter a batch name to continue.",
        });
      }

      if (!values.fileName) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fileName"],
          message: "Upload an xlsx file to continue.",
        });
      }
    }
  });

type BankAnalysisLookupValues = z.infer<typeof bankAnalysisLookupSchema>;
type OpenDropdown = "country" | "app" | "bank" | null;

type BankAnalysisLookupEntryPanelProps = {
  initialMode: BankAnalysisLookupMode;
};

export function BankAnalysisLookupEntryPanel({
  initialMode,
}: BankAnalysisLookupEntryPanelProps) {
  const router = useRouter();
  const [mode, setMode] = useState<BankAnalysisLookupMode>(initialMode);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<BankAnalysisLookupValues>({
    resolver: zodResolver(bankAnalysisLookupSchema),
    defaultValues: {
      mode: initialMode,
      country: "",
      app: "",
      bank: "",
      accountNumber: "",
      batchName: "",
      fileName: "",
    },
  });

  const country = watch("country");
  const app = watch("app");
  const bank = watch("bank") as BankAnalysisLookupBank | "";

  const onSubmit = handleSubmit((values) => {
    router.push(values.mode === "batch" ? "/bank-analysis/batch" : "/bank-analysis/ba-run-1");
  });

  const handleModeChange = (nextMode: BankAnalysisLookupMode) => {
    setMode(nextMode);
    setValue("mode", nextMode);
    setValue("accountNumber", "");
    setValue("batchName", "");
    setValue("fileName", "");
    setBulkFile(null);
    setOpenDropdown(null);
    clearErrors();
    router.replace(`/bank-analysis/lookup?mode=${nextMode}`, { scroll: false });
  };

  const formError =
    errors.country?.message ??
    errors.app?.message ??
    errors.bank?.message ??
    errors.accountNumber?.message ??
    errors.batchName?.message;

  return (
    <div className="flex flex-col gap-10">
      <KybLookupBackHeader
        backHref="/bank-analysis"
        breadcrumb="Bank Analysis / Perform Lookup"
      />

      <div className="mx-auto flex w-full max-w-[694px] flex-col items-center gap-8">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <div className="space-y-2">
            <h1 className="text-[30px] leading-tight font-semibold text-[color:var(--text-primary)]">
              Verification
            </h1>
            <p className="text-sm text-[color:var(--text-muted)]">
              Perform bank analysis checks on your customers
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Bank verification mode"
            className="inline-flex w-full max-w-[384px] gap-6"
          >
            {(
              [
                { id: "single", label: "Single Verification" },
                { id: "bulk", label: "Bulk Verification" },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={mode === (option.id === "bulk" ? "batch" : "single")}
                onClick={() => handleModeChange(option.id === "bulk" ? "batch" : "single")}
                className={cn(
                  "h-11 flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                  mode === (option.id === "bulk" ? "batch" : "single")
                    ? "bg-[color:var(--accent-primary-hover)] text-white"
                    : "border border-[color:var(--accent-primary-hover)] bg-white text-[color:var(--accent-primary-hover)] hover:bg-[color:var(--accent-primary-soft)]",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
          <form onSubmit={onSubmit} className="flex flex-col gap-5 p-8">
            <input type="hidden" {...register("mode")} />
            <input type="hidden" {...register("fileName")} />

            <KybLookupTypeDropdown
              label="Country"
              placeholder="Select country"
              options={bankAnalysisLookupCountryOptions}
              value={country}
              onChange={(value) => setValue("country", value, { shouldValidate: true })}
              open={openDropdown === "country"}
              onOpenChange={(open) => setOpenDropdown(open ? "country" : null)}
            />

            <KybLookupTypeDropdown
              label="Select app"
              options={bankAnalysisLookupAppOptions}
              value={app}
              onChange={(value) => setValue("app", value, { shouldValidate: true })}
              open={openDropdown === "app"}
              onOpenChange={(open) => setOpenDropdown(open ? "app" : null)}
            />

            <KybLookupTypeDropdown
              label="Select bank"
              options={bankAnalysisLookupBankOptions}
              value={bank}
              onChange={(value) => setValue("bank", value, { shouldValidate: true })}
              open={openDropdown === "bank"}
              onOpenChange={(open) => setOpenDropdown(open ? "bank" : null)}
            />

            {mode === "batch" ? (
              <>
                <div className="space-y-1.5">
                  <label
                    htmlFor="bank-analysis-batch-name"
                    className="text-sm font-medium text-[color:var(--text-primary)]"
                  >
                    Batch Name
                  </label>
                  <input
                    id="bank-analysis-batch-name"
                    {...register("batchName")}
                    aria-invalid={Boolean(errors.batchName)}
                    placeholder="e.g. Techventures"
                    className="w-full rounded-lg border border-[color:var(--border-default)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--text-primary)] shadow-sm outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]"
                  />
                </div>

                <KybLookupFileUpload
                  hint="Upload an xlsx file with entity name, account number, and bank columns."
                  file={bulkFile}
                  onFileChange={(file) => {
                    setBulkFile(file);
                    setValue("fileName", file?.name ?? "", { shouldValidate: true });
                  }}
                  error={errors.fileName?.message}
                />
              </>
            ) : (
              <div className="space-y-1.5">
                <label
                  htmlFor="bank-analysis-account-number"
                  className="text-sm font-medium text-[color:var(--text-primary)]"
                >
                  Account Number
                </label>
                <input
                  id="bank-analysis-account-number"
                  {...register("accountNumber")}
                  inputMode="numeric"
                  aria-invalid={Boolean(errors.accountNumber)}
                  placeholder="Enter account number"
                  className="w-full rounded-lg border border-[color:var(--border-default)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--text-primary)] shadow-sm outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]"
                />
              </div>
            )}

            {formError ? (
              <p role="alert" className="text-sm text-[color:var(--state-error)]">
                {formError}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end sm:gap-5">
              <button
                type="button"
                onClick={() => router.push("/bank-analysis")}
                className="h-11 w-full rounded-lg bg-[color:var(--border-subtle)] px-6 text-sm font-medium text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--border-default)] sm:w-auto sm:min-w-[240px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-11 w-full rounded-lg bg-[color:var(--accent-primary-hover)] px-6 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)] sm:w-auto sm:min-w-[240px]"
              >
                {mode === "batch" ? "Start Batch Verification" : "Perform Verification"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
