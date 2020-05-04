import {
  Action,
  InitializeVaultAction,
  SetVaultEntriesAction,
  AddVaultEntryAction,
  ClearVaultEntriesAction,
  ToggleBiometricUnlockAction,
  ToggleConcealTokensAction,
} from './actions';

export const isInitializeVaultAction = (
  action: Action,
): action is InitializeVaultAction => {
  return action.type === 'INITIALIZE_VAULT';
};

export const isSetVaultEntriesAction = (
  action: Action,
): action is SetVaultEntriesAction => {
  return action.type === 'SET_VAULT_ENTRIES';
};

export const isAddVaultEntryAction = (
  action: Action,
): action is AddVaultEntryAction => {
  return action.type === 'ADD_VAULT_ENTRY';
};

export const isClearVaultEntriesAction = (
  action: Action,
): action is ClearVaultEntriesAction => {
  return action.type === 'CLEAR_VAULT_ENTRIES';
};

export const isToggleBiometricUnlockAction = (
  action: Action,
): action is ToggleBiometricUnlockAction => {
  return action.type === 'TOGGLE_BIOMETRIC_UNLOCK';
};

export const isToggleConcealTokensAction = (
  action: Action,
): action is ToggleConcealTokensAction => {
  return action.type === 'TOGGLE_CONCEAL_TOKENS';
};
