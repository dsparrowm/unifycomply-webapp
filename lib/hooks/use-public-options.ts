"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicOptionSet } from "@/lib/api/options";

type LabeledOption = { label: string; value: string };

/**
 * Use a public option set only when every server label already exists on the screen.
 * Extra or renamed labels stay on the hardcoded list.
 */
export function useMatchingOptions(key: string, current: LabeledOption[]) {
  const knownLabels = new Set(current.filter((option) => option.value).map((option) => option.label));
  const query = useQuery({
    queryKey: ["public-options", key],
    queryFn: () => getPublicOptionSet(key),
    staleTime: 60 * 60 * 1000,
  });

  const options = query.data?.options ?? [];
  const labelsMatch =
    options.length > 0 && options.every((option) => knownLabels.has(option.label));

  if (!labelsMatch) {
    return current;
  }

  const placeholder = current.find((option) => option.value === "");
  const matched = options.map((option) => ({ label: option.label, value: option.value }));
  return placeholder ? [placeholder, ...matched] : matched;
}
