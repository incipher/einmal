import { getRandomBytesAsync } from 'expo-random';

export const generateRandomBytes = (count: number): Promise<Uint8Array> => {
  return getRandomBytesAsync(count);
};
