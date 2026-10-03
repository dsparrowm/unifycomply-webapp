# Compliance Rules — add document or country

**Milestone:** M1 settings, live on the app-scoped compliance rules API  
**Figma section:** Settings → Compliance Rules (`886:198352`) shows the dashed add buttons. **No add dialog frame. API-derived / no Figma.**  
**Status:** Done

Read `AGENTS.md` before changing this flow.

## API

`PUT /v1/tenants/apps/{appId}/compliance-rules` replaces the lists already shown on the screen:

| List | Accepted values |
| ---- | --------------- |
| `kycDocuments` | `id-document`, `proof-of-address`, `liveness-check` |
| `kybDocuments` | `certificate-of-incorporation`, `tax-identity`, `proof-of-business-address`, `directors-id` |
| `flaggedCountryCodes` | ISO 3166-1 alpha-2 strings, same shape `GET` returns (`"NG"`). OpenAPI marks each item as an array; that does not match the live payload. |

Labels come from `GET /v1/public/misc/options/{kyc-document-categories|kyb-document-categories|countries}`. Document pickers stay inside the PUT enums. Country names replace raw codes on the existing rows.

## UI

The dashed **Add document requirement** and **Add country** buttons stay where Figma placed them. Each opens a small dialog (same chrome as Create App): one select of values not already on that list, Cancel, and Add.

Add updates the list on screen and enables **Save Changes**. Save is still the write. The button disables when every allowed value is already listed, countries fail to load, or the role cannot `tenant-settings:update`.

## Out of scope

Free-text document names, file upload, and any document type outside the compliance-rules enums.
