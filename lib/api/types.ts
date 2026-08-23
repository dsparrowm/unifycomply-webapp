export type ApiEnvelope<T> = {
  status: boolean;
  message: string;
  data: T;
};

export type ApiPlatform = "app" | "admin";
export type ApiDomain = "sandbox" | "production";

export type ApiUser = {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  countryCode: string;
  status: string;
  lastActivityAt: string | null;
  language: string;
  timezone: string;
  imageUrl: string | null;
};

export type ApiUserAccess = {
  id: string;
  createdAt: string;
  updatedAt: string;
  tenantName: string;
  tenantId: string;
  status: string;
  roleId: string;
  userId: string;
};

export type ApiAccessTokens = {
  token: string;
  refreshToken: string;
  domain: ApiDomain;
};

export type ApiSignInData = {
  user: ApiUser;
  userAccess: ApiUserAccess[];
  currentAccess: ApiUserAccess | null;
  access: ApiAccessTokens;
};

/** Present when MFA is required before issuing tokens (shape may evolve). */
export type ApiMfaChallengeData = {
  requiresMfa: true;
  userId: string;
};

export type SignInDto = {
  email: string;
  password: string;
};

export type SignUpDto = {
  email: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  password: string;
};

export type AuthEmailVerifyDto = {
  email: string;
};

export type AccessSwitchDto = {
  accessId: string;
};

export type ValidateMFATokenDto = {
  userId: string;
  token: string;
};

export type MFATokenDto = {
  token: string;
};

export type PasswordDto = {
  password: string;
};

export type DomainSwitchDto = {
  domain: ApiDomain;
};

export type ApiRolePermission =
  | "team-member:create"
  | "team-member:update"
  | "role-permission:create"
  | "role-permission:update"
  | "verification:approve"
  | "verification:reject"
  | "case:escalate"
  | "approval:escalate"
  | "compliance:update"
  | "tenant-settings:update";

export type ApiTenantRole = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  department: string | null;
  description: string | null;
  riskLevelMinimum: number;
  riskLevelMaximum: number;
  permissions: ApiRolePermission[];
  tenantId: string;
};

export type ApiPermissionOption = {
  value: ApiRolePermission;
  label: string;
  description: string;
};

export type ApiUserProfile = {
  personalInformation: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    role: string | null;
    department: string | null;
  };
  preferences: {
    timezone: string;
    language: string;
  };
};

export type UpdateUserProfileDto = {
  personalInformation: {
    phone?: string;
    firstName?: string;
    lastName?: string;
  };
  preferences: {
    language?: string;
    timezone?: string;
  };
};

export type ApiAddress = {
  houseNo: string;
  street: string;
  city: string;
  state?: string;
  stateCode: string;
  country?: string;
  countryCode: string;
  zipCode: string;
  formatted?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export type ApiBusinessInformation = {
  name: string;
  registrationNumber: string;
  tin: string | null;
  industry: string | null;
  website: string | null;
  yearFounded: string | null;
  companySize: string | null;
  address: ApiAddress | null;
};

export type UpdateTenantBusinessInformationDto = {
  name?: string;
  registrationNumber?: string;
  tin?: string;
  industry?: string;
  website?: string;
  yearFounded?: string;
  companySize?: string;
  address?: {
    houseNo: string;
    street: string;
    city: string;
    stateCode: string;
    countryCode: string;
    zipCode: string;
    coordinates: { lat: number; lng: number };
  };
};

export type ApiTeamMember = {
  id: string;
  fullName?: string;
  name?: string;
  email: string;
  roleId?: string;
  roleName?: string;
  role?: string;
  status?: string;
  lastActiveAt?: string | null;
  lastActivityAt?: string | null;
  imageUrl?: string | null;
  userId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateTenantTeamInviteDto = {
  fullName: string;
  email: string;
  roleId: string;
};

export type ApiApiKey = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publicKey: string;
  secretKey: string;
  domain: ApiDomain;
  lastUsedAt: string | null;
  tenantId: string;
};

export type ApiRiskFactor = {
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  type: string;
  slug: string;
  riskWeight: number;
  domain: ApiDomain;
  tenantId: string;
};

export type ApiRiskScoreThreshold = {
  createdAt: string;
  updatedAt: string;
  warningThreshold: number;
  blockThreshold: number;
  domain: ApiDomain;
  tenantId: string;
};

export type ApiPepTier = {
  createdAt: string;
  updatedAt: string;
  name: string;
  tier: "tier-1" | "tier-2" | "tier-3" | "tier-4";
  description: string;
  riskScoreImpact: number;
  requiresApproval: boolean;
  autoEscalation: boolean;
  positionDescription: string;
  positionExamples: string[];
  domain: ApiDomain;
  tenantId: string;
};

export type ApiNotificationPreferences = {
  id: string;
  createdAt: string;
  updatedAt: string;
  domain: ApiDomain;
  eventCallbackUrl: string | null;
  ipWhitelistEnabled: boolean;
  allowedIps: string[];
  tenantId: string;
};

export type ApiComplianceRules = {
  createdAt: string;
  updatedAt: string;
  kycExpiryDays: number;
  kybExpiryDays: number;
  kycDocuments: string[];
  kybDocuments: string[];
  flaggedCountryCodes: string[];
  domain: ApiDomain;
  tenantId: string;
};

export type ApiLabelValue = {
  value: string;
  label: string;
};

export type ApiEmployeeCount = {
  id: string;
  label: string;
};

export type ApiMfaStatus = {
  MFAEnabled: boolean;
};

export type ApiMfaSetup = {
  keyUri: string;
  secret: string;
};

export type SessionPayload = {
  user: ApiUser;
  userAccess: ApiUserAccess[];
  currentAccess: ApiUserAccess | null;
  domain: ApiDomain;
  roleName: string | null;
};
