import type {
  AmlCaseEntityType,
  AmlDatabaseKey,
  AmlFilterOption,
  AmlRelevanceKey,
  AmlSearchEntityType,
} from "@/types/aml";

export const amlCaseEntityTypeOptions: AmlFilterOption<AmlCaseEntityType>[] = [
  { value: "all", label: "Select All" },
  { value: "person", label: "Person" },
  { value: "organization", label: "Organization" },
  { value: "aircraft", label: "Aircraft" },
  { value: "vessel", label: "Vessel" },
];

export const amlRiskEngineOptions: AmlFilterOption<string>[] = [
  { value: "aml-default", label: "AML Default Engine" },
];

export const amlCaseCountryOptions: AmlFilterOption<string>[] = [
  { value: "nigeria", label: "Nigeria" },
  { value: "ghana", label: "Ghana" },
  { value: "kenya", label: "Kenya" },
  { value: "south-africa", label: "South Africa" },
];

export const amlRelevanceOptions: AmlFilterOption<AmlRelevanceKey>[] = [
  { value: "dob", label: "DOB Matched" },
  { value: "alias", label: "Alias Matched" },
  { value: "name", label: "Name Matched" },
  { value: "rca", label: "RCA Matched" },
];

export const amlSearchEntityTypeOptions: AmlFilterOption<AmlSearchEntityType>[] = [
  { value: "aircraft", label: "Aircraft" },
  { value: "organization", label: "Organization" },
  { value: "person", label: "Person" },
  { value: "vessel", label: "Vessel" },
];

export const amlDatabaseOptions: AmlFilterOption<AmlDatabaseKey>[] = [
  { value: "adverse-media", label: "Adverse Media" },
  { value: "business", label: "Business" },
  { value: "businessperson", label: "Businessperson" },
  { value: "fitness-probity", label: "Fitness and Probity" },
  { value: "insolvency", label: "Insolvency" },
  { value: "pep-1", label: "PEP Tier 1" },
  { value: "pep-2", label: "PEP Tier 2" },
  { value: "pep-3", label: "PEP Tier 3" },
  { value: "pep-4", label: "PEP Tier 4" },
];

export const amlAllDatabaseKeys: AmlDatabaseKey[] = amlDatabaseOptions.map(
  (option) => option.value,
);

export const amlDayOptions: AmlFilterOption<string>[] = Array.from({ length: 31 }, (_, index) => {
  const value = String(index + 1).padStart(2, "0");
  return { value, label: value };
});

export const amlMonthOptions: AmlFilterOption<string>[] = Array.from({ length: 12 }, (_, index) => {
  const value = String(index + 1).padStart(2, "0");
  return { value, label: value };
});

const currentYear = new Date().getFullYear();

export const amlYearOptions: AmlFilterOption<string>[] = Array.from({ length: 100 }, (_, index) => {
  const value = String(currentYear - index);
  return { value, label: value };
});

export function downloadAmlBatchTemplate() {
  const csv = [
    "full_name,entity_type,unique_identifier,date_of_birth,country",
    "Jane Example,person,ID-0001,1990-01-15,Nigeria",
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "aml-batch-template.csv";
  link.click();
  URL.revokeObjectURL(url);
}
