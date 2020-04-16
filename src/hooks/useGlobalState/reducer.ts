import { useReducer, Dispatch, ReducerAction } from 'react';
import { Action } from './actions';
import {
  isSetVaultAction,
  isAddVaultEntryAction,
  isClearVaultAction,
  isToggleConcealTokensAction,
} from './typeGuards';
import { Vault, Settings } from '../../types';

export type State = {
  vault: Vault;
  settings: Settings;
};

type Reducer = (previousState: State, action: Action) => State;

export type DispatchAction = Dispatch<ReducerAction<Reducer>>;

export const useGlobalReducer = (
  initialState: State,
): [State, DispatchAction] => {
  return useReducer<Reducer>((previousState, action) => {
    if (isSetVaultAction(action)) {
      return {
        ...previousState,
        vault: action.vault,
      };
    }

    if (isAddVaultEntryAction(action)) {
      return {
        ...previousState,
        vault: previousState.vault.concat(action.vaultEntry),
      };
    }

    if (isClearVaultAction(action)) {
      return {
        ...previousState,
        vault: [],
      };
    }

    if (isToggleConcealTokensAction(action)) {
      return {
        ...previousState,
        settings: {
          ...previousState.settings,
          concealTokens: !previousState.settings.concealTokens,
        },
      };
    }

    return {
      ...previousState,
    };
  }, initialState);
};
