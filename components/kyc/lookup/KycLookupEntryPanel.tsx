"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { KycLookupBackHeader } from "@/components/kyc/lookup/KycLookupBackHeader";
import { KycLookupFileUpload } from "@/components/kyc/lookup/KycLookupFileUpload";
import { KycLookupTypeDropdown } from "@/components/kyc/lookup/KycLookupTypeDropdown";
import { getErrorMessage } from "@/lib/api/errors";
import { countryNameFromCode } from "@/lib/compliance/format";
import {
  checksToOptions,
  filterKycLookupChecks,
  isKycLookupType,
  lookupCountryCode,
} from "@/lib/compliance/lookup-checks";
import {
  documentTypeForLookup,
  lookupDocumentFields,
  lookupDocumentFileError,
  matchingLookupDocument,
} from "@/lib/compliance/lookup-run";
import {
  getKycBulkUploadHint,
  getKycLookupIdentifierLabel,
  kycLookupAppOptions,
  kycLookupCountryOptions,
  kycLookupTypeOptions,
} from "@/lib/data/kyc-lookup";
import { useAvailableChecks, useKycDocuments, useKycList, useStartKycLookup } from "@/lib/hooks/use-compliance";
import { cn } from "@/lib/utils";
import type { KycLookupVerificationMode } from "@/types/kyc";

type OpenDropdown = "country" | "customer" | "app" | "id" | null;

