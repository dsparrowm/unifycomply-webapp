# UNIFYCOMPLY Product Go-Live Checklist (Frontend)

Source: `UNIFYCOMPLY Product Go-Live Checklist.docx` — **frontend scope only**.

Frontend readiness checklist aligned to the five milestones. Use alongside
`mvp-roadmap.md` and `progress-tracker.md`.

## Deployment Approach

```
Development Environment
    ↓
Internal QA & UAT
    ↓
Client Review
    ↓
Client Infrastructure Deployment
    ↓
Production Go-Live
```

**Objective:** Every UI feature is completed, tested, and approved before production
deployment of the frontend.

---

## Phase 1 — Development Complete

### Milestone 1 — Foundation

- [x] UI design system completed
- [x] Authentication pages completed
- [x] Dashboard framework completed (sidebar, header, nav)
- [x] User management screens completed
- [x] Tenant management screens completed
- [x] Responsive layouts completed
- [x] Loading and error states completed
- [x] RBAC-aware navigation implemented

### Milestone 2 — KYC Orchestration

- [x] Customer onboarding wizard completed
- [ ] Business onboarding screens completed
- [x] Document upload UI completed (onboarding wizard)
- [x] Verification dashboard completed (KYC/KYB detail)
- [ ] Compliance queue — not a separate Figma screen; use KYC/KYB list status filters
- [x] Risk score visualization completed
- [x] Bank analysis list screen completed (`/bank-analysis`)
- [ ] AML screening screens completed (placeholder at `/aml-screening`; list UI pending)

### Milestone 3 — Transaction Monitoring

- [ ] Monitoring dashboard completed
- [ ] Alert management completed
- [ ] Transaction explorer completed
- [ ] Rule management completed
- [ ] Analytics views completed

### Milestone 4 — SAR & Case Management

- [ ] Case dashboard completed
- [ ] Investigation workspace completed
- [ ] Evidence upload UI completed
- [ ] SAR editor completed
- [ ] AI review workflow UI completed
- [ ] Reporting dashboard completed

### Milestone 5 — Optimisation

- [ ] Performance optimized (lazy loading, code splitting)
- [ ] Accessibility verified
- [ ] Cross-browser testing completed
- [ ] Responsive testing completed
- [ ] Error pages completed (404, 500)
- [x] Production build verified (`pnpm run build` passes)

---

## Phase 2 — Internal Quality Assurance

### Functional Testing

- [ ] Every user story tested in the UI
- [ ] Every workflow tested end to end with mock or live data
- [ ] Regression testing completed
- [ ] UI testing completed

### UI Integration Testing

- [ ] Auth flows (login, MFA, password reset, tenant selection)
- [ ] File upload UI
- [ ] Form validation on all multi-step flows
- [ ] Navigation and deep links
- [ ] Empty, loading, and error states

### Security Testing (frontend)

- [ ] Auth UI flows tested
- [ ] RBAC navigation gating verified
- [ ] XSS prevention (no unsafe HTML rendering)
- [ ] Sensitive data not exposed in client storage

### Performance Testing (frontend)

- [ ] Lighthouse / Core Web Vitals acceptable
- [ ] Large table and list rendering acceptable
- [ ] Production bundle size reviewed

---

## Phase 3 — Internal User Acceptance Testing (Rokxier)

### Product Review

- [ ] Product Owner approval
- [ ] UX review completed (Figma parity)
- [ ] Technical Lead approval
- [ ] Security review completed (client-side)

### Documentation Review

- [ ] User Manual
- [ ] Admin Guide
- [ ] Frontend deployment guide

### Internal Sign-Off

| Department | Status |
| ---------- | ------ |
| Product | ☐ |
| Engineering | ☐ |
| QA | ☐ |
| Security | ☐ |
| Management | ☐ |

---

## Phase 4 — Client Demonstration & Acceptance

### Client Demonstration

- [ ] Full UI walkthrough completed
- [ ] All milestone screens demonstrated
- [ ] Client feedback documented
- [ ] Issues logged
- [ ] Change requests documented

### Client Acceptance Testing

- [ ] Functional approval
- [ ] UI approval (Figma match)
- [ ] Performance approval
- [ ] Workflow approval

### Client Sign-Off

| Approval | Status |
| -------- | ------ |
| Product Owner | ☐ |
| Technical Lead | ☐ |
| Compliance Lead | ☐ |
| Executive Sponsor | ☐ |

---

## Phase 5 — Production Deployment (Frontend)

- [ ] Production build artifact created
- [ ] Environment variables configured (`NEXT_PUBLIC_*`)
- [ ] Frontend deployed to client hosting
- [ ] SSL / HTTPS verified
- [ ] Domain and DNS configured
- [ ] Health check / smoke test on deployed URL

---

## Phase 6 — Go-Live Validation (UI Smoke Test)

- [ ] Login / Register
- [ ] Tenant selection
- [ ] User management screens
- [ ] Customer onboarding wizard
- [ ] Document upload
- [ ] KYC / KYB dashboards
- [ ] AML screening screens
- [ ] Risk score display
- [ ] Transaction monitoring dashboard
- [ ] Case creation UI
- [ ] SAR editor
- [ ] Report downloads
- [ ] Settings and profile

---

## Phase 7 — Project Closure (Frontend Handover)

- [ ] Source code
- [ ] Frontend deployment documentation
- [ ] User guide
- [ ] Administrator guide
- [ ] Environment variable documentation

### Final Go-Live Approval (frontend-relevant)

| Role | Responsibility | Status |
| ---- | -------------- | ------ |
| Product Manager | Functional Approval | ☐ |
| Frontend Lead | Frontend Readiness | ☐ |
| QA Lead | Testing Approval | ☐ |
| Client Product Owner | Business Acceptance | ☐ |
| Executive Sponsor | Final Go-Live Approval | ☐ |

---

## Deployment Flow Summary

```
Development
        ↓
Frontend feature completion (Milestones 1–5)
        ↓
Internal QA & UI testing
        ↓
Internal UAT & sign-off
        ↓
Client demonstration & acceptance
        ↓
Frontend production deployment
        ↓
UI smoke testing
        ↓
Go-live approval
        ↓
Production release
```
