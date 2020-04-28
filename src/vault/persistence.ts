import {
  getInfoAsync,
  readAsStringAsync,
  writeAsStringAsync,
  deleteAsync,
  documentDirectory,
} from 'expo-file-system';
import { EncryptedVault } from '../types';

const INTERNAL_VAULT_PATH = documentDirectory + 'vault.json';

export const doesVaultExist = async (): Promise<boolean> => {
  const { exists } = await getInfoAsync(INTERNAL_VAULT_PATH);
  return exists;
};

export const readVault = async (): Promise<EncryptedVault> => {
  const vaultContents = await readAsStringAsync(INTERNAL_VAULT_PATH);
  return JSON.parse(vaultContents);
};

export const writeVault = async (vault: EncryptedVault): Promise<void> => {
  const vaultContents = JSON.stringify(vault, null, 2);
  await writeAsStringAsync(INTERNAL_VAULT_PATH, vaultContents);
};

export const deleteVault = async (): Promise<void> => {
  await deleteAsync(INTERNAL_VAULT_PATH);
};
