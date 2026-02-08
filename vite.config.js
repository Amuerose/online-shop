import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';

export default ({ mode }) => {
  const analyze = (mode === 'analyze') || process.env.ANALYZE === 'true';
  return defineConfig({
    // Ensure Vite treats this as a single-page application (SPA)
    appType: 'spa',
    plugins: [
      react(),
      analyze && visualizer({ filename: 'dist/bundle.html', open: true, gzipSize: true, brotliSize: true })
    ],
    server: {
      host: true,
    },
    optimizeDeps: {
      include: [
        '@floating-ui/react'
      ]
    },
    build: {
      // Ensure 404.html from public is copied into dist for Cloudflare Pages custom 404 support
      copyPublicDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            i18n: ['i18next', 'react-i18next'],
            ui: ['framer-motion'],
            dateFns: ['date-fns'],
            datepickerLib: ['react-datepicker']
          }
        },
        plugins: [
        ]
      }
    },
  })
}
