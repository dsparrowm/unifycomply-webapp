import { KybDetailSectionHeader } from "@/components/kyb/detail/KybDetailSectionHeader";
import { Check, Download, Eye, FileText } from "lucide-react";
import type { KybSubmittedDocument, KybSubmittedDocumentsData } from "@/types/kyb";

type KybDocumentsTabProps = {
  documents: KybSubmittedDocumentsData;
};

function DocumentStatusBadge({ status }: { status: KybSubmittedDocument["status"] }) {
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--state-success)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--state-success)]">
        <Check className="h-3 w-3" />
        Verified
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="inline-flex items-center rounded-full border border-[color:var(--state-error)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--state-error)]">
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-[color:var(--state-warning)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--state-warning)]">
      Pending
    </span>
  );
}

function KybDocumentRow({ document }: { document: KybSubmittedDocument }) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-primary-hover)] text-white"
          aria-hidden
        >
          <FileText className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-[color:var(--text-primary)]">{document.name}</p>
          <p className="text-sm text-[color:var(--text-muted)]">
            Uploaded : {document.uploadedAt}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:shrink-0">
        <DocumentStatusBadge status={document.status} />
        <button
          type="button"
          aria-label={`View ${document.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label={`Download ${document.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export function KybDocumentsTab({ documents }: KybDocumentsTabProps) {
  const documentCount = documents.documents.length;

  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <KybDetailSectionHeader
        title={`Submitted Documents (${documentCount})`}
        status={documents.sectionStatus}
      />

      <div className="space-y-4 p-6">
        {documents.documents.map((document) => (
          <KybDocumentRow key={document.id} document={document} />
        ))}
      </div>
    </div>
  );
}
