export const splitAt = (index: number) => <T>(list: T[]): T[][] => {
  const head = list.slice(0, index);
  const tail = list.slice(index);

  return [head, tail];
};
