export function objectExists<T>(object: T | null | undefined): object is T {
  return object !== null && object !== undefined;
}
