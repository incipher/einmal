import React, { useEffect, useContext, createContext } from 'react';
import { useGlobalReducer, State, DispatchAction } from './reducer';
import { encryptVault, writeVault } from '../../vault';
import * as storage from '../../async-storage';
import * as secureStorage from '../../secure-storage';
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
    settings: {
      biometricUnlock: false,
      concealTokens: false,
    },
  },
  () => {},
]);

export const GlobalStateProvider: React.FC<ProviderProps> = (props) => {
  const {
    children,
    vault: initialVault = null,
    password: initialPassword = null,
    settings: initialSettings = {
      biometricUnlock: false,
      concealTokens: false,
    },
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
    if (password) {
      if (settings.biometricUnlock) {
        secureStorage.setPassword(password);
      } else {
        secureStorage.removePassword();
      }
    }
  }, [settings.biometricUnlock, password]);

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
