import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api/server/http";
import { upstreamFetch } from "@/lib/api/server/upstream";
import type { AuthEmailVerifyDto } from "@/lib/api/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AuthEmailVerifyDto;
    const email = body?.email?.trim();
    if (!email) {
      return NextResponse.json(
        { status: false, message: "Email is required", data: null },
        { status: 400 },
      );
    }

    const envelope = await upstreamFetch({
      method: "POST",
      path: "/v1/auth/email/verify",
      body: { email },
    });

    return NextResponse.json(envelope, { status: 201 });
  } catch (error) {
    return jsonError(error, 400);
  }
}
