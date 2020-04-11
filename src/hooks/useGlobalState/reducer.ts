import { useReducer, Dispatch, ReducerAction } from 'react';
import { Action } from './actions';
import {
  isSetVaultAction,
  isAddVaultEntryAction,
  isClearVaultAction,
} from './typeGuards';
import { Vault } from '../../types';

export type State = {
  vault: Vault;
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

    return {
      ...previousState,
    };
  }, initialState);
};
