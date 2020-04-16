import { Vault, VaultEntry } from '../../types';

export type Action =
  | SetVaultAction
  | AddVaultEntryAction
  | ClearVaultAction
  | ToggleConcealTokensAction;

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
