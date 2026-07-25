import type {
  BankAnalysisFilterOption,
  BankAnalysisLookupBank,
} from "@/types/bank-analysis";

export const bankAnalysisLookupCountryOptions: BankAnalysisFilterOption<string>[] = [
  { value: "nigeria", label: "Nigeria" },
  { value: "ghana", label: "Ghana" },
  { value: "kenya", label: "Kenya" },
  { value: "south-africa", label: "South Africa" },
];

export const bankAnalysisLookupAppOptions: BankAnalysisFilterOption<string>[] = [
  { value: "staging", label: "Staging" },
  { value: "production", label: "Production" },
];

export const bankAnalysisLookupBankOptions: BankAnalysisFilterOption<BankAnalysisLookupBank>[] =
  [
    { value: "access-bank", label: "Access Bank" },
    { value: "gtbank", label: "GTBank" },
    { value: "first-bank", label: "First Bank" },
    { value: "zenith-bank", label: "Zenith Bank" },
    { value: "uba", label: "UBA" },
  ];
