import { apiFetch, apiFetchEnvelope } from "@/lib/api/client";
import { extractMfaChallenge } from "@/lib/api/mfa-challenge";
import type {
  AccessSwitchDto,
  ApiDomain,
  ApiSignInData,
  ApiUser,
  ApiUserAccess,
  SignInDto,
  SignUpDto,
  ValidateMFATokenDto,
} from "@/lib/api/types";

export type ClientSignInResult = {
  user: ApiUser;
  userAccess: ApiUserAccess[];
  currentAccess: ApiUserAccess | null;
  domain: ApiDomain;
  requiresMfa?: boolean;
  userId?: string;
};

function normalizeSessionPayload(data: unknown): ClientSignInResult {
  const record = data as Partial<ApiSignInData> & {
    domain?: ApiDomain;
    requiresMfa?: boolean;
    userId?: string;
  };

  // BFF already normalizes MFA challenges to `{ requiresMfa, userId }`.
  const challenge =
    record.requiresMfa === true && typeof record.userId === "string"
      ? { userId: record.userId, user: record.user }
      : extractMfaChallenge(data);

  if (challenge) {
    return {
      user: (challenge.user as ApiUser) ?? (record.user as ApiUser),
      userAccess: record.userAccess ?? [],
      currentAccess: record.currentAccess ?? null,
      domain: record.domain ?? "sandbox",
      requiresMfa: true,
      userId: challenge.userId,
    };
  }

  return {
    user: record.user as ApiUser,
    userAccess: record.userAccess ?? [],
    currentAccess: record.currentAccess ?? null,
    domain: record.domain ?? record.access?.domain ?? "sandbox",
  };
}

export async function signInWithPassword(dto: SignInDto): Promise<ClientSignInResult> {
  const data = await apiFetch<unknown>("/api/auth/sign-in", {
    method: "POST",
    body: dto,
  });
  return normalizeSessionPayload(data);
}

export async function completeGoogleSignIn(intent: string): Promise<ClientSignInResult> {
  const data = await apiFetch<unknown>("/api/auth/sign-in/intent", {
    method: "POST",
    body: { intent },
  });
  return normalizeSessionPayload(data);
}

export async function signUp(dto: SignUpDto): Promise<unknown> {
  return apiFetch("/api/auth/sign-up", { method: "POST", body: dto });
}

export async function signOut(): Promise<void> {
  await apiFetch("/api/auth/sign-out", { method: "POST" });
}

export async function validateMfa(dto: ValidateMFATokenDto): Promise<ClientSignInResult> {
  const data = await apiFetch<unknown>("/api/auth/mfa/validate", {
    method: "POST",
    body: dto,
  });
  return normalizeSessionPayload(data);
}

export async function switchAccess(dto: AccessSwitchDto): Promise<ClientSignInResult> {
  const data = await apiFetch<unknown>("/api/auth/access/switch", {
    method: "POST",
    body: dto,
  });
  return normalizeSessionPayload(data);
}

export async function requestForgotPassword(email: string): Promise<void> {
  await apiFetchEnvelope("/api/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export async function completeForgotPassword(input: {
  token: string;
  email: string;
  password: string;
}): Promise<void> {
  await apiFetchEnvelope("/api/auth/forgot-password/complete", {
    method: "POST",
    body: input,
  });
}

export async function requestEmailVerify(email: string): Promise<void> {
  await apiFetchEnvelope("/api/auth/email/verify", {
    method: "POST",
    body: { email },
  });
}

export async function completeEmailVerify(input: {
  token: string;
  email: string;
}): Promise<void> {
  await apiFetchEnvelope("/api/auth/email/verify/complete", {
    method: "POST",
    body: input,
  });
}

export async function fetchAuthUser(): Promise<ApiUser> {
  return apiFetch<ApiUser>("/api/v1/auth/user");
}

export async function fetchAuthAccess(): Promise<{
  userAccess: ApiUserAccess[];
  currentAccess: ApiUserAccess | null;
}> {
  return apiFetch("/api/v1/auth/access");
}
