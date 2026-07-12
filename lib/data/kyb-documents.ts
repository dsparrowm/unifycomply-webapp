import type { KybSubmittedDocumentsData } from "@/types/kyb";

export const kybSubmittedDocumentsData: KybSubmittedDocumentsData = {
  sectionStatus: "Active",
  documents: [
    {
      id: "doc-certificate",
      name: "Certificate of Incorporation",
      uploadedAt: "12/02/2025",
      status: "verified",
    },
    {
      id: "doc-memorandum",
      name: "Memorandum & Articles of Association",
      uploadedAt: "12/02/2025",
      status: "verified",
    },
    {
      id: "doc-form-7",
      name: "Form 7",
      uploadedAt: "12/02/2025",
      status: "verified",
    },
    {
      id: "doc-tax-clearance",
      name: "Tax Clearance Cert",
      uploadedAt: "12/02/2025",
      status: "verified",
    },
    {
      id: "doc-business-address",
      name: "Proof of Business Address",
      uploadedAt: "12/02/2025",
      status: "verified",
    },
    {
      id: "doc-directors-id",
      name: "Directors ID",
      uploadedAt: "12/02/2025",
      status: "verified",
    },
  ],
};

export function buildKybSubmittedDocumentsData(): KybSubmittedDocumentsData {
  return kybSubmittedDocumentsData;
}
