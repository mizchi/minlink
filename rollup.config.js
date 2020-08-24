import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";

const defaultPlugins = [typescript(), terser(), filesize()];

export default [
  {
    input: "src/browser.ts",
    output: {
      dir: "dist",
      format: "es",
    },
    plugins: defaultPlugins,
  },
  {
    input: "src/browser.dev.ts",
    output: {
      dir: "dist",
      format: "es",
    },
    plugins: [typescript(), filesize()],
  },

  {
    input: "src/browser.legacy.ts",
    output: {
      dir: "dist",
      name: "minlink",
      format: "umd",
    },
    plugins: [typescript({ target: "es5" }), terser(), filesize()],
  },
  {
    input: "src/memory.ts",
    output: {
      dir: "dist",
      format: "es",
    },
    plugins: defaultPlugins,
  },
  {
    input: "src/node.ts",
    output: {
      dir: "dist",
      format: "es",
    },
    plugins: defaultPlugins,
  },
];
