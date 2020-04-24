import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Image, StyleSheet } from 'react-native';
import { HelperText, TextInput, Button } from 'react-native-paper';
import { useDimensions } from '@react-native-community/hooks';
import { useGlobalState, useInteractables } from '../hooks';
import * as vault from '../vault';
import { sleep } from '../utilities';

const Authentication: React.FC = () => {
  const {
    window: { width: windowWidth },
  } = useDimensions();
  const [, globalDispatch] = useGlobalState();
  const { showSnackbar } = useInteractables();

  const [isLoading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [hasPasswordBeenBlurred, setPasswordBlurred] = useState(false);

  const validatePassword = (): string => {
    if (!password) {
      return 'Required';
    }

    if (password.length < 6) {
      return 'Password must be longer than 5 characters';
    }

    return null;
  };

  const handleUnlockVaultPress = async () => {
    if (isInvalidForm || isLoading) {
      return;
    }

    setLoading(true);

    await sleep(1000);

    try {
      const decryptedVault = await vault.get({ password });

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

  const passwordError = validatePassword();

  const isInvalidPassword = Boolean(passwordError);
  const isInvalidForm = isInvalidPassword;

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
          onSubmitEditing={handleUnlockVaultPress}
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
          onPress={handleUnlockVaultPress}
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
