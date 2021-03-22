module.exports = {
  roots: ["<rootDir>/test"],
  setupFilesAfterEnv: [],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: false,
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      compiler: "ttypescript",
    },
  },
};
