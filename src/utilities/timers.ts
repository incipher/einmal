export const sleep = (millis: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, millis);
  });
};
