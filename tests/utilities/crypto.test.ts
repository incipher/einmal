import {
  hmac,
  repeat,
  toString,
  CryptoDigestAlgorithm,
} from '../../src/utilities/crypto';

describe('hmac()', () => {
  it('should compute HMAC-SHA-512 digest of a string', async () => {
    const data = 'Hi There';
    const secret = toString(repeat({ times: 20 })(0x0b));
    const hashFunction = CryptoDigestAlgorithm.SHA256;

    const expectedDigest =
      'b0344c61d8db38535ca8afceaf0bf12b' + '881dc200c9833da726e9376c2e32cff7';

    const computedDigest = await hmac({
      secret,
      hashFunction,
    })(data);

    expect(computedDigest).toBe(expectedDigest);
  });
});
