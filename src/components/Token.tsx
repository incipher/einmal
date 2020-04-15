import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, TouchableRipple } from 'react-native-paper';
import {
  block,
  set,
  cond,
  and,
  lessThan,
  greaterOrEq,
  concat,
  interpolate,
  useCode,
  Value,
  Node,
  Easing,
} from 'react-native-reanimated';
import { timing } from 'react-native-redash';
import ReText from './ReText';
import { usePrevious } from '../hooks';

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
      timing({ from: 0, to: 1, duration: 400, easing: Easing.linear }),
    );
  }, [token]);

  const animatedToken = interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [Number(previousToken), Number(currentToken)],
  });

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
            <ReText
              style={styles.tokenText}
              text={padToken(animatedToken)}
              maxLength={6}
            />
          </View>

          <Text style={styles.issuer}>{issuer}</Text>
        </View>
      </>
    </TouchableRipple>
  );
};

const padToken = (token: Node<number>): Node<string> => {
  const paddedToken = new Value<string>();

  return block([
    cond(and(greaterOrEq(token, 100000), lessThan(token, 1000000)), [
      set(paddedToken, concat(token)),
    ]),
    cond(and(greaterOrEq(token, 10000), lessThan(token, 100000)), [
      set(paddedToken, concat('0', token)),
    ]),
    cond(and(greaterOrEq(token, 1000), lessThan(token, 10000)), [
      set(paddedToken, concat('00', token)),
    ]),
    cond(and(greaterOrEq(token, 100), lessThan(token, 1000)), [
      set(paddedToken, concat('000', token)),
    ]),
    cond(and(greaterOrEq(token, 10), lessThan(token, 100)), [
      set(paddedToken, concat('0000', token)),
    ]),
    cond(and(greaterOrEq(token, 0), lessThan(token, 10)), [
      set(paddedToken, concat('00000', token)),
    ]),
    paddedToken,
  ]);
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
    fontFamily: 'Inter-Regular',
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
