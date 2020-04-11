export type Vault = VaultEntry[];

export type VaultEntry = {
  account: string;
  digits: number;
  issuer: string;
  key: string;
  type: string;
};
