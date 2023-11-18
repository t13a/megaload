/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  moduleNameMapper: {
    "^@/(.+)$": "<rootDir>/src/$1",
  },
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
  testEnvironment: "jest-environment-jsdom",
};
