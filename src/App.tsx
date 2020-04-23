import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import {
  configureFonts,
  Provider as ThemeProvider,
  DarkTheme,
  Theme,
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Welcome,
  AuthenticationSetup,
  Authentication,
  Home,
  Sorting,
  BarcodeScanner,
  Settings,
} from './screens';
import { GlobalStateProvider, InteractablesProvider } from './hooks';
import * as vault from './vault';
import * as storage from './async-storage';
import { configuration } from './constants';

const theme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: 'white',
    background: 'black',
  },
  fonts: configureFonts({
    default: {
      regular: {
        fontFamily: 'Inter-Regular',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'Inter-Medium',
        fontWeight: 'normal',
      },
      light: {
        fontFamily: 'Inter-Light',
        fontWeight: 'normal',
      },
      thin: {
        fontFamily: 'Inter-Thin',
        fontWeight: 'normal',
      },
    },
  }),
};

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [doesVaultExist, setDoesVaultExist] = useState(false);
  const [initialSettings, setInitialSettings] = useState(null);
  const [isReady, setReady] = useState(false);

  const loadAssets = async () => {
    if (configuration.shouldReset) {
      await Promise.all([deleteVault(), storage.clear()]);
    }

    await Promise.all([
      checkVault(),
      loadSettings(),
      loadImages(),
      loadFonts(),
    ]);
  };

  const deleteVault = async () => {
    try {
      await vault.clear();
    } catch (error) {
      console.log('Failed to delete vault');
    }
  };

  const checkVault = async () => {
    const doesVaultExist = await vault.exists();
    setDoesVaultExist(doesVaultExist);
  };

  const loadSettings = async () => {
    const loadedSettings = {
      concealTokens: (await storage.getConcealTokens()) ?? false,
    };

    setInitialSettings(loadedSettings);
  };

  const loadImages = async () => {
    await Asset.loadAsync([require('../assets/logo.png')]);
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
      'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
      'Inter-Light': require('../assets/fonts/Inter-Light.ttf'),
      'Inter-Thin': require('../assets/fonts/Inter-Thin.ttf'),
      'IBMPlexMono-Regular': require('../assets/fonts/IBMPlexMono-Regular.ttf'),
    });
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
        <InteractablesProvider>
          <GlobalStateProvider settings={initialSettings}>
            {(globalState) => (
              <NavigationContainer>
                <Stack.Navigator
                  initialRouteName={
                    doesVaultExist ? 'Authentication' : 'Welcome'
                  }
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: 'black',
                    },
                    headerTitleStyle: {
                      color: 'white',
                    },
                    headerBackTitleStyle: {
                      color: 'white',
                    },
                    headerTintColor: 'white',
                  }}
                >
                  {globalState.vault ? (
                    <>
                      <Stack.Screen name="Home" component={Home} />
                      <Stack.Screen name="Sorting" component={Sorting} />
                      <Stack.Screen
                        name="BarcodeScanner"
                        component={BarcodeScanner}
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen name="Settings" component={Settings} />
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
                      <Stack.Screen
                        name="Authentication"
                        component={Authentication}
                        options={{ headerShown: false }}
                      />
                    </>
                  )}
                </Stack.Navigator>
              </NavigationContainer>
            )}
          </GlobalStateProvider>
        </InteractablesProvider>
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
