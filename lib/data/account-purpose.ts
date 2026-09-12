import type { SettingsSelectOption } from "@/types/settings";
import type { ApiAccountPurpose, ApiExpectedChannel, ApiSourceOfFunds } from "@/lib/api/types";

export const accountPurposeOptions: SettingsSelectOption[] = [
  { label: "Select account purpose", value: "" },
  { label: "Personal banking", value: "personal-banking" },
  { label: "Savings and investment", value: "savings-investment" },
  { label: "Salary and payroll", value: "salary-payroll" },
  { label: "Business operations", value: "business-operations" },
  { label: "Trade and payments", value: "trade-payments" },
  { label: "Remittance", value: "remittance" },
  { label: "Lending and credit", value: "lending-credit" },
  { label: "Treasury and liquidity", value: "treasury-liquidity" },
  { label: "Other", value: "other" },
];

export const sourceOfFundsOptions: SettingsSelectOption[] = [
  { label: "Select source of funds", value: "" },
  { label: "Salary", value: "salary" },
  { label: "Business income", value: "business-income" },
  { label: "Investment returns", value: "investment-returns" },
  { label: "Sale of assets", value: "sale-of-assets" },
  { label: "Inheritance or gift", value: "inheritance-gift" },
  { label: "Loan or credit", value: "loan-credit" },
  { label: "Savings", value: "savings" },
  { label: "Grant or donation", value: "grant-donation" },
  { label: "Other", value: "other" },
];

export const expectedChannelOptions: Array<{ value: ApiExpectedChannel; label: string }> = [
  { value: "bank-transfer", label: "Bank transfer" },
  { value: "card", label: "Card" },
  { value: "direct-debit", label: "Direct debit" },
  { value: "cash", label: "Cash" },
  { value: "cheque", label: "Cheque" },
  { value: "mobile-money", label: "Mobile money" },
  { value: "crypto", label: "Crypto" },
];

export const accountPurposePurposes = accountPurposeOptions
  .map((option) => option.value)
  .filter((value): value is ApiAccountPurpose => value !== "");

export const accountPurposeSources = sourceOfFundsOptions
  .map((option) => option.value)
  .filter((value): value is ApiSourceOfFunds => value !== "");
