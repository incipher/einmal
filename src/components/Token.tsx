import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, TouchableRipple } from 'react-native-paper';
import Animated, {
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
          <ReText
            style={styles.token}
            text={concat('', animatedToken)}
            maxLength={6}
          />

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
  token: {
    fontSize: 36,
    color: 'white',
  },
  issuer: {
    fontSize: 16,
  },
});

export default Token;
