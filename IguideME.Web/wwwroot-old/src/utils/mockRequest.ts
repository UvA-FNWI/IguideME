export const delay = (cb: any, ms: number = 300) => {
  return new Promise(resolve => setTimeout(resolve, ms)).then(
    () => cb
  );
}