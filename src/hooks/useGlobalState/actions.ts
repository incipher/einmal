import { Vault, VaultEntry } from '../../types';

export type Action =
  | InitializeVaultAction
  | SetVaultAction
  | AddVaultEntryAction
  | ClearVaultAction
  | ToggleConcealTokensAction;

export type InitializeVaultAction = {
  type: 'INITIALIZE_VAULT';
  key: string;
  vault: Vault;
};

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

export type ToggleConcealTokensAction = {
  type: 'TOGGLE_CONCEAL_TOKENS';
};
