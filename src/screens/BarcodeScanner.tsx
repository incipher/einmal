import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { EmptyState } from '../components';
import { useGlobalState } from '../hooks';
import { parseOtpauthUri } from '../crypto';
import { VaultEntry } from '../types';

type Props = {
  onBarcodeScanned?: (entry: VaultEntry) => void;
};

const BarcodeScanner: React.FC<Props> = props => {
  const { onBarcodeScanned } = props;

  const [, globalDispatch] = useGlobalState();

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

    const vaultEntry = parseOtpauthUri(data);
    await haptics.selectionAsync();

    globalDispatch({ type: 'ADD_VAULT_ENTRY', payload: vaultEntry });
    onBarcodeScanned?.(vaultEntry);

    navigation.goBack();
  };

  if (permission === null) {
    return (
      <EmptyState icon="camera-off" heading="Requesting camera permission" />
    );
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
