import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Image, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { HelperText, TextInput, Button } from 'react-native-paper';
import { useDimensions } from '@react-native-community/hooks';
import { useGlobalState, useInteractables } from '../hooks';
import { readVault, decryptVault } from '../vault';
import * as secureStorage from '../secure-storage';
import { sleep } from '../utilities';

type State = {
  password: string;
  hasPasswordBeenBlurred: boolean;
  isLoading: boolean;
};

const Authentication: React.FC = () => {
  const {
    window: { width: windowWidth },
  } = useDimensions();
  const [globalState, globalDispatch] = useGlobalState();
  const { showSnackbar } = useInteractables();

  const [password, setPassword] = useState('');
  const [hasPasswordBeenBlurred, setPasswordBlurred] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const validatePassword = (state: Partial<State>): string => {
    const { password } = state;

    if (!password) {
      return 'Required';
    }

    if (password.length < 6) {
      return 'Password must be longer than 5 characters';
    }

    if (password.length >= 128) {
      return 'Password must be shorter than 128 characters';
    }

    return null;
  };

  const handleUnlockVaultPress = async (state: Partial<State>) => {
    const { password, isLoading } = state;

    const passwordError = validatePassword({ password });

    const isInvalidPassword = Boolean(passwordError);
    const isInvalidForm = [isInvalidPassword].some(Boolean);

    if (isInvalidForm || isLoading) {
      return;
    }

    setLoading(true);
    await sleep(1000);

    try {
      const encryptedVault = await readVault();

      const decryptedVault = await decryptVault({
        encryptedVault,
        password,
      });

      globalDispatch({
        type: 'INITIALIZE_VAULT',
        password,
        vault: decryptedVault,
      });
    } catch (error) {
      showSnackbar('Failed to decrypt vault');
    }

    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      if (globalState.settings.biometricUnlock) {
        const result = await LocalAuthentication.authenticateAsync();

        if (!result.success) {
          return;
        }

        const password = await secureStorage.getPassword();

        setPassword(password);
        handleUnlockVaultPress({ password, isLoading });
      }
    })();
  }, []);

  const passwordError = validatePassword({ password });

  const isInvalidPassword = Boolean(passwordError);
  const isInvalidForm = [isInvalidPassword].some(Boolean);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={{ width: windowWidth * 0.8 }}>
        <Image style={styles.logo} source={require('../../assets/logo.png')} />

        <TextInput
          label="Password"
          selectionColor="grey"
          secureTextEntry={true}
          value={password}
          error={isInvalidPassword && hasPasswordBeenBlurred}
          onChangeText={setPassword}
          onBlur={() => {
            setPasswordBlurred(true);
          }}
          onSubmitEditing={() => {
            handleUnlockVaultPress({ password, isLoading });
          }}
        />

        <HelperText>
          {isInvalidPassword && hasPasswordBeenBlurred ? passwordError : ''}
        </HelperText>

        <Button
          style={styles.button}
          mode="contained"
          color="white"
          loading={isLoading}
          disabled={isInvalidForm}
          onPress={() => {
            handleUnlockVaultPress({ password, isLoading });
          }}
        >
          Unlock Vault
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'black',
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 40,
    width: 75,
    height: 75 * 1.32,
  },
  header: {
    marginHorizontal: 10,
    marginVertical: 16,
    fontSize: 24,
  },
  warningText: {
    marginVertical: 4,
    color: 'yellow',
  },
  button: {
    marginVertical: 16,
  },
});

export default Authentication;
