import { NextResponse } from "next/server";
import { AUTH_PLATFORM } from "@/lib/api/config";
import { jsonError } from "@/lib/api/server/http";
import { upstreamFetch } from "@/lib/api/server/upstream";

type CompleteForgotPasswordBody = {
  token?: string;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CompleteForgotPasswordBody;
    const token = body.token?.trim();
    const email = body.email?.trim();
    const password = body.password;

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
    if (!password || password.length < 8) {
      return NextResponse.json(
        { status: false, message: "Password must be at least 8 characters", data: null },
        { status: 400 },
      );
    }

    // Upstream OpenAPI references AuthEmailVerifyDto (email only); real completion
    // needs the new password — send both.
    const envelope = await upstreamFetch({
      method: "POST",
      path: `/v1/auth/forgot-password/${encodeURIComponent(token)}`,
      query: { platform: AUTH_PLATFORM },
      body: { email, password },
    });

    return NextResponse.json(envelope, { status: 201 });
  } catch (error) {
    return jsonError(error, 400);
  }
}
