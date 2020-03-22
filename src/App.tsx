import React from 'react';
import { ThemeProvider, DarkTheme, Theme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Welcome, SetupAuthentication, TokensList } from './screens';
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
  return (
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
            <Stack.Screen name="Home" component={TokensList} />
          </Stack.Navigator>
        </NavigationContainer>
      </GlobalStateProvider>
    </ThemeProvider>
  );
};

export default App;
