"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AmlAdvanceConfiguration } from "@/components/aml/lookup/AmlAdvanceConfiguration";
import { AmlBiometricUpload } from "@/components/aml/lookup/AmlBiometricUpload";
import { AmlCompactSelect } from "@/components/aml/lookup/AmlCompactSelect";
import { AmlCreateCaseHeader } from "@/components/aml/lookup/AmlCreateCaseHeader";
import { AmlExactMatchSection } from "@/components/aml/lookup/AmlExactMatchSection";
import { AmlSearchBySidebar } from "@/components/aml/lookup/AmlSearchBySidebar";
import { AmlToggle } from "@/components/aml/lookup/AmlToggle";
import { KybLookupTypeDropdown } from "@/components/kyb/lookup/KybLookupTypeDropdown";
import {
  amlAllDatabaseKeys,
  amlCaseCountryOptions,
  amlCaseEntityTypeOptions,
  amlDayOptions,
  amlMonthOptions,
  amlRiskEngineOptions,
  amlYearOptions,
  downloadAmlBatchTemplate,
} from "@/lib/data/aml-create-case";
import { getAmlBatchLookupSlug } from "@/lib/data/aml-batch-results";
import { cn } from "@/lib/utils";
import type {
  AmlCaseEntityType,
  AmlDatabaseKey,
  AmlLookupMode,
  AmlMatchMode,
  AmlRelevanceKey,
  AmlSearchEntityType,
} from "@/types/aml";

const searchByFields = {
  relevance: z.array(z.enum(["dob", "alias", "name", "rca"])),
  searchEntityTypes: z.array(z.enum(["aircraft", "organization", "person", "vessel"])).min(1, {
    message: "Select at least one entity type.",
  }),
  databases: z
    .array(
      z.enum([
        "adverse-media",
        "business",
        "businessperson",
        "fitness-probity",
        "insolvency",
        "pep-1",
        "pep-2",
        "pep-3",
        "pep-4",
      ]),
    )
    .min(1, { message: "Select at least one database." }),
};

const singleSchema = z.object({
  activeMonitoring: z.boolean(),
  fullName: z.string().min(1, "Enter a full name to continue."),
  dobDay: z.string(),
  dobMonth: z.string(),
  dobYear: z.string(),
  entityType: z.enum(["all", "person", "organization", "aircraft", "vessel"]),
  uniqueIdentifier: z.string(),
  biometricFile: z.custom<File | null>((value) => value === null || value instanceof File),
  riskEngine: z.string().min(1),
  country: z.string().min(1, "Select a country to continue."),
  matchMode: z.enum(["score", "exact"]),
  matchScore: z.number().min(0).max(100),
  matchAka: z.boolean(),
  matchRca: z.boolean(),
  ...searchByFields,
});

const batchSchema = z.object({
  activeMonitoring: z.boolean(),
  fileName: z.string().min(1, "Enter a file name to continue."),
  batchFile: z.custom<File | null>((value) => value === null || value instanceof File),
  relevance: searchByFields.relevance,
  searchEntityTypes: searchByFields.searchEntityTypes,
  databases: searchByFields.databases,
});

type SingleValues = z.infer<typeof singleSchema>;
type BatchValues = z.infer<typeof batchSchema>;
type OpenDropdown = "entityType" | "riskEngine" | "country" | "day" | "month" | "year" | null;

const inputClassName =
  "w-full rounded-lg border border-[color:var(--border-default)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--text-primary)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-colors placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]";

const singleDefaults: SingleValues = {
  activeMonitoring: false,
  fullName: "",
  dobDay: "",
  dobMonth: "",
  dobYear: "",
  entityType: "person",
  uniqueIdentifier: "",
  biometricFile: null,
  riskEngine: "aml-default",
  country: "",
  matchMode: "score",
  matchScore: 70,
  matchAka: false,
  matchRca: false,
  relevance: ["name"],
  searchEntityTypes: ["person"],
  databases: [...amlAllDatabaseKeys],
};

const batchDefaults: BatchValues = {
  activeMonitoring: false,
  fileName: "",
  batchFile: null,
  relevance: ["name"],
  searchEntityTypes: ["person"],
  databases: [...amlAllDatabaseKeys],
};

type AmlCreateCasePanelProps = {
  mode: AmlLookupMode;
};

export function AmlCreateCasePanel({ mode }: AmlCreateCasePanelProps) {
  return mode === "batch" ? <AmlBatchCreateCaseForm /> : <AmlSingleCreateCaseForm />;
}

