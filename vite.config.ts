import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'electron/main.ts',
        onstart(options) {
          options.startup()
        },
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          // notify the Renderer-Process to reload when Preload-Script build complete
          options.reload()
        },
      },
    ]),
    renderer()
  ],
  // also ensure Rollup external rules for main build
  build: {
    rollupOptions: {
      external: ['@prisma/client', '.prisma/client'],
    },
  },
  resolve: {
    alias: {
      // prisma client generates imports to ".prisma/client/default" when bundled,
      // map it back to the real package so Node can load it correctly.
      '.prisma/client/default': '@prisma/client',
    },
  },
})
