import React, {
  useState,
  useContext,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react';

type Data = {};

type State = {
  data: Data;
};

type Actions = {
  setData: Dispatch<SetStateAction<Data>>;
};

const GlobalStateContext = createContext<[State, Actions]>([
  {
    data: {},
  },
  {
    setData: () => {},
  },
]);

export const GlobalStateProvider: React.FC = props => {
  const { children } = props;

  const [data, setData] = useState<Data>({});

  const state: State = {
    data,
  };

  const actions: Actions = {
    setData,
  };

  return (
    <GlobalStateContext.Provider value={[state, actions]}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): [State, Actions] => {
  return useContext<[State, Actions]>(GlobalStateContext);
};
