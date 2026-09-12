import type { DeclareAccountPurposeDto, ApiExpectedChannel } from "@/lib/api/types";
import { accountPurposePurposes, accountPurposeSources } from "@/lib/data/account-purpose";
import type { AccountPurposeFormValues } from "@/types/account-purpose";

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function isExpectedChannel(value: string): value is ApiExpectedChannel {
  return (
    value === "bank-transfer" ||
    value === "card" ||
    value === "direct-debit" ||
    value === "cash" ||
    value === "cheque" ||
    value === "mobile-money" ||
    value === "crypto"
  );
}

export const emptyAccountPurposeForm: AccountPurposeFormValues = {
  purpose: "",
  sourceOfFunds: "",
  purposeDetail: "",
  sourceOfWealth: "",
  expectedMonthlyTransactions: "",
  expectedMonthlyValue: "",
  expectedSingleTransactionValue: "",
  currency: "",
  expectedCorridors: "",
  expectedChannels: [],
  anticipatedCounterparties: "",
};

export function mapApiAccountPurposeToForm(data: unknown): AccountPurposeFormValues {
  if (!data || typeof data !== "object") {
    return emptyAccountPurposeForm;
  }
  const record = data as Record<string, unknown>;
  const purpose = asString(record.purpose);
  const sourceOfFunds = asString(record.sourceOfFunds);
  const channels = Array.isArray(record.expectedChannels)
    ? record.expectedChannels.filter((item): item is ApiExpectedChannel => typeof item === "string" && isExpectedChannel(item))
    : [];
  const corridors = Array.isArray(record.expectedCorridors)
    ? record.expectedCorridors.filter((item): item is string => typeof item === "string")
    : [];

  return {
    purpose: purpose && accountPurposePurposes.includes(purpose as (typeof accountPurposePurposes)[number]) ? purpose : "",
    sourceOfFunds:
      sourceOfFunds && accountPurposeSources.includes(sourceOfFunds as (typeof accountPurposeSources)[number])
        ? sourceOfFunds
        : "",
    purposeDetail: asString(record.purposeDetail) ?? "",
    sourceOfWealth: asString(record.sourceOfWealth) ?? "",
    expectedMonthlyTransactions: asNumber(record.expectedMonthlyTransactions)?.toString() ?? "",
    expectedMonthlyValue: asNumber(record.expectedMonthlyValue)?.toString() ?? "",
    expectedSingleTransactionValue: asNumber(record.expectedSingleTransactionValue)?.toString() ?? "",
    currency: asString(record.currency) ?? "",
    expectedCorridors: corridors.join(", "),
    expectedChannels: channels,
    anticipatedCounterparties: asString(record.anticipatedCounterparties) ?? "",
  };
}

export function mapAccountPurposeFormToDto(values: AccountPurposeFormValues): DeclareAccountPurposeDto {
  if (!accountPurposePurposes.includes(values.purpose as (typeof accountPurposePurposes)[number])) {
    throw new Error("Account purpose is required");
  }
  if (!accountPurposeSources.includes(values.sourceOfFunds as (typeof accountPurposeSources)[number])) {
    throw new Error("Source of funds is required");
  }

  const dto: DeclareAccountPurposeDto = {
    purpose: values.purpose as DeclareAccountPurposeDto["purpose"],
    sourceOfFunds: values.sourceOfFunds as DeclareAccountPurposeDto["sourceOfFunds"],
  };

  if (values.purposeDetail.trim()) {
    dto.purposeDetail = values.purposeDetail.trim();
  }
  if (values.sourceOfWealth.trim()) {
    dto.sourceOfWealth = values.sourceOfWealth.trim();
  }
  if (values.anticipatedCounterparties.trim()) {
    dto.anticipatedCounterparties = values.anticipatedCounterparties.trim();
  }
  if (values.currency.trim()) {
    dto.currency = values.currency.trim().toUpperCase();
  }

  const monthlyTransactions = asNumber(values.expectedMonthlyTransactions);
  if (monthlyTransactions !== undefined) {
    dto.expectedMonthlyTransactions = monthlyTransactions;
  }
  const monthlyValue = asNumber(values.expectedMonthlyValue);
  if (monthlyValue !== undefined) {
    dto.expectedMonthlyValue = monthlyValue;
  }
  const singleValue = asNumber(values.expectedSingleTransactionValue);
  if (singleValue !== undefined) {
    dto.expectedSingleTransactionValue = singleValue;
  }

  const corridors = values.expectedCorridors
    .split(/[, ]+/)
    .map((code) => code.trim().toUpperCase())
    .filter(Boolean);
  if (corridors.length > 0) {
    dto.expectedCorridors = corridors;
  }
  if (values.expectedChannels.length > 0) {
    dto.expectedChannels = values.expectedChannels;
  }

  return dto;
}
