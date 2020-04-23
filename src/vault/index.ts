import {
  getInfoAsync,
  readAsStringAsync,
  writeAsStringAsync,
  deleteAsync,
  documentDirectory,
} from 'expo-file-system';
import { decrypt, encrypt } from '../crypto';
import { Vault } from '../types';

const VAULT_PATH = documentDirectory + 'vault.json';

export const exists = async (): Promise<boolean> => {
  const { exists } = await getInfoAsync(VAULT_PATH);
  return exists;
};

export const get = async ({ key }: { key: string }): Promise<Vault> => {
  const vault = await readAsStringAsync(VAULT_PATH);

  const decryptedVault = decrypt(key)(vault);
  const parsedVault = JSON.parse(decryptedVault);

  return parsedVault;
};

export const set = async ({
  vault,
  key,
}: {
  vault: Vault;
  key: string;
}): Promise<Vault> => {
  const stringifiedVault = JSON.stringify(vault);
  const encryptedVault = await encrypt(key)(stringifiedVault);

  await writeAsStringAsync(VAULT_PATH, encryptedVault);

  return vault;
};

export const clear = async (): Promise<void> => {
  await deleteAsync(VAULT_PATH);
};
