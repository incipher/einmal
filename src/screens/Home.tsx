import * as React from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Clipboard,
} from 'react-native';
import { Text, TouchableRipple, Snackbar } from 'react-native-paper';
import ProgressCircle from 'react-native-progress-circle';
import { compose, withClock, ClockData } from '../hocs';

type Props = {} & ClockData;

type State = {
  snackbarText: string;
};

/* TODO: Facilitate manual token creation */
/* TODO: Facilitate token deletion */

class Home extends React.Component<Props, State> {
  state: State = {
    snackbarText: '',
  };

  render() {
    const { seconds } = this.props;
    const { snackbarText } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={accounts}
          renderItem={({ item }) => {
            const { issuer, account, token } = item;

            const tokenString = String(token);
            const tokenFirstHalf = tokenString.substring(0, 3);
            const tokenSecondHalf = tokenString.substring(3, 6);

            return (
              <TouchableRipple
                style={styles.listItemContainer}
                rippleColor="rgba(0, 0, 0, .10)"
                onPress={() => {}}
                onLongPress={() => {
                  Clipboard.setString(tokenString);
                  this.setState({ snackbarText: 'Copied to clipboard' });
                }}
              >
                <>
                  <Text style={styles.issuerText}>{issuer}</Text>

                  <Text style={styles.accountText}>{account}</Text>

                  <Text style={styles.tokenText}>
                    {`${tokenFirstHalf} ${tokenSecondHalf}`}
                  </Text>

                  <ProgressCircle
                    color="#3399ff"
                    shadowColor="#bcbcbc"
                    bgColor="white"
                    radius={12}
                    borderWidth={2}
                    percent={((seconds % 30) * 100) / 30}
                  />
                </>
              </TouchableRipple>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.listItemDivider} />}
          ListFooterComponent={<View style={styles.listItemDivider} />}
          keyExtractor={(_, index) => String(index)}
        />

        <Snackbar
          visible={Boolean(snackbarText)}
          duration={Snackbar.DURATION_SHORT}
          onDismiss={() => this.setState({ snackbarText: '' })}
        >
          {snackbarText}
        </Snackbar>
      </SafeAreaView>
    );
  }
}

const accounts = [
  {
    issuer: 'github.com',
    account: 'john@email.com',
    token: 123456,
  },
  {
    issuer: 'gitlab.com',
    account: 'john@email.com',
    token: 654321,
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 32,
    backgroundColor: '#f5f5f5',
  },
  listItemContainer: {
    padding: 8,
    backgroundColor: 'white',
  },
  listItemDivider: {
    padding: 8,
  },
  issuerText: {
    fontSize: 24,
  },
  accountText: {
    color: 'grey',
  },
  tokenText: {
    fontSize: 32,
    color: '#0f7ebf',
  },
});

export default compose<Props, {}>(withClock)(Home);
