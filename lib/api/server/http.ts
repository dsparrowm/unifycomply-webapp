import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";

export function jsonOk<T>(data: T, message = "OK", init?: ResponseInit) {
  return NextResponse.json({ status: true, message, data }, init);
}

export function jsonError(error: unknown, fallbackStatus = 500) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        status: false,
        message: error.message,
        data: null,
      },
      { status: error.status || fallbackStatus },
    );
  }

  const message = error instanceof Error ? error.message : "Internal server error";
  return NextResponse.json(
    {
      status: false,
      message,
      data: null,
    },
    { status: fallbackStatus },
  );
}

export function stripTokensFromSignInData<T extends Record<string, unknown>>(data: T) {
  if (!data || typeof data !== "object") {
    return data;
  }

  const { access, ...rest } = data as T & { access?: unknown };
  if (!access || typeof access !== "object") {
    return rest as Omit<T, "access"> & { domain?: unknown };
  }

  const domain =
    "domain" in access ? (access as { domain?: unknown }).domain : undefined;

  return {
    ...rest,
    domain,
  };
}