export function KycLookupEntryPanel() {
  const router = useRouter();
  const [verificationMode, setVerificationMode] = useState<KycLookupVerificationMode>("single");
  const [country, setCountry] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [batchName, setBatchName] = useState("");
  const [app, setApp] = useState("");
  const [lookupType, setLookupType] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const customersQuery = useKycList();
  const documentsQuery = useKycDocuments(customerId);
  const checksQuery = useAvailableChecks(country ? lookupCountryCode(country) : "", "individual");
  const startLookup = useStartKycLookup();
  const idOptions = checksQuery.data?.checks.length
    ? checksToOptions(filterKycLookupChecks(checksQuery.data.checks))
    : kycLookupTypeOptions;
  const documentFields = lookupType ? lookupDocumentFields(lookupType) : { file: false, issueDate: false, expiryDate: false };
  const identifierLabel = isKycLookupType(lookupType)
    ? getKycLookupIdentifierLabel(lookupType)
    : idOptions.find((option) => option.value === lookupType)?.label ?? "Identifier";
  const existingDocument = matchingLookupDocument(documentsQuery.data, lookupType, identifier);
  const existingHasFile = Boolean(existingDocument?.url || existingDocument?.status === "validated");
  const customerOptions = useMemo(() => {
    if (!country) return [];
    const countryName = countryNameFromCode(lookupCountryCode(country));
    return (customersQuery.data?.records ?? [])
      .filter((record) => record.country === countryName)
      .map((record) => ({
        value: record.id,
        label: `${record.customerName} (${record.kycId})`,
      }));
  }, [country, customersQuery.data?.records]);

  useEffect(() => {
    if (!customerId || !lookupType) {
      setIdentifier("");
      setIssueDate("");
      setExpiryDate("");
      return;
    }
    const documentType = documentTypeForLookup(lookupType);
    const match = documentsQuery.data?.find((document) => document.type === documentType && document.idNumber);
    setIdentifier(match?.idNumber ?? "");
    setIssueDate(match?.issueDate?.slice(0, 10) ?? "");
    setExpiryDate(match?.expiryDate?.slice(0, 10) ?? "");
    setDocumentFile(null);
    setFileError(null);
  }, [customerId, lookupType, documentsQuery.data]);

  const handleModeChange = (mode: KycLookupVerificationMode) => {
    setVerificationMode(mode);
    setBatchName("");
    setIdentifier("");
    setIssueDate("");
    setExpiryDate("");
    setDocumentFile(null);
    setBulkFile(null);
    setError(null);
    setFileError(null);
    setOpenDropdown(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFileError(null);

    if (!country) {
      setError("Select a country to continue.");
      return;
    }

    if (!customerId) {
      setError("Select an existing customer. Lookup does not create customers.");
      return;
    }

    if (!app) {
      setError("Select an app to continue.");
      return;
    }

    if (!lookupType) {
      setError("Select an ID type to continue.");
      return;
    }

    if (verificationMode === "bulk") {
      setError("Batch lookup is not available yet. Run a single identifier instead.");
      return;
    }

    if (!identifier.trim()) {
      setError(`Enter a ${identifierLabel.toLowerCase()}.`);
      return;
    }

    if (documentFields.issueDate && !issueDate) {
      setError("Enter the issue date from the passport.");
      return;
    }

    if (documentFields.expiryDate && !expiryDate) {
      setError("Enter the expiry date from the document.");
      return;
    }

    if (documentFields.file && !documentFile && !existingHasFile) {
      setError("Upload the identity document to continue.");
      return;
    }

    if (documentFile) {
      const uploadError = lookupDocumentFileError(documentFile);
      if (uploadError) {
        setFileError(uploadError);
        return;
      }
    }

    try {
      const started = await startLookup.mutateAsync({
        customerId,
        lookupType,
        identifier: identifier.trim(),
        file: documentFile,
        issueDate: issueDate || undefined,
        expiryDate: expiryDate || undefined,
      });
      const params = new URLSearchParams({
        workflowId: started.workflowId,
        type: started.lookupType,
        country,
        app,
        identifier: identifier.trim(),
        mode: verificationMode,
      });
      router.push(`/kyc/lookup/result?${params.toString()}`);
    } catch (err) {
      setError(getErrorMessage(err, "Lookup could not be started."));
    }
  };

  const countryField = (
    <KycLookupTypeDropdown
      label="Country"
      placeholder="Select country"
      options={kycLookupCountryOptions}
      value={country}
      onChange={(value) => {
        setCountry(value);
        setCustomerId("");
        setLookupType("");
        setIdentifier("");
        setIssueDate("");
        setExpiryDate("");
        setDocumentFile(null);
      }}
      open={openDropdown === "country"}
      onOpenChange={(open) => setOpenDropdown(open ? "country" : null)}
    />
  );

  const customerField = (
    <KycLookupTypeDropdown
      label="Customer"
      placeholder={country ? "Select an existing customer" : "Select a country first"}
      options={customerOptions}
      value={customerId}
      onChange={(value) => {
        setCustomerId(value);
        setError(null);
      }}
      open={openDropdown === "customer"}
      onOpenChange={(open) => setOpenDropdown(open ? "customer" : null)}
    />
  );

  const appField = (
    <KycLookupTypeDropdown
      label="Select app"
      placeholder="Select"
      options={kycLookupAppOptions}
      value={app}
      onChange={setApp}
      open={openDropdown === "app"}
      onOpenChange={(open) => setOpenDropdown(open ? "app" : null)}
    />
  );

  const idField = (
    <KycLookupTypeDropdown
      label="Select ID"
      placeholder="Select"
      options={idOptions}
      value={lookupType}
                  onChange={(value) => {
                    setLookupType(value);
                    setError(null);
                    setFileError(null);
                    setDocumentFile(null);
                  }}
      open={openDropdown === "id"}
      onOpenChange={(open) => setOpenDropdown(open ? "id" : null)}
    />
  );

  return (
    <div className="flex flex-col gap-10">
      <KycLookupBackHeader breadcrumb="KYC / Perform Lookup" />

      <div className="mx-auto flex w-full max-w-[694px] flex-col items-center gap-8">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <div className="space-y-2">
            <h1 className="text-[30px] font-semibold leading-tight text-[color:var(--text-primary)]">
              Verification
            </h1>
            <p className="text-sm text-[color:var(--text-muted)]">
              Run checks on customers already created through the API
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
                  "flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors h-11",
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
                    htmlFor="lookup-batch-name"
                    className="text-sm font-medium text-[color:var(--text-primary)]"
                  >
                    Batch Name
                  </label>
                  <input
                    id="lookup-batch-name"
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

                <KycLookupFileUpload
                  hint={getKycBulkUploadHint(isKycLookupType(lookupType) ? lookupType : "")}
                  file={bulkFile}
                  onFileChange={(file) => {
                    if (file && !file.name.toLowerCase().endsWith(".xlsx")) {
                      setFileError("Upload an .xlsx spreadsheet.");
                      return;
                    }
                    setBulkFile(file);
                    setFileError(null);
                  }}
                  error={fileError ?? undefined}
                />
              </>
            ) : (
              <>
                {countryField}
                {customerField}
                {country && customerOptions.length === 0 && !customersQuery.isLoading ? (
                  <p className="text-sm text-[color:var(--text-muted)]">
                    No customers in this country yet. Create them through the API, then run lookup here.
                  </p>
                ) : null}
                {appField}
                {idField}

                {lookupType ? (
                  <div className="space-y-1.5">
                    <label
                      htmlFor="lookup-identifier"
                      className="text-sm font-medium text-[color:var(--text-primary)]"
                    >
                      {identifierLabel}
                    </label>
                    <input
                      id="lookup-identifier"
                      value={identifier}
                      onChange={(event) => {
                        setIdentifier(event.target.value);
                        setError(null);
                      }}
                      placeholder={`Enter ${identifierLabel.toLowerCase()}`}
                      className="w-full rounded-lg border border-[color:var(--border-default)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--text-primary)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-colors placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]"
                    />
                  </div>
                ) : null}

                {documentFields.issueDate || documentFields.expiryDate ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {documentFields.issueDate ? (
                      <div className="space-y-1.5">
                        <label
                          htmlFor="lookup-issue-date"
                          className="text-sm font-medium text-[color:var(--text-primary)]"
                        >
                          Issue date
                        </label>
                        <input
                          id="lookup-issue-date"
                          type="date"
                          value={issueDate}
                          onChange={(event) => {
                            setIssueDate(event.target.value);
                            setError(null);
                          }}
                          className="w-full rounded-lg border border-[color:var(--border-default)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--text-primary)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-colors focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]"
                        />
                      </div>
                    ) : null}
                    {documentFields.expiryDate ? (
                      <div className="space-y-1.5">
                        <label
                          htmlFor="lookup-expiry-date"
                          className="text-sm font-medium text-[color:var(--text-primary)]"
                        >
                          Expiry date
                        </label>
                        <input
                          id="lookup-expiry-date"
                          type="date"
                          value={expiryDate}
                          onChange={(event) => {
                            setExpiryDate(event.target.value);
                            setError(null);
                          }}
                          className="w-full rounded-lg border border-[color:var(--border-default)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--text-primary)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-colors focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]"
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {documentFields.file ? (
                  <KycLookupFileUpload
                    label="Document"
                    hint={
                      existingHasFile
                        ? "A file is already on this customer. Upload another only if you need to replace it."
                        : "Upload a scan or photo of the identity document."
                    }
                    file={documentFile}
                    accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                    formatHint="PDF, JPEG, or PNG (max 2MB)"
                    onFileChange={(file) => {
                      if (file) {
                        const uploadError = lookupDocumentFileError(file);
                        if (uploadError) {
                          setFileError(uploadError);
                          setDocumentFile(null);
                          return;
                        }
                      }
                      setDocumentFile(file);
                      setFileError(null);
                    }}
                    error={fileError ?? undefined}
                  />
                ) : null}
              </>
            )}

            {error ? <p className="text-sm text-[color:var(--state-error)]">{error}</p> : null}

            <div className="flex justify-end gap-5 pt-3">
              <button
                type="button"
                onClick={() => router.push("/kyc")}
                className="h-11 min-w-[240px] rounded-lg bg-[color:var(--border-subtle)] px-6 text-sm font-medium text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--border-default)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={startLookup.isPending}
                className="h-11 min-w-[240px] rounded-lg bg-[color:var(--accent-primary-hover)] px-6 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)] disabled:opacity-60"
              >
                {startLookup.isPending ? "Starting…" : "Perform Verification"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
