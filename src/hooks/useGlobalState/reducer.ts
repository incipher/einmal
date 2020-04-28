import { useReducer, Dispatch, ReducerAction } from 'react';
import produce from 'immer';
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

type Reducer = (state: State, action: Action) => State;

export type DispatchAction = Dispatch<ReducerAction<Reducer>>;

export const useGlobalReducer = (
  initialState: State,
): [State, DispatchAction] => {
  return useReducer<Reducer>((state, action) => {
    if (isInitializeVaultAction(action)) {
      return produce(state, (draftState) => {
        draftState.password = action.password;
        draftState.vault = action.vault;
      });
    }

    if (isSetVaultEntriesAction(action)) {
      return produce(state, (draftState) => {
        draftState.vault.entries = action.vaultEntries;
      });
    }

    if (isAddVaultEntryAction(action)) {
      return produce(state, (draftState) => {
        const existingEntryIndex = state.vault.entries.findIndex((entry) => {
          return (
            entry.issuer === action.vaultEntry.issuer &&
            entry.account === action.vaultEntry.account
          );
        });

        if (existingEntryIndex === -1) {
          draftState.vault.entries.push(action.vaultEntry);
        } else {
          draftState.vault.entries[existingEntryIndex] = action.vaultEntry;
        }
      });
    }

    if (isClearVaultEntriesAction(action)) {
      return produce(state, (draftState) => {
        draftState.vault.entries = [];
      });
    }

    if (isToggleConcealTokensAction(action)) {
      return produce(state, (draftState) => {
        draftState.settings.concealTokens = !state.settings.concealTokens;
      });
    }

    return state;
  }, initialState);
};
