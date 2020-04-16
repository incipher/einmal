import { get, set } from './generic';
import { keys } from './keys';

export { clear } from './generic';

export const getConcealTokens = (): Promise<string | null> => {
  return get(keys.CONCEAL_TOKENS);
};

export const setConcealTokens = (concealTokens: boolean): Promise<void> => {
  return set(keys.CONCEAL_TOKENS, concealTokens);
};
