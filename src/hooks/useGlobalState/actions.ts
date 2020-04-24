import { Vault, VaultEntry } from '../../types';

export type Action =
  | InitializeVaultAction
  | SetVaultEntriesAction
  | AddVaultEntryAction
  | ClearVaultEntriesAction
  | ToggleConcealTokensAction;

export type InitializeVaultAction = {
  type: 'INITIALIZE_VAULT';
  password: string;
  vault: Vault;
};

export type SetVaultEntriesAction = {
  type: 'SET_VAULT_ENTRIES';
  vaultEntries: VaultEntry[];
};

export type AddVaultEntryAction = {
  type: 'ADD_VAULT_ENTRY';
  vaultEntry: VaultEntry;
};

export type ClearVaultEntriesAction = {
  type: 'CLEAR_VAULT_ENTRIES';
};

export type ToggleConcealTokensAction = {
  type: 'TOGGLE_CONCEAL_TOKENS';
};
