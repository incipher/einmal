import React, { useEffect, useContext, createContext } from 'react';
import { useGlobalReducer, State, DispatchAction } from './reducer';
import * as vault from '../../vault';
import { Vault, Settings } from '../../types';

type ProviderProps = {
  children: (state: State) => React.ReactNode;
  vault?: Vault;
  settings?: Settings;
};

const GlobalStateContext = createContext<[State, DispatchAction]>([
  {
    vault: [],
    settings: { concealTokens: false },
  },
  () => {},
]);

export const GlobalStateProvider: React.FC<ProviderProps> = (props) => {
  const {
    children,
    vault: initialVault = [],
    settings = { concealTokens: false },
  } = props;

  const [state, dispatch] = useGlobalReducer({
    vault: initialVault,
    settings,
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
