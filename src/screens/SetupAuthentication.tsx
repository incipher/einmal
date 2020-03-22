import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, HelperText, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDimensions } from '@react-native-community/hooks';

const SetupAuthentication: React.FC = () => {
  const navigation = useNavigation();
  const {
    window: { width: windowWidth },
  } = useDimensions();

  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [hasPasswordBeenBlurred, setPasswordBlurred] = useState(false);
  const [hasRepeatedPasswordBeenBlurred, setRepeatedPasswordBlurred] = useState(
    false,
  );

  const validatePassword = (): string => {
    if (!password) {
      return 'Required';
    }

    if (password.length < 6) {
      return 'Password must be longer than 5 characters';
    }

    return null;
  };

  const validateRepeatedPassword = (): string => {
    if (repeatedPassword !== password) {
      return 'Passwords do not match';
    }

    return null;
  };

  const passwordError = validatePassword();
  const repeatedPasswordError = validateRepeatedPassword();

  const isInvalidPassword = Boolean(passwordError);
  const isInvalidRepeatedPassword = Boolean(repeatedPasswordError);

  const isInvalidForm = isInvalidPassword || isInvalidRepeatedPassword;

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View />

      <View style={{ width: windowWidth * 0.8 }}>
        <Text style={styles.header}>Set Password</Text>

        <HelperText style={styles.warningText}>
          If you forget this password, you will permanently lose access to your
          vault.
        </HelperText>

        <TextInput
          label="Password"
          secureTextEntry={true}
          value={password}
          error={isInvalidPassword && hasPasswordBeenBlurred}
          onChangeText={setPassword}
          onBlur={() => {
            setPasswordBlurred(true);
          }}
        />

        <HelperText>
          {isInvalidPassword && hasPasswordBeenBlurred ? passwordError : ''}
        </HelperText>

        <TextInput
          label="Repeat Password"
          secureTextEntry={true}
          value={repeatedPassword}
          error={isInvalidRepeatedPassword && hasRepeatedPasswordBeenBlurred}
          onChangeText={setRepeatedPassword}
          onBlur={() => {
            setRepeatedPasswordBlurred(true);
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
          disabled={isInvalidForm}
          onPress={() => {
            navigation.navigate('SetupAuthentication');
          }}
        >
          Create Vault
        </Button>
      </View>

      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'black',
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

export default SetupAuthentication;
