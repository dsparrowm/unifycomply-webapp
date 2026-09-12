import { ApiError } from "@/lib/api/errors";
import type { ApiEnvelope } from "@/lib/api/types";

type ClientFetchOptions = {
  method?: string;
  body?: unknown;
  query?: Record<string, string | undefined>;
  headers?: Record<string, string>;
};

function buildClientUrl(path: string, query?: Record<string, string | undefined>): string {
  const url = new URL(path, typeof window === "undefined" ? "http://localhost" : window.location.origin);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    }
  }
  return `${url.pathname}${url.search}`;
}

function buildRequestHeaders(options: ClientFetchOptions): Record<string, string> | undefined {
  const headers: Record<string, string> = { ...options.headers };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  return Object.keys(headers).length > 0 ? headers : undefined;
}

export async function apiFetch<T>(path: string, options: ClientFetchOptions = {}): Promise<T> {
  const { method = "GET", body, query } = options;

  const response = await fetch(buildClientUrl(path, query), {
    method,
    credentials: "same-origin",
    headers: buildRequestHeaders(options),
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let envelope: ApiEnvelope<T> | null = null;
  try {
    envelope = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError("Invalid response from server", response.status);
  }

  if (!response.ok || envelope.status === false) {
    throw new ApiError(envelope.message || "Request failed", response.status, envelope);
  }

  return envelope.data;
}

export async function apiFetchEnvelope<T>(
  path: string,
  options: ClientFetchOptions = {},
): Promise<ApiEnvelope<T>> {
  const { method = "GET", body, query } = options;

  const response = await fetch(buildClientUrl(path, query), {
    method,
    credentials: "same-origin",
    headers: buildRequestHeaders(options),
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let envelope: ApiEnvelope<T>;
  try {
    envelope = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError("Invalid response from server", response.status);
  }

  if (!response.ok || envelope.status === false) {
    throw new ApiError(envelope.message || "Request failed", response.status, envelope);
  }

  return envelope;
}
