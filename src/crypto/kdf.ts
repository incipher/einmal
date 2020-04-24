import scrypt from 'scrypt-async';

export const deriveKey = async ({
  password,
  salt,
}: {
  password: Uint8Array;
  salt: Uint8Array;
}): Promise<Uint8Array> => {
  return new Promise((resolve) => {
    const WORK_FACTOR = Math.pow(2, 20); /* N */
    const BLOCK_SIZE = 8; /* r */
    const PARALLELIZATION_FACTOR = 1; /* p */
    const DERIVED_KEY_LENGTH = 32; /* dkLen */

    const parameters = {
      N: WORK_FACTOR,
      r: BLOCK_SIZE,
      p: PARALLELIZATION_FACTOR,
      dkLen: DERIVED_KEY_LENGTH,
      encoding: 'binary',
    };

    scrypt(password, salt, parameters, (derivedKey: Uint8Array) => {
      return resolve(derivedKey);
    });
  });
};
