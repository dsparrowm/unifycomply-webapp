import type { ApiExpectedChannel } from "@/lib/api/types";

export type AccountPurposeFormValues = {
  purpose: string;
  sourceOfFunds: string;
  purposeDetail: string;
  sourceOfWealth: string;
  expectedMonthlyTransactions: string;
  expectedMonthlyValue: string;
  expectedSingleTransactionValue: string;
  currency: string;
  expectedCorridors: string;
  expectedChannels: ApiExpectedChannel[];
  anticipatedCounterparties: string;
};

export type CustomerKind = "kyc" | "kyb";
