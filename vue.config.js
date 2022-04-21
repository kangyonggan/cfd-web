module.exports = {
  publicPath: '/cfd/',
  devServer: {
    disableHostCheck: true,
    port: 9086,
    public: '0.0.0.0:9086',
    proxy: {
      '/cfd-api': {
        target: 'http://192.168.0.106:9080',
        changeOrigin: true,
        pathRewrite: {
          '^/cfd-api': ""
        }
      }
    }
  },

  productionSourceMap: false
}

