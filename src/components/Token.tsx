import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, TouchableRipple } from 'react-native-paper';

type Props = {
  issuer: string;
  token: string;
  onPress?: (data: { issuer: string; token: string }) => void;
};

const Token: React.FC<Props> = (props) => {
  const { issuer, token, onPress } = props;

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
          <Text style={styles.token}>
            {[token?.substring(0, 3), ' ', token?.substring(3, 6)]}
          </Text>

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
  },
  issuer: {
    fontSize: 16,
  },
});

export default Token;
