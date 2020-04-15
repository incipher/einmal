import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Clipboard } from 'react-native';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { EmptyState, LinearIndicator, Token } from '../components';
import { useGlobalState, useInteractables } from '../hooks';
import { generateTotp } from '../crypto';
import { isPhysicalDevice } from '../utilities';

const Home: React.FC = () => {
  const [globalState] = useGlobalState();
  const { showSnackbar } = useInteractables();
  const navigation = useNavigation();

  const [tokens, setTokens] = useState([]);
  const [isFABGroupOpen, setFABGroupOpen] = useState(false);

  useEffect(() => {
    generateTokens();
  }, [globalState.vault]);

  const generateTokens = useCallback(() => {
    setTokens(
      globalState.vault.map((vaultEntry) => generateTotp(vaultEntry.key)),
    );
  }, [globalState.vault]);

  const SECONDS_CAP = 30;
  const cappedSeconds = new Date().getSeconds() % SECONDS_CAP;
  const progress = cappedSeconds / SECONDS_CAP;

  return (
    <View style={styles.container}>
      {globalState.vault.length === 0 ? null : (
        <LinearIndicator
          style={styles.linearIndicator}
          initialProgress={progress}
          duration={SECONDS_CAP * 1000}
          onFinish={generateTokens}
        />
      )}

      <FlatList
        data={globalState.vault}
        renderItem={({ item, index }) => (
          <Token
            issuer={item.issuer}
            token={tokens[index]}
            onPress={({ token }) => {
              Clipboard.setString(token);
              showSnackbar('Copied to clipboard');
            }}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="shield-plus-outline"
            heading="Your vault is empty"
            subheading="Configure your accounts to use two-step verification"
          />
        }
        ItemSeparatorComponent={() => <View style={styles.listItemDivider} />}
        keyExtractor={(item) => [item.issuer, item.account].join(':')}
      />

      <FAB.Group
        style={styles.fab}
        visible={true}
        open={isFABGroupOpen}
        icon={isFABGroupOpen ? 'close' : 'plus'}
        actions={[
          {
            icon: 'qrcode-scan',
            label: 'Scan QR code',
            onPress: () => {
              if (!isPhysicalDevice()) {
                return alert('Camera only works on physical devices');
              }

              navigation.navigate('BarcodeScanner');
            },
          },
          {
            icon: 'keyboard',
            label: 'Enter manually',
            onPress: () => {},
          },
        ]}
        onStateChange={({ open }) => {
          setFABGroupOpen(open);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  linearIndicator: {
    flex: 0.005,
  },
  listItemDivider: {
    paddingVertical: 8,
  },
  fab: {
    marginVertical: 16,
    marginHorizontal: 8,
  },
});

export default Home;
