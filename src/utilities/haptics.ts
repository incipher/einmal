import * as haptics from 'expo-haptics';

export const actuateHapticFeedback = async (): Promise<void> => {
  await haptics.selectionAsync();
};
