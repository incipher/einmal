import { Buffer } from 'buffer';
import { TextEncoder, TextDecoder } from 'text-encoding';
import * as Crypto from 'expo-crypto';

export const hmac = (hashFunction: Crypto.CryptoDigestAlgorithm) => async ({
  key /* K */,
  data /* text */,
}: {
  key: string;
  data: string;
}): Promise<string> => {
  if (hashFunction !== Crypto.CryptoDigestAlgorithm.SHA1) {
    throw new Error('Unsupported hash function: ' + hashFunction);
  }

  /* B */
  const BLOCK_BYTE_LENGTH = 64;

  /* ipad */
  const innerPaddingBytes = create({
    length: BLOCK_BYTE_LENGTH,
    fill: 0x36,
  });

  /* opad */
  const outerPaddingBytes = create({
    length: BLOCK_BYTE_LENGTH,
    fill: 0x5c,
  });

  const keyBytes = toByteArray(new Buffer(key, 'hex').toString());
  const dataBytes = toByteArray(data);

  let adaptedKeyBytes;

  if (keyBytes.length > BLOCK_BYTE_LENGTH) {
    adaptedKeyBytes = toByteArray(
      await Crypto.digestStringAsync(hashFunction, key),
    );
  } else {
    adaptedKeyBytes = concat(
      keyBytes,
      create({ length: BLOCK_BYTE_LENGTH - key.length, fill: 0x00 }),
    );
  }

  const innerDataBytes = concat(
    xor(adaptedKeyBytes, innerPaddingBytes),
    dataBytes,
  );

  const innerData = toString(innerDataBytes);

  /* H(K XOR ipad, text) */
  const innerDigest = await Crypto.digestStringAsync(hashFunction, innerData);

  console.log(new Int8Array(new Buffer(innerDigest, 'hex')));

  // console.log(
  //   new Int8Array(
  //     new Buffer('bcc2c68cabbbf1c3f5b05d8e7e73a4d27b7e1b20', 'hex'),
  //   ),
  // );

  // console.log(new Int8Array(new Buffer(innerDigest, 'hex')));

  // 60

  // console.log(
  //   'EXPECTED INNER DIGEST > bcc2c68cabbbf1c3f5b05d8e7e73a4d27b7e1b20',
  // );
  // console.log('COMPUTED INNER DIGEST >', innerDigest);
  // console.log(
  //   'IS CORRECT >',
  //   innerDigest === 'bcc2c68cabbbf1c3f5b05d8e7e73a4d27b7e1b20' ? '✅' : '🚫',
  // );

  /* Convert the HEX digest to ASCII */
  // const innerDigestASCII = hexToASCII(innerDigest);

  // /* H(K XOR opad, H(K XOR ipad, text)) */
  // const outerDigest = await Crypto.digestStringAsync(
  //   hashFunction,
  //   toString(xor(adaptedKeyBytes, outerPaddingBytes)).concat(innerDigestASCII),
  // );

  // return outerDigest;
  return '';
};

export const hexToASCII = (string: string): string => {
  return new Buffer(string, 'hex').toString('ascii');
};

export const toString = (byteArray: Uint8Array): string => {
  return new TextDecoder('utf-8').decode(byteArray);
};

export const toByteArray = (string: string): Uint8Array => {
  return new TextEncoder().encode(string);
};

export const xor = (
  byteArray1: Uint8Array,
  byteArray2: Uint8Array,
): Uint8Array => {
  let result = create({ length: byteArray1.length, fill: 0x00 });

  for (let i = 0; i < byteArray1.length; i++) {
    result[i] = byteArray1[i] ^ byteArray2[i];
  }

  return result;
};

export const concat = (
  byteArray1: Uint8Array,
  byteArray2: Uint8Array,
): Uint8Array => {
  const result = create({ length: byteArray1.length + byteArray2.length });

  result.set(byteArray1, 0);
  result.set(byteArray2, byteArray1.length);

  return result;
};

export const create = ({
  length,
  fill = 0x00,
}: {
  length: number;
  fill?: number;
}): Uint8Array => {
  return Uint8Array.from({ length: length }, () => fill);
};

export { CryptoDigestAlgorithm } from 'expo-crypto';
