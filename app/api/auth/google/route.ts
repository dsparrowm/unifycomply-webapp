import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api/config";

function resolveAppOrigin(request: Request): string {
  const configured = process.env.APP_URL?.replace(/\/$/, "");
  if (configured) {
    return configured;
  }
  return new URL(request.url).origin;
}

/** Starts Google OAuth by redirecting to the upstream authorize URL. */
export async function GET(request: Request) {
  const redirectUrl = `${resolveAppOrigin(request)}/auth/google/callback`;
  const upstream = new URL(`${getApiBaseUrl()}/v1/auth/google/sign-in`);
  upstream.searchParams.set("redirectUrl", redirectUrl);
  return NextResponse.redirect(upstream.toString());
}
