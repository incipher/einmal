import { useReducer, Dispatch, ReducerAction } from 'react';
import { Action } from './actions';
import {
  isInitializeVaultAction,
  isSetVaultEntriesAction,
  isAddVaultEntryAction,
  isClearVaultEntriesAction,
  isToggleConcealTokensAction,
} from './typeGuards';
import { Vault, Settings } from '../../types';

export type State = {
  password: string;
  vault: Vault;
  settings: Settings;
};

type Reducer = (previousState: State, action: Action) => State;

export type DispatchAction = Dispatch<ReducerAction<Reducer>>;

export const useGlobalReducer = (
  initialState: State,
): [State, DispatchAction] => {
  return useReducer<Reducer>((previousState, action) => {
    if (isInitializeVaultAction(action)) {
      return {
        ...previousState,
        password: action.password,
        vault: action.vault,
      };
    }

    if (isSetVaultEntriesAction(action)) {
      return {
        ...previousState,
        vault: {
          ...previousState.vault,
          entries: action.vaultEntries,
        },
      };
    }

    if (isAddVaultEntryAction(action)) {
      return {
        ...previousState,
        vault: {
          ...previousState.vault,
          entries: previousState.vault.entries.concat(action.vaultEntry),
        },
      };
    }

    if (isClearVaultEntriesAction(action)) {
      return {
        ...previousState,
        vault: {
          ...previousState.vault,
          entries: [],
        },
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

    return previousState;
  }, initialState);
};
