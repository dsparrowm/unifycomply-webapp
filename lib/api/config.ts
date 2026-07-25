export function getApiBaseUrl(): string {
  const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("API_BASE_URL is not configured");
  }
  return baseUrl;
}

export const AUTH_COOKIE_ACCESS = "uc_access";
export const AUTH_COOKIE_REFRESH = "uc_refresh";
export const AUTH_PLATFORM = "app" as const;

/** Access token ~24h from JWT; cookie max-age slightly shorter. */
export const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 23;
/** Refresh token ~7d from JWT. */
export const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
