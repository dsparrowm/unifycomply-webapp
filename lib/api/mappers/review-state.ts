function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/** The queue row carries a `resubmission` object while a send-back is open. */
export function hasResubmission(record: Record<string, unknown>): boolean {
  return isRecord(record.resubmission);
}

export function recordHasResubmission(value: unknown): boolean {
  return isRecord(value) && hasResubmission(value);
}

/**
 * Approve sets `nextReviewAt`. A null clock is "no review scheduled".
 * Do not invent the date from `createdAt`.
 */
export function formatNextReview(record: Record<string, unknown>): string | undefined {
  if (!Object.prototype.hasOwnProperty.call(record, "nextReviewAt")) {
    return undefined;
  }
  const value = record.nextReviewAt;
  if (value === null || value === "") {
    return "no review scheduled";
  }
  const iso = asString(value);
  if (!iso) {
    return "no review scheduled";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "no review scheduled";
  }
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function assignedToIdFrom(record: Record<string, unknown>): string | null {
  if (isRecord(record.assignedTo)) {
    return asString(record.assignedTo.id) ?? null;
  }
  return asString(record.assignedToId) ?? asString(record.assigneeId) ?? null;
}
