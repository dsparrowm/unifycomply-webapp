import type { SettingsProfile, SettingsSelectOption } from "@/types/settings";

export const settingsProfileData: SettingsProfile = {
  firstName: "Ayomikun",
  lastName: "Alimi",
  email: "ayomikunalimi@gmail.com",
  phone: "+23470123456789",
  role: "Senior Compliance Officer",
  department: "Risk & Compliance",
  timezone: "Africa/Lagos",
  language: "en",
  initials: "AA",
  displayName: "Alimi Ayomikun",
};

export const timezoneOptions: SettingsSelectOption[] = [
  { label: "Africa/Lagos (WAT)", value: "Africa/Lagos" },
  { label: "UTC", value: "UTC" },
  { label: "Europe/London (GMT)", value: "Europe/London" },
  { label: "America/New_York (EST)", value: "America/New_York" },
];

export const languageOptions: SettingsSelectOption[] = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "Portuguese", value: "pt" },
];
