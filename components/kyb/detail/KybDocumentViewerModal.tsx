"use client";

import Image from "next/image";
import { useEffect } from "react";
import { X } from "lucide-react";
import { downloadKybDocument } from "@/lib/kyb/download-document";
import type { KybSubmittedDocument } from "@/types/kyb";

type KybDocumentViewerModalProps = {
  open: boolean;
  submittedDocument: KybSubmittedDocument | null;
  onClose: () => void;
};

export function KybDocumentViewerModal({
  open,
  submittedDocument,
  onClose,
}: KybDocumentViewerModalProps) {
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

  if (!open || !submittedDocument) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-[color:var(--text-primary)]/40"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="kyb-document-viewer-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-[720px] flex-col overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between px-6 py-5">
          <h2
            id="kyb-document-viewer-title"
            className="text-lg font-semibold text-[color:var(--text-primary)]"
          >
            {submittedDocument.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-[color:var(--text-light)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 px-6">
          <Image
            src={submittedDocument.previewSrc}
            alt={submittedDocument.name}
            width={1570}
            height={1021}
            className="mx-auto h-auto max-h-[min(52vh,420px)] w-full rounded-lg object-contain"
            priority
          />
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="h-11 min-w-[140px] rounded-full border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-6 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => downloadKybDocument(submittedDocument)}
            className="h-11 min-w-[140px] rounded-full bg-[color:var(--text-primary)] px-6 text-sm font-medium text-white transition-colors hover:opacity-90"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
