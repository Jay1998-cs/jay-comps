module.exports = {
  verbose: true,
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "md"],
  modulePathIgnorePatterns: ["/_site/"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "dekko",
    "node",
    "image.test.js",
    "image.test.ts",
  ],
  testEnvironmentOptions: {
    url: "http://localhost",
  },
  maxWorkers: "50%",
};
