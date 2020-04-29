import React, { useState, useContext, createContext } from 'react';
import {
  Portal,
  Paragraph,
  TextInput,
  Button,
  Snackbar,
  Dialog,
} from 'react-native-paper';
import produce from 'immer';

type ShowSnackbarAction = (snackbarText: string) => void;

type ShowDialogAction = ({
  title,
  paragraphs,
  inputs,
  actions,
}: {
  title: string;
  paragraphs?: string[];
  inputs?: string[];
  actions: { text: string; onPress: (data: any) => void }[];
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
    inputsMap: {},
    actions: [],
  });

  const actions = {
    showSnackbar: setSnackbarText,
    showDialog: ({ title, paragraphs = [], inputs = [], actions }) => {
      const inputsMap = inputs.reduce((accumulation, element) => {
        return { ...accumulation, [element]: '' };
      }, {});

      setDialogState({
        visible: true,
        title,
        paragraphs,
        inputsMap,
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

            {Object.entries(dialogState.inputsMap).map(
              ([property, value], index) => {
                return (
                  <TextInput
                    style={{
                      backgroundColor: '#121212',
                    }}
                    key={index}
                    label={property}
                    selectionColor="grey"
                    secureTextEntry={true}
                    value={value as string}
                    onChangeText={(text) => {
                      setDialogState((state) => {
                        return produce(state, (draftState) => {
                          draftState.inputsMap[property] = text;
                        });
                      });
                    }}
                  />
                );
              },
            )}
          </Dialog.Content>

          <Dialog.Actions>
            {dialogState.actions.map((action) => (
              <Button
                key={action.text}
                onPress={() => {
                  action.onPress(dialogState.inputsMap);

                  setDialogState((state) => {
                    return produce(state, (draftState) => {
                      draftState.visible = false;
                    });
                  });
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
