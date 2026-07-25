/**
 * Detect MFA challenge payloads from sign-in / intent responses.
 * Upstream may return this without access tokens (and sometimes with status:false).
 *
 * Observed live shape (HTTP 401, status:false):
 * `{ message: "Multifactor Authentication required.", data: { userId } }`
 * — no `requiresMfa` flag on `data`.
 */

export function isMfaRequiredMessage(message: unknown): boolean {
  if (typeof message !== "string") {
    return false;
  }
  const normalized = message.toLowerCase();
  return (
    normalized.includes("multifactor") ||
    normalized.includes("multi-factor") ||
    normalized.includes("multi factor") ||
    normalized.includes("mfa required") ||
    normalized.includes("2fa required") ||
    normalized.includes("two-factor") ||
    normalized.includes("two factor")
  );
}

export function extractMfaChallenge(
  data: unknown,
  message?: unknown,
): { userId: string; user?: unknown } | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const access = record.access;
  const hasToken =
    Boolean(access) &&
    typeof access === "object" &&
    access !== null &&
    typeof (access as { token?: unknown }).token === "string" &&
    Boolean((access as { token: string }).token);

  if (hasToken) {
    return null;
  }

  const userIdFromUser =
    record.user &&
    typeof record.user === "object" &&
    record.user !== null &&
    typeof (record.user as { id?: unknown }).id === "string"
      ? (record.user as { id: string }).id
      : null;

  const userId =
    (typeof record.userId === "string" && record.userId) ||
    (typeof record.user_id === "string" && record.user_id) ||
    userIdFromUser;

  if (!userId) {
    return null;
  }

  const flagged =
    record.requiresMfa === true ||
    record.MFARequired === true ||
    record.mfaRequired === true ||
    record.requireMfa === true ||
    record.mfa === true;

  const messageIndicatesMfa = isMfaRequiredMessage(message);

  if (!flagged && !messageIndicatesMfa) {
    return null;
  }

  return { userId, user: record.user };
}
