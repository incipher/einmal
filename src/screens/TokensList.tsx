import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Totp } from '../components';

const TokensList: React.FC = () => {
  return (
    <FlatList
      data={accounts}
      renderItem={({ item }) => {
        return <Totp style={styles.text} secret={item.secret} />;
      }}
      keyExtractor={(_, index) => String(index)}
    />
  );
};

const accounts = [
  {
    issuer: 'github.com',
    account: 'john@example.com',
    secret: 'CFNMN7VBAIC5XYVG',
  },
  {
    issuer: 'npmjs.com',
    account: 'john@example.com',
    secret: 'CFNMN7VBAIC5XYVG',
  },
];

const styles = StyleSheet.create({
  text: {
    fontSize: 40,
  },
});

export default TokensList;
