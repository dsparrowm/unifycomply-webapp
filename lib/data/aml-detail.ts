import { AML_SEARCH_RESULT_PHOTO } from "@/lib/data/aml-search-result";
import type { AmlCaseDetail, AmlCaseKind, AmlSearchInformation } from "@/types/aml";

const personSearch: AmlSearchInformation = {
  searchItem: "Joe Biden",
  entityType: "Person",
  scoreLabel: "Match Score",
  score: 75,
  databases: [
    "Insolvency",
    "Sanctions",
    "PEP TIER 2",
    "Fitness And Probity",
    "Businessperson",
    "Warning and Regulatory Enforcement",
    "SIP",
    "SIE",
    "PEP TIER 1",
    "PEP",
    "PEP TIER 3",
    "PEP TIER 4",
    "Business",
  ],
  country: "United States",
  riskEngine: "AML Default engine",
  photoSrc: AML_SEARCH_RESULT_PHOTO,
  matchSuccessful: true,
};

const corporateSearch: AmlSearchInformation = {
  searchItem: "Meridian Trading",
  entityType: "Corporate",
  scoreLabel: "Match Score",
  score: 75,
  databases: personSearch.databases,
  country: "United States",
  riskEngine: "AML Default engine",
  photoSrc: null,
  matchSuccessful: true,
};

const sanctionsAndWatchlists = [
  {
    title: "SANCTIONS (SCREENED AGAINST 4 GLOBAL SANCTIONS LISTS)",
    items: [
      { title: "OFAC", description: "US Office of Foreign Assets Control" },
      { title: "UN", description: "United Nations" },
      { title: "EU", description: "European Union" },
      { title: "UK HMT", description: "UK His Majesty's Treasury" },
    ],
  },
  {
    title: "WARNING AND REGULATORY ENFORCEMENT",
    items: [
      {
        title: "Warning Matches",
        description: "Checks for adverse media, regulatory actions, or enforcement proceedings against the individual.",
      },
    ],
  },
  {
    title: "INSOLVENCY",
    items: [
      { title: "SIP", description: "Likely a personal insolvency register" },
      { title: "SIE", description: "Possibly another jurisdiction insolvency registry" },
      {
        title: "Businessperson",
        description: "Business-related insolvency or directorship disqualifications",
      },
    ],
  },
];

const personVerifications = [
  {
    title: "POLITICAL EXPOSED PERSON",
    items: [
      {
        title: "PEP Screening",
        description: "Politically exposed person",
      },
    ],
  },
  ...sanctionsAndWatchlists,
];

const personDetail: AmlCaseDetail = {
  id: "favour-peter-soma",
  caseName: "FAVOUR PETER SOMA",
  kind: "person",
  riskScore: 3,
  activeMonitoring: false,
  sourceBanner: {
    title: "Wikipedia List Of Positions Of Authority",
    listedOn: "Thu, 20 Jun 2024",
    href: "https://en.wikipedia.org",
  },
  keyFields: [
    {
      label: "Aliases",
      value:
        "Joseph R. BIDEN, Jr. · Joseph Biden · Joe Biden · Joseph Robinette Biden",
    },
    {
      label: "Born",
      value: "Joseph Robinette Biden Jr November 20, 1942 Scranton, Pennsylvania, U.S.",
    },
    { label: "Category", value: "PEP", tone: "warning" },
    { label: "Children", value: "Beau, Hunter, Naomi, Ashley" },
    { label: "Country", value: "United States" },
    { label: "Date of Birth", value: "1942-11-20" },
    {
      label: "Education",
      value: "University Of Delaware",
      values: [
        "University Of Delaware",
        "Syracuse University",
        "Juris Doctor",
        "Garden City Collegiate",
        "University of Delaware (1961–1965)",
        "Syracuse University (1965–1968)",
        "Bachelor of Arts",
      ],
    },
    { label: "Entity Type", value: "Person" },
    { label: "First Name", value: "Robinette Joseph" },
    { label: "Gender", value: "Male" },
  ],
  linkedEntities: [
    { label: "Partner in Business Or Sport", value: "Charles O. Brown Jr" },
    { label: "Father", value: "Joseph Robinette Biden Sr" },
    { label: "Mother", value: "Jean Biden" },
    { label: "Spouse", value: "Jill Biden" },
    { label: "Sibling", value: "Francis Biden" },
    { label: "Sibling", value: "James Biden" },
    { label: "Sibling", value: "Valerie Biden Owens" },
    {
      label: "Child",
      value: "Hunter Biden",
      detail: "American Attorney And businessman",
    },
    {
      label: "Child",
      value: "Beau Biden",
      detail: "American Attorney And businessman",
    },
    {
      label: "Child",
      value: "Naomi Biden",
      detail: "American Attorney And businessman",
    },
  ],
  corporateLinks: [],
  additionalLinks: [{ label: "Twitter", value: "Joe Biden", href: "https://x.com" }],
  sources: [
    {
      title: "Wikipedia List Of Positions Of Authority",
      listedOn: "Thu, 20 Jun 2024",
      href: "https://en.wikipedia.org",
    },
  ],
  verifications: personVerifications,
  warningItems: [],
  riskScoreValue: 1,
  overallAnalysis: "Low",
  radar: [
    { label: "Categories", value: 42 },
    { label: "Country", value: 22 },
    { label: "Criminal Record", value: 8 },
    { label: "Custom List", value: 8 },
  ],
  riskDetails: [
    { label: "Country Risk", value: "Medium", tone: "warning" },
    { label: "PEP TIER 1 Category", value: "Medium", tone: "warning" },
    { label: "Criminal Record", value: "No Match", tone: "success" },
    { label: "Custom List", value: "No Match", tone: "success" },
  ],
  escalateSummary: {
    riskScore: 4,
    sanction: true,
    warningEnforcement: true,
  },
  searchInformation: personSearch,
};

