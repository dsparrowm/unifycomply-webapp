import { NextResponse } from "next/server";
import { AUTH_PLATFORM, getApiBaseUrl } from "@/lib/api/config";
import { ApiError } from "@/lib/api/errors";
import { extractMfaChallenge } from "@/lib/api/mfa-challenge";
import { setAuthCookies } from "@/lib/api/server/cookies";
import { jsonError, stripTokensFromSignInData } from "@/lib/api/server/http";
import type { ApiEnvelope, ApiSignInData, SignInDto } from "@/lib/api/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignInDto;
    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { status: false, message: "Email and password are required", data: null },
        { status: 400 },
      );
    }

    const url = new URL(`${getApiBaseUrl()}/v1/auth/sign-in`);
    url.searchParams.set("platform", AUTH_PLATFORM);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email.trim(),
        password: body.password,
      }),
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
        typeof envelope.message === "string" ? envelope.message : "Sign in failed",
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
