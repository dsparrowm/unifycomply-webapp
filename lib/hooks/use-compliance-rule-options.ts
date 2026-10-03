"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPublicOptionSet } from "@/lib/api/options";
import type { ApiPublicOption } from "@/lib/api/types";
import {
  KYB_DOCUMENT_REQUIREMENTS,
  KYC_DOCUMENT_REQUIREMENTS,
  type ComplianceRuleOption,
} from "@/lib/constants/compliance-rule-options";

const KYC_ALLOWED = new Set<string>(KYC_DOCUMENT_REQUIREMENTS.map((option) => option.value));
const KYB_ALLOWED = new Set<string>(KYB_DOCUMENT_REQUIREMENTS.map((option) => option.value));

function useOptionSet(key: string) {
  return useQuery({
    queryKey: ["public-options", key],
    queryFn: () => getPublicOptionSet(key),
    staleTime: 60 * 60 * 1000,
  });
}

function allowedOptions(
  loaded: ApiPublicOption[] | undefined,
  fallback: readonly ComplianceRuleOption[],
  allowed: Set<string>,
): ComplianceRuleOption[] {
  const fromApi = (loaded ?? [])
    .filter((option) => allowed.has(option.value))
    .map((option) => ({ label: option.label, value: option.value }));

  return fromApi.length > 0 ? fromApi : [...fallback];
}

export function useComplianceRuleOptions() {
  const kycQuery = useOptionSet("kyc-document-categories");
  const kybQuery = useOptionSet("kyb-document-categories");
  const countriesQuery = useOptionSet("countries");

  const kycDocuments = useMemo(
    () => allowedOptions(kycQuery.data?.options, KYC_DOCUMENT_REQUIREMENTS, KYC_ALLOWED),
    [kycQuery.data?.options],
  );
  const kybDocuments = useMemo(
    () => allowedOptions(kybQuery.data?.options, KYB_DOCUMENT_REQUIREMENTS, KYB_ALLOWED),
    [kybQuery.data?.options],
  );
  const countries = useMemo(
    () =>
      (countriesQuery.data?.options ?? []).map((option) => ({
        label: option.label,
        value: option.value,
      })),
    [countriesQuery.data?.options],
  );

  return {
    kycDocuments,
    kybDocuments,
    countries,
    countriesLoading: countriesQuery.isLoading,
    countriesError: countriesQuery.isError,
  };
}
