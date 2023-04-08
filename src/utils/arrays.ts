export function removeDuplicates<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
