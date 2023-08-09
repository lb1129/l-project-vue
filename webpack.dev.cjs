const path = require('path')
const { resolveApp } = require('./webpack.utils.cjs')

module.exports = ({ PUBLIC_URL, PORT }) => {
  return {
    // 开发服务器配置
    devServer: {
      // 开发服务器启动后是否打开浏览器
      open: true,
      // 静态资源托管
      static: {
        // 目录
        directory: resolveApp('public'),
        // 公共基础路径（告诉开发服务器在哪个 URL 上提供 static.directory 的内容）
        publicPath: PUBLIC_URL,
        // 是否监听 directory 目录文件更改
        watch: true
      },
      // 是否启用 gzip
      compress: true,
      // host
      host: '0.0.0.0',
      // port
      port: PORT,
      client: {
        // 当出现编译错误或警告时，在浏览器中显示全屏覆盖
        overlay: {
          // 仅有错误时 显示 overlay
          errors: true,
          warnings: false
        }
      },
      // 404 fallback
      historyApiFallback: {
        disableDotRule: true,
        index: PUBLIC_URL
      },
      setupMiddlewares(middlewares, devServer) {
        // 如果url不存在 重定向到 PUBLIC_URL
        devServer.app.use((req, res, next) => {
          const servedPath = PUBLIC_URL.slice(0, -1)
          if (servedPath === '' || req.url === servedPath || req.url.startsWith(servedPath)) {
            next()
          } else {
            const newPath = path.posix.join(servedPath, req.path !== '/' ? req.path : '')
            res.redirect(newPath)
          }
        })
        return middlewares
      }
    }
  }
}
