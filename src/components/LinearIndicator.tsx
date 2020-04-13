import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  block,
  set,
  eq,
  not,
  cond,
  timing,
  interpolate,
  useCode,
  Value,
  Clock,
  Node,
  Easing,
  clockRunning,
  startClock,
} from 'react-native-reanimated';
import { interpolateColor } from 'react-native-redash';
import { useMemoOne } from 'use-memo-one';
import { useDimensions } from '@react-native-community/hooks';

type Props = {
  initialProgress?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
};

const LinearIndicator: React.FC<Props> = (props) => {
  const { initialProgress = 0, duration = 1000, style } = props;

  const {
    window: { width: windowWidth },
  } = useDimensions();

  const { progress, clock } = useMemoOne(
    () => ({
      progress: new Value(0),
      clock: new Clock(),
    }),
    [],
  );

  useCode(
    () => block([set(progress, runLoop({ clock, initialProgress, duration }))]),
    [],
  );

  const right = interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [0, windowWidth],
  });

  const backgroundColor = interpolateColor(
    progress,
    {
      inputRange: [0, 1],
      outputRange: ['green', 'red'],
    },
    'hsv',
  );

  const animatedStyle = {
    right,
    backgroundColor,
  };

  const baseStyle = {
    flex: 1,
    backgroundColor: '#591EE5',
  };

  return <Animated.View style={[baseStyle, style, animatedStyle]} />;
};

const runLoop = ({
  clock,
  initialProgress,
  duration,
}: {
  clock: Clock;
  initialProgress: number;
  duration: number;
}): Node<number> => {
  const state = {
    /* Start first loop at an initial position */
    position: new Value(initialProgress),
    finished: new Value(0),
    frameTime: new Value(0),
    time: new Value(0),
  };

  const configuration = {
    /* Duration of the initial progress is subtracted from the full duration */
    duration: new Value(duration - duration * initialProgress),
    toValue: new Value(1),
    easing: Easing.linear,
  };

  return block([
    /* If clock is not running, start it automatically */
    cond(not(clockRunning(clock)), startClock(clock)),
    /* Update position by running a timing based animation */
    timing(clock, state, configuration),
    /* When animation finishes, restart it */
    cond(eq(state.finished, 1), [
      set(state.finished, 0),
      set(state.position, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
      set(configuration.duration, duration),
    ]),
    /* Return position */
    state.position,
  ]);
};

export default LinearIndicator;
