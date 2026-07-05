# Feature Spec: Auth / Onboarding UI

**Milestone:** M1  
**Figma section:** ONBOARDING (`886:48671`)  
**Status:** Implemented (mock auth)

## Routes

| Route | Frame reference | Purpose |
| ----- | --------------- | ------- |
| `/sign-in` | Sign In // 3 (`886:48672`) | Email/password sign-in, Google SSO, link to register |
| `/register` | Sign up // 3 (`886:48929`) | Work email registration, Google SSO, terms |
| `/forgot-password` | — | Request password reset email |
| `/reset-password` | — | Set new password after reset link |
| `/verify-email` | Sign up flow | Post-registration email confirmation |
| `/mfa` | — | 6-digit authenticator verification |
| `/tenant-selection` | — | Choose workspace when user has multiple tenants |

## Layout patterns

1. **Split layout** (`AuthSplitLayout`) — sign-in, forgot/reset password, MFA, tenant selection  
   - Left: brand panel with logo, headline, testimonial (`AuthBrandPanel`)  
   - Right: form content, max width 461px

2. **Card layout** (`AuthCardLayout`) — register, verify-email  
   - Centered card (461px), logo at top, bordered surface

## Mock auth flow

```
sign-in → MFA → tenant-selection (if >1 tenant) → /overview
register → verify-email → MFA → tenant-selection → /overview
```

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

## Out of scope (M1)

- Real API integration
- OAuth with Google
- Email delivery
- Session tokens / refresh
