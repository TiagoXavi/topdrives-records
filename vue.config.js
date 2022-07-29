const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: false,
  css: {
    sourceMap: true
  },
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/vue-cli-deploy/" : "/"
})
