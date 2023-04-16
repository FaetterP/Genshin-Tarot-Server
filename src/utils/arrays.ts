export function removeDuplicates<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
