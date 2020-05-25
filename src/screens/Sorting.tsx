import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Avatar } from 'react-native-paper';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { EmptyState } from '../components';
import { useGlobalState } from '../hooks';

const Sorting: React.FC = () => {
  const [globalState, globalDispatch] = useGlobalState();

  return (
    <View style={styles.container}>
      <DraggableFlatList
        contentContainerStyle={styles.listContentContainer}
        data={globalState.vault.entries}
        renderItem={({ item, isActive, drag }) => (
          <TouchableHighlight
            style={[
              styles.listItemContainer,
              { backgroundColor: isActive ? 'rgba(50, 50, 50, 0.5)' : 'black' },
            ]}
            onPress={() => {}}
            onPressIn={drag}
          >
            <View style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <Avatar.Text
                  style={styles.avatar}
                  size={40}
                  label={item.issuer.substring(0, 1).toUpperCase()}
                />

                <Text style={styles.issuer}>{item.issuer}</Text>
              </View>
              <MaterialCommunityIcons
                name="reorder-horizontal"
                color="white"
                size={26}
              />
            </View>
          </TouchableHighlight>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="sort"
            heading="No entries to sort"
            subheading="Add accounts to enable sorting"
          />
        }
        keyExtractor={(item) => [item.issuer, item.account].join(':')}
        onDragEnd={({ data }) => {
          globalDispatch({ type: 'SET_VAULT_ENTRIES', vaultEntries: data });
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
  listItemContainer: {
    height: 56,
    padding: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 24,
  },
  issuer: {
    fontSize: 18,
  },
});

export default Sorting;
