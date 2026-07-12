import type { RiskScore } from "@/lib/kyc/risk-score";
import type { KybDirectorsData, KybDirector } from "@/types/kyb";

const sharedDirectorContact = {
  nationality: "Nigerian",
  dateAppointed: "12/01/2025",
  idType: "International Passport",
  idNumber: "12/01/2025",
  phone: "08052345678",
  address: "8 banana Island Lagos",
};

function buildDirector(
  partial: Pick<KybDirector, "id" | "fullName" | "role" | "shareholdingPercent" | "email"> &
    Partial<KybDirector>,
): KybDirector {
  return {
    verificationStatus: "pending",
    pepStatus: "non-pep",
    amlClearanceStatus: "clear",
    amlRiskLevel: "Low Risk",
    amlChecks: [],
    ...sharedDirectorContact,
    ...partial,
  };
}

const score0Directors: KybDirectorsData = {
  sectionStatus: "Active",
  directors: [
    {
      id: "director-1",
      fullName: "Tejumade Olomola",
      role: "Managing Director / CEO",
      verificationStatus: "verified",
      pepStatus: "non-pep",
      shareholdingPercent: 60,
      nationality: "Nigerian",
      dateAppointed: "12/01/2025",
      idType: "International Passport",
      idNumber: "12/01/2025",
      phone: "08052345678",
      email: "TejuX@gmail.com",
      address: "8 banana Island Lagos",
      amlClearanceStatus: "clear",
      amlRiskLevel: "Low Risk",
      amlChecks: [
        { id: "sanctions", label: "SANCTIONS", status: "no-match" },
        { id: "adverse-media", label: "ADVERSE MEDIA", status: "no-match" },
        { id: "watchlist", label: "WATCHLIST", status: "no-match" },
      ],
    },
    {
      id: "director-2",
      fullName: "Alimi Ayomikun",
      role: "Managing Director / CTO",
      verificationStatus: "verified",
      pepStatus: "non-pep",
      shareholdingPercent: 40,
      nationality: "Nigerian",
      dateAppointed: "12/01/2025",
      idType: "International Passport",
      idNumber: "12/01/2025",
      phone: "08052345678",
      email: "AyomiX@gmail.com",
      address: "8 banana Island Lagos",
      amlClearanceStatus: "clear",
      amlRiskLevel: "Low Risk",
      amlChecks: [
        { id: "sanctions", label: "SANCTIONS", status: "no-match" },
        { id: "adverse-media", label: "ADVERSE MEDIA", status: "no-match" },
        { id: "watchlist", label: "WATCHLIST", status: "no-match" },
      ],
    },
  ],
};

const score1Directors: KybDirectorsData = {
  sectionStatus: "Active",
  directors: [
    {
      id: "director-1",
      fullName: "Tejumade Olomola",
      role: "Managing Director / CEO",
      verificationStatus: "pending",
      pepStatus: "pep",
      shareholdingPercent: 60,
      nationality: "Nigerian",
      dateAppointed: "12/01/2025",
      idType: "International Passport",
      idNumber: "12/01/2025",
      phone: "08052345678",
      email: "TejuX@gmail.com",
      address: "8 banana Island Lagos",
      amlClearanceStatus: "review",
      amlRiskLevel: "Medium Risk",
      amlChecks: [
        { id: "sanctions", label: "SANCTIONS", status: "no-match" },
        { id: "pep", label: "PEP (Political Exposed Person)", status: "match" },
        { id: "adverse-media", label: "ADVERSE MEDIA", status: "no-match" },
        { id: "watchlist", label: "WATCHLIST", status: "no-match" },
      ],
    },
    {
      id: "director-2",
      fullName: "Alimi Ayomikun",
      role: "Managing Director / CTO",
      verificationStatus: "verified",
      pepStatus: "non-pep",
      shareholdingPercent: 40,
      nationality: "Nigerian",
      dateAppointed: "12/01/2025",
      idType: "International Passport",
      idNumber: "12/01/2025",
      phone: "08052345678",
      email: "AyomiX@gmail.com",
      address: "8 banana Island Lagos",
      amlClearanceStatus: "clear",
      amlRiskLevel: "Low Risk",
      amlChecks: [
        { id: "sanctions", label: "SANCTIONS", status: "no-match" },
        { id: "adverse-media", label: "ADVERSE MEDIA", status: "no-match" },
        { id: "watchlist", label: "WATCHLIST", status: "no-match" },
      ],
    },
  ],
};

const score3Directors: KybDirectorsData = {
  sectionStatus: "Active",
  directors: [
    buildDirector({
      id: "director-1",
      fullName: "Tejumade Olomola",
      role: "Managing Director / CEO",
      shareholdingPercent: 40,
      email: "TejuX@gmail.com",
      pepStatus: "pep",
      amlClearanceStatus: "review",
      amlRiskLevel: "High Risk",
      amlChecks: [
        { id: "sanctions", label: "SANCTIONS", status: "no-match" },
        { id: "pep", label: "PEP (Political Exposed Person)", status: "match" },
        { id: "adverse-media", label: "ADVERSE MEDIA", status: "flagged" },
        { id: "watchlist", label: "WATCHLIST", status: "no-match" },
      ],
    }),
    buildDirector({
      id: "director-2",
      fullName: "Favour Soma",
      role: "Managing Director / COO",
      shareholdingPercent: 30,
      email: "FavourX@gmail.com",
      pepStatus: "pep",
      amlClearanceStatus: "review",
      amlRiskLevel: "High Risk",
      amlChecks: [
        { id: "sanctions", label: "SANCTIONS", status: "no-match" },
        { id: "pep", label: "PEP (Political Exposed Person)", status: "match" },
        { id: "adverse-media", label: "ADVERSE MEDIA", status: "match" },
        { id: "watchlist", label: "WATCHLIST", status: "no-match" },
      ],
    }),
  ],
};

const score4Directors: KybDirectorsData = {
  sectionStatus: "Active",
  directors: [
    buildDirector({
      id: "director-1",
      fullName: "Tejumade Olomola",
      role: "Managing Director / CEO",
      shareholdingPercent: 40,
      email: "TejuX@gmail.com",
      pepStatus: "pep",
      amlClearanceStatus: "flagged",
      amlRiskLevel: "Very High",
      amlChecks: [
        { id: "sanctions", label: "SANCTIONS", status: "match", matchSeverity: "critical" },
        { id: "pep", label: "PEP (Political Exposed Person)", status: "match" },
        { id: "adverse-media", label: "ADVERSE MEDIA", status: "match" },
        { id: "watchlist", label: "WATCHLIST", status: "match", matchSeverity: "critical" },
      ],
    }),
    buildDirector({
      id: "director-2",
      fullName: "Favour Soma",
      role: "Managing Director / COO",
      shareholdingPercent: 30,
      email: "FavourX@gmail.com",
      pepStatus: "pep",
      amlClearanceStatus: "flagged",
      amlRiskLevel: "Very High",
      amlChecks: [
        { id: "sanctions", label: "SANCTIONS", status: "match", matchSeverity: "critical" },
        { id: "pep", label: "PEP (Political Exposed Person)", status: "match" },
        { id: "adverse-media", label: "ADVERSE MEDIA", status: "match" },
        { id: "watchlist", label: "WATCHLIST", status: "flagged" },
      ],
    }),
  ],
};

export function buildKybDirectorsData(score: RiskScore): KybDirectorsData | null {
  if (score === 0) {
    return score0Directors;
  }

  if (score === 1) {
    return score1Directors;
  }

  if (score === 3) {
    return score3Directors;
  }

  if (score === 4) {
    return score4Directors;
  }

  return null;
}
