import { scrypt } from 'scrypt-js';
import { encodeBase64, decodeBase64, decodeUTF8 } from 'tweetnacl-util';
import { generateRandomBytes } from './random';

export const generateRandomSalt = async (): Promise<string> => {
  const randomSaltBytes = await generateRandomBytes(16);
  return encodeBase64(randomSaltBytes);
};

export const deriveKey = async ({
  password,
  salt,
}: {
  password: string;
  salt: string;
}): Promise<string> => {
  const passwordBytes = decodeUTF8(password);
  const saltBytes = decodeBase64(salt);

  const derivedKeyBytes = await deriveKeyBytes({
    password: passwordBytes,
    salt: saltBytes,
  });

  return encodeBase64(derivedKeyBytes);
};

const deriveKeyBytes = async ({
  password,
  salt,
}: {
  password: Uint8Array;
  salt: Uint8Array;
}): Promise<Uint8Array> => {
  const WORK_FACTOR = Math.pow(2, 15); /* N */
  const BLOCK_SIZE = 8; /* r */
  const PARALLELIZATION_FACTOR = 1; /* p */
  const DERIVED_KEY_LENGTH = 32; /* dkLen */

  const derivedKeyBytes = await scrypt(
    password,
    salt,
    WORK_FACTOR,
    BLOCK_SIZE,
    PARALLELIZATION_FACTOR,
    DERIVED_KEY_LENGTH,
  );

  return derivedKeyBytes;
};
