export type ApiPageMeta = {
  totalItems?: number;
  itemsCount?: number;
  itemsPerPage?: number;
  totalPages?: number;
  currentPage?: number;
};

export type ApiEnvelope<T> = {
  status: boolean;
  message: string;
  data: T;
  meta?: ApiPageMeta;
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

/** Shared address payload for customer create/update DTOs. */
export type ApiAddressDto = {
  houseNo: string;
  street: string;
  city: string;
  state: string;
  stateCode: string;
  country: string;
  countryCode: string;
  zipCode: string;
  formatted: string;
  coordinates: { lat: number; lng: number };
};

export type ApiGender = "male" | "female";

export type CreateTenantKycDto = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  dob: string;
  address: ApiAddressDto;
  gender: ApiGender;
  phone: string;
};

export type CreateTenantKybDto = {
  countryCode: string;
  address: ApiAddressDto;
  businessName: string;
  registrationDate: string;
  contactEmail: string;
  contactPhone: string;
  industry?: string;
  website?: string;
};

export type ApiKycDocumentType =
  | "national-identity"
  | "passport"
  | "driver-license"
  | "bank-verification"
  | "utility-bill"
  | "bank-statement"
  | "selfie-photo";

export type ApiKybDocumentType =
  | "certificate-of-incorporation"
  | "tin"
  | "proof-of-business-address"
  | "memart";

export type CreateTenantKycDocumentDto = {
  idNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  type: ApiKycDocumentType;
  file?: string;
};

export type CreateTenantKybDocumentDto = {
  idNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  type: ApiKybDocumentType;
  file?: string;
};

/**
 * Upstream create responses are under-documented in OpenAPI.
 * Accept common id shapes; mappers normalize to a string id.
 */
export type ApiCustomerCreateResult = {
  id?: string;
  customerId?: string;
  [key: string]: unknown;
};

export type ApiCustomerStatus =
  | "pending"
  | "onboarded"
  | "review"
  | "blocked"
  | "offboarded";

export type ApiCustomerListQuery = {
  page?: string;
  limit?: string;
  status?: ApiCustomerStatus;
};

/** Upstream customer reads are under-documented. Mappers accept a loose object. */
export type ApiCustomerRecord = {
  id?: string;
  customerId?: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  email?: string;
  contactEmail?: string;
  phone?: string;
  contactPhone?: string;
  countryCode?: string;
  country?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  dob?: string;
  gender?: string;
  address?: Partial<ApiAddressDto> | null;
  industry?: string;
  website?: string;
  registrationDate?: string;
  registrationNumber?: string;
  tin?: string;
  riskScore?: number;
  riskLevel?: number;
  assignedTo?: string | null;
  assignee?: string | null;
  documents?: unknown;
  flags?: unknown;
};

export type ApiCustomerDocumentRecord = {
  id?: string;
  type?: string;
  documentType?: string;
  idNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  createdAt?: string;
  updatedAt?: string;
  file?: string;
  status?: string;
};

export type ApiKybShareholderRecord = {
  id?: string;
  firstName?: string;
  lastName?: string;
  type?: string;
  sharePercentage?: number;
  shareCountTotal?: number;
  role?: string;
};

export type ApiAccountPurpose =
  | "personal-banking"
  | "savings-investment"
  | "salary-payroll"
  | "business-operations"
  | "trade-payments"
  | "remittance"
  | "lending-credit"
  | "treasury-liquidity"
  | "other";

export type ApiSourceOfFunds =
  | "salary"
  | "business-income"
  | "investment-returns"
  | "sale-of-assets"
  | "inheritance-gift"
  | "loan-credit"
  | "savings"
  | "grant-donation"
  | "other";

export type ApiExpectedChannel =
  | "bank-transfer"
  | "card"
  | "direct-debit"
  | "cash"
  | "cheque"
  | "mobile-money"
  | "crypto";

export type DeclareAccountPurposeDto = {
  purpose: ApiAccountPurpose;
  sourceOfFunds: ApiSourceOfFunds;
  purposeDetail?: string;
  sourceOfWealth?: string;
  expectedMonthlyTransactions?: number;
  expectedMonthlyValue?: number;
  expectedSingleTransactionValue?: number;
  currency?: string;
  expectedCorridors?: string[];
  expectedChannels?: ApiExpectedChannel[];
  anticipatedCounterparties?: string;
};

export type ApiProfileType = "individual" | "business";

export type ApiAvailableCheck = {
  type: string;
  label: string;
  authority: string | null;
  eligibleProviders: string[];
};

export type ApiAvailableChecks = {
  countryCode: string;
  profileType: ApiProfileType;
  checks: ApiAvailableCheck[];
};

export type ApiVerificationTypeSelection = {
  type: string;
  providerKey?: string;
};

export type StartKycVerificationDto = {
  customerId: string;
  verificationTypes: ApiVerificationTypeSelection[];
};

export type StartKybVerificationDto = {
  customerId: string;
  verificationTypes: ApiVerificationTypeSelection[];
};
