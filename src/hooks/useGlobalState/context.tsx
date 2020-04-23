import React, { useEffect, useContext, createContext } from 'react';
import { useGlobalReducer, State, DispatchAction } from './reducer';
import * as vault from '../../vault';
import * as storage from '../../async-storage';
import { Vault, Settings } from '../../types';

type ProviderProps = {
  children: (state: State) => React.ReactNode;
  key?: string;
  vault?: Vault;
  settings?: Settings;
};

const GlobalStateContext = createContext<[State, DispatchAction]>([
  {
    key: null,
    vault: null,
    settings: { concealTokens: false },
  },
  () => {},
]);

export const GlobalStateProvider: React.FC<ProviderProps> = (props) => {
  const {
    children,
    key: initialKey = null,
    vault: initialVault = null,
    settings: initialSettings = { concealTokens: false },
  } = props;

  const [state, dispatch] = useGlobalReducer({
    key: initialKey,
    vault: initialVault,
    settings: initialSettings,
  });

  useEffect(() => {
    try {
      if (state.vault && state.key) {
        vault.set({ vault: state.vault, key: state.key });
      }
    } catch (error) {
      console.log('Failed to write vault:', error);
    }
  }, [state.vault, state.key]);

  useEffect(() => {
    // TODO: Update secure store
  }, [state.key]);

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
