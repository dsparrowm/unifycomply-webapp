import type { KybSubmittedDocument } from "@/types/kyb";

export function getKybDocumentDownloadName(name: string) {
  return `${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}.jpg`;
}

export function downloadKybDocument(document: KybSubmittedDocument) {
  const link = window.document.createElement("a");
  link.href = document.previewSrc;
  link.download = getKybDocumentDownloadName(document.name);
  window.document.body.appendChild(link);
  link.click();
  link.remove();
}
