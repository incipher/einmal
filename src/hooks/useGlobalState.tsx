import React, {
  useReducer,
  useContext,
  createContext,
  Dispatch,
  ReducerAction,
} from 'react';
import { Vault, VaultEntry } from '../types';

type State = {
  vault: Vault;
};

type SetVaultAction = { type: 'SET_VAULT'; vault: Vault };

type AddVaultEntryAction = { type: 'ADD_VAULT_ENTRY'; vaultEntry: VaultEntry };

const isSetVaultAction = (action: Action): action is SetVaultAction => {
  return action.type === 'SET_VAULT';
};

const isAddVaultEntryAction = (
  action: Action,
): action is AddVaultEntryAction => {
  return action.type === 'ADD_VAULT_ENTRY';
};

type Action = SetVaultAction | AddVaultEntryAction;

type Reducer = (previousState: State, action: Action) => State;

type DispatchAction = Dispatch<ReducerAction<Reducer>>;

type ProviderProps = {
  children: (state: State) => React.ReactNode;
  vault?: Vault;
};

const GlobalStateContext = createContext<[State, DispatchAction]>([
  {
    vault: [],
  },
  () => {},
]);

export const GlobalStateProvider: React.FC<ProviderProps> = props => {
  const { children, vault = [] } = props;

  const [state, dispatch] = useReducer<Reducer>(
    (previousState, action) => {
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

      return {
        ...previousState,
      };
    },
    {
      vault,
    },
  );

  return (
    <GlobalStateContext.Provider value={[state, dispatch]}>
      {children(state)}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): [State, DispatchAction] => {
  return useContext<[State, DispatchAction]>(GlobalStateContext);
};
