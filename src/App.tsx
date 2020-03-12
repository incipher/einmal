import React from 'react';
import { ThemeProvider, DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TokensList } from './screens';
import { GlobalStateProvider } from './hooks';

const Stack = createStackNavigator();

function App() {
  return (
    <ThemeProvider theme={DefaultTheme}>
      <GlobalStateProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={TokensList} />
          </Stack.Navigator>
        </NavigationContainer>
      </GlobalStateProvider>
    </ThemeProvider>
  );
}

export default App;
