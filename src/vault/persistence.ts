import {
  getInfoAsync,
  readAsStringAsync,
  writeAsStringAsync,
  deleteAsync,
  documentDirectory,
} from 'expo-file-system';
import { writeFile, DownloadDirectoryPath } from 'react-native-fs';
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

export const importVault = async (
  filePath: string,
): Promise<EncryptedVault> => {
  const vaultContents = await readAsStringAsync(filePath);
  return JSON.parse(vaultContents);
};

export const exportVault = async (vault: EncryptedVault): Promise<void> => {
  const timestamp = Date.now();
  const vaultContents = JSON.stringify(vault, null, 2);

  await writeFile(
    `${DownloadDirectoryPath}/einmal-vault-${timestamp}.json`,
    vaultContents,
    'utf8',
  );
};
