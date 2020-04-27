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
  normalize,
  decodeUTF8,
  decodeBase64,
  encodeUTF8,
  encodeBase64,
  constants,
} from '../crypto';
import { pipe, pipeP } from '../utilities';
import { Vault } from '../types';

const VAULT_PATH = documentDirectory + 'vault.json';

export const exists = async (): Promise<boolean> => {
  const { exists } = await getInfoAsync(VAULT_PATH);
  return exists;
};

export const get = async ({
  password,
}: {
  password: string;
}): Promise<Vault> => {
  const persistedVault = await pipeP(readAsStringAsync, JSON.parse)(VAULT_PATH);

  const { salt, nonce, encryptedEntries } = {
    salt: decodeBase64(persistedVault.encryption.salt),
    nonce: decodeBase64(persistedVault.encryption.nonce),
    encryptedEntries: decodeBase64(persistedVault.entries),
  };

  const key = await deriveKey({
    /* TODO: Ensure password & salt are in ASCII */
    password: normalize(password),
    salt: encodeBase64(salt),
  });

  const entries = pipe(
    decrypt({ key: decodeBase64(key), nonce }),
    encodeUTF8,
    JSON.parse,
  )(encryptedEntries);

  return {
    entries,
  };
};

export const set = async ({
  vault,
  password,
}: {
  vault: Vault;
  password: string;
}): Promise<void> => {
  const [salt, nonce] = await Promise.all([
    generateRandomBytes(constants.SALT_LENGTH),
    generateRandomBytes(constants.NONCE_LENGTH),
  ]);

  const key = await deriveKey({
    /* TODO: Ensure password & salt are in ASCII */
    password: normalize(password),
    salt: encodeBase64(salt),
  });

  const encryptedEntries = pipe(
    JSON.stringify,
    decodeUTF8,
    encrypt({ key: decodeBase64(key), nonce }),
  )(vault.entries);

  const { encryption, entries } = {
    encryption: {
      salt: encodeBase64(salt),
      nonce: encodeBase64(nonce),
    },
    entries: encodeBase64(encryptedEntries),
  };

  const persistedVault = {
    encryption,
    entries,
  };

  await writeAsStringAsync(VAULT_PATH, JSON.stringify(persistedVault, null, 2));
};

export const clear = async (): Promise<void> => {
  await deleteAsync(VAULT_PATH);
};
