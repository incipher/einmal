import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import {
  Provider as ThemeProvider,
  DarkTheme,
  Theme,
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Welcome, AuthenticationSetup, Home } from './screens';
import { GlobalStateProvider } from './hooks';
import * as vault from './vault';
import { settings } from './constants';

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
  const [initialVault, setInitialVault] = useState(null);
  const [isReady, setReady] = useState(false);

  const loadAssets = async () => {
    if (settings.shouldReset) {
      await Promise.all([deleteVault()]);
    }

    await Promise.all([loadVault(), loadImages()]);
  };

  const deleteVault = async () => {
    try {
      await vault.erase();
    } catch (error) {
      console.log('Failed to erase vault');
    }
  };

  const loadVault = async () => {
    try {
      const loadedVault = await vault.load();
      setInitialVault(loadedVault);
    } catch (error) {
      console.log('Failed to load vault');
    }
  };

  const loadImages = async () => {
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
        <GlobalStateProvider vault={initialVault}>
          {globalState => (
            <NavigationContainer>
              <Stack.Navigator>
                {globalState.data.vault ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <Stack.Screen
                      name="Welcome"
                      component={Welcome}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="AuthenticationSetup"
                      component={AuthenticationSetup}
                      options={{ headerShown: false }}
                    />
                  </>
                )}
              </Stack.Navigator>
            </NavigationContainer>
          )}
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
