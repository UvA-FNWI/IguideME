export function basePath(path: string): string {
  if (!process.env.NEXT_PUBLIC_BASE_URL) throw new Error('NEXT_PUBLIC_BASE_URL is not defined');
  return new URL(path, process.env.NEXT_PUBLIC_BASE_URL).toString();
}
