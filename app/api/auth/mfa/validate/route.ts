import { AUTH_PLATFORM } from "@/lib/api/config";
import { setAuthCookies } from "@/lib/api/server/cookies";
import { jsonError, stripTokensFromSignInData } from "@/lib/api/server/http";
import { upstreamFetch } from "@/lib/api/server/upstream";
import type { ApiSignInData, ValidateMFATokenDto } from "@/lib/api/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ValidateMFATokenDto;
    if (!body?.userId || !body?.token) {
      return Response.json(
        { status: false, message: "userId and token are required", data: null },
        { status: 400 },
      );
    }

    const envelope = await upstreamFetch<ApiSignInData>({
      method: "POST",
      path: "/v1/auth/mfa/validate",
      query: { platform: AUTH_PLATFORM },
      body,
    });

    if (envelope.data?.access?.token) {
      await setAuthCookies(envelope.data.access);
    }

    return Response.json({
      status: true,
      message: envelope.message,
      data: stripTokensFromSignInData(envelope.data as unknown as Record<string, unknown>),
    });
  } catch (error) {
    return jsonError(error, 401);
  }
}
