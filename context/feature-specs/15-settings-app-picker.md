# Feature Spec: Settings app picker

**Milestone:** M2  
**Figma section:** None — **API-derived / no Figma**  
**Status:** Done (initial)

Read `AGENTS.md` and `09-m2-api-ui-flow-gap.md` before changing this flow.

## Purpose

Core Platform deprecated tenant-wide copies of API keys, risk factors, risk
score, PEP, notifications, webhooks, and compliance rules. Those resources now
live on `GET/PUT /v1/tenants/apps/{appId}/…`.

Settings Figma is still one tenant-wide page. Product asked for an **App**
picker on Settings so officers choose which app those screens edit.

## UI

- Picker sits on the Settings **title row** (right of “Settings”), on every
  settings route. Figma has no picker; do not add a second header block.
- Label: **App** (inline). Helper copy is `sr-only`. Native select uses
  settings field tokens. **Create App** opens a small modal (name required,
  description optional) matching Invite Team Member chrome.
- Empty tenant: app-scoped pages show **No apps yet** + Create App. Tenant-only
  pages (profile, business, teams, roles, security, audit logs) stay available.

## App-scoped routes

These wait for a selected app and call `/v1/tenants/apps/{appId}/…`:

- `/settings/api-keys`
- `/settings/approvals`
- `/settings/pep-settings`
- `/settings/notification`
- `/settings/compliance-rules`

Selected `appId` is persisted per tenant in localStorage (not cookies / JWTs).

## Out of scope

- Full tenant-app CRUD (rename, disable, key scopes)
- Wiring lookup **Select app** dropdowns to live apps
- Shareholder create
- Multi-key `/v1/tenants/apps/{appId}/keys` UI — keep the existing public/secret
  pair via `…/api-key`
