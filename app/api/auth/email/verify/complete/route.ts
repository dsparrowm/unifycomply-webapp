import { NextResponse } from "next/server";
import { AUTH_PLATFORM } from "@/lib/api/config";
import { jsonError } from "@/lib/api/server/http";
import { upstreamFetch } from "@/lib/api/server/upstream";

type CompleteEmailVerifyBody = {
  token?: string;
  email?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CompleteEmailVerifyBody;
    const token = body.token?.trim();
    const email = body.email?.trim();

    if (!token) {
      return NextResponse.json(
        { status: false, message: "Verification token is required", data: null },
        { status: 400 },
      );
    }
    if (!email) {
      return NextResponse.json(
        { status: false, message: "Email is required", data: null },
        { status: 400 },
      );
    }

    const envelope = await upstreamFetch({
      method: "POST",
      path: `/v1/auth/email/verify/${encodeURIComponent(token)}`,
      query: { platform: AUTH_PLATFORM },
      body: { email },
    });

    return NextResponse.json(envelope, { status: 201 });
  } catch (error) {
    return jsonError(error, 400);
  }
}
