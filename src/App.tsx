import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ThemeProvider, DefaultTheme } from 'react-native-paper';
import { TokensList } from './screens';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ThemeProvider theme={DefaultTheme}>
        <TokensList />
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
