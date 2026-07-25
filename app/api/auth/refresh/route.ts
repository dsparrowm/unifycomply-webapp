import { getRefreshToken, setAuthCookies, clearAuthCookies } from "@/lib/api/server/cookies";
import { jsonError, jsonOk } from "@/lib/api/server/http";
import { upstreamFetch } from "@/lib/api/server/upstream";
import type { ApiAccessTokens } from "@/lib/api/types";

export async function POST() {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      await clearAuthCookies();
      return jsonError(new Error("No refresh token"), 401);
    }

    const envelope = await upstreamFetch<ApiAccessTokens | { access: ApiAccessTokens }>({
      method: "POST",
      path: "/v1/auth/refresh",
      bearer: refreshToken,
      skipRefresh: true,
    });

    const tokens =
      envelope.data && typeof envelope.data === "object" && "token" in envelope.data
        ? (envelope.data as ApiAccessTokens)
        : (envelope.data as { access: ApiAccessTokens }).access;

    await setAuthCookies(tokens);
    return jsonOk({ domain: tokens.domain }, envelope.message);
  } catch (error) {
    await clearAuthCookies();
    return jsonError(error, 401);
  }
}
