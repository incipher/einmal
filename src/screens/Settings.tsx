import React, { useState } from 'react';
import { View, SectionList, StyleSheet, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { List, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useGlobalState, useInteractables } from '../hooks';
import { importVault, exportVault, decryptVault, encryptVault } from '../vault';
import { requestExternalStoragePermission, sleep } from '../utilities';
import { configuration, colors } from '../constants';
import { Sections } from '../types';

type Setting = {
  title: string;
  description: string;
  value?: boolean;
  loading?: boolean;
  onPress?: () => void;
  onToggle?: () => void;
};

const Settings: React.FC = () => {
  const [globalState, globalDispatch] = useGlobalState();
  const { showSnackbar, showDialog } = useInteractables();
  const navigation = useNavigation();

  const [isImportingVault, setImportingVault] = useState(false);
  const [isExportingVault, setExportingVault] = useState(false);

  const sections: Sections<Setting> = [
    {
      title: 'Vault',
      data: [
        {
          title: 'Import',
          description: 'Import encrypted vault from a file',
          loading: isImportingVault,
          onPress: async () => {
            const response = await DocumentPicker.getDocumentAsync({
              type: 'application/json',
              copyToCacheDirectory: true,
            });

            if (response.type === 'cancel') {
              return;
            }

            showDialog({
              title: 'Enter password',
              inputs: ['Password'],
              actions: [
                {
                  text: 'Cancel',
                  onPress: () => {},
                },
                {
                  text: 'Import',
                  onPress: async (inputs) => {
                    const { Password: password } = inputs;

                    setImportingVault(true);

                    try {
                      const encryptedVault = await importVault(response.uri);

                      const decryptedVault = await decryptVault({
                        encryptedVault,
                        password,
                      });

                      globalDispatch({
                        type: 'INITIALIZE_VAULT',
                        password,
                        vault: decryptedVault,
                      });

                      showSnackbar('Vault imported successfully');
                    } catch (error) {
                      showSnackbar('Failed to import vault');
                    }

                    setImportingVault(false);
                  },
                },
              ],
            });
          },
        },
        {
          title: 'Export',
          description: 'Export encrypted vault to a file',
          loading: isExportingVault,
          onPress: async () => {
            try {
              const { status } = await requestExternalStoragePermission();

              if (status !== 'granted') {
                return;
              }

              setExportingVault(true);
              await sleep(500);

              const encryptedVault = await encryptVault({
                password: globalState.password,
                vault: globalState.vault,
              });

              await exportVault(encryptedVault);

              showSnackbar('Vault exported to Downloads directory');
            } catch (error) {
              showSnackbar('Unable to export vault');
            }

            setExportingVault(false);
          },
        },
        {
          title: 'Clear',
          description: 'Delete vault contents',
          onPress: () => {
            showDialog({
              title: 'Clear vault?',
              paragraphs: [
                'Clearing your vault will lock you out of your accounts with two-factor authentication enabled.',
                'You are advised to export your vault to a file first, or disable two-factor authentication for your accounts.',
              ],
              actions: [
                {
                  text: 'Cancel',
                  onPress: () => {},
                },
                {
                  text: 'Clear',
                  onPress: () => {
                    globalDispatch({ type: 'CLEAR_VAULT_ENTRIES' });
                    showSnackbar('Vault cleared');

                    navigation.navigate('Home');
                  },
                },
              ],
            });
          },
        },
      ],
    },
    {
      title: 'Security',
      data: [
        {
          title: 'Discreet mode',
          description: 'Conceal tokens by default',
          value: globalState.settings.concealTokens,
          onPress: () => {
            globalDispatch({ type: 'TOGGLE_CONCEAL_TOKENS' });
          },
          onToggle: () => {
            globalDispatch({ type: 'TOGGLE_CONCEAL_TOKENS' });
          },
        },
      ],
    },
    {
      title: 'About',
      data: [
        {
          title: 'Version',
          description: configuration.version,
          onPress: undefined,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <SectionList
        stickySectionHeadersEnabled={false}
        sections={sections}
        renderItem={({ item }) => {
          const {
            title,
            description,
            value,
            loading,
            onPress,
            onToggle,
          } = item;

          return (
            <List.Item
              style={{ opacity: onPress ? 1 : 0.4 }}
              title={title}
              description={description}
              onPress={onPress}
              right={() => {
                if (onToggle) {
                  return (
                    <Switch
                      trackColor={{ false: 'grey', true: colors.SECONDARY }}
                      value={value}
                      onValueChange={onToggle}
                    />
                  );
                }

                if (loading) {
                  return (
                    <ActivityIndicator
                      style={styles.spinner}
                      color={colors.SECONDARY}
                      size={24}
                    />
                  );
                }

                return null;
              }}
            />
          );
        }}
        renderSectionHeader={({ section }) => {
          const { title } = section;

          return (
            <View style={styles.sectionHeader}>
              <List.Subheader style={styles.sectionHeaderText}>
                {title}
              </List.Subheader>
            </View>
          );
        }}
        renderSectionFooter={() => <View style={styles.sectionFooter} />}
        keyExtractor={(item) => item.title}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  sectionHeader: {
    paddingVertical: 4,
  },
  sectionHeaderText: {
    color: colors.SECONDARY,
  },
  sectionFooter: {
    paddingVertical: 4,
    backgroundColor: '#111',
  },
  spinner: {
    marginRight: 14,
  },
});

export default Settings;
