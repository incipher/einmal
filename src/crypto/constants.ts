import { secretbox } from 'tweetnacl';

export const constants = {
  SALT_LENGTH: 16,
  KEY_LENGTH: secretbox.keyLength,
  NONCE_LENGTH: secretbox.nonceLength,
};
