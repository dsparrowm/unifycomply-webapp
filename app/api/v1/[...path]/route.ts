import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { getAccessToken, setAuthCookies } from "@/lib/api/server/cookies";
import { jsonError } from "@/lib/api/server/http";
import { upstreamFetchRaw } from "@/lib/api/server/upstream";

const ALLOWED_PREFIXES = [
  "auth/",
  "users/",
  "tenants/",
  "public/",
] as const;

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

function isAllowedPath(segments: string[]): boolean {
  const joined = segments.join("/");
  return ALLOWED_PREFIXES.some((prefix) => joined === prefix.slice(0, -1) || joined.startsWith(prefix));
}

async function proxy(request: Request, context: RouteContext) {
  try {
    const { path: segments } = await context.params;
    if (!segments?.length || !isAllowedPath(segments)) {
      return NextResponse.json(
        { status: false, message: "Path not allowed", data: null },
        { status: 404 },
      );
    }

    const upstreamPath = `/v1/${segments.join("/")}`;
    const url = new URL(request.url);
    const query: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      query[key] = value;
    });

    const method = request.method.toUpperCase();
    const needsAuth = !segments[0] || segments[0] !== "public";

    if (needsAuth) {
      const access = await getAccessToken();
      if (!access) {
        return NextResponse.json(
          { status: false, message: "Unauthorized", data: null },
          { status: 401 },
        );
      }
    }

    let body: unknown;
    if (method !== "GET" && method !== "HEAD") {
      const text = await request.text();
      body = text ? JSON.parse(text) : undefined;
    }

    const { response, bodyText } = await upstreamFetchRaw({
      method,
      path: upstreamPath,
      query,
      body,
      auth: needsAuth,
    });

    // Domain switch may return new tokens — set cookies when present.
    if (upstreamPath === "/v1/tenants/settings/domain/switch" && response.ok) {
      try {
        const parsed = JSON.parse(bodyText) as {
          data?: { access?: { token: string; refreshToken: string; domain: "sandbox" | "production" } };
        };
        if (parsed?.data?.access?.token) {
          await setAuthCookies(parsed.data.access);
        }
      } catch {
        // ignore parse errors; still return upstream body
      }
    }

    return new NextResponse(bodyText, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error) {
    // Prefer upstream/auth status codes over a generic 500 when available.
    if (error instanceof ApiError) {
      return jsonError(error, error.status >= 400 ? error.status : 502);
    }
    return jsonError(error, 502);
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
