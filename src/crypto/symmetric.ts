import { secretbox, randomBytes, setPRNG } from 'tweetnacl';
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64,
} from 'tweetnacl-util';
import { createRandomBytes } from '@otplib/plugin-crypto-js';
import { KeyEncodings } from '@otplib/core';
import scrypt from 'scrypt-async';

setPRNG((requiredRandomBytes, requiredRandomBytesCount) => {
  const generatedRandomBytes = generateRandomBytes(requiredRandomBytesCount);

  for (let i = 0; i < generatedRandomBytes.length; i++) {
    requiredRandomBytes[i] = generatedRandomBytes[i];
  }
});

export const generateRandomKey = (): string => {
  return encodeBase64(randomBytes(secretbox.keyLength));
};

export const deriveKey = (salt: string) => (
  password: string,
): Promise<string> => {
  return new Promise(resolve => {
    const options = {
      N: 16384,
      r: 8,
      p: 1,
      dkLen: 32,
      encoding: 'base64',
    };

    scrypt(password, salt, options, (derivedKey: string) => {
      resolve(derivedKey);
    });
  });
};

export const encrypt = (key: string) => (message: string): string => {
  const keyBytes = decodeBase64(key);
  const messageBytes = decodeUTF8(message);

  const encryptedMessageWithNonceBytes = encryptBytes(keyBytes)(messageBytes);

  return encodeBase64(encryptedMessageWithNonceBytes);
};

export const decrypt = (key: string) => (
  encryptedMessageWithNonce: string,
): string => {
  const keyBytes = decodeBase64(key);
  const encryptedMessageWithNonceBytes = decodeBase64(
    encryptedMessageWithNonce,
  );

  const decryptedMessageBytes = decryptBytes(keyBytes)(
    encryptedMessageWithNonceBytes,
  );

  return encodeUTF8(decryptedMessageBytes);
};

const encryptBytes = (keyBytes: Uint8Array) => (
  messageBytes: Uint8Array,
): Uint8Array => {
  const nonceBytes = generateRandomNonce();

  const encryptedMessageBytes = secretbox(messageBytes, nonceBytes, keyBytes);

  const encryptedMessageWithNonceBytes = new Uint8Array(
    nonceBytes.length + encryptedMessageBytes.length,
  );

  encryptedMessageWithNonceBytes.set(nonceBytes);
  encryptedMessageWithNonceBytes.set(encryptedMessageBytes, nonceBytes.length);

  return encryptedMessageWithNonceBytes;
};

const decryptBytes = (keyBytes: Uint8Array) => (
  encryptedMessageWithNonceBytes: Uint8Array,
): Uint8Array => {
  const nonceBytes = encryptedMessageWithNonceBytes.slice(
    0,
    secretbox.nonceLength,
  );

  const encryptedMessageBytes = encryptedMessageWithNonceBytes.slice(
    secretbox.nonceLength,
    encryptedMessageWithNonceBytes.length,
  );

  const decryptedMessageBytes = secretbox.open(
    encryptedMessageBytes,
    nonceBytes,
    keyBytes,
  );

  if (!decryptedMessageBytes) {
    throw new Error('Failed to decrypt message');
  }

  return decryptedMessageBytes;
};

const generateRandomNonce = (): Uint8Array => {
  return randomBytes(secretbox.nonceLength);
};

const generateRandomBytes = (count: number): Uint8Array => {
  const encodedRandomBytes = createRandomBytes(count, KeyEncodings.BASE64);
  return decodeBase64(encodedRandomBytes);
};
