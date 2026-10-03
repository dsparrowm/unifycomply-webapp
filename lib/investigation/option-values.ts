import type { ApiPublicOption } from "@/lib/api/types";

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Keep the words already on the screen. Send the registry `value` when it
 * matches that label or the existing slug. Unknown extra options stay off the screen.
 */
export function resolveOptionValue(
  options: ApiPublicOption[] | undefined,
  screenLabel: string,
  fallback: string,
): string {
  if (!options?.length) {
    return fallback;
  }
  const byValue = options.find((option) => option.value === fallback);
  if (byValue) {
    return byValue.value;
  }
  const labelNeedle = normalize(screenLabel);
  const byLabel = options.find(
    (option) => normalize(option.label) === labelNeedle || normalize(option.value) === labelNeedle,
  );
  if (byLabel) {
    return byLabel.value;
  }
  const fallbackNeedle = normalize(fallback);
  const byFallback = options.find(
    (option) => normalize(option.value) === fallbackNeedle || normalize(option.label) === fallbackNeedle,
  );
  return byFallback?.value ?? fallback;
}
