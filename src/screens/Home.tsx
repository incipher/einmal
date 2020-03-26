import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Avatar, TouchableRipple, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Totp } from '../components';
import { useGlobalState } from '../hooks';

const Home: React.FC = () => {
  const [globalState] = useGlobalState();
  const { vault } = globalState.data;

  const navigation = useNavigation();

  const [isFABGroupOpen, setFABGroupOpen] = useState(false);

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContentContainer}
        data={vault}
        renderItem={({ item }) => {
          return (
            <TouchableRipple
              style={styles.listItem}
              rippleColor="rgba(0, 0, 0, .10)"
              onPress={() => {}}
            >
              <>
                <Avatar.Image
                  style={styles.avatar}
                  size={32}
                  source={{ uri: null }}
                />

                <View>
                  <Totp style={styles.text} secret={item.key} />

                  <Text>{item.issuer}</Text>
                </View>
              </>
            </TouchableRipple>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <MaterialCommunityIcons
              style={styles.emptyStateIcon}
              name="shield-plus-outline"
              size={120}
              color="#aaa"
            />

            <Text style={styles.emptyStateHeading}>Your vault is empty</Text>

            <Text style={styles.emptyStateSubheading}>
              Configure your accounts to use two-step verification
            </Text>
          </View>
        }
        ListHeaderComponent={<View style={styles.listItemDivider} />}
        ItemSeparatorComponent={() => <View style={styles.listItemDivider} />}
        ListFooterComponent={<View style={styles.listItemDivider} />}
        keyExtractor={(_, index) => String(index)}
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
  listItemDivider: {
    padding: 8,
  },
  fab: {
    marginVertical: 16,
    marginHorizontal: 8,
  },
});

export default Home;
