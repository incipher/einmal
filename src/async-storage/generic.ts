import { AsyncStorage } from 'react-native';

export const get = async <T>(key: string): Promise<T | null> => {
  return JSON.parse(await AsyncStorage.getItem(key));
};

export const set = (key: string, value: any): Promise<void> => {
  return AsyncStorage.setItem(key, JSON.stringify(value));
};

export const remove = (key: string): Promise<void> => {
  return AsyncStorage.removeItem(key);
};

export const clear = (): Promise<void> => {
  return AsyncStorage.clear();
};
