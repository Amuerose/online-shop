import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';
import ignore from 'rollup-plugin-ignore';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ filename: 'dist/stats.html', open: true })
  ],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:1337',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: [
      '@floating-ui/react-dom-interactions',
      '@floating-ui/react'
    ]
  },
  build: {
    rollupOptions: {
      external: [
        '@floating-ui/react-dom-interactions',
        '@floating-ui/react'
      ],
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          i18n: ['i18next', 'react-i18next'],
          ui: ['framer-motion'],
          firebase: [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
            'firebase/storage',
            'firebase/database',
            'firebase/functions'
          ],
          dateFns: ['date-fns'],
          datepickerLib: ['react-datepicker'],
          floatingUI: ['@floating-ui/dom'],
          vendors: ['axios']
        }
      },
      plugins: [
        // Ignore all date-fns locale files to reduce bundle size
        ignore(['date-fns/locale/*'])
      ]
    }
  },
})