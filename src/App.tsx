import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import { ThemeProvider, DarkTheme, Theme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Welcome, SetupAuthentication, Home } from './screens';
import { GlobalStateProvider } from './hooks';

const theme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: 'white',
    background: 'black',
  },
};

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [isReady, setReady] = useState(false);

  const loadAssets = async () => {
    await Asset.loadAsync([require('../assets/logo.png')]);
  };

  if (!isReady) {
    return (
      <AppLoading
        startAsync={loadAssets}
        onFinish={() => {
          setReady(true);
        }}
        onError={console.warn}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ThemeProvider theme={theme}>
        <GlobalStateProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome">
              <Stack.Screen
                name="Welcome"
                component={Welcome}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SetupAuthentication"
                component={SetupAuthentication}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Home"
                component={Home}
                options={{
                  headerTitle: 'Einmal',
                  headerStyle: {
                    backgroundColor: 'black',
                  },
                  headerTitleStyle: {
                    color: 'white',
                  },
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </GlobalStateProvider>
      </ThemeProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
