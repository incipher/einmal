import React, {
  useState,
  useContext,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react';
import { Snackbar } from 'react-native-paper';

type State = string;

type SetState = Dispatch<SetStateAction<State>>;

const SnackbarContext = createContext<SetState>(() => {});

export const SnackbarProvider: React.FC = (props) => {
  const { children } = props;

  const [snackbarText, setSnackbarText] = useState('');

  return (
    <SnackbarContext.Provider value={setSnackbarText}>
      {children}

      <Snackbar
        visible={Boolean(snackbarText)}
        duration={Snackbar.DURATION_MEDIUM}
        onDismiss={() => {
          setSnackbarText('');
        }}
      >
        {snackbarText}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SetState => {
  return useContext<SetState>(SnackbarContext);
};
