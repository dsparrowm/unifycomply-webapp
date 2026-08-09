import type {
  AmlAdditionalInfoLink,
  AmlBatchResult,
  AmlDecisionHistoryEntry,
  AmlFilterOption,
  AmlKeySummaryField,
  AmlLinkedEntity,
  AmlListFilters,
  AmlMatch,
  AmlScreeningDetail,
  AmlScreeningListData,
  AmlScreeningRecord,
  AmlSearchInformation,
  AmlVerificationSection,
} from "@/types/aml-screening";

export const amlDefaultFilters: AmlListFilters = {
  date: "all",
  status: "all",
  monitoring: "all",
  assignee: "all",
  more: "all",
};

/** Figma AML list Date dropdown */
export const amlDateFilterOptions: AmlFilterOption<AmlListFilters["date"]>[] = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last-7-days", label: "Last 7 days" },
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "last-3-months", label: "Last 3 Months" },
  { value: "last-6-months", label: "Last 6 Months" },
  { value: "specific-range", label: "Specific Date Range" },
];

export const amlStatusFilterOptions: AmlFilterOption<AmlListFilters["status"]>[] = [
  { value: "all", label: "All" },
  { value: "flagged", label: "Flagged" },
  { value: "clear", label: "Clear" },
  { value: "in-review", label: "In Review" },
  { value: "blocked", label: "Blocked" },
  { value: "escalated", label: "Escalated" },
  { value: "case-created", label: "Case Created" },
];

