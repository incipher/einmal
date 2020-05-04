import * as SecureStore from 'expo-secure-store';

export const get = async <T>(key: string): Promise<T | null> => {
  return JSON.parse(await SecureStore.getItemAsync(key));
};

export const set = <T>(key: string, value: T): Promise<void> => {
  return SecureStore.setItemAsync(key, JSON.stringify(value));
};

export const remove = (key: string): Promise<void> => {
  return SecureStore.deleteItemAsync(key);
};
