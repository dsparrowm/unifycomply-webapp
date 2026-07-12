import type {
  SettingsBusinessInformation,
  SettingsProfile,
  SettingsSelectOption,
  SettingsTeamMember,
  SettingsRole,
  SettingsSecurity,
  SettingsAuditLogEntry,
  SettingsApprovals,
  SettingsPepSettings,
  SettingsNotifications,
  SettingsComplianceRules,
} from "@/types/settings";

export const settingsProfileData: SettingsProfile = {
  firstName: "Ayomikun",
  lastName: "Alimi",
  email: "ayomikunalimi@gmail.com",
  phone: "+23470123456789",
  role: "Senior Compliance Officer",
  department: "Risk & Compliance",
  timezone: "Africa/Lagos",
  language: "en",
  initials: "AA",
  displayName: "Alimi Ayomikun",
};

export const timezoneOptions: SettingsSelectOption[] = [
  { label: "Africa/Lagos (WAT)", value: "Africa/Lagos" },
  { label: "UTC", value: "UTC" },
  { label: "Europe/London (GMT)", value: "Europe/London" },
  { label: "America/New_York (EST)", value: "America/New_York" },
];

export const languageOptions: SettingsSelectOption[] = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "Portuguese", value: "pt" },
];

export const settingsBusinessInformationData: SettingsBusinessInformation = {
  companyName: "TechStack",
  registrationNumber: "RC 1234567",
  taxIdentificationNumber: "TIN 98765432",
  industry: "financial",
  website: "https://www.tectstack.com",
  yearOfEstablishment: "2018",
  numberOfEmployees: "50-100",
  streetAddress: "15 Marina Road, Lagos Island",
  city: "Lagos",
  stateRegion: "Lagos State",
  country: "NG",
  postalCode: "101423",
};

