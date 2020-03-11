import React from 'react';
import { SafeAreaView, FlatList, StyleSheet } from 'react-native';
import { Totp } from './components';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={accounts}
        renderItem={({ item }) => {
          return <Totp style={styles.text} secret={item.secret} />;
        }}
        keyExtractor={(_, index) => String(index)}
      />
    </SafeAreaView>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 40,
  },
});

export default App;
