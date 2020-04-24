export {
  encodeBase64,
  encodeUTF8,
  decodeBase64,
  decodeUTF8,
} from 'tweetnacl-util';

export const normalize = (string: string) => {
  return string.normalize('NFKC');
};
