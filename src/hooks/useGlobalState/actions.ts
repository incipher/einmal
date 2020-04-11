import { Vault, VaultEntry } from '../../types';

export type Action = SetVaultAction | AddVaultEntryAction | ClearVaultAction;

export type SetVaultAction = {
  type: 'SET_VAULT';
  vault: Vault;
};

export type AddVaultEntryAction = {
  type: 'ADD_VAULT_ENTRY';
  vaultEntry: VaultEntry;
};

export type ClearVaultAction = {
  type: 'CLEAR_VAULT';
};
