global.Buffer = global.Buffer || require('buffer').Buffer;

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { totpToken, totpOptions, KeyEncodings } from '@otplib/core';
import { createDigest } from '@otplib/plugin-crypto-js';
import { keyDecoder } from '@otplib/plugin-base32-enc-dec';

export default function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const secret = 'CFNMN7VBAIC5XYVG';

      const totp = totpToken(
        keyDecoder(secret, KeyEncodings.HEX),
        totpOptions({
          createDigest,
          encoding: KeyEncodings.HEX,
        }),
      );

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
