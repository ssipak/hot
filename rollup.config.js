import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import tsPlugin from "rollup-plugin-typescript2";
import vue from "rollup-plugin-vue";
import del from "rollup-plugin-delete";
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';

import packageJson from "./package.json";

const useVis = process.env.VISUALIZE ==='yes'

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
  ].map(output => ({
    ...output,
    sourcemap: useVis,
  })),
  plugins: [
    del({ targets: 'dist/*'}),
    peerDepsExternal(),
    resolve(),
    commonjs(),
    tsPlugin(),
    vue(),
    terser(),
    useVis && visualizer({
      open: true,
      filename: 'dist/stats.html',
      sourcemap: true,
      gzipSize: true,
    }),
  ]
};
