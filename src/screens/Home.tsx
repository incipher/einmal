import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Avatar, TouchableRipple, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { EmptyState } from '../components';
import { useGlobalState, useClock } from '../hooks';
import { generateTotp } from '../crypto';
import { isPhysicalDevice } from '../utilities';

const Home: React.FC = () => {
  const [globalState] = useGlobalState();
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
          const { issuer, key } = item;

          return (
            <TouchableRipple
              style={styles.listItem}
              rippleColor="rgba(0, 0, 0, .10)"
              onPress={() => {}}
            >
              <>
                {true /* TODO: If favicon exists */ ? (
                  <Avatar.Text
                    style={styles.avatar}
                    size={40}
                    label={issuer.substring(0, 1)}
                  />
                ) : (
                  <Avatar.Image
                    style={styles.avatar}
                    size={32}
                    source={{ uri: null }}
                  />
                )}

                <View>
                  <Text style={styles.text}>{tokens[index] || '000000'}</Text>

                  <Text>{issuer}</Text>
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
        ListHeaderComponent={<View style={styles.listItemDivider} />}
        ItemSeparatorComponent={() => <View style={styles.listItemDivider} />}
        ListFooterComponent={<View style={styles.listItemDivider} />}
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
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  avatar: {
    marginRight: 16,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 26,
    color: 'white',
  },
  listItemDivider: {
    padding: 8,
  },
  fab: {
    marginVertical: 16,
    marginHorizontal: 8,
  },
});

export default Home;
