import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TenantRole } from "@/types/rbac";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  initials: string;
};

export type Tenant = {
  id: string;
  name: string;
  role: TenantRole;
};

export type AuthStep = "signed_out" | "pending_email" | "pending_mfa" | "pending_tenant" | "authenticated";

type AuthState = {
  authStep: AuthStep;
  user: AuthUser | null;
  tenant: Tenant | null;
  signIn: (email: string) => void;
  register: (email: string) => void;
  verifyEmail: () => void;
  completeMfa: () => void;
  selectTenant: (tenant: Tenant) => void;
  signOut: () => void;
};

const mockTenants: Tenant[] = [
  { id: "tenant-1", name: "Hyperpels Tech", role: "compliance-officer" },
  { id: "tenant-2", name: "Rokswood Financial", role: "compliance-manager" },
  { id: "tenant-3", name: "Acme Corp", role: "admin" },
  { id: "tenant-4", name: "DevOps Labs", role: "developer" },
];

const defaultUser: AuthUser = {
  id: "user-1",
  name: "Alimi Ayomikun",
  email: "Ayomikunalimi@hyperpels.com",
  initials: "AA",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authStep: "signed_out",
      user: null,
      tenant: null,
      signIn: (email) =>
        set({
          authStep: "pending_mfa",
          user: {
            ...defaultUser,
            email,
          },
        }),
      register: (email) =>
        set({
          authStep: "pending_email",
          user: {
            ...defaultUser,
            email,
          },
        }),
      verifyEmail: () => set({ authStep: "pending_mfa" }),
      completeMfa: () =>
        set((state) => {
          if (mockTenants.length > 1) {
            return { authStep: "pending_tenant" };
          }
          return {
            authStep: "authenticated",
            tenant: state.tenant ?? mockTenants[0],
          };
        }),
      selectTenant: (tenant) => set({ tenant, authStep: "authenticated" }),
      signOut: () =>
        set({
          authStep: "signed_out",
          user: null,
          tenant: null,
        }),
    }),
    { name: "unifycomply-auth" },
  ),
);

export { mockTenants };
