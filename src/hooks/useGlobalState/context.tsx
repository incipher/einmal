import React, { useEffect, useContext, createContext } from 'react';
import { useGlobalReducer, State, DispatchAction } from './reducer';
import { encryptVault, writeVault } from '../../vault';
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

  const { vault, password, settings } = state;

  useEffect(() => {
    (async () => {
      if (vault && password) {
        const encryptedVault = await encryptVault({
          vault,
          password,
        });

        await writeVault(encryptedVault);
      }
    })();
  }, [vault, password]);

  useEffect(() => {
    storage.setConcealTokens(settings.concealTokens);
  }, [settings.concealTokens]);

  return (
    <GlobalStateContext.Provider value={[state, dispatch]}>
      {children(state)}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): [State, DispatchAction] => {
  return useContext<[State, DispatchAction]>(GlobalStateContext);
};
