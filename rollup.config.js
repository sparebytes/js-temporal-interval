import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import pkg from "./package.json";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default [
  {
    input: "lib/Interval.ts",
    external: ["@js-temporal/polyfill"],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    plugins: [
      babel({
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        exclude: ["node_modules/**"],
        runtimeHelpers: true,
      }),
      commonjs({ extensions }),
      resolve(),
    ],
  },
];
