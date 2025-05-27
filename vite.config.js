import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { hoistStatic: false } } })],
  base: './',
  server: {
    hmr: false
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: function (id) {
          // if (id.includes('node_modules')) {
          //   return 'vendor';
          // }

          return null;
        }
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true
    },
  },
  resolve: {
    alias: [
      // /@/xxxx => src/xxxx
      {
        find: /@\//,
        replacement: path.resolve('src') + '/',
      },
    ],
  },
})