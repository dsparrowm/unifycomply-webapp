"use client";

import { ArrowLeft, CloudUpload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { AmlEntityTypeMultiSelect } from "@/components/aml-screening/create-case/AmlEntityTypeMultiSelect";
import { AmlCreateCaseSearchByRail } from "@/components/aml-screening/create-case/AmlCreateCaseSearchByRail";
import { AmlActiveMonitoringToggle } from "@/components/aml-screening/detail/AmlActiveMonitoringToggle";
import { SettingsToggle } from "@/components/settings/SettingsToggle";
import {
  amlCreateCaseCountryOptions,
  amlCreateCaseDayOptions,
  amlCreateCaseDefaultSearchBy,
  amlCreateCaseEntityTypeOptions,
  amlCreateCaseMonthOptions,
  amlCreateCaseRiskEngineOptions,
} from "@/lib/data/aml-create-case";
import { cn } from "@/lib/utils";

const fieldClassName =
  "h-11 w-full rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3.5 text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]";

const labelClassName = "mb-1.5 block text-sm font-medium text-[color:var(--text-primary)]";

type FormState = {
  fullName: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  entityTypes: string[];
  uniqueIdentifier: string;
  country: string;
  riskEngine: string;
  matchScoreEnabled: boolean;
  exactMatch: boolean;
  matchScore: number;
  matchAkas: boolean;
  matchRca: boolean;
  biometricFileName: string;
};

const defaultFormState: FormState = {
  fullName: "",
  birthDay: "",
  birthMonth: "",
  birthYear: "",
  entityTypes: ["person"],
  uniqueIdentifier: "",
  country: "",
  riskEngine: "aml-default",
  matchScoreEnabled: true,
  exactMatch: false,
  matchScore: 70,
  matchAkas: false,
  matchRca: false,
  biometricFileName: "",
};

function isAcceptedImage(file: File) {
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".png") ||
    file.type === "image/jpeg" ||
    file.type === "image/png"
  );
}

