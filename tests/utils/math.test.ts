import { clamp } from "../../src/utils/math";

describe("utils/math/clamp", () => {
  const min = -5.5;
  const max = 5.5;

  it("return value", () => {
    const value = 4;
    expect(clamp(value, min, max)).toBe(value);
  });

  it("return min", () => {
    expect(clamp(min - 1, min, max)).toBe(min);
  });

  it("return max", () => {
    expect(clamp(max + 1, min, max)).toBe(max);
  });

  it("swap min max", () => {
    const value = 4;
    const errorMessage = `ArgumentError: '${max}' cannot be greater than '${min}'.`;
    expect(() => clamp(value, max, min)).toThrow(errorMessage);
  });
});
