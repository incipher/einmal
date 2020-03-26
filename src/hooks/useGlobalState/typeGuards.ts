import { Action, SetVaultAction, AddVaultEntryAction } from './actions';

export const isSetVaultAction = (action: Action): action is SetVaultAction => {
  return action.type === 'SET_VAULT';
};

export const isAddVaultEntryAction = (
  action: Action,
): action is AddVaultEntryAction => {
  return action.type === 'ADD_VAULT_ENTRY';
};
