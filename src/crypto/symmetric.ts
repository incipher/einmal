import { secretbox } from 'tweetnacl';
import {
  encodeBase64,
  encodeUTF8,
  decodeBase64,
  decodeUTF8,
} from 'tweetnacl-util';
import { generateRandomBytes } from './random';

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
  const nonceBytes = await generateRandomBytes(secretbox.nonceLength);

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
