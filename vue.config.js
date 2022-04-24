module.exports = {
  publicPath: '/cfd/',
  devServer: {
    disableHostCheck: true,
    port: 9086,
    public: '0.0.0.0:9086',
    proxy: {
      '/cfd-api': {
        target: 'http://127.0.0.1:9080',
        changeOrigin: true,
        pathRewrite: {
          '^/cfd-api': ""
        }
      }
    }
  },

  productionSourceMap: false
}

