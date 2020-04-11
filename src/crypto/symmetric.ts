import { secretbox } from 'tweetnacl';
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64,
} from 'tweetnacl-util';
import scrypt from 'scrypt-async';
import { generateRandomBytes } from './random';

export const generateRandomKey = async (): Promise<string> => {
  const randomKeyBytes = await generateRandomKeyBytes();
  return encodeBase64(randomKeyBytes);
};

export const deriveKey = (salt: string) => (
  password: string,
): Promise<string> => {
  return new Promise((resolve) => {
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

export const encrypt = (key: string) => async (
  message: string,
): Promise<string> => {
  const keyBytes = decodeBase64(key);
  const messageBytes = decodeUTF8(message);

  const encryptedMessageWithNonceBytes = await encryptBytes(keyBytes)(
    messageBytes,
  );

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

const encryptBytes = (keyBytes: Uint8Array) => async (
  messageBytes: Uint8Array,
): Promise<Uint8Array> => {
  const nonceBytes = await generateRandomNonceBytes();

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

const generateRandomKeyBytes = (): Promise<Uint8Array> => {
  return generateRandomBytes(secretbox.keyLength);
};

const generateRandomNonceBytes = (): Promise<Uint8Array> => {
  return generateRandomBytes(secretbox.nonceLength);
};
