export const amlCreateCaseCountryOptions = [
  { value: "nigeria", label: "Nigeria" },
  { value: "ghana", label: "Ghana" },
  { value: "kenya", label: "Kenya" },
  { value: "south-africa", label: "South Africa" },
  { value: "united-states", label: "United States" },
  { value: "united-kingdom", label: "United Kingdom" },
] as const;

export const amlCreateCaseEntityTypeOptions = [
  { value: "person", label: "Person" },
  { value: "organization", label: "Organization" },
  { value: "aircraft", label: "Aircraft" },
  { value: "vessel", label: "Vessel" },
] as const;

export const amlCreateCaseRiskEngineOptions = [
  { value: "aml-default", label: "AML Default Engine" },
] as const;

export const amlCreateCaseDayOptions = Array.from({ length: 31 }, (_, index) => {
  const value = String(index + 1).padStart(2, "0");
  return { value, label: value };
});

export const amlCreateCaseMonthOptions = [
  { value: "01", label: "01" },
  { value: "02", label: "02" },
  { value: "03", label: "03" },
  { value: "04", label: "04" },
  { value: "05", label: "05" },
  { value: "06", label: "06" },
  { value: "07", label: "07" },
  { value: "08", label: "08" },
  { value: "09", label: "09" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
] as const;

export const amlCreateCaseRelevanceOptions = [
  { id: "dob-matched", label: "DOB Matched" },
  { id: "alias-matched", label: "Alias Matched" },
  { id: "name-matched", label: "Name Matched" },
  { id: "rca-matched", label: "RCA Matched" },
] as const;

export const amlCreateCaseSearchEntityTypeOptions = [
  { id: "aircraft", label: "Aircraft" },
  { id: "organization", label: "Organization" },
  { id: "person", label: "Person" },
  { id: "vessel", label: "Vessel" },
] as const;

export const amlCreateCaseDatabaseOptions = [
  { id: "adverse-media", label: "Adverse Media" },
  { id: "business", label: "Business" },
  { id: "business-person", label: "BusinessPerson" },
  { id: "fitness-probity", label: "Fitness and Probity" },
  { id: "insolvency", label: "Insolvency" },
  { id: "pep-tier-1", label: "PEP Tier 1" },
  { id: "pep-tier-2", label: "PEP Tier 2" },
  { id: "pep-tier-3", label: "PEP Tier 3" },
  { id: "pep-tier-4", label: "PEP Tier 4" },
] as const;

export const amlCreateCaseDefaultSearchBy = {
  relevance: ["name-matched"] as string[],
  entityTypes: ["person"] as string[],
  databases: amlCreateCaseDatabaseOptions.map((option) => option.id) as string[],
};
