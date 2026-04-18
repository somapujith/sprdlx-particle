import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
            'animation-vendor': ['gsap', 'framer-motion'],
            'spline-vendor': ['@splinetool/react-spline'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    server: {
      host: '::',
      port: 5174,
      strictPort: true,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
