# Code Standards

## General

- Keep components small and single-purpose — one component per file, one concern per file
- Fix root causes; do not layer conditional hacks or workarounds
- Do not mix data-fetching logic and rendering logic in the same component
- Prefer React Query hooks for server/API state when a backend exists
- Prefer explicit over implicit — name things clearly, avoid abbreviations in identifiers
- Delete dead code rather than commenting it out

## TypeScript

- Strict mode required throughout — `"strict": true` in `tsconfig.json`
- Avoid `any` — use explicit interfaces, discriminated unions, or `unknown` with narrowing
- All component props must be explicitly typed
- Export shared types from `types/` — do not duplicate types across files
- Prefer `type` over `interface` unless declaration merging is needed

## Next.js (App Router)

- Default to Server Components — add `"use client"` only when the component needs:
  - Browser event handlers
  - React state or effects
  - Browser APIs or Zustand store access
- Use `next/image` for all images — never raw `<img>` tags
- Use `next/link` for internal navigation — never raw `<a>` tags for in-app routes
- Use `loading.tsx` and `error.tsx` at route segments that depend on async data

## Styling

- Use CSS custom property tokens from `ui-context.md` — no hardcoded hex values
- Tailwind utility classes only — no inline `style={{}}` except for dynamic values from data
- Follow the border radius scale in `ui-context.md`
- No global CSS overrides to shadcn/ui — customise via `className` only
- Responsive design: mobile-first (`sm`, `md`, `lg`, `xl`)

## Components

- Presentational components receive all data via props
- Container components read from hooks or stores and pass data down
- Use `cn()` from `lib/utils.ts` for conditional class merging

## State Management

- Prefer local state and React Query; add Zustand only when global client state is justified
- One slice per domain if using Zustand; actions defined inside the store
- Do not store derived values — compute with selectors

## Forms (React Hook Form + Zod)

- Schemas defined with Zod and colocated with the form component
- Never manage form field values with `useState` for multi-field forms
- Validate on submit; show inline field-level errors

## File Organisation (planned)

```
app/
app/
  (auth)/          ← sign-in, onboarding (WebApp Figma)
  (app)/           ← authenticated WebApp routes
  globals.css      ← CSS custom property tokens

components/
  ui/              ← shadcn/ui primitives — do not modify
  layout/          ← shell, navbar, sidebar, page header
  [feature]/       ← one folder per feature area from Figma

lib/
  utils.ts
  constants.ts
  data/            ← mock fixtures (v1)
  hooks/           ← React Query hooks (when APIs exist)

store/             ← Zustand slices (if needed)
types/             ← shared TypeScript types
```

## Naming Conventions

- Components: PascalCase (`ComplianceDashboard`, `PolicyCard`)
- Hooks: camelCase with `use` prefix (`usePolicies`, `useAuthSession`)
- Store slices: camelCase with `Store` suffix (`useFiltersStore`)
- Utility functions: camelCase (`formatDate`, `slugify`)
- Files: PascalCase for components, kebab-case for utilities and stores
- CSS tokens: kebab-case with double dash (`--accent-primary`)

## Figma Implementation

- Match frame layout and spacing from Figma; do not improvise alternate layouts
- Name components after their Figma frame or section where practical
- When a frame is ambiguous, note it in the feature spec and `progress-tracker.md`
  before implementing
