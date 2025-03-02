import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
  plugins: [
    react(),
    {
      ...nodeResolve({
        preferBuiltins: true,
        browser: true
      }),
      enforce: 'pre',
      apply: 'build'
    },
    {
      ...commonjs({
        include: /node_modules/
      }),
      enforce: 'pre',
      apply: 'build'
    }
  ],
  build: {
    outDir: 'dist',
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
