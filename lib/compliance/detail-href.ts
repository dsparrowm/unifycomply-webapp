/** Build detail href from a queue row. Prefer customer id; attach workflowId for tab APIs. */
export function verificationDetailHref(
  kind: "kyc" | "kyb",
  record: { id: string; workflowId?: string },
): string {
  const base = `/${kind}/${encodeURIComponent(record.id)}`;
  if (record.workflowId && record.workflowId !== record.id) {
    return `${base}?workflowId=${encodeURIComponent(record.workflowId)}`;
  }
  return base;
}
