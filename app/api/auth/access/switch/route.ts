import { setAuthCookies } from "@/lib/api/server/cookies";
import { jsonError, stripTokensFromSignInData } from "@/lib/api/server/http";
import { upstreamFetch } from "@/lib/api/server/upstream";
import type { AccessSwitchDto, ApiSignInData } from "@/lib/api/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AccessSwitchDto;
    if (!body?.accessId) {
      return Response.json(
        { status: false, message: "accessId is required", data: null },
        { status: 400 },
      );
    }

    const envelope = await upstreamFetch<ApiSignInData | { access: ApiSignInData["access"] }>({
      method: "POST",
      path: "/v1/auth/access/switch",
      auth: true,
      body,
    });

    const data = envelope.data as Partial<ApiSignInData> & {
      access?: ApiSignInData["access"];
    };

    if (data?.access?.token) {
      await setAuthCookies(data.access);
    }

    return Response.json({
      status: true,
      message: envelope.message,
      data: stripTokensFromSignInData(data as unknown as Record<string, unknown>),
    });
  } catch (error) {
    return jsonError(error, 401);
  }
}
