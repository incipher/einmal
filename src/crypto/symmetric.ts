import { secretbox } from 'tweetnacl';

export const encrypt = ({
  nonce,
  key,
}: {
  nonce: Uint8Array;
  key: Uint8Array;
}) => (plaintext: Uint8Array): Uint8Array => {
  return secretbox(plaintext, nonce, key);
};

export const decrypt = ({
  nonce,
  key,
}: {
  nonce: Uint8Array;
  key: Uint8Array;
}) => (ciphertext: Uint8Array): Uint8Array => {
  const plaintext = secretbox.open(ciphertext, nonce, key);

  if (!plaintext) {
    throw new Error('Failed to decrypt message');
  }

  return plaintext;
};
