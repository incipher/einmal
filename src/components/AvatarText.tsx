import React, { memo } from 'react';
import { StyleProp, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
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
    <LinearGradient
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
      colors={[randomColor(), 'transparent']}
    >
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </LinearGradient>
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
