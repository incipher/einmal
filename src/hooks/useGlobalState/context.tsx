import React, { useEffect, useContext, createContext } from 'react';
import { useGlobalReducer, State, DispatchAction } from './reducer';
import * as vault from '../../vault';
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

export const GlobalStateProvider: React.FC<ProviderProps> = (props) => {
  const { children, vault: initialVault = [] } = props;

  const [state, dispatch] = useGlobalReducer({
    vault: initialVault,
  });

  useEffect(() => {
    try {
      vault.set(state.vault);
    } catch (error) {
      console.log('Failed to write vault:', error);
    }
  }, [state.vault]);

  return (
    <GlobalStateContext.Provider value={[state, dispatch]}>
      {children(state)}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): [State, DispatchAction] => {
  return useContext<[State, DispatchAction]>(GlobalStateContext);
};
