export function isLiveCustomerId(id: string): boolean {
  return !id.startsWith("kyc-record-") && !id.startsWith("kyb-record-") && id.length >= 16;
}

export function customerAppId(customer: unknown): string | undefined {
  if (!customer || typeof customer !== "object") {
    return undefined;
  }
  const value = (customer as { appId?: unknown }).appId;
  return typeof value === "string" && value ? value : undefined;
}

export function customerCountryCode(customer: unknown): string {
  if (!customer || typeof customer !== "object") {
    return "NG";
  }
  const record = customer as { countryCode?: unknown; address?: { countryCode?: unknown } };
  if (typeof record.countryCode === "string" && record.countryCode) {
    return record.countryCode;
  }
  if (typeof record.address?.countryCode === "string" && record.address.countryCode) {
    return record.address.countryCode;
  }
  return "NG";
}
