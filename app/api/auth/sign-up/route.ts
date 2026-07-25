import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api/server/http";
import { upstreamFetch } from "@/lib/api/server/upstream";
import type { SignUpDto } from "@/lib/api/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignUpDto;
    if (!body?.email || !body?.password || !body?.firstName || !body?.lastName || !body?.countryCode) {
      return NextResponse.json(
        { status: false, message: "Missing required sign-up fields", data: null },
        { status: 400 },
      );
    }

    const envelope = await upstreamFetch({
      method: "POST",
      path: "/v1/auth/sign-up",
      body,
    });

    return NextResponse.json(envelope, { status: 201 });
  } catch (error) {
    return jsonError(error, 400);
  }
}
