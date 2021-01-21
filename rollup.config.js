import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolvePlugin from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import tsPlugin from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';
import del from 'rollup-plugin-delete';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';
import { dtsImportsPlugin } from 'rollup-plugin-dts-imports';

import packageJson from './package.json';
import { resolve as resolvePath } from 'path';

const useVis = process.env.VISUALIZE === 'yes';

export default {
  input: 'src/index.ts',
  output: [
    {
      format: 'cjs',
      file: packageJson.main
    },
    {
      format: 'esm',
      file: packageJson.module
    }
  ].map(output => ({
    ...output,
    sourcemap: useVis
  })),
  plugins: [
    del({ targets: 'dist/*' }),
    peerDepsExternal(),
    alias({
      entries: { '@': resolvePath(__dirname, 'src') }
    }),
    resolvePlugin(),
    commonjs(),
    vue(),
    tsPlugin(),
    dtsImportsPlugin(),
    terser(),
    useVis && visualizer({
      open: true,
      filename: 'dist/stats.html',
      sourcemap: true,
      gzipSize: true
    })
  ]
};
