"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { KybLookupBackHeader } from "@/components/kyb/lookup/KybLookupBackHeader";
import { KybLookupTypeDropdown } from "@/components/kyb/lookup/KybLookupTypeDropdown";
import {
  bankAnalysisLookupAppOptions,
  bankAnalysisLookupBankOptions,
  bankAnalysisLookupCountryOptions,
} from "@/lib/data/bank-analysis-lookup";
import { cn } from "@/lib/utils";
import type { BankAnalysisLookupBank } from "@/types/bank-analysis";

const bankAnalysisLookupSchema = z.object({
  country: z.string().min(1, "Select a country to continue."),
  app: z.string().min(1, "Select an app to continue."),
  bank: z.string().min(1, "Select a bank to continue."),
  accountNumber: z.string(),
});

type BankAnalysisLookupValues = z.infer<typeof bankAnalysisLookupSchema>;
type OpenDropdown = "country" | "app" | "bank" | null;

export function BankAnalysisLookupEntryPanel() {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<BankAnalysisLookupValues>({
    resolver: zodResolver(bankAnalysisLookupSchema),
    defaultValues: {
      country: "",
      app: "",
      bank: "",
      accountNumber: "",
    },
  });

  const country = watch("country");
  const app = watch("app");
  const bank = watch("bank") as BankAnalysisLookupBank | "";

  const onSubmit = handleSubmit((values) => {
    if (!values.accountNumber.trim()) {
      setError("accountNumber", { message: "Enter an account number to continue." });
      return;
    }

    router.push("/bank-analysis/ba-run-1");
  });

  const formError =
    errors.country?.message ??
    errors.app?.message ??
    errors.bank?.message ??
    errors.accountNumber?.message;

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

          <div className="inline-flex w-full max-w-[384px] gap-6">
            {(
              [
                { id: "single", label: "Single Verification" },
                { id: "bulk", label: "Bulk Verification" },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={option.id === "bulk"}
                title={option.id === "bulk" ? "Batch Lookup is pending its result design" : undefined}
                className={cn(
                  "h-11 flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                  option.id === "single"
                    ? "bg-[color:var(--accent-primary-hover)] text-white"
                    : "cursor-not-allowed border border-[color:var(--accent-primary-hover)] bg-white text-[color:var(--accent-primary-hover)] opacity-60",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
          <form onSubmit={onSubmit} className="flex flex-col gap-5 p-8">
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
                placeholder="Enter account number"
                className="w-full rounded-lg border border-[color:var(--border-default)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--text-primary)] shadow-sm outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]"
              />
            </div>

            {formError ? (
              <p className="text-sm text-[color:var(--state-error)]">{formError}</p>
            ) : null}

            <div className="flex justify-end gap-5 pt-3">
              <button
                type="button"
                onClick={() => router.push("/bank-analysis")}
                className="h-11 min-w-[240px] rounded-lg bg-[color:var(--border-subtle)] px-6 text-sm font-medium text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--border-default)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-11 min-w-[240px] rounded-lg bg-[color:var(--accent-primary-hover)] px-6 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
              >
                Perform Verification
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
