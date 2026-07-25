import { cookies } from "next/headers";
import {
  ACCESS_COOKIE_MAX_AGE,
  AUTH_COOKIE_ACCESS,
  AUTH_COOKIE_REFRESH,
  REFRESH_COOKIE_MAX_AGE,
} from "@/lib/api/config";
import type { ApiAccessTokens } from "@/lib/api/types";

function cookieSecure(): boolean {
  return process.env.NODE_ENV === "production";
}

export async function setAuthCookies(tokens: ApiAccessTokens): Promise<void> {
  const jar = await cookies();
  const secure = cookieSecure();

  jar.set(AUTH_COOKIE_ACCESS, tokens.token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_COOKIE_MAX_AGE,
  });

  jar.set(AUTH_COOKIE_REFRESH, tokens.refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });
}

export async function clearAuthCookies(): Promise<void> {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE_ACCESS);
  jar.delete(AUTH_COOKIE_REFRESH);
}

export async function getAccessToken(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(AUTH_COOKIE_ACCESS)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(AUTH_COOKIE_REFRESH)?.value;
}