const corporateDetail: AmlCaseDetail = {
  id: "meridian-trading",
  caseName: "MERIDIAN TRADING",
  kind: "corporate",
  riskScore: 3,
  activeMonitoring: false,
  sourceBanner: {
    title: "OFAC SDN List & Shell Company Database",
    listedOn: "Thu, 20 Jun 2024",
    href: "https://sanctionssearch.ofac.treas.gov",
  },
  keyFields: [
    {
      label: "Aliases",
      value: "Meridian Trading Corp · Meridian International · MTC Holdings",
    },
    { label: "Category", value: "Sanctioned Entity · Shell Company", tone: "warning" },
    { label: "Country", value: "United States" },
    { label: "Registration Number", value: "BVI-892456" },
    { label: "Date of incorporation", value: "1942-11-20" },
    { label: "Jurisdiction", value: "United States" },
    { label: "Business Type", value: "Logistics" },
    {
      label: "Directors",
      value: "Corporate Services Provider",
      values: ["Corporate Services Provider", "Nominee Director Services Ltd"],
    },
    { label: "Entity Type", value: "Corporate" },
    { label: "Ultimate Beneficial Owner", value: "Unknown shell company structure" },
  ],
  linkedEntities: [],
  corporateLinks: [
    {
      description: "Related Entity",
      entityName: "Meridian Investments Ltd (Cyprus)",
      details: "Cephas Trust",
    },
    {
      description: "Beneficial Owners",
      entityName: "Unknown",
      details: "Undisclosed ownership",
    },
  ],
  additionalLinks: [{ label: "Twitter", value: "Socials-Meridian", href: "https://x.com" }],
  sources: [
    {
      title: "U.S. Department of Treasury – OFAC SDN List",
      description: "Corporate entities designated for sanctions.",
      href: "https://sanctionssearch.ofac.treas.gov",
    },
    {
      title: "U.S. Department of Treasury – OFAC SDN List",
      description: "Corporate entities designated for sanctions.",
      href: "https://sanctionssearch.ofac.treas.gov",
    },
  ],
  verifications: sanctionsAndWatchlists,
  warningItems: [],
  riskScoreValue: 1,
  overallAnalysis: "Low",
  radar: personDetail.radar,
  riskDetails: personDetail.riskDetails,
  escalateSummary: personDetail.escalateSummary,
  searchInformation: corporateSearch,
};

const personSlugs: Record<string, string> = {
  "favour-peter-soma": "FAVOUR PETER SOMA",
  "mary-peter": "MARY PETER",
  "kate-morrison": "KATE MORRISON",
  "drew-cano": "DREW CANO",
  "andi-lane": "ANDI LANE",
  "peter-sam": "PETER SAM",
  "tejumade-olomola": "TEJUMADE OLOMOLA",
  "favour-chris": "FAVOUR CHRIS",
};

const corporateNames: Record<string, string> = {
  "meridian-trading": "MERIDIAN TRADING",
  "cephas-trust": "CEPHAS TRUST",
  "chris-sam": "CHRIS SAM",
  "mikun-peter": "MIKUN PETER",
  "favour-chris": "FAVOUR CHRIS",
};

function titleFromSlug(id: string) {
  return id.replace(/-/g, " ").toUpperCase();
}

export function getAmlCaseSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getAmlCaseHref(name: string, kind: "person" | "corporate" | "batch") {
  if (kind === "batch") {
    return "/aml-screening/batch/techventures";
  }

  const slug =
    getAmlCaseSlug(name) || (kind === "corporate" ? "meridian-trading" : "favour-peter-soma");

  if (kind === "corporate") {
    return `/aml-screening/${slug}?kind=corporate`;
  }

  return `/aml-screening/${slug}`;
}

export function getAmlCaseDetail(id: string, kind?: AmlCaseKind): AmlCaseDetail | undefined {
  const knownPerson = Boolean(personSlugs[id]);
  const knownCorporate = Boolean(corporateNames[id]);
  const useCorporate =
    kind === "corporate" || (kind !== "person" && knownCorporate && !knownPerson);

  if (useCorporate && (knownCorporate || kind === "corporate")) {
    return {
      ...corporateDetail,
      id,
      caseName: corporateNames[id] ?? titleFromSlug(id),
    };
  }

  if (knownPerson || kind === "person") {
    return {
      ...personDetail,
      id,
      caseName: personSlugs[id] ?? titleFromSlug(id),
    };
  }

  if (knownCorporate) {
    return {
      ...corporateDetail,
      id,
      caseName: corporateNames[id] ?? titleFromSlug(id),
    };
  }

  return undefined;
}
