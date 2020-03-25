import React, {
  useState,
  useContext,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react';

type Vault = {};

type Data = {
  vault: Vault;
};

type State = {
  data: Data;
};

type Actions = {
  setData: Dispatch<SetStateAction<Data>>;
};

const GlobalStateContext = createContext<[State, Actions]>([
  {
    data: {
      vault: null,
    },
  },
  {
    setData: () => {},
  },
]);

type ProviderProps = {
  children: (state: State) => React.ReactNode;
  vault?: Vault;
};

export const GlobalStateProvider: React.FC<ProviderProps> = props => {
  const { children, vault = null } = props;

  const [data, setData] = useState<Data>({
    vault,
  });

  const state: State = {
    data,
  };

  const actions: Actions = {
    setData,
  };

  return (
    <GlobalStateContext.Provider value={[state, actions]}>
      {children(state)}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): [State, Actions] => {
  return useContext<[State, Actions]>(GlobalStateContext);
};
