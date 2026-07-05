# UI Context

Design tokens extracted from Figma WebApp frame `886:70409` (KYC list).

## Theme

Light mode. Enterprise compliance dashboard — white surfaces, light gray page background,
teal primary accent.

## Colors

All components use CSS custom properties from `app/globals.css`.

| Role | CSS Variable | Value |
| ---- | ------------ | ----- |
| Page background | `--bg-base` | `#F7F9FC` |
| Surface / Card | `--bg-surface` | `#FFFFFF` |
| Muted surface | `--bg-muted` | `#F7F9FC` |
| Primary text | `--text-primary` | `#101928` |
| Muted text | `--text-muted` | `#475367` |
| Light text | `--text-light` | `#667185` |
| Primary accent (teal) | `--accent-primary` | `#00454C` |
| Primary hover | `--accent-primary-hover` | `#007984` |
| Active nav background | `--accent-primary-soft` | `#EEFCFE` |
| Border default | `--border-default` | `#E4E7EC` |
| Border subtle | `--border-subtle` | `#F0F2F5` |
| Sandbox banner bg | `--sandbox-bg` | `#FFFCE6` |
| Sandbox banner border | `--sandbox-border` | `#CFB10B` |
| Sandbox banner text | `--sandbox-text` | `#443C1B` |
| Success | `--state-success` | `#16A34A` |
| Warning | `--state-warning` | `#F59E0B` |
| Error | `--state-error` | `#FF383C` |
| Info | `--state-info` | `#2563EB` |

### Auth card layout (register / verify-email)

| Role | CSS Variable | Value |
| ---- | ------------ | ----- |
| Heading | `--auth-heading` | `#111111` |
| Subtitle | `--auth-subtitle` | `#645D5D` |
| Label / legal links | `--auth-label` | `#344054` |
| Input border | `--auth-input-border` | `#D0D5DD` |
| Placeholder | `--auth-placeholder` | `#667085` |
| Footer text | `--auth-footer-text` | `#1D2739` |

Register primary button uses `--accent-primary-hover` (`#007984`) per Figma frame `886:48929`.

Sign-in split layout (`886:48672`) uses the same auth field tokens; primary button and links use `--accent-primary-hover`.

## Typography

| Role | Font | Tailwind |
| ---- | ---- | -------- |
| UI text | Onest (`next/font/google`) | `font-sans` |

### Type Scale

| Usage | Classes |
| ----- | ------- |
| Page title | `text-xl font-semibold` |
| Page subtitle | `text-sm text-[--text-muted]` |
| Section label (sidebar) | `text-xs uppercase` |
| Nav item | `text-sm` |
| Table header | `text-sm font-medium text-[--text-muted]` |
| Metric value | `text-3xl font-semibold` |
| Sandbox banner | `text-xs font-medium` |

## Layout

| Element | Value |
| ------- | ----- |
| Sidebar width | `293px` (`--sidebar-width`) |
| Header height | `72px` |
| Sandbox banner | `40px` when active |
| Page padding | `p-6` |
| Card radius | `rounded-xl` |
| Button / input radius | `rounded-lg` |
| Nav item radius | `rounded-lg` |

## App Shell

- **Sidebar** — logo, grouped nav with section headers and chevrons
- **Sandbox banner** — full-width yellow strip when environment is sandbox
- **Header** — search, Sandbox/Production toggle, user menu, primary CTA
- **Main** — scrollable content on `--bg-base`

## Buttons

| Variant | Style |
| ------- | ----- |
| Primary | `bg-[--accent-primary] text-white rounded-lg` |
| Secondary / filter | `border border-[--border-default] bg-white rounded-lg` |
| Ghost pagination | `text-[--text-muted] hover:bg-[--bg-muted]` |

## Icons

Lucide React. Inline `h-4 w-4`, nav `h-[18px] w-[18px]`.
