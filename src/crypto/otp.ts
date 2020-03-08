global.Buffer = global.Buffer || require('buffer').Buffer;

import {
  totpToken,
  totpOptions,
  totpTimeRemaining,
  KeyEncodings,
} from '@otplib/core';
import { createDigest } from '@otplib/plugin-crypto-js';
import { keyDecoder } from '@otplib/plugin-base32-enc-dec';

export const totp = (secret: string): string => {
  return totpToken(
    keyDecoder(secret, KeyEncodings.HEX),
    totpOptions({
      createDigest,
      encoding: KeyEncodings.HEX,
    }),
  );
};

export const totpExpiry = (): number => {
  return totpTimeRemaining(Date.now(), 30);
};
