import React, { useContext, createContext } from 'react';
import { useGlobalReducer, State, DispatchAction } from './reducer';
import { Vault } from '../../types';

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

  const [state, dispatch] = useGlobalReducer({
    vault,
  });

  return (
    <GlobalStateContext.Provider value={[state, dispatch]}>
      {children(state)}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): [State, DispatchAction] => {
  return useContext<[State, DispatchAction]>(GlobalStateContext);
};
