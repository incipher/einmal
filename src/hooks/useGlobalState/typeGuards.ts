import {
  Action,
  SetVaultAction,
  AddVaultEntryAction,
  ClearVaultAction,
} from './actions';

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
