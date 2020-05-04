import { get, set, remove } from './generic';
import { keys } from './keys';

export const getPassword = (): Promise<string | null> => {
  return get(keys.PASSWORD);
};

export const setPassword = (password: string): Promise<void> => {
  return set(keys.PASSWORD, password);
};

export const removePassword = (): Promise<void> => {
  return remove(keys.PASSWORD);
};
