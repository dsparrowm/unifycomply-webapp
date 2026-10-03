"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAuthUser } from "@/lib/api/auth";
import { getTeams } from "@/lib/api/settings";
import { assignVerification } from "@/lib/api/verifications";
import { useSettingsAppSelection } from "@/lib/hooks/use-tenant-apps";

export type AssigneeOption = {
  value: string;
  label: string;
};

export function useAssignableOfficers() {
  return useQuery({
    queryKey: ["settings", "assignable-officers"],
    queryFn: async (): Promise<AssigneeOption[]> => {
      const [teams, user] = await Promise.all([
        getTeams().catch(() => []),
        fetchAuthUser().catch(() => null),
      ]);
      const options: AssigneeOption[] = teams
        .filter((member) => Boolean(member.userId))
        .map((member) => ({
          value: member.userId as string,
          label: member.fullName || member.name || member.email,
        }));
      if (user && !options.some((option) => option.value === user.id)) {
        const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
        options.unshift({ value: user.id, label: name || user.email });
      }
      return [{ value: "", label: "Unassigned" }, ...options];
    },
    staleTime: 60 * 1000,
  });
}

export function useAssignVerification() {
  const { selectedAppId } = useSettingsAppSelection();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workflowId, userId }: { workflowId: string; userId: string | null }) =>
      assignVerification(workflowId, userId, selectedAppId ?? undefined),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["verifications"] });
      await queryClient.invalidateQueries({ queryKey: ["customers", "kyc", "queue"] });
      await queryClient.invalidateQueries({ queryKey: ["customers", "kyb", "queue"] });
    },
  });
}
