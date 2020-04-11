import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { EmptyState } from '../components';
import { useGlobalState, useInteractables } from '../hooks';
import { parseOtpauthUri } from '../crypto';
import { actuateHapticFeedback } from '../utilities';
import { VaultEntry } from '../types';

type Props = {
  onBarcodeScanned?: (entry: VaultEntry) => void;
};

const BarcodeScanner: React.FC<Props> = (props) => {
  const { onBarcodeScanned } = props;

  const [globalState, globalDispatch] = useGlobalState();
  const { showSnackbar } = useInteractables();
  const navigation = useNavigation();

  const [permission, setPermission] = useState(null);
  const [hasScanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setPermission(status);
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    await actuateHapticFeedback();

    try {
      const { type, account, digits, issuer, key } = parseOtpauthUri(data);

      if (!type || !account || !digits || !issuer || !key) {
        throw new Error('Insufficient OTP parameters');
      }

      if (type !== 'totp' || digits !== 6) {
        throw new Error('Unsupported OTP parameters');
      }

      const vaultEntry = {
        type,
        account,
        digits,
        issuer,
        key,
      };

      globalDispatch({ type: 'ADD_VAULT_ENTRY', vaultEntry });
      onBarcodeScanned?.(vaultEntry);
    } catch (error) {
      showSnackbar('Unsupported QR code');
    }

    navigation.goBack();
  };

  if (permission === null) {
    return <EmptyState icon="camera" heading="Requesting camera permission" />;
  }

  if (permission !== 'granted') {
    return (
      <EmptyState
        icon="camera-off"
        heading="Cannot access camera"
        subheading="Give the app permission to access your camera"
      />
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={hasScanned ? undefined : handleBarCodeScanned}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'black',
  },
});

export default BarcodeScanner;
