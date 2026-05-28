/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  maxWorkers: 1,
  transformIgnorePatterns: ["node_modules/(?!uuid)"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.js$": ["ts-jest", { tsconfig: { allowJs: true } }],
  },
};
