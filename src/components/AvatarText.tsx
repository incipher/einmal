import React, { memo } from 'react';
import {
  View,
  StyleProp,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Text } from 'react-native-paper';
import randomColor from 'randomcolor';

type Props = {
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  size: number;
  label: string;
};

const AvatarText: React.FC<Props> = (props) => {
  const { style, labelStyle, size, label } = props;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: randomColor({ luminosity: 'dark' }),
        },
        style,
      ]}
    >
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  label: {
    fontSize: 24,
  },
});

export default memo(AvatarText, (previousProps, nextProps) => {
  return (
    previousProps.size === nextProps.size &&
    previousProps.label === nextProps.label
  );
});
