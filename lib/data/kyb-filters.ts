import type { KycFilterOption, KycSearchModeFilter } from "@/types/kyc";

export {
  kycDefaultFilters as kybDefaultFilters,
  kycDateFilterOptions as kybDateFilterOptions,
  kycStatusFilterOptions as kybStatusFilterOptions,
  kycPriorityFilterOptions as kybPriorityFilterOptions,
  kycMoreFilterOptions as kybMoreFilterOptions,
} from "@/lib/data/kyc-filters";

/** Figma frame 81 — Type dropdown (Single entity search / Bulk Search). */
export const kybSearchModeFilterOptions: KycFilterOption<KycSearchModeFilter>[] = [
  { value: "single-entity-search", label: "Single entity search" },
  { value: "bulk-search", label: "Bulk Search" },
];
