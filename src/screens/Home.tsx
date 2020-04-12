import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Clipboard } from 'react-native';
import { Text, Avatar, TouchableRipple, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { EmptyState } from '../components';
import { useGlobalState, useInteractables, useClock } from '../hooks';
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
  }, []);

  useClock(({ second }) => {
    if (second === 0 || second === 30) {
      generateTokens();
    }
  });

  const generateTokens = () => {
    setTokens(
      globalState.vault.map((vaultEntry) => generateTotp(vaultEntry.key)),
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContentContainer}
        data={globalState.vault}
        renderItem={({ item, index }) => {
          const { issuer } = item;

          const token = tokens[index];

          return (
            <TouchableRipple
              style={styles.listItem}
              onPress={() => {
                Clipboard.setString(token);
                showSnackbar('Copied to clipboard');
              }}
            >
              <>
                {false /* TODO: If favicon exists */ ? (
                  <Avatar.Image
                    style={styles.avatar}
                    size={48}
                    source={{ uri: null }}
                  />
                ) : (
                  <Avatar.Text
                    style={styles.avatar}
                    size={48}
                    label={issuer.substring(0, 1)}
                  />
                )}

                <View>
                  <Text style={styles.token}>
                    {[token?.substring(0, 3), ' ', token?.substring(3, 6)]}
                  </Text>

                  <Text style={styles.issuer}>{issuer}</Text>
                </View>
              </>
            </TouchableRipple>
          );
        }}
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
  listContentContainer: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    marginRight: 24,
  },
  token: {
    fontSize: 36,
  },
  issuer: {
    fontSize: 16,
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
