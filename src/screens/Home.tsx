import React, { useState, useMemo, useLayoutEffect } from 'react';
import { View, Image, FlatList, StyleSheet, Clipboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Portal, IconButton, Searchbar, FAB } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';
import { EmptyState, LinearIndicator, Token } from '../components';
import { useGlobalState, useInteractables } from '../hooks';
import { generateTotp } from '../crypto';
import { isPhysicalDevice } from '../utilities';
import { colors } from '../constants';

const Home: React.FC = () => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const isNavigationFocused = useIsFocused();

  const [globalState] = useGlobalState();
  const { showSnackbar } = useInteractables();

  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchbarVisible, setSearchbarVisible] = useState(false);
  const [isFABGroupOpen, setFABGroupOpen] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => {
        return (
          <View style={[styles.header, { paddingTop: insets.top }]}>
            {isSearchbarVisible ? (
              <Searchbar
                style={styles.searchbar}
                autoFocus={true}
                placeholder="Search"
                selectionColor="grey"
                value={searchQuery}
                onChangeText={setSearchQuery}
                icon="arrow-left"
                onIconPress={clearAndCloseSearchbar}
              />
            ) : (
              <Image
                style={styles.headerLogo}
                source={require('../../assets/logo.png')}
              />
            )}

            <View style={styles.headerRight}>
              {isSearchbarVisible ? null : (
                <IconButton
                  icon={() => (
                    <MaterialIcons name="search" color="white" size={26} />
                  )}
                  onPress={() => {
                    setSearchbarVisible(true);
                  }}
                />
              )}

              <IconButton
                icon={() => (
                  <MaterialIcons name="sort" color="white" size={30} />
                )}
                onPress={() => {
                  navigation.navigate('Sorting');
                }}
              />

              <IconButton
                icon={() => (
                  <MaterialIcons name="settings" color="white" size={24} />
                )}
                onPress={() => {
                  navigation.navigate('Settings');
                }}
              />
            </View>
          </View>
        );
      },
    });
  }, [navigation, isSearchbarVisible, searchQuery]);

  useBackHandler(() => {
    if (isSearchbarVisible) {
      clearAndCloseSearchbar();
      return true;
    }

    return false;
  });

  const clearAndCloseSearchbar = () => {
    setSearchbarVisible(false);
    setSearchQuery('');
  };

  const isVaultEmpty = globalState.vault.entries.length === 0;

  const viewableVaultEntries = useMemo(() => {
    return globalState.vault.entries
      .filter((vaultEntry) => {
        return vaultEntry.issuer
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      })
      .map((vaultEntry) => ({
        ...vaultEntry,
        token: generateTotp(vaultEntry.secret),
      }));
  }, [globalState.vault.entries, searchQuery, toggleSwitch]);

  const SECONDS_CAP = 30;
  const cappedSeconds = new Date().getSeconds() % SECONDS_CAP;
  const progress = cappedSeconds / SECONDS_CAP;

  return (
    <View style={styles.container}>
      {isVaultEmpty ? null : (
        <LinearIndicator
          style={styles.linearIndicator}
          initialProgress={progress}
          duration={SECONDS_CAP * 1000}
          onFinish={() => setToggleSwitch((toggleSwitch) => !toggleSwitch)}
        />
      )}

      {isVaultEmpty ? (
        <EmptyState
          icon="shield-plus-outline"
          heading="Your vault is empty"
          subheading="Configure your accounts to use two-step verification"
        />
      ) : (
        <FlatList
          style={styles.list}
          data={viewableVaultEntries}
          renderItem={({ item }) => (
            <Token
              issuer={item.issuer}
              token={item.token}
              shouldConceal={globalState.settings.concealTokens}
              onPress={({ token }) => {
                Clipboard.setString(token);
                showSnackbar('Copied to clipboard');
              }}
            />
          )}
          keyExtractor={(item) => [item.issuer, item.account].join(':')}
          getItemLayout={
            undefined /* TODO: Optimize performance using getItemLayout() */
          }
        />
      )}

      <Portal>
        <FAB.Group
          fabStyle={styles.fab}
          visible={isNavigationFocused}
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
              onPress: () => {
                showSnackbar('Coming soon');
              },
            },
          ]}
          onStateChange={({ open }) => {
            setFABGroupOpen(open);
          }}
        />
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 4,
    backgroundColor: 'black',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 20,
    height: 20,
    marginHorizontal: 16,
  },
  searchbar: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  linearIndicator: {
    flex: 0.005,
  },
  list: {
    flex: 1,
  },
  fab: {
    marginBottom: 32,
    backgroundColor: colors.SECONDARY,
  },
});

export default Home;
