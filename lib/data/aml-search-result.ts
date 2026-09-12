import type {
  AmlFilterOption,
  AmlMatchStatus,
  AmlSearchMatch,
  AmlSearchResultData,
} from "@/types/aml";

export const AML_SEARCH_RESULT_PHOTO = "/assets/aml/match-portrait.svg";

const sharedSearchInformation = {
  searchItem: "Joe Biden",
  entityType: "Person",
  databases: [
    "Insolvency",
    "Sanctions",
    "PEP TIER 2",
    "Fitness And Probity",
    "Businessperson",
    "Warning and Regulatory Enforcement",
    "SIP",
    "PEP TIER 1",
    "PEP",
    "PEP TIER 3",
    "PEP TIER 4",
    "Business",
  ],
  country: "United States",
  riskEngine: "AML Default engine",
};

const peterSamBase = {
  name: "Peter Sam",
  riskScore: 2,
  matchStatus: "potential-match" as const,
  dateOfBirth: "14/02/2005",
};

export const amlSearchResultMulti: AmlSearchResultData = {
  caseName: "FAVOUR PETER SOMA",
  matches: [
    {
      ...peterSamBase,
      id: "aml-match-1",
      matchScore: 75,
      relevance: "name",
      databases: ["PEP"],
      photoSrc: null,
    },
    {
      ...peterSamBase,
      id: "aml-match-2",
      matchScore: 75,
      relevance: "rca",
      databases: ["Warning and regulatory enforcement"],
      photoSrc: null,
    },
    {
      ...peterSamBase,
      id: "aml-match-3",
      matchScore: 75,
      relevance: "name",
      databases: ["Sanction", "PEP"],
      photoSrc: null,
    },
    {
      ...peterSamBase,
      id: "aml-match-4",
      matchScore: 75,
      relevance: "name",
      databases: ["SIP"],
      photoSrc: null,
    },
  ],
  searchInformation: {
    ...sharedSearchInformation,
    scoreLabel: "Fuzzy Score",
    score: 95,
    photoSrc: null,
    matchSuccessful: false,
  },
};

export const amlSearchResultSingle: AmlSearchResultData = {
  caseName: "FAVOUR PETER SOMA",
  matches: [
    {
      ...peterSamBase,
      id: "aml-match-photo",
      matchScore: 100,
      relevance: "country",
      databases: ["PEP"],
      photoSrc: AML_SEARCH_RESULT_PHOTO,
    },
  ],
  searchInformation: {
    ...sharedSearchInformation,
    scoreLabel: "Match Score",
    score: 95,
    photoSrc: AML_SEARCH_RESULT_PHOTO,
    matchSuccessful: true,
  },
};

export const amlMatchStatusOptions: AmlFilterOption<AmlMatchStatus>[] = [
  { value: "no-match", label: "No Match" },
  { value: "potential-match", label: "Potential Match" },
  { value: "match", label: "Match" },
  { value: "false-positive", label: "False Positive" },
  { value: "true-positive", label: "True Positive" },
];

export const amlMatchRelevanceLabels: Record<AmlSearchMatch["relevance"], string> = {
  dob: "DOB Matched",
  alias: "Alias Matched",
  name: "Name Matched",
  rca: "RCA Matched",
  country: "Country Matched",
};

export const amlMatchStatusLabels: Record<AmlMatchStatus, string> = {
  "no-match": "No Match",
  "potential-match": "Potential Match",
  match: "Match",
  "false-positive": "False Positive",
  "true-positive": "True Positive",
};
