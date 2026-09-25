"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LIST_TYPE_OPTIONS = ["Post No Debit"] as const;

const ENTITY_TYPE_OPTIONS = ["Individual", "Business"] as const;

const NATIONALITY_OPTIONS = [
  "United States",
  "United Kingdom",
  "Nigeria",
  "Germany",
  "Canada",
] as const;

const RISK_LEVEL_OPTIONS = ["Low", "Medium", "High", "Critical"] as const;

const REASON_OPTIONS = [
  "Unusual transaction Pattern",
  "Structuring / Smurfing",
  "High Risk Jurisdiction Pattern",
  "Layering Activity",
  "Trade Based Money Laundering",
  "Beneficial Ownership Concern",
  "PEP Involvement",
  "Potential Sanctions Evasion",
  "Suspected Terrorist Financing",
  "Fraud Indicators",
] as const;

const SOURCE_OPTIONS = [
  "Internal TM Alert",
  "Customer Disclosure",
  "Law Enforcement",
  "Regulatory Request",
  "Third-party Tip",
] as const;

const OFFICER_OPTIONS = [
  "Compliance Officer",
  "MLRO",
  "Senior Analyst",
] as const;

type PlacePndModalProps = {
  open: boolean;
  transactionId: string;
  customerName?: string;
  onClose: () => void;
  onSubmit?: (payload: {
    entityType: "individual" | "business";
    fullName: string;
    riskLevel: "low" | "medium" | "high" | "critical";
    reasonForListing: string;
    narrative?: string;
    evidenceReference?: string;
  }) => void;
};

function FieldLabel({
  children,
  required,
  htmlFor,
}: {
  children: string;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-[color:var(--text-primary)]"
    >
      {children}
      {required ? <span className="text-[color:var(--state-error)]"> *</span> : null}
    </label>
  );
}

const inputClassName =
  "w-full rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3 py-2.5 text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]";