export const industryOptions: SettingsSelectOption[] = [
  { label: "Financial", value: "financial" },
  { label: "Technology", value: "technology" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Retail", value: "retail" },
  { label: "Manufacturing", value: "manufacturing" },
];

export const employeeCountOptions: SettingsSelectOption[] = [
  { label: "1 - 10", value: "1-10" },
  { label: "11 - 50", value: "11-50" },
  { label: "50 - 100", value: "50-100" },
  { label: "100 - 500", value: "100-500" },
  { label: "500+", value: "500+" },
];

export const countryOptions: SettingsSelectOption[] = [
  { label: "Nigeria", value: "NG" },
  { label: "Ghana", value: "GH" },
  { label: "Kenya", value: "KE" },
  { label: "United Kingdom", value: "GB" },
  { label: "United States", value: "US" },
];

export const settingsTeamMembersData: SettingsTeamMember[] = [
  {
    id: "team-1",
    name: "Tejumade Olomola",
    email: "Tejumade@hyperpels.com",
    initials: "TO",
    role: "Senior Compliance Officer",
    lastActive: "2 minutes ago",
    status: "active",
  },
  {
    id: "team-2",
    name: "Alimi Ayomikun",
    email: "Tejumade@hyperpels.com",
    initials: "AA",
    role: "Compliance Manager",
    lastActive: "2 minutes ago",
    status: "active",
  },
  {
    id: "team-3",
    name: "Favour Soma",
    email: "Tejumade@hyperpels.com",
    initials: "FS",
    role: "Junior Compliance Officer",
    lastActive: "2 minutes ago",
    status: "active",
  },
  {
    id: "team-4",
    name: "Favour Soma",
    email: "Tejumade@hyperpels.com",
    initials: "FS",
    role: "Junior Compliance Officer",
    lastActive: "2 minutes ago",
    status: "removed",
  },
  {
    id: "team-5",
    name: "Cephas Trust",
    email: "Tejumade@hyperpels.com",
    initials: "CT",
    role: "Junior Compliance Officer",
    lastActive: "2 minutes ago",
    status: "pending",
  },
];

const verificationPermissions = [
  { id: "approve-verification", label: "Approve Verification", enabled: true },
  { id: "reject-verification", label: "Reject verification", enabled: true },
  { id: "escalate-to-senior", label: "escalate to senior", enabled: true },
];

export const settingsRolesData: SettingsRole[] = [
  {
    id: "role-junior-compliance-officer",
    name: "Junior Compliance Officer",
    riskLevel: "Risk Level 0 - 1",
    permissions: verificationPermissions,
    summary: "Approve • Reject • Escalate",
  },
  {
    id: "role-senior-compliance-officer",
    name: "Senior Compliance Officer",
    riskLevel: "Risk Level 0 - 2",
    permissions: verificationPermissions,
    summary: "Approve • Reject • Escalate",
  },
  {
    id: "role-compliance-manager",
    name: "Compliance Manager",
    riskLevel: "Risk Level 0 - 3",
    permissions: verificationPermissions,
    summary: "Approve • Reject • Escalate",
  },
  {
    id: "role-head-of-compliance",
    name: "Head of Compliance",
    riskLevel: "Risk Level 0 - 4",
    permissions: [
      { id: "approve-verification", label: "Approve Verification", enabled: true },
      { id: "reject-verification", label: "Reject verification", enabled: true },
    ],
    summary: "Approve • Reject",
  },
];

export const settingsSecurityData: SettingsSecurity = {
  twoFactorEnabled: true,
  twoFactorStatus: "2FA is currently enabled",
  twoFactorMethod: "Using authenticator app (Google Authenticator)",
  sessions: [
    {
      id: "session-1",
      device: "Chrome on Windows",
      location: "Lagos, Nigeria",
      ipAddress: "197.210.52.143",
      lastActive: "Just now",
      isCurrent: true,
    },
    {
      id: "session-2",
      device: "Safari on iPhone",
      location: "Lagos, Nigeria",
      ipAddress: "197.210.52.143",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
  ],
};

export const auditLogModuleOptions: SettingsSelectOption[] = [
  { label: "All modules", value: "all" },
  { label: "KYC", value: "kyc" },
  { label: "KYB", value: "kyb" },
  { label: "Settings", value: "settings" },
  { label: "Teams", value: "teams" },
  { label: "Security", value: "security" },
];

export const settingsAuditLogsData: SettingsAuditLogEntry[] = [
  {
    id: "audit-1",
    timestamp: "2024-01-30",
    time: "12:25:33",
    userName: "Tejumade Olomola",
    userRole: "Senior Compliance Officer",
    action: "KYC verification approved",
    actionDetail: "KYC-2024-0154 • Ahmed Musa",
    module: "KYC",
    ipAddress: "197.210.52.143",
    status: "completed",
  },
  {
    id: "audit-2",
    timestamp: "2024-01-30",
    time: "11:48:12",
    userName: "Alimi Ayomikun",
    userRole: "Compliance Manager",
    action: "Role permissions updated",
    actionDetail: "Junior Compliance Officer",
    module: "Settings",
    ipAddress: "197.210.52.143",
    status: "completed",
  },
  {
    id: "audit-3",
    timestamp: "2024-01-30",
    time: "10:15:07",
    userName: "Favour Soma",
    userRole: "Junior Compliance Officer",
    action: "KYC verification rejected",
    actionDetail: "KYC-2024-0152 • Incomplete documents",
    module: "KYC",
    ipAddress: "102.89.44.201",
    status: "failed",
  },
  {
    id: "audit-4",
    timestamp: "2024-01-30",
    time: "09:32:44",
    userName: "Cephas Trust",
    userRole: "Junior Compliance Officer",
    action: "Team member invited",
    actionDetail: "Pending invitation sent",
    module: "Teams",
    ipAddress: "197.210.52.143",
    status: "pending",
  },
  {
    id: "audit-5",
    timestamp: "2024-01-29",
    time: "16:54:21",
    userName: "Tejumade Olomola",
    userRole: "Senior Compliance Officer",
    action: "Business information updated",
    actionDetail: "Company details saved",
    module: "Settings",
    ipAddress: "197.210.52.143",
    status: "completed",
  },
  {
    id: "audit-6",
    timestamp: "2024-01-29",
    time: "15:20:18",
    userName: "Alimi Ayomikun",
    userRole: "Compliance Manager",
    action: "2FA backup codes viewed",
    actionDetail: "Security settings",
    module: "Security",
    ipAddress: "197.210.52.143",
    status: "completed",
  },
  {
    id: "audit-7",
    timestamp: "2024-01-29",
    time: "14:08:55",
    userName: "Favour Soma",
    userRole: "Junior Compliance Officer",
    action: "KYB case escalated",
    actionDetail: "KYB-2024-0089 • Escalated to senior",
    module: "KYB",
    ipAddress: "102.89.44.201",
    status: "pending",
  },
  {
    id: "audit-8",
    timestamp: "2024-01-29",
    time: "11:41:03",
    userName: "Tejumade Olomola",
    userRole: "Senior Compliance Officer",
    action: "Password changed",
    actionDetail: "Account security update",
    module: "Security",
    ipAddress: "197.210.52.143",
    status: "completed",
  },
  {
    id: "audit-9",
    timestamp: "2024-01-28",
    time: "17:22:36",
    userName: "Cephas Trust",
    userRole: "Junior Compliance Officer",
    action: "Export report requested",
    actionDetail: "KYC compliance queue",
    module: "KYC",
    ipAddress: "197.210.52.143",
    status: "completed",
  },
  {
    id: "audit-10",
    timestamp: "2024-01-28",
    time: "09:05:14",
    userName: "Alimi Ayomikun",
    userRole: "Compliance Manager",
    action: "Session revoked",
    actionDetail: "Safari on iPhone signed out",
    module: "Security",
    ipAddress: "197.210.52.143",
    status: "failed",
  },
];

export const riskFactorImpactOptions: SettingsSelectOption[] = [
  { label: "+1 Low Impact", value: "low" },
  { label: "+2 Medium Impact", value: "medium" },
  { label: "+3 High Impact", value: "high" },
];

export const settingsApprovalsData: SettingsApprovals = {
  riskFactors: [
    {
      id: "risk-pep",
      title: "Politically Exposed Person (PEP) Association",
      description: "Name similarity or known association with politically exposed persons",
      enabled: true,
      impact: "low",
    },
    {
      id: "risk-sanctions",
      title: "Sanctions List Match",
      description: "Name appears on international sanctions lists (OFAC, EU, UN)",
      enabled: true,
      impact: "low",
    },
    {
      id: "risk-warnings",
      title: "Warnings and Regulatory Enforcement",
      description: "Negative news articles or public records found",
      enabled: true,
      impact: "low",
    },
    {
      id: "risk-geography",
      title: "High-Risk Geographic Location",
      description: "Located in or transacting from high-risk jurisdiction",
      enabled: true,
      impact: "low",
    },
    {
      id: "risk-document",
      title: "Suspected Document Tampering",
      description: "AI detection indicates possible document modification or forgery",
      enabled: true,
      impact: "low",
    },
  ],
  thresholds: {
    warningThreshold: 2,
    approvalBlockThreshold: 3,
    maxScore: 4,
  },
};

export const settingsPepData: SettingsPepSettings = {
  tiers: [
    {
      id: "pep-tier-4",
      level: 4,
      title: "Senior Foreign PEP",
      description: "Heads of state, government ministers, senior officials",
      riskScoreImpact: 4,
      requiresApproval: true,
      autoEscalation: true,
      examples: ["President", "Central Bank Governor", "Government Minister"],
    },
    {
      id: "pep-tier-3",
      level: 3,
      title: "Domestic Senior PEP",
      description: "Senior domestic politicians and officials",
      riskScoreImpact: 3,
      requiresApproval: true,
      autoEscalation: true,
      examples: ["Member of Parliament", "State Governor", "Senior Judge"],
    },
    {
      id: "pep-tier-2",
      level: 2,
      title: "International Organization Officials",
      description: "Senior management of international organizations",
      riskScoreImpact: 2,
      requiresApproval: true,
      autoEscalation: true,
      examples: ["UN Senior Official", "IMF Director", "World Bank Executive"],
    },
    {
      id: "pep-tier-1",
      level: 1,
      title: "Close Associates and Family Members",
      description: "Close family members and known associates of PEPs",
      riskScoreImpact: 1,
      requiresApproval: true,
      autoEscalation: false,
      examples: ["Spouse of PEP", "Adult Child", "Business Partner"],
    },
  ],
};

export const settingsNotificationsData: SettingsNotifications = {
  webhookEnabled: true,
  webhookUrl: "https://api.acmecorp.com/webhooks/unifycomply",
};

export const verificationExpiryOptions: SettingsSelectOption[] = [
  { label: "6 months", value: "6" },
  { label: "12 months", value: "12" },
  { label: "18 months", value: "18" },
  { label: "24 months", value: "24" },
  { label: "36 months", value: "36" },
];

export const settingsComplianceRulesData: SettingsComplianceRules = {
  verificationExpiry: {
    kycExpiryMonths: "12",
    kybExpiryMonths: "24",
  },
  kycDocuments: [
    { id: "kyc-id-document", label: "ID Document" },
    { id: "kyc-proof-of-address", label: "Proof of Address" },
    { id: "kyc-selfie", label: "Selfie" },
  ],
  kybDocuments: [
    { id: "kyb-certificate", label: "Certificate of Incorporation" },
    { id: "kyb-tax-id", label: "Tax ID" },
    { id: "kyb-business-address", label: "Proof of Business Address" },
    { id: "kyb-directors-id", label: "Directors ID" },
  ],
  flaggedCountries: [
    { id: "country-north-korea", label: "North Korea" },
    { id: "country-iran", label: "Iran" },
    { id: "country-syria", label: "Syria" },
    { id: "country-cuba", label: "Cuba" },
  ],
};
