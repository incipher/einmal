import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { TokensList } from './screens';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TokensList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
