import { NativeModules } from 'react-native';

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
  password /* ASCII encoding */,
  salt /* Base64 encoding */,
  workFactor = Math.pow(2, 15),
  blockSize = 8,
  parallelizationFactor = 1,
  derivedKeyLength = 32,
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
