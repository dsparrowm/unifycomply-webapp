import type {
  AmlFilterOption,
  AmlSearchMatchStatus,
  AmlSearchResultsData,
} from "@/types/aml-screening";

export const amlSearchMatchStatusOptions: AmlFilterOption<AmlSearchMatchStatus>[] = [
  { value: "potential-match", label: "Potential Match" },
  { value: "true-match", label: "True Match" },
  { value: "false-positive", label: "False Positive" },
  { value: "no-match", label: "No Match" },
];

export const amlSearchMatchStatusLabels: Record<AmlSearchMatchStatus, string> = {
  "potential-match": "Potential Match",
  "true-match": "True Match",
  "false-positive": "False Positive",
  "no-match": "No Match",
};

/** Mock Search Results after Create a New Case → Search (Figma frame). */
export const amlSearchResultsData: AmlSearchResultsData = {
  queryName: "Favour Peter Soma",
  recordCount: 1,
  totalPages: 10,
  records: [
    {
      id: "asr-1",
      name: "Peter Sam",
      matchScorePercent: 100,
      riskScore: 2,
      matchStatus: "potential-match",
      database: "PEP",
      relevance: "Country Matched",
      dateOfBirth: "14/02/2005",
      avatarInitials: "PS",
      detailId: "aml-1",
    },
  ],
  information: {
    searchItem: "Joe Biden",
    entityTypeLabel: "Person",
    matchScorePercent: 95,
    matchSuccessful: true,
    databases: [
      { id: "insolvency", label: "Insolvency" },
      { id: "sanctions", label: "Sanctions" },
      { id: "pep-tier-2", label: "PEP TIER 2" },
      { id: "fitness-probity", label: "Fitness And Probity" },
      { id: "businessperson", label: "Businessperson" },
      { id: "adverse-media", label: "Adverse Media" },
      { id: "pep", label: "PEP", flagged: true },
      { id: "pep-tier-1", label: "PEP TIER 1" },
      { id: "pep-tier-3", label: "PEP TIER 3" },
      { id: "pep-tier-4", label: "PEP TIER 4" },
      { id: "business", label: "Business" },
    ],
    country: "United States",
    riskEngine: "AML Default engine",
    avatarInitials: "JB",
  },
};
