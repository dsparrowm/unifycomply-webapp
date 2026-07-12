import { buildRiskAnalysisData } from "@/lib/compliance/risk-analysis";
import { buildKybDirectorsData } from "@/lib/data/kyb-directors";
import { buildKybShareCapitalData } from "@/lib/data/kyb-shareholders";
import { buildKybComplianceChecksData } from "@/lib/data/kyb-compliance-checks";
import { buildKybSubmittedDocumentsData } from "@/lib/data/kyb-documents";
import { kybListDataPopulated } from "@/lib/data/kyb";
import { clampRiskScore, getRiskScoreLabel, type RiskScore } from "@/lib/kyc/risk-score";
import type { KybDetail, KybRecord, KybRiskFactor } from "@/types/kyb";

const techVenturesTemplate = {
  registryStatus: "Active",
  legalBusinessName: "TechVentures Nigeria Limited",
  registrationNumber: "RC-23456789",
  dateRegistered: "2018-03-15",
  tin: "12345678-0001",
  industry: "Technology and Software Development",
  registeredAddress: "45 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
  phoneNumber: "+234 809 123 4567",
  email: "info@techventures.ng",
  website: "www.techventures.ng",
  businessActivities: ["Cybersecurity Services", "IT Consulting Services"],
  submittedAt: "10/1/2026 | 10:30AM",
  lastUpdatedAt: "10/1/2026 | 10:30AM",
  employeeCount: "10-20",
  annualRevenue: ">$5M",
  businessPermit: "Yes",
  operatingCountries: "Multi",
};

const riskSummaries: Record<RiskScore, string> = {
  0: "No risk factors identified. Registry and screening checks passed.",
  1: "Low-risk profile with minor monitoring flags. Standard review recommended.",
  2: "Moderate risk indicators detected. Additional verification may be required.",
  3: "Elevated risk profile. Enhanced due diligence recommended before approval.",
  4: "Very high risk profile. Approval blocked pending senior compliance review.",
};

const riskFactorsByScore: Record<RiskScore, KybRiskFactor[]> = {
  0: [
    {
      id: "sanctions",
      category: "Sanctioned",
      title: "Sanctions Screening Match",
      description: "No risk factors. All checks passed. Approve immediately if registry data is confirmed.",
    },
  ],
  1: [
    {
      id: "sanctions",
      category: "Sanctioned",
      title: "Sanctions Screening Match",
      description: "No sanctions matches found. Low-risk monitoring flags noted for cross-border activity.",
    },
    {
      id: "pep",
      category: "PEP",
      title: "Politically Exposed Persons",
      description: "No PEP associations identified for directors or shareholders.",
    },
  ],
  2: [
    {
      id: "sanctions",
      category: "Sanctioned",
      title: "Sanctions Screening Match",
      description: "Potential partial match under review. Confirm entity ownership before approval.",
    },
    {
      id: "adverse-media",
      category: "Adverse Media",
      title: "Adverse Media Screening",
      description: "Minor adverse media references detected. Review recommended.",
    },
  ],
  3: [
    {
      id: "sanctions",
      category: "Sanctioned",
      title: "Sanctions Screening Match",
      description: "No direct sanctions match. Enhanced screening recommended due to elevated risk score.",
    },
    {
      id: "ownership",
      category: "Ownership",
      title: "Beneficial Ownership",
      description: "Complex ownership structure detected. Verify UBO details before approval.",
    },
  ],
  4: [
    {
      id: "sanctions",
      category: "Sanctioned",
      title: "Sanctions Screening Match",
      description: "Potential sanctions exposure identified. Escalate to senior reviewer immediately.",
    },
    {
      id: "adverse-media",
      category: "Adverse Media",
      title: "Adverse Media Screening",
      description: "Significant adverse media findings require compliance review.",
    },
  ],
};

function slugifyBusinessName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildBusinessContact(record: KybRecord) {
  const slug = slugifyBusinessName(record.businessName);

  return {
    registeredAddress: `${record.country} — registered business address on file`,
    phoneNumber: "+234 800 000 0000",
    email: `contact@${slug}.com`,
    website: `www.${slug}.com`,
    industry: `${record.businessType} services`,
    registrationNumber: `RC-${record.kybId.slice(-6)}`,
    dateRegistered: record.submittedAt,
    tin: `${record.kybId.slice(-8)}-0001`,
    businessActivities: [record.businessType, `${record.country} operations`],
    employeeCount: record.riskScore >= 3 ? "10-20" : "1-10",
    annualRevenue: record.riskScore >= 3 ? ">$5M" : "<$1M",
    businessPermit: record.status === "rejected" ? "No" : "Yes",
    operatingCountries: record.country === "Nigeria" ? "Single" : "Multi",
  };
}

function buildDetailFromRecord(record: KybRecord): KybDetail {
  const score = clampRiskScore(record.riskScore);
  const isTechVentures = record.id === "kyb-record-5";
  const contact = isTechVentures ? techVenturesTemplate : buildBusinessContact(record);

  return {
    id: record.id,
    kybId: record.kybId,
    businessName: record.businessName,
    businessType: record.businessType,
    country: record.country,
    status: record.status,
    priority: record.priority,
    riskScore: score,
    riskSummary: riskSummaries[score],
    registryStatus: record.status === "rejected" ? "Inactive" : "Active",
    legalBusinessName: record.businessName,
    registrationNumber: contact.registrationNumber,
    dateRegistered: contact.dateRegistered,
    tin: contact.tin,
    industry: isTechVentures ? techVenturesTemplate.industry : contact.industry,
    registeredAddress: isTechVentures
      ? techVenturesTemplate.registeredAddress
      : contact.registeredAddress,
    phoneNumber: isTechVentures ? techVenturesTemplate.phoneNumber : contact.phoneNumber,
    email: isTechVentures ? techVenturesTemplate.email : contact.email,
    website: isTechVentures ? techVenturesTemplate.website : contact.website,
    businessActivities: isTechVentures
      ? techVenturesTemplate.businessActivities
      : contact.businessActivities,
    submittedAt: isTechVentures ? techVenturesTemplate.submittedAt : `${record.submittedAt} | 09:00AM`,
    lastUpdatedAt: isTechVentures
      ? techVenturesTemplate.lastUpdatedAt
      : `${record.submittedAt} | 09:00AM`,
    employeeCount: isTechVentures ? techVenturesTemplate.employeeCount : contact.employeeCount,
    annualRevenue: isTechVentures ? techVenturesTemplate.annualRevenue : contact.annualRevenue,
    businessPermit: isTechVentures ? techVenturesTemplate.businessPermit : contact.businessPermit,
    operatingCountries: isTechVentures
      ? techVenturesTemplate.operatingCountries
      : contact.operatingCountries,
    riskFactors: riskFactorsByScore[score],
    riskAnalysis: buildRiskAnalysisData(score, "business"),
    directors: buildKybDirectorsData(score),
    shareholders: buildKybShareCapitalData(),
    documents: buildKybSubmittedDocumentsData(),
    complianceChecks: buildKybComplianceChecksData(score),
  };
}

const detailById = new Map<string, KybDetail>(
  kybListDataPopulated.records.map((record) => [record.id, buildDetailFromRecord(record)]),
);

export function getKybDetailById(id: string): KybDetail | undefined {
  return detailById.get(id);
}

export function getAllKybDetailIds(): string[] {
  return Array.from(detailById.keys());
}

export function getKybDetailRiskLabel(score: number): string {
  return getRiskScoreLabel(score);
}
