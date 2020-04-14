import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, TouchableRipple } from 'react-native-paper';
import {
  set,
  interpolate,
  concat,
  useCode,
  Value,
  Easing,
} from 'react-native-reanimated';
import { timing } from 'react-native-redash';
import ReText from './ReText';
import { usePrevious } from '../hooks';
import { splitAt } from '../utilities';

type Props = {
  issuer: string;
  token: string;
  onPress?: (data: { issuer: string; token: string }) => void;
};

const Token: React.FC<Props> = (props) => {
  const { issuer, token, onPress } = props;

  const currentToken = token ?? '000000';
  const previousToken = usePrevious(token) ?? '000000';

  const progress = new Value(0);

  useCode(() => {
    return set(
      progress,
      timing({ from: 0, to: 1, duration: 200, easing: Easing.linear }),
    );
  }, [token]);

  /**
   * Token digits are animated individually, for two reasons:
   *
   * 1. When the token as a whole is fed into the interpolation function,
   *    leading zeroes are ignored. For example: if the token "012345" is
   *    generated, we end up with the interpolated value of "12345.0".
   *
   * 2. Padding the token in the middle (so "123456" becomes "123 456", for
   *    a better UX) is impossible due to the limited available operations
   *    on string animated values.
   */
  const tokenDigits = Array.from({ length: 6 }, (_, index) => {
    return interpolate(progress, {
      inputRange: [0, 1],
      outputRange: [Number(previousToken[index]), Number(currentToken[index])],
    });
  });

  const [firstThreeTokenDigits, lastThreeTokenDigits] = splitAt(3)(tokenDigits);

  return (
    <TouchableRipple
      style={styles.container}
      onPress={() => {
        onPress?.({ issuer, token });
      }}
    >
      <>
        {false /* TODO: If favicon exists */ ? (
          <Avatar.Image
            style={styles.avatar}
            size={48}
            source={{ uri: null }}
          />
        ) : (
          <Avatar.Text
            style={styles.avatar}
            size={48}
            label={issuer.substring(0, 1)}
          />
        )}

        <View>
          <View style={styles.tokenContainer}>
            {firstThreeTokenDigits.map((digit, index) => (
              <ReText
                key={index}
                style={styles.tokenText}
                text={concat(digit)}
                maxLength={1}
              />
            ))}

            <View style={styles.tokenSeparator} />

            {lastThreeTokenDigits.map((digit, index) => (
              <ReText
                key={index}
                style={styles.tokenText}
                text={concat(digit)}
                maxLength={1}
              />
            ))}
          </View>

          <Text style={styles.issuer}>{issuer}</Text>
        </View>
      </>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    marginRight: 24,
  },
  tokenContainer: {
    flexDirection: 'row',
  },
  tokenText: {
    fontSize: 36,
    color: 'white',
  },
  tokenSeparator: {
    marginHorizontal: 4,
  },
  issuer: {
    fontSize: 16,
  },
});

export default Token;
