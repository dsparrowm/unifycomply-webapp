import { getApiBaseUrl } from "@/lib/api/config";
import { ApiError } from "@/lib/api/errors";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from "@/lib/api/server/cookies";
import type { ApiAccessTokens, ApiEnvelope } from "@/lib/api/types";

type UpstreamOptions = {
  method?: string;
  path: string;
  query?: Record<string, string | undefined>;
  body?: unknown;
  /** Use access cookie (default true for authenticated calls). */
  auth?: boolean;
  /** Override bearer token (e.g. refresh flow). */
  bearer?: string;
  /** Skip automatic refresh-on-401. */
  skipRefresh?: boolean;
};

function buildUrl(path: string, query?: Record<string, string | undefined>): string {
  const base = getApiBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${normalized}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    }
  }
  return url.toString();
}

async function parseEnvelope<T>(response: Response): Promise<ApiEnvelope<T>> {
  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new ApiError("Invalid response from API", response.status);
  }

  if (
    typeof json !== "object" ||
    json === null ||
    !("status" in json) ||
    !("message" in json)
  ) {
    throw new ApiError("Unexpected API response shape", response.status, json);
  }

  const envelope = json as ApiEnvelope<T>;
  if (!response.ok || envelope.status === false) {
    throw new ApiError(
      typeof envelope.message === "string" ? envelope.message : "Request failed",
      response.status,
      envelope,
    );
  }

  return envelope;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(buildUrl("/v1/auth/refresh"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      await clearAuthCookies();
      return null;
    }

    const envelope = await parseEnvelope<ApiAccessTokens | { access: ApiAccessTokens }>(response);
    const tokens =
      envelope.data && typeof envelope.data === "object" && "token" in envelope.data
        ? (envelope.data as ApiAccessTokens)
        : (envelope.data as { access: ApiAccessTokens }).access;

    if (!tokens?.token || !tokens?.refreshToken) {
      await clearAuthCookies();
      return null;
    }

    await setAuthCookies(tokens);
    return tokens.token;
  } catch {
    try {
      await clearAuthCookies();
    } catch {
      // ignore cookie clear failures during refresh recovery
    }
    return null;
  }
}

export async function upstreamFetch<T>(options: UpstreamOptions): Promise<ApiEnvelope<T>> {
  const { method = "GET", path, query, body, auth = false, bearer, skipRefresh = false } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let token = bearer;
  if (!token && auth) {
    token = await getAccessToken();
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  if (response.status === 401 && auth && !skipRefresh && !bearer) {
    const nextAccess = await refreshAccessToken();
    if (nextAccess) {
      return upstreamFetch<T>({
        ...options,
        bearer: nextAccess,
        skipRefresh: true,
      });
    }
  }

  return parseEnvelope<T>(response);
}

export async function upstreamFetchRaw(
  options: UpstreamOptions,
): Promise<{ response: Response; bodyText: string }> {
  const { method = "GET", path, query, body, auth = false, bearer, skipRefresh = false } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let token = bearer;
  if (!token && auth) {
    token = await getAccessToken();
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? error.message : "Upstream request failed",
      502,
    );
  }

  if (response.status === 401 && auth && !skipRefresh && !bearer) {
    const nextAccess = await refreshAccessToken();
    if (nextAccess) {
      return upstreamFetchRaw({
        ...options,
        bearer: nextAccess,
        skipRefresh: true,
      });
    }
  }

  const bodyText = await response.text();
  return { response, bodyText };
}
