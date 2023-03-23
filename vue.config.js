const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      // 1.不需要node polyfilss
      alias: {
        crypto: false
      },
    }
  },

  //开启代理服务器 
  devServer: {
    port: 888, // 端口号
    open: false, // 配置自动启动浏览器

    proxy: {

      '/api': {
        target: 'http://127.0.0.1:8888/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/public': {
        target: 'http://127.0.0.1:8888/public',
        changeOrigin: true,
        pathRewrite: {
          '^/public': ''
        }
      },

    }
  }
},
  /* 
    devServer: {
      port: 8888,
      proxy: {
        '/dev-server': {
          target: 'http://localhost:8886/',
          // 跨域配置
          changeOrigin: true,
          // 路径重写 
          pathRewrite: {
            '^/api': '/'
          }
        },
        '/prod-server': {
          target: 'http://localhost:8887/',
          // 跨域配置
          changeOrigin: true,
          // 路径重写 
          pathRewrite: {
            '^/api': '/'
          }
        }
      }
  
  
    },
  } */
)