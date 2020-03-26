import Constants from 'expo-constants';

export const isPhysicalDevice = (): boolean => {
  return Constants.isDevice;
};
