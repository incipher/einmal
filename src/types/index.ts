/* React Native */

// SectionList

export type Section<T> = {
  title: string;
  data: T[];
};

export type Sections<T> = Section<T>[];

/* Global State */

// Vault

export type Vault = VaultEntry[];

export type VaultEntry = {
  account: string;
  digits: number;
  issuer: string;
  secret: string;
  type: string;
};

// Settings

export type Settings = {
  concealTokens: boolean;
};
