global.Buffer = global.Buffer || require('buffer').Buffer;

import { totpToken, totpOptions, KeyEncodings } from '@otplib/core';
import { createDigest } from '@otplib/plugin-crypto-js';
import { keyDecoder } from '@otplib/plugin-base32-enc-dec';
import { parse } from 'url-otpauth';
import { VaultEntry } from '../types';

export const generateTotp = (secret: string): string => {
  return totpToken(
    keyDecoder(secret, KeyEncodings.HEX),
    totpOptions({
      createDigest,
      encoding: KeyEncodings.HEX,
    }),
  );
};

export const parseOtpauthUri = (uri: string): VaultEntry => {
  try {
    return parse(uri);
  } catch (error) {
    throw new Error('Could not parse otpauth:// URI');
  }
};
