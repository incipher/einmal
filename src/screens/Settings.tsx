import React from 'react';
import { View, SectionList, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useGlobalState, useInteractables } from '../hooks';
import * as vault from '../vault';
import { settings } from '../constants';

const Settings: React.FC = () => {
  const [, globalDispatch] = useGlobalState();
  const { showSnackbar, showDialog } = useInteractables();
  const navigation = useNavigation();

  const sections = [
    {
      title: 'Vault',
      data: [
        {
          title: 'Change password',
          description: 'Set a new password to the vault',
          onPress: () => {
            showSnackbar('Coming soon');
          },
        },
        {
          title: 'Cloud backup',
          description: 'Back up encrypted vault to the cloud',
          onPress: () => {
            showSnackbar('Coming soon');
          },
        },
        {
          title: 'Import',
          description: 'Import vault from a file',
          onPress: () => {
            showSnackbar('Coming soon');
          },
        },
        {
          title: 'Export',
          description: 'Export vault to a file',
          onPress: () => {
            showSnackbar('Coming soon');
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
                  text: 'Clear vault',
                  onPress: async () => {
                    try {
                      await vault.set([]);
                      globalDispatch({ type: 'CLEAR_VAULT' });

                      showSnackbar('Vault cleared');
                      navigation.navigate('Home');
                    } catch (error) {
                      console.log('Failed to write vault');
                    }
                  },
                },
              ],
            });
          },
        },
      ],
    },
    {
      title: 'About',
      data: [
        {
          title: 'Version',
          description: settings.version,
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
          const { title, description, onPress } = item;

          return (
            <List.Item
              style={{ opacity: onPress ? 1 : 0.4 }}
              title={title}
              description={description}
              onPress={onPress}
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
    color: '#60d6c4',
  },
  sectionFooter: {
    paddingVertical: 4,
    backgroundColor: '#111',
  },
});

export default Settings;
