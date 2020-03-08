global.Buffer = global.Buffer || require('buffer').Buffer;

import { totpToken, totpOptions, KeyEncodings } from '@otplib/core';
import { createDigest } from '@otplib/plugin-crypto-js';
import { keyDecoder } from '@otplib/plugin-base32-enc-dec';

export const authenticatorToken = (secret: string): string => {
  return totpToken(
    keyDecoder(secret, KeyEncodings.HEX),
    totpOptions({
      createDigest,
      encoding: KeyEncodings.HEX,
    }),
  );
};
