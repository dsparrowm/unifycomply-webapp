export const APP_SCOPED_SETTINGS_PATHS = [
  "/settings/api-keys",
  "/settings/approvals",
  "/settings/pep-settings",
  "/settings/notification",
  "/settings/compliance-rules",
] as const;

export function isAppScopedSettingsPath(pathname: string): boolean {
  return APP_SCOPED_SETTINGS_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