export function PlacePndModal({
  open,
  transactionId,
  customerName = "",
  onClose,
  onSubmit,
}: PlacePndModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [listType, setListType] = useState<string>(LIST_TYPE_OPTIONS[0]);
  const [entityType, setEntityType] = useState<string>(ENTITY_TYPE_OPTIONS[0]);
  const [fullName, setFullName] = useState(customerName);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState<string>(NATIONALITY_OPTIONS[0]);
  const [bvnSsn, setBvnSsn] = useState("123456789");
  const [idNumber, setIdNumber] = useState("1234567890");
  const [address, setAddress] = useState("address");
  const [riskLevel, setRiskLevel] = useState("");
  const [reason, setReason] = useState("");
  const [narrative, setNarrative] = useState("");
  const [source, setSource] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [evidenceRef, setEvidenceRef] = useState(`Transaction ID: ${transactionId}`);
  const [officer, setOfficer] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    setFullName(customerName || "Anna Schmidt");
    setEvidenceRef(`Transaction ID: ${transactionId}`);
  }, [customerName, open, transactionId]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const canSubmit = narrative.trim().length > 0 && Boolean(riskLevel) && Boolean(reason);

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }
    onSubmit?.({
      entityType: entityType === "Business" ? "business" : "individual",
      fullName: fullName.trim(),
      riskLevel: riskLevel.toLowerCase() as "low" | "medium" | "high" | "critical",
      reasonForListing: reason,
      narrative: narrative.trim(),
      evidenceReference: evidenceRef.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close place PND dialog"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-pnd-title"
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-[color:var(--border-subtle)] px-6 py-4">
          <div>
            <h2
              id="place-pnd-title"
              className="text-lg font-semibold text-[color:var(--text-primary)]"
            >
              Place Post No Debit (PND)
            </h2>
            <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">
              Freeze account and prevent debit transactions
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="pnd-list-type">List Type</FieldLabel>
              <select
                id="pnd-list-type"
                value={listType}
                onChange={(event) => setListType(event.target.value)}
                className={inputClassName}
              >
                {LIST_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="pnd-entity-type">Entity Type</FieldLabel>
              <select
                id="pnd-entity-type"
                value={entityType}
                onChange={(event) => setEntityType(event.target.value)}
                className={inputClassName}
              >
                {ENTITY_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-[color:var(--border-default)] p-4">
            <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">
              Individual Information
            </h3>
            <div>
              <FieldLabel htmlFor="pnd-full-name">Full Name</FieldLabel>
              <input
                id="pnd-full-name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className={inputClassName}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="pnd-dob">Date of Birth</FieldLabel>
                <input
                  id="pnd-dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="pnd-nationality">Nationality</FieldLabel>
                <select
                  id="pnd-nationality"
                  value={nationality}
                  onChange={(event) => setNationality(event.target.value)}
                  className={inputClassName}
                >
                  {NATIONALITY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="pnd-bvn">BVN / SSN</FieldLabel>
                <input
                  id="pnd-bvn"
                  type="text"
                  value={bvnSsn}
                  onChange={(event) => setBvnSsn(event.target.value)}
                  className={inputClassName}
                />
              </div>
              <div>
                <FieldLabel htmlFor="pnd-id">ID Number</FieldLabel>
                <input
                  id="pnd-id"
                  type="text"
                  value={idNumber}
                  onChange={(event) => setIdNumber(event.target.value)}
                  className={inputClassName}
                />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="pnd-address">Full Address</FieldLabel>
              <input
                id="pnd-address"
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="address"
                className={inputClassName}
              />
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-[color:var(--border-default)] p-4">
            <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">
              Risk Assessment
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="pnd-risk">Risk Level</FieldLabel>
                <select
                  id="pnd-risk"
                  value={riskLevel}
                  onChange={(event) => setRiskLevel(event.target.value)}
                  className={inputClassName}
                >
                  <option value="">Select</option>
                  {RISK_LEVEL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="pnd-reason">Reason for Listing</FieldLabel>
                <select
                  id="pnd-reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  className={inputClassName}
                >
                  <option value="">Select</option>
                  {REASON_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="pnd-narrative" required>
                Detailed Narrative
              </FieldLabel>
              <textarea
                id="pnd-narrative"
                value={narrative}
                onChange={(event) => setNarrative(event.target.value)}
                rows={4}
                placeholder="Provide detailed description of suspicious activity, red flags, and justification for PND listing..."
                className={cn(inputClassName, "resize-none")}
              />
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-[color:var(--border-default)] p-4">
            <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">
              Supporting Information
            </h3>
            <div>
              <FieldLabel htmlFor="pnd-source">Source of Information</FieldLabel>
              <select
                id="pnd-source"
                value={source}
                onChange={(event) => setSource(event.target.value)}
                className={inputClassName}
              >
                <option value="">Select</option>
                {SOURCE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="pnd-review-date">Review Date</FieldLabel>
              <input
                id="pnd-review-date"
                type="date"
                value={reviewDate}
                onChange={(event) => setReviewDate(event.target.value)}
                className={inputClassName}
              />
            </div>
            <div>
              <FieldLabel htmlFor="pnd-evidence">Evidence Reference</FieldLabel>
              <input
                id="pnd-evidence"
                type="text"
                value={evidenceRef}
                onChange={(event) => setEvidenceRef(event.target.value)}
                className={inputClassName}
              />
            </div>
            <div>
              <FieldLabel htmlFor="pnd-officer">Reporting Officer</FieldLabel>
              <select
                id="pnd-officer"
                value={officer}
                onChange={(event) => setOfficer(event.target.value)}
                className={inputClassName}
              >
                <option value="">Select</option>
                {OFFICER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel required>Upload Supporting Documents</FieldLabel>
              <p className="mb-2 text-xs text-[color:var(--text-muted)]">
                Court orders, evidence, legal documents
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setFileName(file?.name ?? null);
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-4 py-8 text-center transition-colors hover:border-[color:var(--accent-primary-hover)]"
              >
                <Upload className="h-6 w-6 text-[color:var(--accent-primary-hover)]" />
                <span className="text-sm font-medium text-[color:var(--text-primary)]">
                  {fileName ?? "Click to upload or drag and drop"}
                </span>
                <span className="text-xs text-[color:var(--text-muted)]">
                  PDF, DOCX, JPG, PNG up to 10MB each
                </span>
              </button>
            </div>
          </section>

          <div className="rounded-lg border border-[color:var(--state-warning)]/30 bg-[color:var(--state-warning-soft)] px-4 py-3">
            <p className="text-sm font-semibold text-[color:var(--state-warning)]">
              Important Notice - Account Freeze
            </p>
            <p className="mt-1 text-sm text-[color:var(--text-muted)]">
              By placing Post No Debit (PND) on this account, all debit transactions will be
              immediately blocked and the account will be frozen. Credits may still be allowed.
              This action will be logged in the audit trail and requires supporting documentation.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 border-t border-[color:var(--border-subtle)] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[color:var(--border-default)] px-5 py-2.5 text-sm font-medium text-[color:var(--text-muted)] hover:bg-[color:var(--bg-muted)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="rounded-lg bg-[color:var(--accent-primary-hover)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[color:var(--accent-primary)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            File SAR
          </button>
        </div>
      </div>
    </div>
  );
}
