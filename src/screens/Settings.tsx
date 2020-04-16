import React from 'react';
import { View, SectionList, StyleSheet } from 'react-native';
import { List, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useGlobalState, useInteractables } from '../hooks';
import { settings } from '../constants';
import { Sections } from '../types';

type Setting = {
  title: string;
  description: string;
  value?: boolean;
  onPress?: () => void;
  onToggle?: () => void;
};

const Settings: React.FC = () => {
  const [globalState, globalDispatch] = useGlobalState();
  const { showSnackbar, showDialog } = useInteractables();
  const navigation = useNavigation();

  const sections: Sections<Setting> = [
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
                  onPress: () => {
                    globalDispatch({ type: 'CLEAR_VAULT' });
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
          title: 'Conceal tokens',
          description: 'Tap to reveal tokens individually',
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
          const { title, description, value, onPress, onToggle } = item;

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
                      trackColor={{ false: 'grey', true: '#009999' }}
                      value={value}
                      onValueChange={onToggle}
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
    color: '#60d6c4',
  },
  sectionFooter: {
    paddingVertical: 4,
    backgroundColor: '#111',
  },
});

export default Settings;
