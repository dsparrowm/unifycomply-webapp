import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  completeGoogleSignIn as apiCompleteGoogleSignIn,
  signInWithPassword as apiSignIn,
  signOut as apiSignOut,
  switchAccess as apiSwitchAccess,
  validateMfa as apiValidateMfa,
  type ClientSignInResult,
} from "@/lib/api/auth";
import { getRolesPermissions } from "@/lib/api/settings";
import type { ApiDomain, ApiUser, ApiUserAccess } from "@/lib/api/types";
import { normalizeTenantRole } from "@/lib/rbac/permissions";
import type { TenantRole } from "@/types/rbac";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  initials: string;
  firstName: string;
  lastName: string;
};

export type Tenant = {
  id: string;
  accessId: string;
  name: string;
  role: TenantRole;
  roleId: string;
  tenantId: string;
};

export type AuthStep =
  | "signed_out"
  | "pending_email"
  | "pending_mfa"
  | "pending_tenant"
  | "authenticated";

type AuthState = {
  authStep: AuthStep;
  user: AuthUser | null;
  tenant: Tenant | null;
  userAccess: ApiUserAccess[];
  domain: ApiDomain;
  pendingMfaUserId: string | null;
  /** @deprecated Prefer signInWithPassword — kept for transitional callers */
  signIn: (email: string) => void;
  register: (email: string) => void;
  verifyEmail: () => void;
  signInWithPassword: (email: string, password: string) => Promise<"mfa" | "tenant" | "authenticated">;
  completeGoogleSignIn: (intent: string) => Promise<"mfa" | "tenant" | "authenticated">;
  completeMfa: (code: string) => Promise<"tenant" | "authenticated">;
  selectTenant: (tenant: Tenant) => Promise<void>;
  selectAccess: (accessId: string) => Promise<void>;
  applySession: (session: ClientSignInResult, roleName?: string | null) => "mfa" | "tenant" | "authenticated";
  setDomain: (domain: ApiDomain) => void;
  signOut: () => Promise<void>;
};

function toAuthUser(user: ApiUser): AuthUser {
  const firstName = user.firstName ?? "";
  const lastName = user.lastName ?? "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  return {
    id: user.id,
    name: `${firstName} ${lastName}`.trim() || user.email,
    email: user.email,
    initials,
    firstName,
    lastName,
  };
}

function accessToTenant(access: ApiUserAccess, roleName?: string | null): Tenant {
  const role = normalizeTenantRole(roleName) ?? "compliance-officer";
  return {
    id: access.tenantId,
    accessId: access.id,
    name: access.tenantName,
    role,
    roleId: access.roleId,
    tenantId: access.tenantId,
  };
}

