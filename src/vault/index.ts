import {
  readAsStringAsync,
  deleteAsync,
  documentDirectory,
} from 'expo-file-system';
import { Vault } from '../types';

const VAULT_PATH = documentDirectory + 'vault.json';

export const load = async (): Promise<Vault> => {
  const vaultContents = await readAsStringAsync(VAULT_PATH);
  const parsedVaultContents = JSON.parse(vaultContents);

  return parsedVaultContents;
};

export const erase = async (): Promise<void> => {
  await deleteAsync(VAULT_PATH);
};
