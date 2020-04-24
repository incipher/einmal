/* React Native */

// SectionList

export type Section<T> = {
  title: string;
  data: T[];
};

export type Sections<T> = Section<T>[];

/* Global State */

// Vault

export type Vault = {
  entries: VaultEntry[];
};

export type PersistedVault = {
  encryption: VaultEncryption;
  entries: string;
};

export type VaultEncryption = {
  salt: string;
  nonce: string;
};

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
