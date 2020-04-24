import React, { useEffect, useContext, createContext } from 'react';
import { useGlobalReducer, State, DispatchAction } from './reducer';
import * as vault from '../../vault';
import * as storage from '../../async-storage';
import { Vault, Settings } from '../../types';

type ProviderProps = {
  children: (state: State) => React.ReactNode;
  vault?: Vault;
  password?: string;
  settings?: Settings;
};

const GlobalStateContext = createContext<[State, DispatchAction]>([
  {
    vault: null,
    password: null,
    settings: { concealTokens: false },
  },
  () => {},
]);

export const GlobalStateProvider: React.FC<ProviderProps> = (props) => {
  const {
    children,
    vault: initialVault = null,
    password: initialPassword = null,
    settings: initialSettings = { concealTokens: false },
  } = props;

  const [state, dispatch] = useGlobalReducer({
    vault: initialVault,
    password: initialPassword,
    settings: initialSettings,
  });

  useEffect(() => {
    if (state.vault && state.password) {
      vault.set({
        vault: state.vault,
        password: state.password,
      });
    }
  }, [state.vault, state.password]);

  useEffect(() => {
    // TODO: Update secure store
  }, [state.password]);

  useEffect(() => {
    storage.setConcealTokens(state.settings.concealTokens);
  }, [state.settings.concealTokens]);

  return (
    <GlobalStateContext.Provider value={[state, dispatch]}>
      {children(state)}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): [State, DispatchAction] => {
  return useContext<[State, DispatchAction]>(GlobalStateContext);
};
