import type { ApiCustomerFlagStatus } from "@/lib/api/types";

/** Document requirements checklist — API-derived / no dedicated Figma frame. */
export type DocumentRequirementItem = {
  id: string;
  category: string;
  label: string;
  satisfied: boolean;
  acceptedTypes: string[];
  documentCount: number;
};

/** Customer flag — maps to existing KYC Alert card chrome; status via PATCH only. */
export type CustomerFlag = {
  id: string;
  status: ApiCustomerFlagStatus;
  title: string;
  description: string;
};
