export type VerificationCheckOption = {
  type: string;
  label: string;
  authority: string | null;
  providers: Array<{ value: string; label: string }>;
};

export type StartVerificationSelection = {
  type: string;
  providerKey: string;
};
