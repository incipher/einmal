import React, { useState, useRef } from 'react';
import { View, KeyboardAvoidingView, Image, StyleSheet } from 'react-native';
import { Text, HelperText, TextInput, Button } from 'react-native-paper';
import { useDimensions } from '@react-native-community/hooks';
import { useGlobalState } from '../hooks';
import { sleep } from '../utilities';

type State = {
  password: string;
  repeatedPassword: string;
  hasPasswordBeenBlurred: boolean;
  hasRepeatedPasswordBeenBlurred: boolean;
  isLoading: boolean;
};

const AuthenticationSetup: React.FC = () => {
  const {
    window: { width: windowWidth },
  } = useDimensions();
  const [, globalDispatch] = useGlobalState();

  const [isLoading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [hasPasswordBeenBlurred, setPasswordBlurred] = useState(false);
  const [hasRepeatedPasswordBeenBlurred, setRepeatedPasswordBlurred] = useState(
    false,
  );

  const repeatedPasswordRef = useRef(null);

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

  const validateRepeatedPassword = (state: Partial<State>): string => {
    const { password, repeatedPassword } = state;

    if (repeatedPassword !== password) {
      return 'Passwords do not match';
    }

    return null;
  };

  const handleCreateVaultPress = async (state: Partial<State>) => {
    const { password, repeatedPassword, isLoading } = state;

    const passwordError = validatePassword({ password });
    const repeatedPasswordError = validateRepeatedPassword({
      password,
      repeatedPassword,
    });

    const isInvalidPassword = Boolean(passwordError);
    const isInvalidRepeatedPassword = Boolean(repeatedPasswordError);

    const isInvalidForm = [isInvalidPassword, isInvalidRepeatedPassword].some(
      Boolean,
    );

    if (isInvalidForm || isLoading) {
      return;
    }

    setLoading(true);
    await sleep(1000);

    globalDispatch({
      type: 'INITIALIZE_VAULT',
      password,
      vault: {
        entries: [],
      },
    });

    setLoading(false);
  };

  const passwordError = validatePassword({ password });
  const repeatedPasswordError = validateRepeatedPassword({
    password,
    repeatedPassword,
  });

  const isInvalidPassword = Boolean(passwordError);
  const isInvalidRepeatedPassword = Boolean(repeatedPasswordError);

  const isInvalidForm = [isInvalidPassword, isInvalidRepeatedPassword].some(
    Boolean,
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={{ width: windowWidth * 0.8 }}>
        <Image style={styles.logo} source={require('../../assets/logo.png')} />

        <Text style={styles.header}>Set Password</Text>

        <HelperText style={styles.warningText}>
          If you forget this password, you will permanently lose access to your
          vault.
        </HelperText>

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
            repeatedPasswordRef.current.focus();
          }}
        />

        <HelperText>
          {isInvalidPassword && hasPasswordBeenBlurred ? passwordError : ''}
        </HelperText>

        <TextInput
          ref={repeatedPasswordRef}
          label="Repeat Password"
          selectionColor="grey"
          secureTextEntry={true}
          value={repeatedPassword}
          error={isInvalidRepeatedPassword && hasRepeatedPasswordBeenBlurred}
          onChangeText={setRepeatedPassword}
          onBlur={() => {
            setRepeatedPasswordBlurred(true);
          }}
          onSubmitEditing={() => {
            handleCreateVaultPress({ password, repeatedPassword, isLoading });
          }}
        />

        <HelperText>
          {isInvalidRepeatedPassword && hasRepeatedPasswordBeenBlurred
            ? repeatedPasswordError
            : ''}
        </HelperText>

        <Button
          style={styles.button}
          mode="contained"
          color="white"
          loading={isLoading}
          disabled={isInvalidForm}
          onPress={() => {
            handleCreateVaultPress({ password, repeatedPassword, isLoading });
          }}
        >
          Create Vault
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

export default AuthenticationSetup;
