import React, {
  useReducer,
  useContext,
  createContext,
  Dispatch,
  ReducerAction,
} from 'react';
import { Vault } from '../types';

type State = {
  vault: Vault;
};

type ActionType = 'SET_VAULT' | 'ADD_VAULT_ENTRY';

type Action = {
  type: ActionType;
  payload: any;
};

type Reducer = (previousState: State, action: Action) => State;

type DispatchAction = Dispatch<ReducerAction<Reducer>>;

const GlobalStateContext = createContext<[State, DispatchAction]>([
  {
    vault: [],
  },
  () => {},
]);

type ProviderProps = {
  children: (state: State) => React.ReactNode;
  vault?: Vault;
};

export const GlobalStateProvider: React.FC<ProviderProps> = props => {
  const { children, vault = [] } = props;

  const [state, dispatch] = useReducer<Reducer>(
    (previousState, action) => {
      const { type, payload } = action;

      if (type === 'SET_VAULT') {
        return {
          ...previousState,
          vault: payload,
        };
      }

      if (type === 'ADD_VAULT_ENTRY') {
        return {
          ...previousState,
          vault: previousState.vault.concat(payload),
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
