import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    target: 'es2015',
    minify: 'terser',
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        format: 'es',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
