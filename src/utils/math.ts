export function clamp(value: number, min: number, max: number) {
  if (min > max) {
    throw new Error(`ArgumentError: '${min}' cannot be greater than '${max}'.`);
  }
  
  return Math.min(Math.max(value, min), max);
}
