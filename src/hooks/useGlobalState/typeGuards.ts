import {
  Action,
  InitializeVaultAction,
  SetVaultAction,
  AddVaultEntryAction,
  ClearVaultAction,
  ToggleConcealTokensAction,
} from './actions';

export const isInitializeVaultAction = (
  action: Action,
): action is InitializeVaultAction => {
  return action.type === 'INITIALIZE_VAULT';
};

export const isSetVaultAction = (action: Action): action is SetVaultAction => {
  return action.type === 'SET_VAULT';
};

export const isAddVaultEntryAction = (
  action: Action,
): action is AddVaultEntryAction => {
  return action.type === 'ADD_VAULT_ENTRY';
};

export const isClearVaultAction = (
  action: Action,
): action is ClearVaultAction => {
  return action.type === 'CLEAR_VAULT';
};

export const isToggleConcealTokensAction = (
  action: Action,
): action is ToggleConcealTokensAction => {
  return action.type === 'TOGGLE_CONCEAL_TOKENS';
};
