import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Welcome: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View>
        <Image style={styles.logo} source={require('../../assets/logo.png')} />

        <Text style={styles.header}>
          Protect your online accounts against hijacking attacks
        </Text>

        <Button
          mode="contained"
          onPress={() => {
            navigation.navigate('AuthenticationSetup');
          }}
        >
          Get Started
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'black',
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 40,
    width: 75,
    height: 75 * 1.32,
  },
  header: {
    marginVertical: 24,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default Welcome;
