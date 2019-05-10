import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarCodeScanner, BarCodeScannedCallback } from 'expo';
import { acquireCameraPermission } from '../utilities';

type Props = {
  onCodeScan: (uri: string) => any;
};

type State = {
  hasCameraPermission: boolean | null;
  isCodeScanned: boolean;
};

export default class BarcodeScanner extends React.Component<Props, State> {
  state: State = {
    hasCameraPermission: null,
    isCodeScanned: false,
  };

  async componentDidMount() {
    const hasCameraPermission = await acquireCameraPermission();
    this.setState({ hasCameraPermission });
  }

  _handleCodeScan: BarCodeScannedCallback = result => {
    this.setState({ isCodeScanned: true });
    this.props.onCodeScan(result.data);
  };

  render() {
    const { hasCameraPermission, isCodeScanned } = this.state;

    if (!hasCameraPermission) {
      return (
        <View style={styles.container}>
          <Text>Camera permission not granted</Text>
        </View>
      );
    }

    return (
      <BarCodeScanner
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={isCodeScanned ? undefined : this._handleCodeScan}
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
