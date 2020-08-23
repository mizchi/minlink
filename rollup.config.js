import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "src/browser.ts",
    output: {
      file: "dist/browser.js",
      format: "es",
    },
    plugins: [typescript()],
  },
  {
    input: "src/node.ts",
    output: {
      file: "dist/node.mjs",
      format: "es",
    },
    plugins: [typescript()],
  },
];
