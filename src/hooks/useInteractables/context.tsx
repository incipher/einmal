import React, { useState, useContext, createContext } from 'react';
import {
  Portal,
  Paragraph,
  Button,
  Snackbar,
  Dialog,
} from 'react-native-paper';

type ShowSnackbarAction = (snackbarText: string) => void;

type ShowDialogAction = ({
  title,
  paragraphs,
  actions,
}: {
  title: string;
  paragraphs: string[];
  actions: { text: string; onPress: () => void }[];
}) => void;

type Actions = {
  showSnackbar: ShowSnackbarAction;
  showDialog: ShowDialogAction;
};

const InteractablesContext = createContext<Actions>({
  showSnackbar: () => {},
  showDialog: () => {},
});

export const InteractablesProvider: React.FC = (props) => {
  const { children } = props;

  const [snackbarText, setSnackbarText] = useState('');

  const [dialogState, setDialogState] = useState({
    visible: false,
    title: '',
    paragraphs: [],
    actions: [],
  });

  const actions = {
    showSnackbar: setSnackbarText,
    showDialog: ({ title, paragraphs, actions }) => {
      setDialogState({
        visible: true,
        title,
        paragraphs,
        actions,
      });
    },
  };

  return (
    <InteractablesContext.Provider value={actions}>
      {children}

      <Snackbar
        visible={Boolean(snackbarText)}
        duration={2500}
        onDismiss={() => {
          setSnackbarText('');
        }}
      >
        {snackbarText}
      </Snackbar>

      <Portal>
        <Dialog
          visible={dialogState.visible}
          onDismiss={() => {
            setDialogState((state) => ({ ...state, visible: false }));
          }}
        >
          <Dialog.Title>{dialogState.title}</Dialog.Title>

          <Dialog.Content>
            {dialogState.paragraphs.map((paragraph) => (
              <Paragraph style={{ marginVertical: 8 }} key={paragraph}>
                {paragraph}
              </Paragraph>
            ))}
          </Dialog.Content>

          <Dialog.Actions>
            {dialogState.actions.map((action) => (
              <Button
                key={action.text}
                onPress={() => {
                  action.onPress();
                  setDialogState((state) => ({ ...state, visible: false }));
                }}
              >
                {action.text}
              </Button>
            ))}
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </InteractablesContext.Provider>
  );
};

export const useInteractables = (): Actions => {
  return useContext<Actions>(InteractablesContext);
};
