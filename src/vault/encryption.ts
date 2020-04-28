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
import { pipe } from '../utilities';
import { Vault, EncryptedVault } from '../types';

export const decryptVault = async (data: {
  encryptedVault: EncryptedVault;
  password: string;
}): Promise<Vault> => {
  const password = pipe(normalize, decodeUTF8)(data.password);

  /* TODO: Validate vault */

  const { salt, nonce, encryptedEntries } = {
    salt: decodeBase64(data.encryptedVault.keyDerivation.salt),
    nonce: decodeBase64(data.encryptedVault.encryption.nonce),
    encryptedEntries: decodeBase64(data.encryptedVault.entries),
  };

  const {
    workFactor,
    blockSize,
    parallelizationFactor,
    derivedKeyLength,
  } = data.encryptedVault.keyDerivation;

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

  const vault = {
    entries,
  };

  return vault;
};

export const encryptVault = async (data: {
  vault: Vault;
  password: string;
}): Promise<EncryptedVault> => {
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

  const encryptedVault = {
    keyDerivation,
    encryption,
    entries,
  };

  return encryptedVault;
};
