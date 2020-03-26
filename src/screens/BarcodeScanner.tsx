import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useGlobalState } from '../hooks';
import { parseOtpauthUri } from '../crypto';
import { VaultEntry } from '../types';

type Props = {
  onBarcodeScanned?: (entry: VaultEntry) => void;
};

const BarcodeScanner: React.FC<Props> = props => {
  const { onBarcodeScanned } = props;

  const [, globalActions] = useGlobalState();
  const { setData } = globalActions;

  const navigation = useNavigation();

  const [permission, setPermission] = useState(null);
  const [hasScanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setPermission(status);
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);

    const vaultEntry = parseOtpauthUri(data);

    setData(data => ({ vault: data.vault.concat(vaultEntry) }));
    onBarcodeScanned?.(vaultEntry);

    navigation.goBack();
  };

  if (permission === null) {
    return (
      <View style={styles.emptyStateContainer}>
        <MaterialCommunityIcons
          style={styles.emptyStateIcon}
          name="camera"
          size={120}
          color="#aaa"
        />

        <Text style={styles.emptyStateHeading}>
          Requesting camera permission
        </Text>
      </View>
    );
  }

  if (permission !== 'granted') {
    return (
      <View style={styles.emptyStateContainer}>
        <MaterialCommunityIcons
          style={styles.emptyStateIcon}
          name="camera-off"
          size={120}
          color="#aaa"
        />

        <Text style={styles.emptyStateHeading}>Cannot access camera</Text>

        <Text style={styles.emptyStateSubheading}>
          Give the app permission to access your camera
        </Text>
      </View>
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'black',
  },
  emptyStateIcon: {
    margin: 8,
  },
  emptyStateHeading: {
    margin: 8,
    textAlign: 'center',
    fontSize: 26,
    color: '#aaa',
  },
  emptyStateSubheading: {
    margin: 8,
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
  },
});

export default BarcodeScanner;
