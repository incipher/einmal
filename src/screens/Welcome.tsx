import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Welcome: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View />

      <View>
        <Text style={styles.header}>
          Safeguard yourself with two-factor authentication.
        </Text>

        <Button
          mode="contained"
          onPress={() => {
            navigation.navigate('SetupAuthentication');
          }}
        >
          Get Started
        </Button>
      </View>

      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'black',
  },
  header: {
    marginVertical: 24,
    fontSize: 32,
  },
});

export default Welcome;
