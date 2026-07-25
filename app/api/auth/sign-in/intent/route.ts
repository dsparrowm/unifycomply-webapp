import { NextResponse } from "next/server";
import { AUTH_PLATFORM, getApiBaseUrl } from "@/lib/api/config";
import { ApiError } from "@/lib/api/errors";
import { extractMfaChallenge } from "@/lib/api/mfa-challenge";
import { setAuthCookies } from "@/lib/api/server/cookies";
import { jsonError, stripTokensFromSignInData } from "@/lib/api/server/http";
import type { ApiEnvelope, ApiSignInData } from "@/lib/api/types";

type IntentBody = {
  intent?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as IntentBody;
    const intent = body.intent?.trim();
    if (!intent) {
      return NextResponse.json(
        { status: false, message: "Intent is required", data: null },
        { status: 400 },
      );
    }

    const url = new URL(`${getApiBaseUrl()}/v1/auth/sign-in/intent`);
    url.searchParams.set("platform", AUTH_PLATFORM);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ intent }),
      cache: "no-store",
    });

    let envelope: ApiEnvelope<unknown>;
    try {
      envelope = (await response.json()) as ApiEnvelope<unknown>;
    } catch {
      throw new ApiError("Invalid response from API", response.status);
    }

    const challenge = extractMfaChallenge(envelope.data, envelope.message);
    if (challenge) {
      return NextResponse.json({
        status: true,
        message: envelope.message || "MFA required",
        data: {
          requiresMfa: true,
          userId: challenge.userId,
          user: challenge.user ?? null,
          userAccess: [],
          currentAccess: null,
          domain: "sandbox",
        },
      });
    }

    if (!response.ok || envelope.status === false) {
      throw new ApiError(
        typeof envelope.message === "string" ? envelope.message : "Google sign-in failed",
        response.status || 401,
        envelope,
      );
    }

    const data = envelope.data as ApiSignInData;
    if (data?.access?.token) {
      await setAuthCookies(data.access);
    }

    return NextResponse.json({
      status: true,
      message: envelope.message,
      data: stripTokensFromSignInData(data as unknown as Record<string, unknown>),
    });
  } catch (error) {
    return jsonError(error, 401);
  }
}
