import * as React from 'react';
import { BarcodeScanner } from './components';
import { parseOtpAuthUri } from './utilities';

type Props = {};

type State = {};

export default class App extends React.Component<Props, State> {
  state: State = {};

  _handleCodeScan = (uri: string) => {
    console.log('URI >', uri);
    console.log('PARSED URI >', parseOtpAuthUri(uri));
  };

  render() {
    return <BarcodeScanner onCodeScan={this._handleCodeScan} />;
  }
}
