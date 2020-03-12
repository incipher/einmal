import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Avatar, TouchableRipple } from 'react-native-paper';
import { Totp } from '../components';

const TokensList: React.FC = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
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
                  source={{ uri: item.issuer.icon }}
                />

                <View>
                  <Totp style={styles.text} secret={item.secret} />

                  <Text>{item.issuer.name}</Text>
                </View>
              </>
            </TouchableRipple>
          );
        }}
        ListHeaderComponent={<View style={styles.listItemDivider} />}
        ItemSeparatorComponent={() => <View style={styles.listItemDivider} />}
        ListFooterComponent={<View style={styles.listItemDivider} />}
        keyExtractor={(_, index) => String(index)}
      />
    </View>
  );
};

const accounts = [
  {
    account: 'john@example.com',
    secret: 'CFNMN7VBAIC5XYVG',
    issuer: {
      name: 'GitHub',
      icon:
        'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fnewmerator.github.io%2Fblacktocat.png&f=1&nofb=1',
    },
  },
  {
    account: 'john@example.com',
    secret: 'CFNMN7VBAIC5XYVG',
    issuer: {
      name: 'npm',
      icon:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Favatars2.githubusercontent.com%2Fu%2F6078720%3Fs%3D400%26v%3D4&f=1&nofb=1',
    },
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 32,
    backgroundColor: '#f5f5f5',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  avatar: {
    marginRight: 16,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 26,
    color: '#0F52BA',
  },
  listItemDivider: {
    padding: 8,
  },
});

export default TokensList;
