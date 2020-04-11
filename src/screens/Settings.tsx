import React from 'react';
import { View, SectionList, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { settings } from '../constants';

const Settings: React.FC = () => {
  const navigation = useNavigation();

  const sections = [
    {
      title: 'Vault',
      data: [
        {
          title: 'Cloud backup',
          description: 'Backup encrypted vault to the cloud',
          onPress: () => {},
        },
        {
          title: 'Import',
          description: 'Import vault from a file',
          onPress: () => {},
        },
        {
          title: 'Export',
          description: 'Export the vault',
          onPress: () => {},
        },
        {
          title: 'Clear',
          description: 'Delete vault contents',
          onPress: () => {},
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
