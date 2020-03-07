import * as Crypto from 'expo-crypto';
import { parse } from 'url-otpauth';

export const parseOtpAuthUri = (
  uri: string,
): {
  account: string;
  digits: number;
  issuer: string;
  key: string;
  type: string;
} => {
  try {
    return parse(uri);
  } catch (error) {
    throw new Error('Could not parse otpauth:// URI');
  }
};

export const generateTotp = (secretBase32: string): Promise<Crypto.Digest> => {
  const secretHex = parseInt(secretBase32, 16);

  const nowMillis = Date.now();
  const nowSeconds = Math.floor(nowMillis / 1000);

  const counter = nowSeconds / 30;
  const counterHex = counter.toString(16);

  const data = [secretHex].join('');

  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, data, {
    encoding: Crypto.CryptoEncoding.HEX,
  });
};
