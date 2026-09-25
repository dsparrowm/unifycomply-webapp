"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { ApiKybDocumentType, CreateTenantKybDocumentDto } from "@/lib/api/types";
import type { KybSubmittedDocument } from "@/types/kyb";

const documentOptions: { value: ApiKybDocumentType; label: string }[] = [
  { value: "certificate-of-incorporation", label: "Certificate of Incorporation" },
  { value: "tin", label: "TIN" },
  { value: "proof-of-business-address", label: "Proof of Business Address" },
  { value: "memart", label: "Memorandum & Articles of Association" },
];

type Props = {
  document: KybSubmittedDocument | null;
  onClose: () => void;
  onSave: (body: CreateTenantKybDocumentDto) => Promise<void>;
};

export function KybDocumentMetadataModal({ document, onClose, onSave }: Props) {
  const [type, setType] = useState<ApiKybDocumentType>("certificate-of-incorporation");
  const [idNumber, setIdNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!document) return;
    setType(document.type ?? "certificate-of-incorporation");
    setIdNumber(document.idNumber ?? "");
    setIssueDate(document.issueDate ?? "");
    setExpiryDate(document.expiryDate ?? "");
    setError(null);
  }, [document]);

  if (!document) return null;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave({
        type,
        idNumber: idNumber.trim() || undefined,
        issueDate: issueDate || undefined,
        expiryDate: expiryDate || undefined,
      });
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not update document");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" aria-label="Close dialog" onClick={onClose} className="absolute inset-0 bg-[color:var(--text-primary)]/20 backdrop-blur-[2px]" />
      <div role="dialog" aria-modal="true" aria-labelledby="document-metadata-title" className="relative z-10 w-full max-w-lg rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl">
        <div className="flex items-center justify-between border-b border-[color:var(--border-default)] px-5 py-5">
          <h2 id="document-metadata-title" className="text-lg font-medium text-[color:var(--text-primary)]">Edit document metadata</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-[color:var(--text-light)] hover:bg-[color:var(--bg-muted)]"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4 px-5 py-6">
          <label className="block text-sm text-[color:var(--text-primary)]">Document type<select value={type} onChange={(event) => setType(event.target.value as ApiKybDocumentType)} className="mt-1 w-full rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3 py-2.5">{documentOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          <label className="block text-sm text-[color:var(--text-primary)]">Document number<input value={idNumber} onChange={(event) => setIdNumber(event.target.value)} className="mt-1 w-full rounded-lg border border-[color:var(--border-default)] px-3 py-2.5" /></label>
          <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm text-[color:var(--text-primary)]">Issue date<input type="date" value={issueDate} onChange={(event) => setIssueDate(event.target.value)} className="mt-1 w-full rounded-lg border border-[color:var(--border-default)] px-3 py-2.5" /></label><label className="block text-sm text-[color:var(--text-primary)]">Expiry date<input type="date" value={expiryDate} onChange={(event) => setExpiryDate(event.target.value)} className="mt-1 w-full rounded-lg border border-[color:var(--border-default)] px-3 py-2.5" /></label></div>
          {error ? <p className="text-sm text-[color:var(--state-error)]">{error}</p> : null}
          <div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-lg border border-[color:var(--border-default)] px-4 py-2 text-sm">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-[color:var(--accent-primary)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60">{saving ? "Saving..." : "Save changes"}</button></div>
        </form>
      </div>
    </div>
  );
}