export function AmlCreateCasePanel() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeMonitoring, setActiveMonitoring] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [form, setForm] = useState<FormState>(defaultFormState);
  const [relevance, setRelevance] = useState(amlCreateCaseDefaultSearchBy.relevance);
  const [entityTypes, setEntityTypes] = useState(amlCreateCaseDefaultSearchBy.entityTypes);
  const [databases, setDatabases] = useState(amlCreateCaseDefaultSearchBy.databases);

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleFile = (file: File | null) => {
    if (!file) {
      updateForm("biometricFileName", "");
      return;
    }
    if (!isAcceptedImage(file)) {
      return;
    }
    updateForm("biometricFileName", file.name);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0] ?? null);
  };

  const onFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0] ?? null);
  };

  const handleClear = () => {
    setForm(defaultFormState);
    setRelevance(amlCreateCaseDefaultSearchBy.relevance);
    setEntityTypes(amlCreateCaseDefaultSearchBy.entityTypes);
    setDatabases(amlCreateCaseDefaultSearchBy.databases);
    setActiveMonitoring(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSearch = () => {
    router.push("/aml-screening/search-results");
  };

  return (
    <div className="mx-auto flex max-w-[1327px] flex-col gap-6 pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Link
            href="/aml-screening"
            className="inline-flex items-center gap-1.5 text-sm text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Link>
          <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">
            Create a New Case
          </h1>
        </div>
        <AmlActiveMonitoringToggle
          checked={activeMonitoring}
          onChange={setActiveMonitoring}
        />
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,320px)]">
        <section className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 border-b border-[color:var(--border-default)] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">
              Create a New Case
            </h2>
            <AmlActiveMonitoringToggle
              checked={activeMonitoring}
              onChange={setActiveMonitoring}
            />
          </div>

          <div className="mt-6 space-y-6">
            <div className="grid items-stretch gap-5 lg:grid-cols-2">
              <div className="flex flex-col gap-5">
                <label className="block">
                  <span className={labelClassName}>Full Name</span>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(event) => updateForm("fullName", event.target.value)}
                    placeholder="Enter full name"
                    className={fieldClassName}
                  />
                </label>

                <AmlEntityTypeMultiSelect
                  label="Entity Type"
                  options={amlCreateCaseEntityTypeOptions}
                  value={form.entityTypes}
                  onChange={(next) => updateForm("entityTypes", next)}
                />

                <label className="block">
                  <span className={labelClassName}>Unique Identifier</span>
                  <input
                    type="text"
                    value={form.uniqueIdentifier}
                    onChange={(event) => updateForm("uniqueIdentifier", event.target.value)}
                    placeholder="Enter"
                    className={fieldClassName}
                  />
                </label>

                <label className="mt-auto block">
                  <span className={labelClassName}>Custom Risk Engine</span>
                  <select
                    value={form.riskEngine}
                    onChange={(event) => updateForm("riskEngine", event.target.value)}
                    className={fieldClassName}
                  >
                    {amlCreateCaseRiskEngineOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <span className={labelClassName}>Date of Birth / Incorporation</span>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      aria-label="Day"
                      value={form.birthDay}
                      onChange={(event) => updateForm("birthDay", event.target.value)}
                      className={fieldClassName}
                    >
                      <option value="">DD</option>
                      {amlCreateCaseDayOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label="Month"
                      value={form.birthMonth}
                      onChange={(event) => updateForm("birthMonth", event.target.value)}
                      className={fieldClassName}
                    >
                      <option value="">MM</option>
                      {amlCreateCaseMonthOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={form.birthYear}
                      onChange={(event) =>
                        updateForm("birthYear", event.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      placeholder="YYYY"
                      aria-label="Year"
                      className={fieldClassName}
                    />
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col">
                  <span className={labelClassName}>Biometric Screening</span>
                  <div
                    className={cn(
                      "flex min-h-[148px] flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-5 text-center transition-colors",
                      isDragging
                        ? "border-[color:var(--accent-primary-hover)] bg-[color:var(--accent-primary-soft)]"
                        : "border-[color:var(--border-default)] hover:border-[color:var(--accent-primary-hover)]",
                    )}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      className="hidden"
                      onChange={onFileInputChange}
                    />
                    <CloudUpload
                      className="h-6 w-6 text-[color:var(--accent-primary-hover)]"
                      aria-hidden="true"
                    />
                    {form.biometricFileName ? (
                      <p className="mt-2 text-sm font-medium text-[color:var(--text-primary)]">
                        {form.biometricFileName}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm">
                        <span className="font-medium text-[color:var(--accent-primary-hover)]">
                          Click to upload
                        </span>
                        <span className="text-[color:var(--text-muted)]"> or drag and drop</span>
                      </p>
                    )}
                    <p className="mt-1 text-xs text-[color:var(--text-muted)]">
                      Accepted format: Jpeg/Png
                    </p>
                  </div>
                </div>

                <label className="mt-auto block">
                  <span className={labelClassName}>Country</span>
                  <select
                    value={form.country}
                    onChange={(event) => updateForm("country", event.target.value)}
                    className={fieldClassName}
                  >
                    <option value="">Select</option>
                    {amlCreateCaseCountryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">Exact Match</h3>
              <div className="mt-4 flex flex-wrap gap-5">
                <label className="inline-flex items-center gap-2 text-sm text-[color:var(--text-primary)]">
                  <input
                    type="checkbox"
                    checked={form.matchScoreEnabled}
                    onChange={(event) => updateForm("matchScoreEnabled", event.target.checked)}
                    className="h-4 w-4 rounded border-[color:var(--border-default)] accent-[color:var(--accent-primary-hover)]"
                  />
                  Match Score
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-[color:var(--text-primary)]">
                  <input
                    type="checkbox"
                    checked={form.exactMatch}
                    onChange={(event) => updateForm("exactMatch", event.target.checked)}
                    className="h-4 w-4 rounded border-[color:var(--border-default)] accent-[color:var(--accent-primary-hover)]"
                  />
                  Exact Match
                </label>
              </div>

              {form.matchScoreEnabled ? (
                <div className="mt-5">
                  <div className="relative mb-1 flex justify-center">
                    <span className="rounded-md bg-[color:var(--accent-primary-hover)] px-2 py-0.5 text-xs font-medium text-white">
                      {form.matchScore}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={form.matchScore}
                    onChange={(event) => updateForm("matchScore", Number(event.target.value))}
                    aria-label="Match score"
                    className="w-full accent-[color:var(--accent-primary-hover)]"
                  />
                  <div className="mt-1 flex items-center justify-between text-xs text-[color:var(--text-muted)]">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              ) : null}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">
                Advance Configuration
              </h3>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-[color:var(--border-default)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                      Match AKAs
                    </p>
                    <SettingsToggle
                      checked={form.matchAkas}
                      onChange={(checked) => updateForm("matchAkas", checked)}
                      label="Match AKAs"
                    />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--text-muted)]">
                    Broaden entity name search to Aliases and Alternate Names to eliminate false
                    negatives
                  </p>
                </div>
                <div className="rounded-xl border border-[color:var(--border-default)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                      Match RCA
                    </p>
                    <SettingsToggle
                      checked={form.matchRca}
                      onChange={(checked) => updateForm("matchRca", checked)}
                      label="Match RCA"
                    />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--text-muted)]">
                    Search through Relatives and close Associates for comprehensive compliance
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="h-11 min-w-[100px] rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-5 text-sm font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-muted)]"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleSearch}
                className="h-11 min-w-[100px] rounded-lg bg-[color:var(--accent-primary-hover)] px-5 text-sm font-medium text-white hover:bg-[color:var(--accent-primary)]"
              >
                Search
              </button>
            </div>
          </div>
        </section>

        <AmlCreateCaseSearchByRail
          relevance={relevance}
          entityTypes={entityTypes}
          databases={databases}
          onRelevanceChange={setRelevance}
          onEntityTypesChange={setEntityTypes}
          onDatabasesChange={setDatabases}
        />
      </div>
    </div>
  );
}
