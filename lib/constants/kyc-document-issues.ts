import type { KycDocumentIssue } from "@/types/kyc";

export const kycDocumentIssues: KycDocumentIssue[] = [
  {
    id: "blurred",
    title: "Blurred or Out of Focus",
    description: "Image is not clear enough to read text or verify details",
    tone: "warning",
  },
  {
    id: "poor-lighting",
    title: "Poor Lighting or Glare",
    description: "Image has shadows, reflections, or insufficient lighting",
    tone: "warning",
  },
  {
    id: "incomplete",
    title: "Incomplete or Cut-Off Document",
    description: "Parts of the document are missing or cropped out of frame",
    tone: "warning",
  },
  {
    id: "wrong-document-type",
    title: "Wrong Document Type",
    description: "Document uploaded does not match the required type",
    tone: "error",
  },
  {
    id: "expired",
    title: "Expired Document",
    description: "Document has passed its expiration date",
    tone: "error",
  },
  {
    id: "selfie-quality",
    title: "Selfie Quality Issues",
    description: "Selfie is unclear, wearing accessories, or doesn't match ID photo",
    tone: "warning",
  },
  {
    id: "text-not-readable",
    title: "Text Not Readable",
    description: "Text on document cannot be read clearly by our system",
    tone: "warning",
  },
];
