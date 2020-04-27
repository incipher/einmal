const constants = {
  keyDerivation: {
    SALT_LENGTH: 16,
    WORK_FACTOR: Math.pow(2, 15),
    BLOCK_SIZE: 8,
    PARALLELIZATION_FACTOR: 1,
    DERIVED_KEY_LENGTH: 32,
  },
  encryption: {
    NONCE_LENGTH: 24,
  },
};

export default constants;
