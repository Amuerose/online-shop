import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';

export default ({ mode }) => {
  const analyze = (mode === 'analyze') || process.env.ANALYZE === 'true';
  return defineConfig({
    plugins: [
      react(),
      analyze && visualizer({ filename: 'dist/bundle.html', open: true, gzipSize: true, brotliSize: true })
    ],
    server: {
      host: true,
    },
    optimizeDeps: {
      include: [
        '@floating-ui/react',
        '@supabase/supabase-js'
      ]
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            i18n: ['i18next', 'react-i18next'],
            ui: ['framer-motion'],
            supabase: ['@supabase/supabase-js'],
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