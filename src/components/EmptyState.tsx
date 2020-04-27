import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';

type Props = {
  style?: StyleProp<ViewStyle>;
  icon: string;
  heading?: string;
  subheading?: string;
};

const EmptyState: React.FC<Props> = (props) => {
  const { style, icon, heading = '', subheading = '' } = props;

  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons
        style={styles.icon}
        name={icon}
        size={120}
        color="#aaa"
      />

      <Text style={styles.heading}>{heading}</Text>

      <Text style={styles.subheading}>{subheading}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'black',
  },
  icon: {
    margin: 8,
  },
  heading: {
    margin: 8,
    textAlign: 'center',
    fontSize: 26,
    color: '#aaa',
  },
  subheading: {
    margin: 8,
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
  },
});

export default EmptyState;
