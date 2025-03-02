import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL || 'http://localhost:3000';

  return {
    plugins: [
      react({
        jsxRuntime: 'automatic',
        babel: {
          plugins: ['@babel/plugin-transform-react-jsx']
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    server: {
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@headlessui/react', '@heroicons/react'],
            charts: ['react-chartjs-2', 'recharts']
          }
        }
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      force: true
    }
  };
});
