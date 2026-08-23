import type { ApiCustomerAddress, ApiCustomerLifecycleStatus } from "@/lib/api/types";
import type { KycPriority, KycVerificationStatus } from "@/types/kyc";

const COUNTRY_NAMES: Record<string, string> = {
  NG: "Nigeria",
  GH: "Ghana",
  KE: "Kenya",
  ZA: "South Africa",
  GB: "United Kingdom",
  US: "United States",
};

const COUNTRY_DIAL: Record<string, string> = {
  NG: "234",
  GH: "233",
  KE: "254",
  ZA: "27",
  GB: "44",
  US: "1",
};

export function countryNameFromCode(code?: string | null): string {
  if (!code) return "—";
  const upper = code.toUpperCase();
  return COUNTRY_NAMES[upper] ?? code;
}

export function countryCodeFromSlug(slug: string): string {
  const trimmed = slug.trim();
  if (trimmed.length === 2) return trimmed.toUpperCase();
  const match = Object.entries(COUNTRY_NAMES).find(([, name]) => name.toLowerCase() === trimmed.toLowerCase());
  return match?.[0] ?? trimmed.slice(0, 2).toUpperCase();
}

export function formatAddress(address?: ApiCustomerAddress | null): string {
  if (!address) return "—";
  if (address.formatted?.trim()) return address.formatted.trim();
  return (
    [address.houseNo, address.street, address.city, address.state, address.zipCode, address.country]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(", ") || "—"
  );
}

export function formatTimeInQueue(from?: string | null): string {
  if (!from) return "—";
  const start = Date.parse(from);
  if (Number.isNaN(start)) return "—";
  const minutes = Math.max(0, Math.floor((Date.now() - start) / 60000));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
}

export function mapLifecycleStatus(status?: ApiCustomerLifecycleStatus | null): KycVerificationStatus {
  switch (status) {
    case "onboarded":
      return "approved";
    case "review":
      return "in-review";
    case "blocked":
    case "offboarded":
      return "rejected";
    default:
      return "pending";
  }
}

export function priorityFromRisk(score?: number | null): KycPriority {
  const value = score ?? 0;
  if (value >= 4) return "critical";
  if (value >= 3) return "high";
  if (value >= 2) return "medium";
  return "low";
}

export function shortCustomerRef(prefix: string, id: string): string {
  return `${prefix}-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function buildCustomerAddress(input: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  countryCode?: string;
}): ApiCustomerAddress {
  const countryCode = input.countryCode?.toUpperCase();
  return {
    street: input.street?.trim() || undefined,
    city: input.city?.trim() || undefined,
    state: input.state?.trim() || undefined,
    zipCode: input.zipCode?.trim() || undefined,
    countryCode,
    country: countryNameFromCode(countryCode),
  };
}

export function toE164(phone: string, countryCode: string): string {
  const digits = phone.replace(/\D/g, "");
  if (phone.trim().startsWith("+")) return `+${digits}`;
  const dial = COUNTRY_DIAL[countryCode.toUpperCase()] ?? "";
  const local = digits.replace(new RegExp(`^0+`), "").replace(new RegExp(`^${dial}`), "");
  return dial ? `+${dial}${local}` : `+${digits}`;
}

export async function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
