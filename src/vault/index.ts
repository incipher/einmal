import {
  readAsStringAsync,
  writeAsStringAsync,
  deleteAsync,
  documentDirectory,
} from 'expo-file-system';
import { Vault } from '../types';

const VAULT_PATH = documentDirectory + 'vault.json';

export const get = async (): Promise<Vault> => {
  const vault = await readAsStringAsync(VAULT_PATH);
  const parsedVault = JSON.parse(vault);

  return parsedVault;
};

export const set = async (vault: Vault): Promise<Vault> => {
  const stringifiedVault = JSON.stringify(vault);
  await writeAsStringAsync(VAULT_PATH, stringifiedVault);

  return vault;
};

export const clear = async (): Promise<void> => {
  await deleteAsync(VAULT_PATH);
};
