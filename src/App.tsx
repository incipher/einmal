import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { AppLoading } from 'expo';
import {
  readAsStringAsync,
  deleteAsync,
  documentDirectory,
} from 'expo-file-system';
import { Asset } from 'expo-asset';
import { ThemeProvider, DarkTheme, Theme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Welcome, SetupAuthentication, Home } from './screens';
import { GlobalStateProvider } from './hooks';
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
  const [vault, setVault] = useState(null);
  const [isReady, setReady] = useState(false);

  const loadAssets = async () => {
    if (settings.shouldReset) {
      await Promise.all([deleteVault()]);
    }

    await Promise.all([loadVault(), loadImages()]);
  };

  const deleteVault = async () => {
    const vaultPath = documentDirectory + 'vault.json';

    try {
      await deleteAsync(vaultPath);
    } catch (error) {
      console.log('Failed to delete vault');
    }
  };

  const loadVault = async () => {
    const vaultPath = documentDirectory + 'vault.json';

    try {
      const vaultContents = await readAsStringAsync(vaultPath);
      const parsedVaultContents = JSON.parse(vaultContents);

      setVault(parsedVaultContents);
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
        <GlobalStateProvider vault={vault}>
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
                      name="SetupAuthentication"
                      component={SetupAuthentication}
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
