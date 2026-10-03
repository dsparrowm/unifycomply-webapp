export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof ApiError) {
    return error.message || fallback;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

/** `data.code` on a Core Platform error envelope, when the body includes one. */
export function apiErrorCode(error: unknown): string | undefined {
  if (!(error instanceof ApiError) || !error.body || typeof error.body !== "object") {
    return undefined;
  }
  const record = error.body as Record<string, unknown>;
  const data = record.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const code = (data as Record<string, unknown>).code;
    if (typeof code === "string" && code) {
      return code;
    }
  }
  return typeof record.code === "string" && record.code ? record.code : undefined;
}

export function decisionErrorMessage(error: unknown, fallback: string): string {
  if (apiErrorCode(error) === "escalation-required") {
    return "Escalate this case before it can be approved.";
  }
  return getErrorMessage(error, fallback);
}
