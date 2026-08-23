# Feature Spec: Auth / Onboarding UI

**Milestone:** M1  
**Figma section:** ONBOARDING (`886:48671`)  
**Status:** Implemented (live API via BFF)

## Routes

| Route | Frame reference | Purpose |
| ----- | --------------- | ------- |
| `/sign-in` | Sign In // 3 (`886:48672`) | Email/password sign-in, Google SSO, link to register |
| `/register` | Sign up // 3 (`886:48929`) | Registration (API: email, name, country, password) |
| `/forgot-password` | — | Request password reset email |
| `/reset-password` | — | Set new password after reset link |
| `/verify-email` | Sign up flow | Post-registration email confirmation |
| `/auth/google/callback` | — | Completes Google OAuth via session intent |
| `/mfa` | — | 6-digit authenticator verification when required |
| `/tenant-selection` | — | Choose workspace when user has multiple tenants |

## Layout patterns

1. **Split layout** (`AuthSplitLayout`) — sign-in, forgot/reset password, MFA, tenant selection, Google callback  
   - Left: brand panel with logo, headline, testimonial (`AuthBrandPanel`) — desktop (`lg+`) only  
   - Mobile: smaller dark logo top-left above the form (`AuthBrandPanel compact align="start"`); form column top-aligned  
   - Right: form content, max width 461px

2. **Card layout** (`AuthCardLayout`) — register, verify-email  
   - Centered card (461px), logo at top, bordered surface

## Live auth flow

```
sign-in (POST /api/auth/sign-in → upstream /v1/auth/sign-in?platform=app)
  → if MFA challenge (no tokens + requiresMfa/userId) → /mfa (POST /api/auth/mfa/validate)
  → if multiple userAccess → /tenant-selection (POST /api/auth/access/switch)
  → /overview

Google:
  GET /api/auth/google
    → redirect upstream /v1/auth/google/sign-in?redirectUrl={APP_URL|/origin}/auth/google/callback
  → Google + upstream callback
  → /auth/google/callback?intent=…
  → POST /api/auth/sign-in/intent → upstream /v1/auth/sign-in/intent?platform=app
  → MFA / tenant / overview (same as password sign-in)

register (POST /api/auth/sign-up) → /verify-email
  → resend: POST /api/auth/email/verify → upstream /v1/auth/email/verify
  → link: /verify-email?token=…&email=…
  → POST /api/auth/email/verify/complete → upstream /v1/auth/email/verify/{token}?platform=app
  → /sign-in

forgot-password (POST /api/auth/forgot-password)
  → email link → /reset-password?token=…&email=…
  → POST /api/auth/forgot-password/complete → upstream /v1/auth/forgot-password/{token}?platform=app
```

Settings → Security MFA:

```
enable: POST /api/v1/auth/mfa/setup → { keyUri, secret }
  → QR from keyUri (MfaQrCode) + copyable secret → PUT /api/v1/auth/mfa/enable { token }
disable: PUT /api/v1/auth/mfa/disable { token }
status: GET /api/v1/auth/mfa/status
```

When MFA is disabled and tokens are returned, skip `/mfa`. JWTs are stored only in
httpOnly cookies (`uc_access`, `uc_refresh`) by the BFF — never in Zustand.

State lives in `store/auth.store.ts` with `authStep`:  
`signed_out` | `pending_email` | `pending_mfa` | `pending_tenant` | `authenticated`

App routes are protected by `AppAuthGuard`. Auth routes use `AuthRedirectGuard`.

## Components

- `components/auth/AuthBrandPanel.tsx`
- `components/auth/AuthLayout.tsx` — split + card layouts
- `components/auth/AuthField.tsx`
- `components/auth/AuthButton.tsx` — primary/secondary, divider, Google button
- `components/auth/AuthRedirectGuard.tsx`
- `components/layout/AppAuthGuard.tsx`
- `app/api/auth/*` — BFF routes

## Out of scope

- Email delivery implementation (upstream)
- Active sessions / backup codes (no API)
- Fine-grained API permission gating (UI still uses `TenantRole` matrix; API permissions available for later)
- Upstream Google OAuth `redirect_uri` host configuration (must match the Core Platform Google app settings)
