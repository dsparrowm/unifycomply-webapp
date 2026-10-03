import { NextResponse } from "next/server";
import { AUTH_PLATFORM } from "@/lib/api/config";
import { setAuthCookies } from "@/lib/api/server/cookies";
import { jsonError, stripTokensFromSignInData } from "@/lib/api/server/http";
import { upstreamFetch } from "@/lib/api/server/upstream";
import type { ApiAccessTokens } from "@/lib/api/types";

type CompleteForgotPasswordBody = {
  token?: string;
  email?: string;
};

type ForgotPasswordSession = {
  access?: ApiAccessTokens;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CompleteForgotPasswordBody;
    const token = body.token?.trim();
    const email = body.email?.trim();

    if (!token) {
      return NextResponse.json(
        { status: false, message: "Reset token is required", data: null },
        { status: 400 },
      );
    }
    if (!email) {
      return NextResponse.json(
        { status: false, message: "Email is required", data: null },
        { status: 400 },
      );
    }

    const envelope = await upstreamFetch<ForgotPasswordSession>({
      method: "POST",
      path: `/v1/auth/forgot-password/${encodeURIComponent(token)}`,
      query: { platform: AUTH_PLATFORM },
      body: { email },
    });

    const access = envelope.data?.access;
    if (access?.token && access.refreshToken) {
      await setAuthCookies(access);
    }

    return NextResponse.json(
      {
        status: true,
        message: envelope.message,
        data: stripTokensFromSignInData(
          (envelope.data ?? {}) as unknown as Record<string, unknown>,
        ),
      },
      { status: 201 },
    );
  } catch (error) {
    return jsonError(error, 400);
  }
}
