import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  server: {
    host: true,
    port: Number(process.env.VITE_DEV_PORT || 5173),
    strictPort: true,
    watch: {
      usePolling:
        process.env.USE_POLLING === 'true' || process.env.CHOKIDAR_USEPOLLING === 'true',
      interval: Number(process.env.POLLING_INTERVAL || 300),
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
