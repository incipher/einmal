import { NativeModules } from 'react-native';
import constants from './constants';

const { CryptoModule } = NativeModules;

type ScryptParameters = {
  password: string;
  salt: string;
  workFactor?: number;
  blockSize?: number;
  parallelizationFactor?: number;
  derivedKeyLength?: number;
  derivedKeyEncoding?: 'base64' | 'hex';
};

export const deriveKey = async ({
  password /* Encoded into Base64 */,
  salt /* Encoded into Base64 */,
  workFactor = constants.keyDerivation.WORK_FACTOR,
  blockSize = constants.keyDerivation.BLOCK_SIZE,
  parallelizationFactor = constants.keyDerivation.PARALLELIZATION_FACTOR,
  derivedKeyLength = constants.keyDerivation.DERIVED_KEY_LENGTH,
  derivedKeyEncoding = 'base64',
}: ScryptParameters): Promise<string> => {
  return CryptoModule.scrypt(
    password,
    salt,
    workFactor /* N */,
    blockSize /* r */,
    parallelizationFactor /* p */,
    derivedKeyLength /* dkLen */,
    derivedKeyEncoding,
  );
};
