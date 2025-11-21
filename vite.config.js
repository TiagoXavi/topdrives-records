import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { hoistStatic: false } } })],
  base: '/',
  server: {
    hmr: false
  },
  css: {
    devSourcemap: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: function (id) {
          let notGroup = [
            "/components/MainGallery",
            "/components/MainSwagger",
            "/components/MainCharts",
            "/components/MainFindCar",
            "/components/MainDownTimes",
            "/components/MainTranslate",
            "/components/MainNewPhotos",
            "/components/MainTestPoints",
            "/components/MainAddNewCars",
            "/components/MainCheatSheet",
            "/components/MainCodeUtility",
            "/components/MainPacks",
            "/components/MainTimeline",
            "/components/MainCommunity",
            "/components/MainStuff",
            "/components/MainAccelCurveMaker",
            "/components/MainShowcase",
            "/components/BaseMyGarage",
            "/components/MainCsvChart",
            "/components/MainMatchSimulator",
            "/components/MainTemplateGuidelines",
            "/components/MainLogin",
            "/components/MainRegister",
            "/components/MainVerifyEmail",
            "/components/MainResetPassword",
            "/components/MainAskNewPassword"
          ];

          const blockedList = notGroup.some(path => id.includes(path));

          if (
            id.includes('/components') &&
            !id.includes('MainRT') &&
            !id.includes('tempJson') &&
            !id.includes('BaseTyreSvg') &&
            !blockedList
          ) {
            return 'components';
          }

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