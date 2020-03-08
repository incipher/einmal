import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Totp } from './components';

export default function App() {
  return (
    <View style={styles.container}>
      <Totp style={styles.text} secret="CFNMN7VBAIC5XYVG" />
    </View>
  );
}

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
