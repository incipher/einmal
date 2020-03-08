import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { authenticatorToken } from './crypto';

export default function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const totp = authenticatorToken('CFNMN7VBAIC5XYVG');
      setToken(totp);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{token}</Text>
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
