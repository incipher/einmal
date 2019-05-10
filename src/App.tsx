import * as React from 'react';
import { View, Text, LayoutAnimation, StyleSheet } from 'react-native';
import { Permissions, BarCodeScanner, BarCodeScannedCallback } from 'expo';
import { parse } from 'url-otpauth';

type Props = {};

type State = {
  hasCameraPermission: boolean | null;
  scannedUrl: string | null;
};

export default class App extends React.Component<Props, State> {
  state: State = {
    hasCameraPermission: null,
    scannedUrl: null,
  };

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeScan: BarCodeScannedCallback = result => {
    if (result.data !== this.state.scannedUrl) {
      LayoutAnimation.spring();

      const { data: scannedUrl } = result;

      this.setState({ scannedUrl });

      console.log('SCANNED URL >', scannedUrl);
      console.log('PARSED SCANNED URL >', parse(scannedUrl));
    }
  };

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return (
        <View style={styles.container}>
          <Text>Requesting camera permission</Text>
        </View>
      );
    }

    if (hasCameraPermission === false) {
      return (
        <View style={styles.container}>
          <Text>Camera permission not granted</Text>
        </View>
      );
    }

    return (
      <BarCodeScanner
        style={styles.container}
        onBarCodeScanned={this._handleBarCodeScan}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
