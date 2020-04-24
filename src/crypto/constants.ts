import { secretbox } from 'tweetnacl';

export const constants = {
  SALT_LENGTH: 16,
  NONCE_LENGTH: secretbox.nonceLength,
};
