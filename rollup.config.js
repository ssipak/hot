import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import vue from "rollup-plugin-vue";
import del from "rollup-plugin-delete";
import alias from "@rollup/plugin-alias";
import { terser } from 'rollup-plugin-terser';

import packageJson from "./package.json";
import path from "path";

export default {
  input: "src/index.ts",
  output: [
    {
      format: "cjs",
      file: packageJson.main,
    },
    {
      format: "esm",
      file: packageJson.module,
    }
  ],
  plugins: [
    del({ targets: 'dist/*'}),
    peerDepsExternal(),
    resolve(),
    alias({
      entries: {
        '@': path.resolve(__dirname, 'src'),
      },
    }),
    commonjs(),
    typescript(),
    vue(),
    terser(),
  ]
};
