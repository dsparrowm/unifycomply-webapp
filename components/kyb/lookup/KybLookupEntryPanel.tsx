"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { KybLookupBackHeader } from "@/components/kyb/lookup/KybLookupBackHeader";
import { KybLookupFileUpload } from "@/components/kyb/lookup/KybLookupFileUpload";
import { KybLookupTypeDropdown } from "@/components/kyb/lookup/KybLookupTypeDropdown";
import {
  getKybBulkUploadHint,
  getKybLookupIdentifierLabel,
  kybLookupAppOptions,
  kybLookupCountryOptions,
  kybLookupTypeOptions,
} from "@/lib/data/kyb-lookup";
import { cn } from "@/lib/utils";
import type { KybLookupType, KybLookupVerificationMode } from "@/types/kyb";

type OpenDropdown = "country" | "app" | "id" | null;

export function KybLookupEntryPanel() {
  const router = useRouter();
  const [verificationMode, setVerificationMode] = useState<KybLookupVerificationMode>("single");
  const [country, setCountry] = useState("");
  const [batchName, setBatchName] = useState("");
  const [app, setApp] = useState("");
  const [lookupType, setLookupType] = useState<KybLookupType | "">("");
  const [identifier, setIdentifier] = useState("");
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleModeChange = (mode: KybLookupVerificationMode) => {
    setVerificationMode(mode);
    setBatchName("");
    setIdentifier("");
    setBulkFile(null);
    setError(null);
    setFileError(null);
    setOpenDropdown(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFileError(null);

    if (!country) {
      setError("Select a country to continue.");
      return;
    }

    if (!app) {
      setError("Select an app to continue.");
      return;
    }

    if (!lookupType) {
      setError("Select a lookup type to continue.");
      return;
    }

    if (verificationMode === "bulk") {
      if (!batchName.trim()) {
        setError("Enter a batch name to continue.");
        return;
      }

      if (!bulkFile) {
        setFileError("Upload an xlsx file to continue.");
        return;
      }

      router.push(
        `/kyb/lookup/result?${new URLSearchParams({
          type: lookupType,
          country,
          app,
          batch: batchName.trim(),
          identifier: "RC-23456789",
          mode: verificationMode,
        }).toString()}`,
      );
      return;
    }

    if (!identifier.trim()) {
      setError(`Enter a ${getKybLookupIdentifierLabel(lookupType).toLowerCase()}.`);
      return;
    }

    const params = new URLSearchParams({
      type: lookupType,
      country,
      app,
      identifier: identifier.trim(),
      mode: verificationMode,
    });

    router.push(`/kyb/lookup/result?${params.toString()}`);
  };

  const countryField = (
    <KybLookupTypeDropdown
      label="Country"
      placeholder="Select country"
      options={kybLookupCountryOptions}
      value={country}
      onChange={setCountry}
      open={openDropdown === "country"}
      onOpenChange={(open) => setOpenDropdown(open ? "country" : null)}
    />
  );

  const appField = (
    <KybLookupTypeDropdown
      label="Select app"
      placeholder="Select"
      options={kybLookupAppOptions}
      value={app}
      onChange={setApp}
      open={openDropdown === "app"}
      onOpenChange={(open) => setOpenDropdown(open ? "app" : null)}
    />
  );

  const idField = (
    <KybLookupTypeDropdown
      label="Select ID"
      placeholder="Select"
      options={kybLookupTypeOptions}
      value={lookupType}
      onChange={(value) => {
        setLookupType(value);
        setIdentifier("");
        setError(null);
      }}
      open={openDropdown === "id"}
      onOpenChange={(open) => setOpenDropdown(open ? "id" : null)}
    />
  );

  return (
    <div className="flex flex-col gap-10">
      <KybLookupBackHeader breadcrumb="KYB / Perform Lookup" />

      <div className="mx-auto flex w-full max-w-[694px] flex-col items-center gap-8">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <div className="space-y-2">
            <h1 className="text-[30px] font-semibold leading-tight text-[color:var(--text-primary)]">
              Verification
            </h1>
            <p className="text-sm text-[color:var(--text-muted)]">
              Perform kyb checks on your businesses
            </p>
          </div>

          <div className="inline-flex w-full max-w-[384px] gap-6">
            {(
              [
                { id: "single", label: "Single Verification" },
                { id: "bulk", label: "Bulk Verification" },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleModeChange(mode.id)}
                className={cn(
                  "h-11 flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                  verificationMode === mode.id
                    ? "bg-[color:var(--accent-primary-hover)] text-white"
                    : "border border-[color:var(--accent-primary-hover)] bg-white text-[color:var(--accent-primary-hover)]",
                )}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-8">
            {verificationMode === "bulk" ? (
              <>
                {countryField}

                <div className="space-y-1.5">
                  <label
                    htmlFor="kyb-lookup-batch-name"
                    className="text-sm font-medium text-[color:var(--text-primary)]"
                  >
                    Batch Name
                  </label>
                  <input
                    id="kyb-lookup-batch-name"
                    value={batchName}
                    onChange={(event) => {
                      setBatchName(event.target.value);
                      setError(null);
                    }}
                    placeholder="file"
                    className="w-full rounded-lg border border-[color:var(--border-default)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--text-primary)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-colors placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]"
                  />
                </div>

                {appField}
                {idField}

                <KybLookupFileUpload
                  hint={getKybBulkUploadHint(lookupType)}
                  file={bulkFile}
                  onFileChange={(file) => {
                    setBulkFile(file);
                    setFileError(null);
                  }}
                  error={fileError ?? undefined}
                />
              </>
            ) : (
              <>
                {countryField}
                {appField}
                {idField}

                {lookupType ? (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="kyb-lookup-identifier"
                      className="text-sm font-medium text-[color:var(--text-primary)]"
                    >
                      {getKybLookupIdentifierLabel(lookupType)}
                    </label>
                    <input
                      id="kyb-lookup-identifier"
                      value={identifier}
                      onChange={(event) => {
                        setIdentifier(event.target.value);
                        setError(null);
                      }}
                      placeholder={`Enter ${getKybLookupIdentifierLabel(lookupType).toLowerCase()}`}
                      className="w-full rounded-lg border border-[color:var(--border-default)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--text-primary)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-colors placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]"
                    />
                  </div>
                ) : null}
              </>
            )}

            {error ? <p className="text-sm text-[color:var(--state-error)]">{error}</p> : null}

            <div className="flex justify-end gap-5 pt-3">
              <button
                type="button"
                onClick={() => router.push("/kyb")}
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
