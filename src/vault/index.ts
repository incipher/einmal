import {
  getInfoAsync,
  readAsStringAsync,
  writeAsStringAsync,
  deleteAsync,
  documentDirectory,
} from 'expo-file-system';
import {
  generateRandomBytes,
  deriveKey,
  decrypt,
  encrypt,
  decodeBase64,
  encodeBase64,
  decodeUTF8,
  normalize,
  constants,
  encodeUTF8,
} from '../crypto';
import { pipe, pipeP } from '../utilities';
import { Vault } from '../types';

const VAULT_PATH = documentDirectory + 'vault.json';

export const exists = async (): Promise<boolean> => {
  const { exists } = await getInfoAsync(VAULT_PATH);
  return exists;
};

export const get = async (data: { password: string }): Promise<Vault> => {
  const password = pipe(normalize, decodeUTF8)(data.password);

  const vault = await pipeP(readAsStringAsync, JSON.parse)(VAULT_PATH);

  const { salt, nonce, encryptedEntries } = {
    salt: decodeBase64(vault.encryption.salt),
    nonce: decodeBase64(vault.encryption.nonce),
    encryptedEntries: decodeBase64(vault.entries),
  };

  const key = await deriveKey({
    password,
    salt,
  });

  const entries = pipe(
    decrypt({ key, nonce }),
    encodeUTF8,
    JSON.parse,
  )(encryptedEntries);

  return {
    entries,
  };
};

export const set = async (data: {
  vault: Vault;
  password: string;
}): Promise<void> => {
  const password = pipe(normalize, decodeUTF8)(data.password);

  const [salt, nonce] = await Promise.all([
    generateRandomBytes(constants.SALT_LENGTH),
    generateRandomBytes(constants.NONCE_LENGTH),
  ]);

  const key = await deriveKey({
    password,
    salt,
  });

  const encryptedEntries = pipe(
    JSON.stringify,
    decodeUTF8,
    encrypt({ key, nonce }),
  )(data.vault.entries);

  const { encryption, entries } = {
    encryption: {
      salt: encodeBase64(salt),
      nonce: encodeBase64(nonce),
    },
    entries: encodeBase64(encryptedEntries),
  };

  const vault = {
    encryption,
    entries,
  };

  await writeAsStringAsync(VAULT_PATH, JSON.stringify(vault, null, 2));
};

export const clear = async (): Promise<void> => {
  await deleteAsync(VAULT_PATH);
};