export const amlMonitoringFilterOptions: AmlFilterOption<AmlListFilters["monitoring"]>[] = [
  { value: "all", label: "All" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const amlAssigneeFilterOptions: AmlFilterOption<AmlListFilters["assignee"]>[] = [
  { value: "all", label: "All" },
  { value: "assigned", label: "Assigned" },
  { value: "unassigned", label: "Unassigned" },
];

export const amlMoreFilterOptions: AmlFilterOption<AmlListFilters["more"]>[] = [
  { value: "all", label: "All" },
  { value: "high-risk", label: "Risk score 3+" },
  { value: "batch-only", label: "Batch only" },
  { value: "manual-only", label: "Manual only" },
];

const amlScreeningRecords: AmlScreeningRecord[] = [
  {
    id: "aml-1",
    amlId: "#3088",
    screeningId: "AML-2026-0088",
    entityName: "Favour Peter Soma",
    entityType: "individual",
    country: "Nigeria",
    dateTime: "06/08/2026, 09:42",
    screeningType: "manual",
    initiatedBy: "Alimi Ayomikun",
    assignedTo: "Alimi Ayomikun",
    status: "flagged",
    activeMonitoring: true,
    matches: 3,
    riskScore: 4,
    priority: "critical",
    submittedAt: "2026-08-06",
  },
  {
    id: "aml-2",
    amlId: "#3087",
    screeningId: "AML-2026-0087",
    entityName: "Amina Bello",
    entityType: "individual",
    country: "Nigeria",
    dateTime: "06/08/2026, 09:18",
    screeningType: "automatic",
    initiatedBy: "System",
    assignedTo: "Chioma Okeke",
    status: "in-review",
    activeMonitoring: true,
    matches: 1,
    riskScore: 2,
    priority: "medium",
    submittedAt: "2026-08-06",
  },
  {
    id: "aml-3",
    amlId: "#3086",
    screeningId: "AML-2026-0086",
    entityName: "TechVentures Nigeria Limited",
    entityType: "business",
    country: "Nigeria",
    dateTime: "06/08/2026, 08:51",
    screeningType: "batch",
    initiatedBy: "Alimi Ayomikun",
    assignedTo: null,
    status: "clear",
    activeMonitoring: false,
    matches: 0,
    riskScore: 0,
    priority: "low",
    submittedAt: "2026-08-06",
  },
  {
    id: "aml-4",
    amlId: "#3085",
    screeningId: "AML-2026-0085",
    entityName: "Njeri Wanjiku",
    entityType: "individual",
    country: "Kenya",
    dateTime: "05/08/2026, 16:12",
    screeningType: "manual",
    initiatedBy: "David Mensah",
    assignedTo: "David Mensah",
    status: "escalated",
    activeMonitoring: true,
    matches: 2,
    riskScore: 3,
    priority: "high",
    submittedAt: "2026-08-05",
  },
  {
    id: "aml-5",
    amlId: "#3084",
    screeningId: "AML-2026-0084",
    entityName: "Bluewave Technologies Ltd",
    entityType: "business",
    country: "Ghana",
    dateTime: "05/08/2026, 14:35",
    screeningType: "batch",
    initiatedBy: "System",
    assignedTo: "Chioma Okeke",
    status: "clear",
    activeMonitoring: false,
    matches: 0,
    riskScore: 1,
    priority: "low",
    submittedAt: "2026-08-05",
  },
  {
    id: "aml-6",
    amlId: "#3083",
    screeningId: "AML-2026-0083",
    entityName: "Omar Hassan",
    entityType: "individual",
    country: "Egypt",
    dateTime: "05/08/2026, 11:08",
    screeningType: "manual",
    initiatedBy: "Alimi Ayomikun",
    assignedTo: "Alimi Ayomikun",
    status: "case-created",
    activeMonitoring: true,
    matches: 4,
    riskScore: 4,
    priority: "critical",
    submittedAt: "2026-08-05",
  },
  {
    id: "aml-7",
    amlId: "#3082",
    screeningId: "AML-2026-0082",
    entityName: "Sunrise Agro Exports",
    entityType: "business",
    country: "Ghana",
    dateTime: "04/08/2026, 15:44",
    screeningType: "batch",
    initiatedBy: "System",
    assignedTo: null,
    status: "clear",
    activeMonitoring: false,
    matches: 0,
    riskScore: 0,
    priority: "low",
    submittedAt: "2026-08-04",
  },
  {
    id: "aml-8",
    amlId: "#3081",
    screeningId: "AML-2026-0081",
    entityName: "Grace Mensah",
    entityType: "individual",
    country: "Ghana",
    dateTime: "04/08/2026, 13:22",
    screeningType: "automatic",
    initiatedBy: "System",
    assignedTo: "David Mensah",
    status: "in-review",
    activeMonitoring: true,
    matches: 1,
    riskScore: 2,
    priority: "medium",
    submittedAt: "2026-08-04",
  },
  {
    id: "aml-9",
    amlId: "#3080",
    screeningId: "AML-2026-0080",
    entityName: "Vertex Capital Partners",
    entityType: "business",
    country: "South Africa",
    dateTime: "03/08/2026, 17:05",
    screeningType: "manual",
    initiatedBy: "Chioma Okeke",
    assignedTo: "Chioma Okeke",
    status: "blocked",
    activeMonitoring: true,
    matches: 2,
    riskScore: 3,
    priority: "high",
    submittedAt: "2026-08-03",
  },
  {
    id: "aml-10",
    amlId: "#3079",
    screeningId: "AML-2026-0079",
    entityName: "David Okafor",
    entityType: "individual",
    country: "Nigeria",
    dateTime: "03/08/2026, 10:27",
    screeningType: "automatic",
    initiatedBy: "System",
    assignedTo: null,
    status: "clear",
    activeMonitoring: false,
    matches: 0,
    riskScore: 0,
    priority: "low",
    submittedAt: "2026-08-03",
  },
  {
    id: "aml-11",
    amlId: "#3078",
    screeningId: "AML-2026-0078",
    entityName: "Cedar Properties Group",
    entityType: "business",
    country: "Nigeria",
    dateTime: "02/08/2026, 12:06",
    screeningType: "batch",
    initiatedBy: "Alimi Ayomikun",
    assignedTo: "Alimi Ayomikun",
    status: "in-review",
    activeMonitoring: false,
    matches: 1,
    riskScore: 2,
    priority: "medium",
    submittedAt: "2026-08-02",
  },
  {
    id: "aml-12",
    amlId: "#3077",
    screeningId: "AML-2026-0077",
    entityName: "Fatima Diallo",
    entityType: "individual",
    country: "Senegal",
    dateTime: "01/08/2026, 09:14",
    screeningType: "manual",
    initiatedBy: "David Mensah",
    assignedTo: null,
    status: "clear",
    activeMonitoring: false,
    matches: 0,
    riskScore: 1,
    priority: "low",
    submittedAt: "2026-08-01",
  },
];

export const amlScreeningListDataEmpty: AmlScreeningListData = {
  metrics: [
    { id: "total-screening", label: "TOTAL SCREENING", value: 0, tone: "info" },
    { id: "active-monitoring", label: "ACTIVE MONITORING", value: 0, tone: "warning" },
    { id: "clear-status", label: "CLEAR STATUS", value: 0, tone: "success" },
    { id: "blocked", label: "BLOCKED", value: 0, tone: "error" },
  ],
  records: [],
};

export const amlScreeningListDataPopulated: AmlScreeningListData = {
  metrics: [
    { id: "total-screening", label: "TOTAL SCREENING", value: 14, tone: "info" },
    { id: "active-monitoring", label: "ACTIVE MONITORING", value: 5, tone: "warning" },
    { id: "clear-status", label: "CLEAR STATUS", value: 5, tone: "success" },
    { id: "blocked", label: "BLOCKED", value: 2, tone: "error" },
  ],
  records: amlScreeningRecords,
};

const baseHistory: AmlDecisionHistoryEntry[] = [
  {
    id: "screened",
    type: "screened",
    title: "Screening completed",
    description: "Entity checked against sanctions, PEP, adverse media, and watchlists.",
    actor: "UnifyComply Screening Engine",
    timestamp: "06 Aug 2026, 09:42",
  },
];

function createMatches(record: AmlScreeningRecord): AmlMatch[] {
  if (record.matches === 0) {
    return [];
  }

  const available: AmlMatch[] = [
    {
      id: `${record.id}-pep`,
      category: "pep",
      source: "Global PEP Database",
      matchedName: record.entityName,
      strength: "exact",
      score: 98,
      description: "Name and jurisdiction align with a politically exposed person record.",
    },
    {
      id: `${record.id}-sanctions`,
      category: "sanctions",
      source: "OFAC Consolidated List",
      matchedName: record.entityName,
      strength: "strong",
      score: 91,
      description: "Strong name similarity. Date of birth requires manual confirmation.",
    },
    {
      id: `${record.id}-media`,
      category: "adverse-media",
      source: "International News Index",
      matchedName: record.entityName,
      strength: "possible",
      score: 78,
      description: "Possible adverse media association involving financial misconduct.",
    },
    {
      id: `${record.id}-watchlist`,
      category: "watchlist",
      source: "Internal Monitoring List",
      matchedName: record.entityName,
      strength: "strong",
      score: 88,
      description: "Entity appears on the tenant's enhanced monitoring list.",
    },
  ];

  return available.slice(0, record.matches);
}

function createKeySummary(record: AmlScreeningRecord): AmlKeySummaryField[] {
  const isIndividual = record.entityType === "individual";
  const fields: AmlKeySummaryField[] = [
    {
      id: "alias",
      label: "Alias",
      value:
        record.matches > 0
          ? `${record.entityName}; ${record.entityName.replace("Peter ", "P. ")}`
          : record.entityName,
    },
    {
      id: "born",
      label: "Born",
      value: isIndividual
        ? "14 Mar 1985 · Lagos, Nigeria"
        : "Incorporated 12 Jan 2014 · Lagos, Nigeria",
    },
    {
      id: "category",
      label: "Category",
      value: record.matches > 0 ? "Politically exposed person" : "Standard entity",
      badge: record.matches > 0 ? "PEP" : undefined,
    },
    {
      id: "country",
      label: "Country",
      value: record.country,
    },
    {
      id: "date-of-birth",
      label: isIndividual ? "Date of Birth" : "Incorporation Date",
      value: isIndividual ? "1985-03-14" : "2014-01-12",
    },
    {
      id: "entity-type",
      label: "Entity Type",
      value: isIndividual ? "Person" : "Organization",
    },
    {
      id: "first-name",
      label: isIndividual ? "Full Name" : "Legal Name",
      value: record.entityName,
    },
    {
      id: "gender",
      label: isIndividual ? "Gender" : "Business Size",
      value: isIndividual ? "Not disclosed" : "SME",
    },
    {
      id: "reference",
      label: isIndividual ? "Identifier" : "Registration",
      value: isIndividual ? "BVN •••• 5401" : "RC 1084527",
    },
  ];

  return fields;
}

/** Linked Entities content from Figma Data Summary / Linked Entities frame. */
function createLinkedEntities(record: AmlScreeningRecord): AmlLinkedEntity[] {
  // Figma frame shows the populated relationship list for a matched individual profile.
  if (record.entityType !== "individual" || record.matches === 0) {
    return [];
  }

  return [
    {
      id: `${record.id}-partner`,
      relationship: "Partner in Business Or Sport",
      name: "Charles O. Brown Jr",
    },
    {
      id: `${record.id}-father`,
      relationship: "Father",
      name: "Joseph Robinette Biden Sr",
    },
    {
      id: `${record.id}-mother`,
      relationship: "Mother",
      name: "Jean Biden",
    },
    {
      id: `${record.id}-spouse`,
      relationship: "Spouse",
      name: "Jill Biden",
    },
    {
      id: `${record.id}-sibling-1`,
      relationship: "Sibling",
      name: "Francis Biden",
    },
    {
      id: `${record.id}-sibling-2`,
      relationship: "Sibling",
      name: "James Biden",
    },
    {
      id: `${record.id}-sibling-3`,
      relationship: "Sibling",
      name: "Valerie Biden Owens",
    },
    {
      id: `${record.id}-child-1`,
      relationship: "Child",
      name: "Hunter Biden - American Attorney And businessman",
    },
    {
      id: `${record.id}-child-2`,
      relationship: "Child",
      name: "Hunter Biden - American Attorney And businessman",
    },
    {
      id: `${record.id}-child-3`,
      relationship: "Child",
      name: "Hunter Biden - American Attorney And businessman",
    },
  ];
}

/** Additional information links from Figma Data Summary / Additional information frame. */
function createAdditionalInformation(record: AmlScreeningRecord): AmlAdditionalInfoLink[] {
  if (record.entityType !== "individual" || record.matches === 0) {
    return [];
  }

  return [
    {
      id: `${record.id}-twitter`,
      source: "Twitter",
      label: "Joe Biden",
      href: "https://twitter.com/JoeBiden",
    },
  ];
}

function createVerificationSections(record: AmlScreeningRecord): AmlVerificationSection[] {
  const hasPep = record.matches >= 1;
  const hasSanctions = record.matches >= 2;
  const hasWarning = record.matches >= 3;

  return [
    {
      id: "pep",
      title: "POLITICAL EXPOSED PERSON",
      rows: [
        {
          id: "pep-screening",
          label: "PEP Screening",
          description: "Politically exposed person",
          outcome: hasPep ? "match" : "no-match",
        },
      ],
    },
    {
      id: "sanctions",
      title: "SANCTIONS SCREENING (SCREENED AGAINST 4 GLOBAL SANCTIONS LISTS)",
      rows: [
        {
          id: "ofac",
          label: "OFAC",
          description: "US Office of Foreign Assets Control",
          outcome: hasSanctions ? "match" : "no-match",
        },
        {
          id: "un",
          label: "UN",
          description: "United Nations consolidated list",
          outcome: "no-match",
        },
        {
          id: "eu",
          label: "EU",
          description: "European Union consolidated list",
          outcome: "no-match",
        },
        {
          id: "uk-hmt",
          label: "UK HMT",
          description: "UK HM Treasury sanctions",
          outcome: "no-match",
        },
      ],
    },
    {
      id: "warning",
      title: "WARNING AND REGULATORY ENFORCEMENT",
      rows: [
        {
          id: "warning-matches",
          label: "Warning Matches",
          description: "Adverse media and regulatory enforcement actions",
          outcome: hasWarning ? "match" : "no-match",
        },
      ],
    },
    {
      id: "insolvency",
      title: "INSOLVENCY",
      rows: [
        {
          id: "sip",
          label: "SIP",
          description: "Personal insolvency register",
          outcome: "no-match",
        },
        {
          id: "sie",
          label: "SIE",
          description: "Cross-jurisdiction insolvency registry",
          outcome: "no-match",
        },
        {
          id: "businessperson",
          label: "Businessperson",
          description: "Business insolvency or directorship disqualifications",
          outcome: "no-match",
        },
      ],
    },
  ];
}

function createSearchInformation(record: AmlScreeningRecord): AmlSearchInformation {
  const initials = record.entityName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return {
    searchItem: record.entityName,
    entityTypeLabel: record.entityType === "individual" ? "Person" : "Organization",
    matchScore: record.matches > 0 ? Math.min(98, 70 + record.matches * 8) : 0,
    matchSuccessful: record.matches > 0,
    databases: [
      "Adverse Media",
      "Sanctions",
      "PEP TIER 1",
      "PEP TIER 2",
      "Fitness And Probity",
      "Insolvency",
      "Business",
      "Businessperson",
    ],
    country: record.country,
    riskEngine: "AML Default engine",
    avatarInitials: initials || "AM",
  };
}

const amlScreeningDetails: AmlScreeningDetail[] = amlScreeningRecords.map((record) => ({
  ...record,
  dateOfBirth: record.entityType === "individual" ? "14 Mar 1985" : undefined,
  reference: record.entityType === "individual" ? "BVN •••• 5401" : "RC 1084527",
  aliases: record.matches > 0 ? [record.entityName.replace("Peter ", "P. ")] : [],
  matchSummary:
    record.matches > 0
      ? `${record.matches} potential match${record.matches === 1 ? "" : "es"} require compliance review.`
      : "No potential matches were found across enabled screening sources.",
  matchesDetail: createMatches(record),
  matchingConfiguration: {
    minimumMatchScore: 75,
    fuzzyMatching: true,
    requireDateOfBirth: record.entityType === "individual",
    sources: ["sanctions", "pep", "adverse-media", "watchlist"],
  },
  decisionHistory: baseHistory.map((entry) => ({
    ...entry,
    id: `${record.id}-${entry.id}`,
    timestamp: record.dateTime,
  })),
  keySummary: createKeySummary(record),
  linkedEntities: createLinkedEntities(record),
  additionalInformation: createAdditionalInformation(record),
  verificationSections: createVerificationSections(record),
  searchInformation: createSearchInformation(record),
}));

export const amlBatchResult: AmlBatchResult = {
  id: "batch-2026-014",
  batchName: "August Customer Review",
  fileName: "august-customer-review.xlsx",
  submittedAt: "06 Aug 2026, 10:05",
  totalRecords: 6,
  successful: 3,
  review: 2,
  highRisk: 1,
  records: [
    {
      id: "aml-3",
      screeningId: "AML-2026-0086",
      entityName: "TechVentures Nigeria Limited",
      entityType: "business",
      country: "Nigeria",
      status: "successful",
      matches: 0,
      riskScore: 0,
    },
    {
      id: "aml-7",
      screeningId: "AML-2026-0082",
      entityName: "Sunrise Agro Exports",
      entityType: "business",
      country: "Ghana",
      status: "successful",
      matches: 0,
      riskScore: 0,
    },
    {
      id: "aml-10",
      screeningId: "AML-2026-0079",
      entityName: "David Okafor",
      entityType: "individual",
      country: "Nigeria",
      status: "successful",
      matches: 0,
      riskScore: 0,
    },
    {
      id: "aml-2",
      screeningId: "AML-2026-0087",
      entityName: "Amina Bello",
      entityType: "individual",
      country: "Nigeria",
      status: "review",
      matches: 1,
      riskScore: 2,
    },
    {
      id: "aml-8",
      screeningId: "AML-2026-0081",
      entityName: "Grace Mensah",
      entityType: "individual",
      country: "Ghana",
      status: "review",
      matches: 1,
      riskScore: 2,
    },
    {
      id: "aml-1",
      screeningId: "AML-2026-0088",
      entityName: "Favour Peter Soma",
      entityType: "individual",
      country: "Nigeria",
      status: "high-risk",
      matches: 3,
      riskScore: 4,
    },
  ],
};

export function getAmlScreeningDetailById(id: string): AmlScreeningDetail | undefined {
  return amlScreeningDetails.find((detail) => detail.id === id);
}