function AmlSingleCreateCaseForm() {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SingleValues>({
    resolver: zodResolver(singleSchema),
    defaultValues: singleDefaults,
  });

  const values = watch();
  const formError =
    errors.fullName?.message ??
    errors.country?.message ??
    errors.searchEntityTypes?.message ??
    errors.databases?.message;

  return (
    <form
      onSubmit={handleSubmit((formValues) => {
        router.push(
          `/aml-screening/lookup/result?name=${encodeURIComponent(formValues.fullName)}`,
        );
      })}
      className="flex flex-col gap-6"
    >
      <AmlCreateCaseHeader
        activeMonitoring={values.activeMonitoring}
        onActiveMonitoringChange={(checked) => setValue("activeMonitoring", checked)}
      />

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <div className="min-w-0 flex-1 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-lg font-semibold text-[color:var(--text-primary)]">
              Create a New Case
            </h1>
            <AmlToggle
              id="aml-card-monitoring"
              label="Active Monitoring"
              checked={values.activeMonitoring}
              onChange={(checked) => setValue("activeMonitoring", checked)}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="aml-full-name"
                className="text-sm font-medium text-[color:var(--text-primary)]"
              >
                Full Name
              </label>
              <input
                id="aml-full-name"
                {...register("fullName")}
                placeholder="Enter full name"
                className={inputClassName}
              />
            </div>

            <div className="space-y-1.5">
              <p className="text-sm font-medium text-[color:var(--text-primary)]">
                Date of Birth / Incorporation
              </p>
              <div className="grid grid-cols-3 gap-2">
                <AmlCompactSelect
                  placeholder="DD"
                  options={amlDayOptions}
                  value={values.dobDay}
                  onChange={(value) => setValue("dobDay", value)}
                  open={openDropdown === "day"}
                  onOpenChange={(open) => setOpenDropdown(open ? "day" : null)}
                />
                <AmlCompactSelect
                  placeholder="MM"
                  options={amlMonthOptions}
                  value={values.dobMonth}
                  onChange={(value) => setValue("dobMonth", value)}
                  open={openDropdown === "month"}
                  onOpenChange={(open) => setOpenDropdown(open ? "month" : null)}
                />
                <AmlCompactSelect
                  placeholder="YYYY"
                  options={amlYearOptions}
                  value={values.dobYear}
                  onChange={(value) => setValue("dobYear", value)}
                  open={openDropdown === "year"}
                  onOpenChange={(open) => setOpenDropdown(open ? "year" : null)}
                />
              </div>
            </div>

            <KybLookupTypeDropdown
              label="Entity Type"
              options={amlCaseEntityTypeOptions}
              value={values.entityType}
              onChange={(value) => setValue("entityType", value as AmlCaseEntityType)}
              open={openDropdown === "entityType"}
              onOpenChange={(open) => setOpenDropdown(open ? "entityType" : null)}
            />

            <div className="md:row-span-2">
              <AmlBiometricUpload
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                acceptedLabel="Jpeg/Png"
                file={values.biometricFile}
                onFileChange={(file) => setValue("biometricFile", file)}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="aml-unique-id"
                className="text-sm font-medium text-[color:var(--text-primary)]"
              >
                Unique Identifier
              </label>
              <input
                id="aml-unique-id"
                {...register("uniqueIdentifier")}
                placeholder="Enter"
                className={inputClassName}
              />
            </div>

            <KybLookupTypeDropdown
              label="Customer Risk Engine"
              options={amlRiskEngineOptions}
              value={values.riskEngine}
              onChange={(value) => setValue("riskEngine", value)}
              open={openDropdown === "riskEngine"}
              onOpenChange={(open) => setOpenDropdown(open ? "riskEngine" : null)}
            />

            <KybLookupTypeDropdown
              label="Country"
              placeholder="Select"
              options={amlCaseCountryOptions}
              value={values.country}
              onChange={(value) => setValue("country", value, { shouldValidate: true })}
              open={openDropdown === "country"}
              onOpenChange={(open) => setOpenDropdown(open ? "country" : null)}
            />
          </div>

          <div className="mt-8">
            <AmlExactMatchSection
              matchMode={values.matchMode}
              matchScore={values.matchScore}
              onMatchModeChange={(mode) => setValue("matchMode", mode as AmlMatchMode)}
              onMatchScoreChange={(score) => setValue("matchScore", score)}
            />
          </div>

          <div className="mt-8">
            <AmlAdvanceConfiguration
              matchAka={values.matchAka}
              matchRca={values.matchRca}
              onMatchAkaChange={(checked) => setValue("matchAka", checked)}
              onMatchRcaChange={(checked) => setValue("matchRca", checked)}
            />
          </div>

          {formError ? (
            <p className="mt-6 text-sm text-[color:var(--state-error)]">{formError}</p>
          ) : null}

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => reset(singleDefaults)}
              className="h-11 min-w-[120px] rounded-lg bg-[color:var(--border-subtle)] px-6 text-sm font-medium text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--border-default)]"
            >
              Clear
            </button>
            <button
              type="submit"
              className="h-11 min-w-[120px] rounded-lg bg-[color:var(--accent-primary-hover)] px-6 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
            >
              Search
            </button>
          </div>
        </div>

        <AmlSearchBySidebar
          relevance={values.relevance as AmlRelevanceKey[]}
          searchEntityTypes={values.searchEntityTypes as AmlSearchEntityType[]}
          databases={values.databases as AmlDatabaseKey[]}
          onRelevanceChange={(value) => setValue("relevance", value)}
          onSearchEntityTypesChange={(value) =>
            setValue("searchEntityTypes", value, { shouldValidate: true })
          }
          onDatabasesChange={(value) => setValue("databases", value, { shouldValidate: true })}
        />
      </div>
    </form>
  );
}

function AmlBatchCreateCaseForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<BatchValues>({
    resolver: zodResolver(batchSchema),
    defaultValues: batchDefaults,
  });

  const values = watch();
  const formError =
    errors.fileName?.message ??
    errors.batchFile?.message ??
    errors.searchEntityTypes?.message ??
    errors.databases?.message;

  const onSubmit = handleSubmit((formValues) => {
    if (!(formValues.batchFile instanceof File)) {
      setError("batchFile", { message: "Upload a CSV or Excel file to continue." });
      return;
    }

    router.push(`/aml-screening/batch/${getAmlBatchLookupSlug(formValues.fileName)}`);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <AmlCreateCaseHeader
        activeMonitoring={values.activeMonitoring}
        onActiveMonitoringChange={(checked) => setValue("activeMonitoring", checked)}
      />

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <div className="min-w-0 flex-1 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-lg font-semibold text-[color:var(--text-primary)]">
              Create a New Case
            </h1>
            <AmlToggle
              id="aml-batch-card-monitoring"
              label="Active Monitoring"
              checked={values.activeMonitoring}
              onChange={(checked) => setValue("activeMonitoring", checked)}
            />
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="aml-file-name"
                className="text-sm font-medium text-[color:var(--text-primary)]"
              >
                File Name
              </label>
              <input
                id="aml-file-name"
                {...register("fileName")}
                placeholder="Enter"
                className={inputClassName}
              />
            </div>

            <AmlBiometricUpload
              hint="Upload a CSV or Excel file containing entity information"
              accept=".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              acceptedLabel="CSV/Excel"
              file={values.batchFile}
              onFileChange={(file) => setValue("batchFile", file, { shouldValidate: true })}
              error={errors.batchFile?.message}
            />

            <div className="flex flex-col gap-3 rounded-xl bg-[color:var(--accent-primary-soft)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--accent-primary-hover)]" />
                <div>
                  <p className="text-sm font-medium text-[color:var(--text-primary)]">
                    Need a template?
                  </p>
                  <p className="text-sm text-[color:var(--text-muted)]">
                    Download our CSV template with the correct format and field requirements
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={downloadAmlBatchTemplate}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-[color:var(--accent-primary)] px-3 text-xs font-medium text-white transition-colors hover:bg-[color:var(--accent-primary-hover)]"
              >
                <Download className="h-3.5 w-3.5" />
                Download Template
              </button>
            </div>
          </div>

          {formError && formError !== errors.batchFile?.message ? (
            <p className="mt-6 text-sm text-[color:var(--state-error)]">{formError}</p>
          ) : null}

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => reset(batchDefaults)}
              className={cn(
                "h-11 min-w-[120px] rounded-lg bg-[color:var(--border-subtle)] px-6 text-sm font-medium text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--border-default)]",
              )}
            >
              Clear
            </button>
            <button
              type="submit"
              className="h-11 min-w-[120px] rounded-lg bg-[color:var(--accent-primary-hover)] px-6 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
            >
              Search
            </button>
          </div>
        </div>

        <AmlSearchBySidebar
          relevance={values.relevance as AmlRelevanceKey[]}
          searchEntityTypes={values.searchEntityTypes as AmlSearchEntityType[]}
          databases={values.databases as AmlDatabaseKey[]}
          onRelevanceChange={(value) => setValue("relevance", value)}
          onSearchEntityTypesChange={(value) =>
            setValue("searchEntityTypes", value, { shouldValidate: true })
          }
          onDatabasesChange={(value) => setValue("databases", value, { shouldValidate: true })}
        />
      </div>
    </form>
  );
}
