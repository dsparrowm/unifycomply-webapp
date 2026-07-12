export type SettingsProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  timezone: string;
  language: string;
  initials: string;
  displayName: string;
};

export type SettingsSelectOption = {
  label: string;
  value: string;
};

export type SettingsBusinessInformation = {
  companyName: string;
  registrationNumber: string;
  taxIdentificationNumber: string;
  industry: string;
  website: string;
  yearOfEstablishment: string;
  numberOfEmployees: string;
  streetAddress: string;
  city: string;
  stateRegion: string;
  country: string;
  postalCode: string;
};

export type SettingsTeamMemberStatus = "active" | "removed" | "pending";

export type SettingsTeamMember = {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  lastActive: string;
  status: SettingsTeamMemberStatus;
};

export type SettingsRolePermission = {
  id: string;
  label: string;
  enabled: boolean;
};

export type SettingsRole = {
  id: string;
  name: string;
  riskLevel: string;
  permissions: SettingsRolePermission[];
  summary: string;
};

export type SettingsActiveSession = {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
};

export type SettingsSecurity = {
  twoFactorEnabled: boolean;
  twoFactorStatus: string;
  twoFactorMethod: string;
  sessions: SettingsActiveSession[];
};

export type SettingsAuditLogStatus = "completed" | "failed" | "pending";

export type SettingsAuditLogEntry = {
  id: string;
  timestamp: string;
  time: string;
  userName: string;
  userRole: string;
  action: string;
  actionDetail: string;
  module: string;
  ipAddress: string;
  status: SettingsAuditLogStatus;
};

export type SettingsRiskFactorImpact = "low" | "medium" | "high";

export type SettingsRiskFactor = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  impact: SettingsRiskFactorImpact;
};

export type SettingsApprovalThresholds = {
  warningThreshold: number;
  approvalBlockThreshold: number;
  maxScore: number;
};

export type SettingsApprovals = {
  riskFactors: SettingsRiskFactor[];
  thresholds: SettingsApprovalThresholds;
};

export type SettingsPepTierLevel = 1 | 2 | 3 | 4;

export type SettingsPepTier = {
  id: string;
  level: SettingsPepTierLevel;
  title: string;
  description: string;
  riskScoreImpact: number;
  requiresApproval: boolean;
  autoEscalation: boolean;
  examples: string[];
};

export type SettingsPepSettings = {
  tiers: SettingsPepTier[];
};

export type SettingsNotifications = {
  webhookEnabled: boolean;
  webhookUrl: string;
};

export type SettingsComplianceListItem = {
  id: string;
  label: string;
};

export type SettingsVerificationExpiry = {
  kycExpiryMonths: string;
  kybExpiryMonths: string;
};

export type SettingsComplianceRules = {
  verificationExpiry: SettingsVerificationExpiry;
  kycDocuments: SettingsComplianceListItem[];
  kybDocuments: SettingsComplianceListItem[];
  flaggedCountries: SettingsComplianceListItem[];
};
