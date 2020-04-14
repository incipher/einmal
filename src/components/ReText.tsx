import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import Animated from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type TextProps = TextInputProps & {
  text: Animated.Node<string>;
};

const ReText: React.FC<TextProps> = (props) => {
  const { text, ...rest } = props;

  return (
    <AnimatedTextInput
      text={text}
      underlineColorAndroid="transparent"
      editable={false}
      {...rest}
    />
  );
};

export default ReText;
