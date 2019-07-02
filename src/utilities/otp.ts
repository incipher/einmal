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
