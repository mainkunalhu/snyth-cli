import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: ['./package/index.ts'],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
