import { Vault, VaultEntry } from '../../types';

export type Action = SetVaultAction | AddVaultEntryAction;

export type SetVaultAction = {
  type: 'SET_VAULT';
  vault: Vault;
};

export type AddVaultEntryAction = {
  type: 'ADD_VAULT_ENTRY';
  vaultEntry: VaultEntry;
};
