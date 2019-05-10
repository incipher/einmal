import * as React from 'react';
import { parse } from 'url-otpauth';
import { BarcodeScanner } from './components';

type Props = {};

type State = {};

export default class App extends React.Component<Props, State> {
  state: State = {};

  _handleCodeScan = (url: string) => {
    console.log('URL >', url);
    console.log('PARSED URL >', parse(url));
  };

  render() {
    return <BarcodeScanner onCodeScan={this._handleCodeScan} />;
  }
}
