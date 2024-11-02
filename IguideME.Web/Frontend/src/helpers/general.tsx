export function objectExists<T>(object: T | null | undefined): object is T {
  console.log(object);
  return object !== null && object !== undefined;
}
