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

export const get = async (data: { password: string }): Promise<Vault> => {
  const password = pipe(normalize, decodeUTF8)(data.password);

  const persistedVault = await pipeP(readAsStringAsync, JSON.parse)(VAULT_PATH);

  const { salt, nonce, encryptedEntries } = {
    salt: decodeBase64(persistedVault.keyDerivation.salt),
    nonce: decodeBase64(persistedVault.encryption.nonce),
    encryptedEntries: decodeBase64(persistedVault.entries),
  };

  const {
    workFactor,
    blockSize,
    parallelizationFactor,
    derivedKeyLength,
  } = persistedVault.keyDerivation;

  const key = await deriveKey({
    password: encodeBase64(password),
    salt: encodeBase64(salt),
    workFactor,
    blockSize,
    parallelizationFactor,
    derivedKeyLength,
    derivedKeyEncoding: 'base64',
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

export const set = async (data: {
  vault: Vault;
  password: string;
}): Promise<void> => {
  const password = pipe(normalize, decodeUTF8)(data.password);

  const [salt, nonce] = await Promise.all([
    generateRandomBytes(constants.keyDerivation.SALT_LENGTH),
    generateRandomBytes(constants.encryption.NONCE_LENGTH),
  ]);

  const key = await deriveKey({
    password: encodeBase64(password),
    salt: encodeBase64(salt),
    workFactor: constants.keyDerivation.WORK_FACTOR,
    blockSize: constants.keyDerivation.BLOCK_SIZE,
    parallelizationFactor: constants.keyDerivation.PARALLELIZATION_FACTOR,
    derivedKeyLength: constants.keyDerivation.DERIVED_KEY_LENGTH,
    derivedKeyEncoding: 'base64',
  });

  const encryptedEntries = pipe(
    JSON.stringify,
    decodeUTF8,
    encrypt({ key: decodeBase64(key), nonce }),
  )(data.vault.entries);

  const { keyDerivation, encryption, entries } = {
    keyDerivation: {
      salt: encodeBase64(salt),
      workFactor: constants.keyDerivation.WORK_FACTOR,
      blockSize: constants.keyDerivation.BLOCK_SIZE,
      parallelizationFactor: constants.keyDerivation.PARALLELIZATION_FACTOR,
      derivedKeyLength: constants.keyDerivation.DERIVED_KEY_LENGTH,
    },
    encryption: {
      nonce: encodeBase64(nonce),
    },
    entries: encodeBase64(encryptedEntries),
  };

  const persistedVault = {
    keyDerivation,
    encryption,
    entries,
  };

  await writeAsStringAsync(VAULT_PATH, JSON.stringify(persistedVault, null, 2));
};

export const clear = async (): Promise<void> => {
  await deleteAsync(VAULT_PATH);
};
