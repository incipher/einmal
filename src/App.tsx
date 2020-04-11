import React, { useState } from 'react';
import { SafeAreaView, Image, StatusBar, StyleSheet } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import {
  Provider as ThemeProvider,
  DarkTheme,
  Theme,
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Welcome, AuthenticationSetup, Home, BarcodeScanner } from './screens';
import { GlobalStateProvider, SnackbarProvider } from './hooks';
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
      await vault.clear();
    } catch (error) {
      console.log('Failed to delete vault');
    }
  };

  const loadVault = async () => {
    try {
      const loadedVault = await vault.get();
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
        <SnackbarProvider>
          <GlobalStateProvider vault={initialVault}>
            {(globalState) => (
              <NavigationContainer>
                <Stack.Navigator>
                  {globalState.vault ? (
                    <>
                      <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{
                          headerTitle: null,
                          headerStyle: {
                            backgroundColor: 'black',
                            borderBottomColor: 'grey',
                            borderBottomWidth: 0.5,
                          },
                          headerLeft: () => (
                            <Image
                              style={{
                                width: 20,
                                height: 20,
                                marginHorizontal: 16,
                              }}
                              source={require('../assets/logo.png')}
                            />
                          ),
                        }}
                      />
                      <Stack.Screen
                        name="BarcodeScanner"
                        component={BarcodeScanner}
                        options={{ headerShown: false }}
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
        </SnackbarProvider>
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
