import * as React from 'react';
import { ThemeProvider, DefaultTheme, Theme } from 'react-native-paper';
import { Home } from './screens';
import { BarcodeScanner } from './components';
import { parseOtpAuthUri } from './utilities';
import { colors } from './constants';

type Props = {};

type State = {};

export default class App extends React.Component<Props, State> {
  state: State = {};

  _handleCodeScan = (uri: string) => {
    console.log('URI >', uri);
    console.log('PARSED URI >', parseOtpAuthUri(uri));
  };

  render() {
    const theme: Theme = {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: colors.PRIMARY,
        accent: colors.PRIMARY,
      },
      fonts: {
        ...DefaultTheme.fonts,
      },
    };

    return (
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    );
  }
}