async function resolveRoleName(roleId: string | null | undefined): Promise<string | null> {
  if (!roleId) return null;
  try {
    const roles = await getRolesPermissions();
    return roles.find((role) => role.id === roleId)?.name ?? null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      authStep: "signed_out",
      user: null,
      tenant: null,
      userAccess: [],
      domain: "sandbox",
      pendingMfaUserId: null,

      signIn: (email) =>
        set({
          authStep: "pending_mfa",
          user: {
            id: "",
            name: email,
            email,
            initials: email.slice(0, 2).toUpperCase(),
            firstName: "",
            lastName: "",
          },
        }),

      register: (email) =>
        set({
          authStep: "pending_email",
          user: {
            id: "",
            name: email,
            email,
            initials: email.slice(0, 2).toUpperCase(),
            firstName: "",
            lastName: "",
          },
        }),

      verifyEmail: () =>
        set({
          authStep: "signed_out",
          pendingMfaUserId: null,
        }),

      applySession: (session, roleName) => {
        if (session.requiresMfa && session.userId) {
          set({
            authStep: "pending_mfa",
            pendingMfaUserId: session.userId,
            user: session.user ? toAuthUser(session.user) : get().user,
            userAccess: session.userAccess,
            domain: session.domain,
          });
          return "mfa";
        }

        const user = toAuthUser(session.user);
        const accesses = session.userAccess ?? [];

        if (accesses.length > 1 && !session.currentAccess) {
          set({
            authStep: "pending_tenant",
            user,
            userAccess: accesses,
            tenant: null,
            domain: session.domain,
            pendingMfaUserId: null,
          });
          return "tenant";
        }

        if (accesses.length > 1) {
          set({
            authStep: "pending_tenant",
            user,
            userAccess: accesses,
            tenant: session.currentAccess
              ? accessToTenant(session.currentAccess, roleName)
              : null,
            domain: session.domain,
            pendingMfaUserId: null,
          });
          return "tenant";
        }

        const current = session.currentAccess ?? accesses[0] ?? null;
        set({
          authStep: "authenticated",
          user,
          userAccess: accesses,
          tenant: current ? accessToTenant(current, roleName) : null,
          domain: session.domain,
          pendingMfaUserId: null,
        });
        return "authenticated";
      },

      signInWithPassword: async (email, password) => {
        const session = await apiSignIn({ email, password });
        const roleId = session.currentAccess?.roleId ?? session.userAccess[0]?.roleId;
        const roleName = await resolveRoleName(roleId);
        // If MFA not required and single tenant, still try profile role as fallback
        const next = get().applySession(session, roleName);
        if (next === "authenticated" && !get().tenant?.role) {
          // no-op; role already set via alias
        }
        // Single-access accounts: plan says skip tenant selection
        if (next === "tenant" && session.userAccess.length <= 1 && session.currentAccess) {
          const role = await resolveRoleName(session.currentAccess.roleId);
          set({
            authStep: "authenticated",
            tenant: accessToTenant(session.currentAccess, role ?? roleName),
            domain: session.domain,
          });
          return "authenticated";
        }
        return next;
      },

      completeGoogleSignIn: async (intent) => {
        const session = await apiCompleteGoogleSignIn(intent);
        const roleId = session.currentAccess?.roleId ?? session.userAccess[0]?.roleId;
        const roleName = await resolveRoleName(roleId);
        const next = get().applySession(session, roleName);
        if (next === "tenant" && session.userAccess.length <= 1 && session.currentAccess) {
          const role = await resolveRoleName(session.currentAccess.roleId);
          set({
            authStep: "authenticated",
            tenant: accessToTenant(session.currentAccess, role ?? roleName),
            domain: session.domain,
          });
          return "authenticated";
        }
        return next;
      },

      completeMfa: async (code) => {
        const userId = get().pendingMfaUserId ?? get().user?.id;
        if (!userId) {
          throw new Error("Missing MFA user context");
        }
        const session = await apiValidateMfa({ userId, token: code });
        const roleId = session.currentAccess?.roleId ?? session.userAccess[0]?.roleId;
        const roleName = await resolveRoleName(roleId);
        const next = get().applySession(session, roleName);
        if (next === "tenant" && session.userAccess.length <= 1 && session.currentAccess) {
          set({
            authStep: "authenticated",
            tenant: accessToTenant(session.currentAccess, roleName),
          });
          return "authenticated";
        }
        if (next === "mfa") {
          return "authenticated";
        }
        return next;
      },

      selectTenant: async (tenant) => {
        await get().selectAccess(tenant.accessId);
      },

      selectAccess: async (accessId) => {
        const session = await apiSwitchAccess({ accessId });
        const match =
          session.currentAccess ??
          session.userAccess.find((access) => access.id === accessId) ??
          null;
        const roleName = await resolveRoleName(match?.roleId);
        set({
          authStep: "authenticated",
          user: session.user ? toAuthUser(session.user) : get().user,
          userAccess: session.userAccess.length ? session.userAccess : get().userAccess,
          tenant: match ? accessToTenant(match, roleName) : get().tenant,
          domain: session.domain ?? get().domain,
          pendingMfaUserId: null,
        });
      },

      setDomain: (domain) => set({ domain }),

      signOut: async () => {
        try {
          await apiSignOut();
        } finally {
          set({
            authStep: "signed_out",
            user: null,
            tenant: null,
            userAccess: [],
            domain: "sandbox",
            pendingMfaUserId: null,
          });
        }
      },
    }),
    {
      name: "unifycomply-auth",
      // Avoid SSR crash: default localStorage access leaves `persist` undefined on the server.
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return window.localStorage;
      }),
      partialize: (state) => ({
        authStep: state.authStep,
        user: state.user,
        tenant: state.tenant,
        userAccess: state.userAccess,
        domain: state.domain,
        pendingMfaUserId: state.pendingMfaUserId,
      }),
    },
  ),
);

/** @deprecated Mock list retained for type-compatible imports during migration */
export const mockTenants: Tenant[] = [];
